"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useReadContract,
  useBalance
} from "wagmi";
// Assuming wagmiConfig is correctly set up and exported from your utils
// import { config as wagmiConfig } from "../app/utils/wagmi"; // Adjust path if needed

// ABI for BondingCurvePool
const BondingCurvePoolABI = [
  {
    "type": "constructor",
    "inputs": [
      { "type": "string", "name": "name", "internalType": "string" },
      { "type": "string", "name": "symbol", "internalType": "string" },
      { "type": "uint256", "name": "_initialTokenPrice", "internalType": "uint256" },
      { "type": "uint256", "name": "_initialLotteryPool", "internalType": "uint256" },
      { "type": "address", "name": "_treasury", "internalType": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "TokensPurchased",
    "inputs": [
      { "type": "address", "name": "buyer", "indexed": true, "internalType": "address" },
      { "type": "uint256", "name": "amountEth", "indexed": false, "internalType": "uint256" },
      { "type": "uint256", "name": "amountTokens", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokensSold",
    "inputs": [
      { "type": "address", "name": "seller", "indexed": true, "internalType": "address" },
      { "type": "uint256", "name": "amountTokens", "indexed": false, "internalType": "uint256" },
      { "type": "uint256", "name": "amountEth", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LotteryPoolUpdated",
    "inputs": [
      { "type": "uint256", "name": "newLotteryPool", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "updateVirtualReserves",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "calculateCurrentPrice",
    "inputs": [],
    "outputs": [
      { "type": "uint256", "name": "", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateBuyReturn",
    "inputs": [
      { "type": "uint256", "name": "ethAmount", "internalType": "uint256" }
    ],
    "outputs": [
      { "type": "uint256", "name": "", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "calculateSellReturn",
    "inputs": [
      { "type": "uint256", "name": "tokenAmount", "internalType": "uint256" }
    ],
    "outputs": [
      { "type": "uint256", "name": "", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "buy",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "sell",
    "inputs": [
      { "type": "uint256", "name": "tokenAmount", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "burn",
    "inputs": [
      { "type": "uint256", "name": "tokenAmount", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addToLotteryPool",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  { "type": "function", "name": "INITIAL_SUPPLY", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "MIN_LOTTERY_POOL", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "MAX_LOTTERY_POOL", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "MIN_BUY", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "SCALE_FACTOR", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "SCALE_DENOMINATOR", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "initialTokenPrice", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "lotteryPool", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "ethRaised", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "constant_k", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "migrated_supply", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "virtualTokenReserve", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "virtualEthReserve", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "name", "inputs": [], "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "decimals", "inputs": [], "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view" },
  { "type": "function", "name": "totalSupply", "inputs": [], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "balanceOf", "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "transfer", "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "allowance", "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "approve", "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "transferFrom", "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable" }
];

const BASE_SEPOLIA_CHAIN_ID = 84532; // Base Sepolia Chain ID

// Component receives tokenAddress for the specific BondingCurvePool
const TokenTradeInterface = ({ tokenSymbol, tokenName, tokenAddress }) => {
  const [amount, setAmount] = useState("");
  const [tradeType, setTradeType] = useState("buy"); // "buy" or "sell"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentTokenPrice, setCurrentTokenPrice] = useState("0");
  const [expectedReturn, setExpectedReturn] = useState("0"); // For buy/sell calculation
  const [tokenDecimals, setTokenDecimals] = useState(18); // Default to 18, fetch if different

  const { address: accountAddress, isConnected, chain } = useAccount();

  // Wagmi hooks for contract interaction
  const { 
    data: txHash, 
    error: writeContractError, 
    isPending: isWriteContractPending,
    writeContractAsync 
  } = useWriteContract();

  const { 
    data: receipt, 
    error: waitForReceiptError, 
    isLoading: isReceiptLoading, 
    isSuccess: isReceiptSuccess 
  } = useWaitForTransactionReceipt({ hash: txHash });

  // Fetch user's ETH balance
  const { data: ethBalanceData } = useBalance({
    address: accountAddress,
    watch: true,
  });
  const ethBalance = ethBalanceData ? parseFloat(ethers.formatEther(ethBalanceData.value)) : 0;

  // Fetch user's token balance for the current pool
  const { data: tokenBalanceData, refetch: refetchTokenBalance } = useReadContract({
    address: tokenAddress,
    abi: BondingCurvePoolABI,
    functionName: 'balanceOf',
    args: [accountAddress],
    chainId: BASE_SEPOLIA_CHAIN_ID,
    enabled: !!accountAddress && !!tokenAddress, // Only run if prerequisites are met
  });
  const userTokenBalance = tokenBalanceData ? parseFloat(ethers.formatUnits(tokenBalanceData, tokenDecimals)) : 0;
  
  // Fetch token decimals
  const { data: fetchedTokenDecimals } = useReadContract({
    address: tokenAddress,
    abi: BondingCurvePoolABI,
    functionName: 'decimals',
    chainId: BASE_SEPOLIA_CHAIN_ID,
    enabled: !!tokenAddress,
  });

  useEffect(() => {
    if (fetchedTokenDecimals) {
      setTokenDecimals(Number(fetchedTokenDecimals));
    }
  }, [fetchedTokenDecimals]);


  // Fetch current token price
  const { data: priceData, refetch: refetchPrice } = useReadContract({
    address: tokenAddress,
    abi: BondingCurvePoolABI,
    functionName: 'calculateCurrentPrice',
    chainId: BASE_SEPOLIA_CHAIN_ID,
    enabled: !!tokenAddress,
  });

  useEffect(() => {
    if (priceData) {
      setCurrentTokenPrice(ethers.formatEther(priceData)); // Assuming price is in ETH like units
    }
  }, [priceData]);

  // Calculate expected buy/sell return
  const { data: calculatedReturnData, refetch: refetchCalculatedReturn } = useReadContract({
    address: tokenAddress,
    abi: BondingCurvePoolABI,
    functionName: tradeType === 'buy' ? 'calculateBuyReturn' : 'calculateSellReturn',
    args: [
      amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ?
        (tradeType === 'buy' ? ethers.parseEther(amount) : ethers.parseUnits(amount, tokenDecimals))
        : ethers.parseEther("0") // Default to 0 if amount is invalid
    ],
    chainId: BASE_SEPOLIA_CHAIN_ID,
    enabled: !!tokenAddress && !!amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0,
  });

  useEffect(() => {
    if (calculatedReturnData) {
      setExpectedReturn(
        tradeType === 'buy' 
          ? ethers.formatUnits(calculatedReturnData, tokenDecimals) 
          : ethers.formatEther(calculatedReturnData)
      );
    } else if (amount && parseFloat(amount) > 0) {
      setExpectedReturn("Calculating...");
    } else {
      setExpectedReturn("0");
    }
  }, [calculatedReturnData, amount, tradeType, tokenDecimals]);


  const handleAmountChange = (e) => {
    const val = e.target.value;
     // Allow only numbers and a single decimal point
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  const handleTradeTypeChange = (type) => {
    setTradeType(type);
    setAmount(""); // Reset amount on trade type change
    setError("");
    setSuccessMessage("");
    setExpectedReturn("0");
  };

  const handleTrade = async () => {
    setError("");
    setSuccessMessage("");

    if (!isConnected || !accountAddress) {
      setError("Please connect your wallet.");
      return;
    }
    if (chain && chain.id !== BASE_SEPOLIA_CHAIN_ID) {
      setError(`Please switch to Base Sepolia network. You are on chain ID ${chain.id}.`);
      return;
    }
    if (!tokenAddress) {
      setError("Token address not provided. Cannot perform trade.");
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    console.log(`Attempting to ${tradeType} ${amount} of ${tokenSymbol} (${tokenAddress})`);

    try {
      let txResponse;
      if (tradeType === "buy") {
        const ethValue = ethers.parseEther(amount);
        console.log(`Calling 'buy' function with ETH value: ${ethers.formatEther(ethValue)}`);
        
        // Pre-flight check for buy return
        const tokensToReceive = await refetchCalculatedReturn();
        if (!tokensToReceive.data || ethers.toBigInt(tokensToReceive.data) === 0n) {
            setError("Calculated tokens to receive is zero. Transaction not sent.");
            setIsSubmitting(false);
            return;
        }
        console.log(`Expected tokens to receive from calculateBuyReturn: ${ethers.formatUnits(tokensToReceive.data, tokenDecimals)}`);

        txResponse = await writeContractAsync({
          address: tokenAddress,
          abi: BondingCurvePoolABI,
          functionName: 'buy',
          value: ethValue, // Send ETH with the transaction for buying
          // chainId: BASE_SEPOLIA_CHAIN_ID // Not needed if wallet is on correct chain
        });
      } else { // Sell
        const tokenAmountParsed = ethers.parseUnits(amount, tokenDecimals);
        console.log(`Calling 'sell' function with token amount: ${ethers.formatUnits(tokenAmountParsed, tokenDecimals)}`);

        // Pre-flight check for sell return
        const ethToReceive = await refetchCalculatedReturn();
         if (!ethToReceive.data || ethers.toBigInt(ethToReceive.data) === 0n) {
            setError("Calculated ETH to receive is zero. Transaction not sent.");
            setIsSubmitting(false);
            return;
        }
        console.log(`Expected ETH to receive from calculateSellReturn: ${ethers.formatEther(ethToReceive.data)}`);

        txResponse = await writeContractAsync({
          address: tokenAddress,
          abi: BondingCurvePoolABI,
          functionName: 'sell',
          args: [tokenAmountParsed],
          // chainId: BASE_SEPOLIA_CHAIN_ID
        });
      }
      console.log("Transaction submitted. Hash:", txHash); // txHash is updated by useWriteContract
                                                       // but txResponse from await has it immediately.
                                                       // Using txHash from the hook is generally safer for subsequent steps.

    } catch (err) {
      console.error("Error submitting transaction:", err);
      setError(`Transaction failed: ${err.shortMessage || err.message}`);
      setIsSubmitting(false);
    }
  };
  
  // Effect to handle transaction lifecycle (pending, success, error)
  useEffect(() => {
    if (isWriteContractPending) {
      setSuccessMessage("Please confirm the transaction in your wallet...");
      setError("");
      return;
    }
    if (writeContractError) {
      setError(`Transaction submission failed: ${writeContractError.shortMessage || writeContractError.message}`);
      setSuccessMessage("");
      setIsSubmitting(false); // Re-enable button
      return;
    }

    if (txHash && !isReceiptLoading && !isReceiptSuccess && !waitForReceiptError) {
      setSuccessMessage(`Transaction ${txHash} sent. Waiting for confirmation...`);
    }
    
    if (isReceiptSuccess && receipt) {
      console.log("Transaction Confirmed! Receipt:", receipt);
      setSuccessMessage(`Trade successful! Tx: ${receipt.transactionHash}`);
      setError("");
      setAmount(""); // Reset amount after successful trade
      setIsSubmitting(false); // Re-enable button

      // Refetch balances and price after successful trade
      refetchTokenBalance();
      // refetchEthBalance(); // useBalance has `watch: true`
      refetchPrice();
      refetchCalculatedReturn(); // To reset expected return

      // Log event details if available
      const contractInterface = new ethers.Interface(BondingCurvePoolABI);
      receipt.logs.forEach(log => {
        try {
          const parsedLog = contractInterface.parseLog(log);
          if (parsedLog) {
            console.log("Parsed Log:", parsedLog.name, parsedLog.args);
            if (parsedLog.name === "TokensPurchased") {
              console.log(`Tokens Purchased - Buyer: ${parsedLog.args.buyer}, ETH Spent: ${ethers.formatEther(parsedLog.args.amountEth)}, Tokens Received: ${ethers.formatUnits(parsedLog.args.amountTokens, tokenDecimals)}`);
            } else if (parsedLog.name === "TokensSold") {
              console.log(`Tokens Sold - Seller: ${parsedLog.args.seller}, Tokens Sold: ${ethers.formatUnits(parsedLog.args.amountTokens, tokenDecimals)}, ETH Received: ${ethers.formatEther(parsedLog.args.amountEth)}`);
            }
          }
        } catch (e) {
          // Might be a log from another contract if the pool interacts with others
          // console.log("Could not parse a log:", log);
        }
      });


    }

    if (waitForReceiptError) {
      console.error("Error waiting for transaction receipt:", waitForReceiptError);
      setError(`Transaction confirmation failed: ${waitForReceiptError.shortMessage || waitForReceiptError.message}`);
      setSuccessMessage("");
      setIsSubmitting(false); // Re-enable button
    }
  }, [
    txHash, writeContractError, isWriteContractPending, 
    receipt, isReceiptSuccess, isReceiptLoading, waitForReceiptError,
    refetchTokenBalance, refetchPrice, tokenDecimals, refetchCalculatedReturn
  ]);


  const handleMaxAmount = () => {
    if (tradeType === "buy") {
      // Leave a tiny bit for gas if setting max ETH, though smart wallets might handle this.
      // For simplicity, just setting the full balance. User should manage gas.
      setAmount(ethBalance.toString());
    } else {
      setAmount(userTokenBalance.toString());
    }
  };

  const handlePresetAmount = (value) => {
    setAmount(value);
  };

  const isLoading = isSubmitting || isWriteContractPending || isReceiptLoading;
  const buttonText = () => {
    if (isWriteContractPending) return "Confirm in wallet...";
    if (isReceiptLoading) return "Processing transaction...";
    if (isSubmitting && !isWriteContractPending && !isReceiptLoading) return "Submitting...";
    return `${tradeType.charAt(0).toUpperCase() + tradeType.slice(1)} ${tokenSymbol}`;
  };


  return (
    <div className="0 rounded-xl border  p-4 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-semibold text-green-100">Trade</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTradeTypeChange("buy")}
            className={`px-4 py-1 rounded-lg font-medium text-sm transition-all ${
              tradeType === "buy"
                ? "bg-green-300 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            disabled={isLoading}
          >
            Buy
          </button>
          <button
            onClick={() => handleTradeTypeChange("sell")}
            className={`px-4 py-1 rounded-lg font-medium text-sm transition-all ${
              tradeType === "sell"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            disabled={isLoading}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="mb-1 text-xs text-gray-400">
        Current Price: {parseFloat(currentTokenPrice).toFixed(6)} ETH/{tokenSymbol}
      </div>
      {tokenAddress && <div className="mb-3 text-xs text-gray-500 truncate" title={tokenAddress}>Pool: {tokenAddress}</div>}


      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>
            {tradeType === "buy" ? "Your ETH Balance:" : `Your ${tokenSymbol} Balance:`}
          </span>
          <span>
            {tradeType === "buy"
              ? `${ethBalance.toFixed(4)} ETH`
              : `${userTokenBalance.toFixed(4)} ${tokenSymbol}`}
          </span>
        </div>
        <div className="relative">
          <input
            type="text" // Changed to text to allow for better regex control if needed
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-lg focus:outline-none focus:border-green-500"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 font-medium">
            {tradeType === "buy" ? "ETH" : tokenSymbol}
          </div>
        </div>
      </div>
       <div className="text-xs text-gray-400 mb-3 h-4"> {/* Min height to prevent layout shift */}
        {parseFloat(amount) > 0 && expectedReturn !== "0" && (
          tradeType === 'buy' 
            ? `You will receive approx: ${parseFloat(expectedReturn).toFixed(4)} ${tokenSymbol}`
            : `You will receive approx: ${parseFloat(expectedReturn).toFixed(4)} ETH`
        )}
      </div>


      <div className="grid grid-cols-4 gap-2 mb-3">
        <button
          onClick={() => handlePresetAmount(tradeType === "buy" ? "0.01" : "10")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
          disabled={isLoading}
        >
          {tradeType === "buy" ? "0.01" : "10"}
        </button>
        <button
          onClick={() => handlePresetAmount(tradeType === "buy" ? "0.05" : "50")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
          disabled={isLoading}
        >
          {tradeType === "buy" ? "0.05" : "50"}
        </button>
        <button
          onClick={() => handlePresetAmount(tradeType === "buy" ? "0.1" : "100")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
          disabled={isLoading}
        >
          {tradeType === "buy" ? "0.1" : "100"}
        </button>
        <button
          onClick={handleMaxAmount}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
          disabled={isLoading}
        >
          MAX
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <p className="text-xs text-red-400 my-2 w-full text-center bg-red-900_bg-opacity-50 p-2 rounded">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="text-xs text-green-300 my-2 w-full text-center bg-green-900_bg-opacity-50 p-2 rounded">
          {successMessage}
        </p>
      )}

      <button
        onClick={handleTrade}
        disabled={isLoading || !tokenAddress || (parseFloat(amount) <= 0) || !isConnected}
        className={`w-full py-2 rounded-lg font-bold text-base transition-all mt-auto ${
          tradeType === "buy"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {buttonText()}
      </button>

      <div className="mt-2 text-xs text-gray-500 text-center">
        {/* These are illustrative. Real fees/slippage would involve more complex logic or contract reads */}
        <p>Trading fees: 4% (implied by SCALE_FACTOR) • Slippage: Auto</p>
      </div>
    </div>
  );
};

export default TokenTradeInterface;

