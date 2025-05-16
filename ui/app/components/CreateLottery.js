"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import DatePicker from "../common/DatePicker";
import { ethers } from "ethers";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from "wagmi";
import { config as wagmiConfig } from "../utils/wagmi";
import { updateTokenOnLaunch } from "../utils/firebaseHelpers";

// ABI for TokenLaunchpad
const tokenLaunchpadABI = [
  {
    "type": "event",
    "name": "TokenCreated",
    "inputs": [
      { "type": "address", "name": "tokenAddress", "indexed": true },
      { "type": "string", "name": "name", "indexed": false },
      { "type": "string", "name": "symbol", "indexed": false }
    ],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "launchToken",
    "inputs": [
      { "type": "string", "name": "name" },
      { "type": "string", "name": "symbol" },
      { "type": "uint256", "name": "initialTokenPrice" },
      { "type": "uint256", "name": "initialLotteryPool" }
    ],
    "outputs": [
      { "type": "address", "name": "" }
    ],
    "stateMutability": "nonpayable" // Assuming it's not payable and modifies state
  },
  {
    "type": "function",
    "name": "getAllTokens",
    "inputs": [],
    "outputs": [
      {
        "type": "tuple[]",
        "name": "",
        "components": [
          { "type": "address", "name": "tokenAddress" },
          { "type": "string", "name": "name" },
          { "type": "string", "name": "symbol" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      { "type": "address", "name": "" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      { "type": "address", "name": "newOwner" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
  // You would also need the constructor if you ever call it directly via ABI,
  // but for useWriteContract targeting launchToken, it's not strictly needed here.
  // And any other Ownable events if you interact with them.
];

// Contract Address deployed on Base Sepolia with wallet 0xC43389A2B7eB3e5540FDC734dA7205A215551d01
const contractAddress = "0xB6A265C087A7dF387dB167c52005AeB4f6C538C9";

export default function CreateLottery({ onGoBack }) {
  const [tokenName, setTokenName] = useState("");
  const [ticker, setTicker] = useState("");
  const [lotteryPool, setLotteryPool] = useState("");
  const [lotteryDate, setLotteryDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // For the file object
  const [imagePreview, setImagePreview] = useState(""); // For the image preview URL
  const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState(""); // Store Cloudinary URL

  const [telegramLink, setTelegramLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");

  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageUploading, setImageUploading] = useState(false); // Keep this state for tracking

  const { address: accountAddress, isConnected, chain } = useAccount(); // Get account status and chain from Wagmi
  const [firebaseDocId, setFirebaseDocId] = useState(null); // Store Firebase Doc ID

  // Wagmi's write contract hook
  const { 
    data: txHash, // Renamed from `hash` for clarity
    error: writeContractError, 
    isPending: isWriteContractPending,
    writeContractAsync // We'll call this function
  } = useWriteContract();

  const resetFormFields = () => {
    setTokenName("");
    setTicker("");
    setLotteryPool("");
    setLotteryDate("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setCloudinaryImageUrl("");
    setTelegramLink("");
    setWebsiteLink("");
    setTwitterLink("");
    setShowOptionalFields(false);
    setFirebaseDocId(null); // Reset Firebase Doc ID
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Automatically upload to Cloudinary when image is selected
      uploadToCloudinary(file);
    }
  };

  // Upload to Cloudinary using our secure API endpoint
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    setImageUploading(true);
    setError("");
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload to our Next.js API endpoint
      const response = await fetch("/api/uploadtocloudinary", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setCloudinaryImageUrl(data.secure_url);
      setImageUploading(false);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      setImageUploading(false);
      return null;
    }
  };

  const handleCreateLottery = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    if (!tokenName || !ticker || !lotteryPool || !lotteryDate || !cloudinaryImageUrl) {
      setError("Please fill in all required fields: Token Name, Ticker, Lottery Pool, Date, and Image.");
      setIsSubmitting(false);
      return;
    }

    // --- Firebase Data Saving ---
    // This happens before blockchain interaction. Consider if this order is preferred.
    let currentFirebaseDocId; // Temporary variable for this function scope
    try {
      const lotteryData = {
        tokenName,
        ticker,
        lotteryPool: parseFloat(lotteryPool) || 0, // Ensure it's a number
        lotteryDate,
        description,
        tokenImage: cloudinaryImageUrl, // Use Cloudinary URL directly
        telegramLink,
        websiteLink,
        twitterLink,
        createdAt: new Date(),
        status: "pending_blockchain", // Initial status
        // tokenAddress will be added later after contract deployment
        // Other chain-specific data like initialTokenPrice can be added here if needed
        // For now, keeping it as it was, assuming it will be part of the update
      };

      const docRef = await addDoc(collection(db, "token"), lotteryData);
      currentFirebaseDocId = docRef.id;
      setFirebaseDocId(docRef.id); // Set state for useEffect
      // Don't reset form or show full success yet, blockchain part follows.
      setSuccessMessage("Lottery data saved, preparing blockchain transaction...");
    } catch (dbError) {
      console.error("Error adding document to Firebase: ", dbError);
      setError("Failed to save lottery data. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // --- Smart Contract Interaction ---
    if (!isConnected || !accountAddress) {
      setError("Please connect your wallet to launch the token.");
      setIsSubmitting(false); // Stops after Firebase save if wallet not connected
      return;
    }
    if (chain && chain.id !== 84532) { // Base Sepolia Chain ID
      setError(`Please switch your wallet to Base Sepolia. You are on chain ID ${chain.id}.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const parsedTokenPrice = ethers.parseEther("0.0001");
      const parsedPoolAmount = ethers.parseEther(lotteryPool.toString());

      console.log("Submitting launchToken transaction...");
      await writeContractAsync({
        address: contractAddress,
        abi: tokenLaunchpadABI,
        functionName: 'launchToken',
        args: [
          tokenName,
          ticker,
          parsedTokenPrice,
          parsedPoolAmount
        ],
      });
      // `txHash` state from `useWriteContract` will be updated by the hook.
      // `isWriteContractPending` will be true while wallet is open / processing.
      // The `useEffect` watching `txHash` (now `data` from `useWriteContract`) will handle next steps.
      // `setSuccessMessage` will be updated by the useEffect for receipt.
      // Form reset will also happen in useEffect after full success.
    } catch (contractCallError) {
      console.error("Smart contract call error (writeContractAsync): ", contractCallError);
      setError(`Blockchain transaction failed: ${contractCallError.shortMessage || contractCallError.message}`);
      // Optionally update Firebase status to "failed"
      if (currentFirebaseDocId) { 
        updateTokenOnLaunch(currentFirebaseDocId, { status: "blockchain_failed", error: contractCallError.message }); 
      }
      setIsSubmitting(false); // Overall submission stops if contract call fails to initiate
    }
    // Note: `isSubmitting` remains true if `writeContractAsync` was called successfully,
    // as we are now waiting for `isWriteContractPending` and then `isReceiptLoading`.
    // The button's disabled state should reflect `isSubmitting || isWriteContractPending || isReceiptLoading`
  };

  // Hook to wait for the transaction receipt
  const { 
    data: receipt, 
    error: waitForReceiptError, 
    isLoading: isReceiptLoading, 
    isSuccess: isReceiptSuccess 
  } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    // This effect runs when `txHash` from `useWriteContract` is set,
    // or when receipt status changes.
    if (isWriteContractPending) {
        setSuccessMessage("Please confirm the transaction in your wallet...");
        setError(""); // Clear previous errors
        return; // Don't proceed further if still pending wallet confirmation
    }
    if (writeContractError) {
        setError(`Transaction submission failed: ${writeContractError.shortMessage || writeContractError.message}`);
        setSuccessMessage("");
        setIsSubmitting(false);
        return;
    }

    if (txHash && !isReceiptLoading && !isReceiptSuccess && !waitForReceiptError) {
        setSuccessMessage(`Transaction ${txHash} sent. Waiting for blockchain confirmation...`);
    }
    
    if (isReceiptSuccess && receipt) {
      console.log("Transaction confirmed:", receipt);
      const contractInterface = new ethers.Interface(tokenLaunchpadABI);
      let newLotteryName = tokenName; // Capture tokenName at time of effect run
      const currentFormTokenName = document.getElementById('lottery-name')?.value;
      if (currentFormTokenName) newLotteryName = currentFormTokenName;

      if (receipt.logs) {
        const eventTopic = ethers.id("TokenCreated(address,string,string)");
        const tokenCreatedLog = receipt.logs.find(log => 
          log.topics[0] === eventTopic && 
          log.address.toLowerCase() === contractAddress.toLowerCase()
        );

        if (tokenCreatedLog) {
          try {
            const decodedEvent = contractInterface.parseLog({ topics: tokenCreatedLog.topics, data: tokenCreatedLog.data });
            if (decodedEvent && decodedEvent.args) {
              const newTokenAddress = decodedEvent.args.tokenAddress;
              const poolName = decodedEvent.args.name;
              const poolSymbol = decodedEvent.args.symbol;
              
              setSuccessMessage(`Lottery "${newLotteryName}" launched! Token Address: ${newTokenAddress}. Tx: ${txHash}`);
              
              // Update Firebase with the new tokenAddress and status
              if (firebaseDocId) {
                updateTokenOnLaunch(firebaseDocId, {
                  tokenAddress: newTokenAddress, // This is the BondingCurvePool address
                  poolName: poolName,           // Name of the token from event (should match input)
                  poolSymbol: poolSymbol,         // Symbol of the token from event (should match input)
                  status: "live",
                  transactionHash: receipt.transactionHash,
                  // Potentially add other details fetched from the new pool contract if needed
                  // e.g., initialTokenPrice (though it was an input, might be good to confirm from event/contract)
                });
              } else {
                console.warn("firebaseDocId not set, cannot update Firebase with tokenAddress");
              }
              resetFormFields(); // Reset form on full success
            } else {
              setSuccessMessage(`Lottery "${newLotteryName}" launched! Tx: ${txHash}. (Could not parse event details)`);
              if (firebaseDocId) updateTokenOnLaunch(firebaseDocId, { status: "blockchain_confirmed_event_parse_failed", transactionHash: receipt.transactionHash });
            }
          } catch (parseError) {
            setSuccessMessage(`Lottery "${newLotteryName}" launched! Tx: ${txHash}. (Error parsing event)`);
            if (firebaseDocId) updateTokenOnLaunch(firebaseDocId, { status: "blockchain_confirmed_event_parse_error", transactionHash: receipt.transactionHash, error: parseError.message });
            console.error("Error parsing TokenCreated event:", parseError);
          }
        } else {
          setSuccessMessage(`Lottery "${newLotteryName}" launched! Tx: ${txHash}. (TokenCreated event not found in logs)`);
          if (firebaseDocId) updateTokenOnLaunch(firebaseDocId, { status: "blockchain_confirmed_event_not_found", transactionHash: receipt.transactionHash });
        }
      } else {
        setSuccessMessage(`Lottery "${newLotteryName}" launched! Tx: ${txHash}. (No logs in receipt)`);
        if (firebaseDocId) updateTokenOnLaunch(firebaseDocId, { status: "blockchain_confirmed_no_logs", transactionHash: receipt.transactionHash });
      }
      setIsSubmitting(false);
    }

    if (waitForReceiptError) {
      console.error("Error waiting for transaction receipt:", waitForReceiptError);
      setError(`Transaction confirmation failed: ${waitForReceiptError.shortMessage || waitForReceiptError.message}`);
      if (firebaseDocId) {
         updateTokenOnLaunch(firebaseDocId, { status: "blockchain_receipt_failed", error: waitForReceiptError.message });
      }
      setSuccessMessage("");
      setIsSubmitting(false);
    }
  }, [
    txHash, writeContractError, isWriteContractPending, 
    receipt, isReceiptSuccess, isReceiptLoading, waitForReceiptError,
    tokenName, firebaseDocId // Keep tokenName & firebaseDocId for messages/updates if form is reset early
  ]);

  // Determine overall loading state for the button
  const isLoading = imageUploading || isSubmitting || isWriteContractPending || isReceiptLoading;
  const buttonText = () => {
    if (imageUploading) return "Uploading image...";
    if (isWriteContractPending) return "Confirm in wallet...";
    if (isReceiptLoading) return "Processing on blockchain...";
    if (isSubmitting) return "Submitting..."; // General submission before wallet interaction
    return "Create Lottery";
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <button
        onClick={onGoBack}
        className="text-gray-400 hover:text-green-300 mb-4 self-center text-lg"
      >
        [go back]
      </button>
      <h2 className="text-3xl font-semibold mb-6 text-green-300">
        Create New Lottery
      </h2>
      <form
        className="w-full flex flex-col gap-4 items-start"
        onSubmit={handleCreateLottery}
      >
        {/* Name Input */}
        <div className="w-full">
          <label
            htmlFor="lottery-name"
            className="block text-sm font-medium text-green-300 mb-1"
          >
            Token Name <span className="text-green-500">*</span>
          </label>
          <input
            type="text"
            id="lottery-name" // Used by useEffect to grab tokenName for success message
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        {/* Ticker Input */}
        <div className="w-full">
          <label
            htmlFor="lottery-ticker"
            className="block text-sm font-medium text-green-300 mb-1"
          >
            Ticker <span className="text-green-500">*</span>
          </label>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-gray-600 bg-gray-800 text-gray-400 text-sm">
              $
            </span>
            <input
              type="text"
              id="lottery-ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="flex-1 block w-full h-10 rounded-none rounded-r-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="lottery-pool"
            className="block text-sm font-medium text-green-300 mb-1"
          >
            Lottery Pool <span className="text-green-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="lottery-pool"
              value={lotteryPool}
              onChange={(e) => {
                // Only allow numbers and decimals
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setLotteryPool(value);
                }
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter amount (e.g., 1.5)"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ETH
            </span>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="lottery-date"
            className="block text-sm font-medium text-green-300 mb-1"
          >
            Date of lottery <span className="text-green-500">*</span>
          </label>
          <DatePicker
            selectedDate={lotteryDate}
            onDateChange={(date) => setLotteryDate(date)}
            placeholder="Select date"
          />
        </div>

        {/* Direct Cloudinary Image Upload */}
        <div className="w-full">
          <label className="block text-sm font-medium text-green-300 mb-1">
            Image <span className="text-green-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md bg-gray-700">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-24 w-auto object-cover rounded-md mb-2"
                />
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}

              <div className="flex text-sm text-gray-400 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-green-300 hover:text-green-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-green-500 px-3 py-2"
                >
                  <span>{imageFile ? "Change image" : "Select an image"}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              </div>

              {!imagePreview && (
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              )}
              {imageUploading && (
                <p className="text-xs text-green-300 mt-2">
                  Uploading image...
                </p>
              )}
              {cloudinaryImageUrl && (
                <p className="text-xs text-green-300 mt-2">
                  Image uploaded successfully!
                </p>
              )}
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                    setCloudinaryImageUrl("");
                  }}
                  className="mt-2 bg-red-500 text-white font-semibold py-1 px-3 text-xs rounded-md hover:bg-red-400 transition-colors"
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Optional Fields Container */}
        {showOptionalFields && (
          <div className="w-full flex flex-col gap-4 mt-2">
            {/* Description Textarea */}
            <div className="w-full">
              <label
                htmlFor="lottery-description"
                className="block text-sm font-medium text-green-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="lottery-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            {/* Telegram Link */}
            <div className="w-full">
              <label
                htmlFor="telegram-link"
                className="block text-sm font-medium text-green-300 mb-1"
              >
                Telegram link
              </label>
              <input
                type="url"
                id="telegram-link"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://t.me/yourgroup (optional)"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            {/* Website Link */}
            <div className="w-full">
              <label
                htmlFor="website-link"
                className="block text-sm font-medium text-green-300 mb-1"
              >
                Website link
              </label>
              <input
                type="url"
                id="website-link"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
                placeholder="https://yourwebsite.com (optional)"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            {/* Twitter/X Link */}
            <div className="w-full">
              <label
                htmlFor="twitter-link"
                className="block text-sm font-medium text-green-300 mb-1"
              >
                Twitter or X link
              </label>
              <input
                type="url"
                id="twitter-link"
                value={twitterLink}
                onChange={(e) => setTwitterLink(e.target.value)}
                placeholder="https://twitter.com/yourprofile (optional)"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {/* Show/Hide More Options Button */}
        <div className="w-full text-left mt-2">
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="text-sm text-green-300 hover:text-green-400"
          >
            {showOptionalFields ? "hide more options ↑" : "show more options ↓"}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <p className="text-xs text-red-400 mt-2 w-full text-center bg-red-900_bg-opacity-50 p-2 rounded">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-xs text-green-300 mt-2 w-full text-center bg-green-900_bg-opacity-50 p-2 rounded">
            {successMessage}
          </p>
        )}

        {/* Tip Text */}
        <p className="text-xs text-gray-400 mt-2 w-full text-center">
          Tip: fields marked with <span className="text-red-500">*</span> are
          required. Coin data cannot be changed after creation.
        </p>

        {/* Create Lottery Button */}
        <div className="w-full mt-2">
          <button
            type="submit"
            className="w-full bg-green-300 text-gray-600 font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {buttonText()}
          </button>
        </div>
      </form>
    </div>
  );
}
