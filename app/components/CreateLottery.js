"use client";

import { useState } from "react";
import { db } from "../../lib/firebase"; // Remove storage import
import { collection, addDoc } from "firebase/firestore";
import DatePicker from "../common/DatePicker";

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
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    if (!tokenName || !ticker || !lotteryPool || !lotteryDate) {
      setError(
        "Please fill in all required fields: Token Name, Ticker, Lottery Pool, and Date."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload image first if present
      let imageUrl = cloudinaryImageUrl;
      if (imageFile && !cloudinaryImageUrl) {
        imageUrl = await uploadToCloudinary(imageFile);
        if (!imageUrl && imageFile) {
          // If image upload failed but image was selected, stop the submission
          setIsSubmitting(false);
          return;
        }
      }

      const lotteryData = {
        tokenName,
        ticker,
        lotteryPool: parseFloat(lotteryPool) || 0, // Ensure it's a number
        lotteryDate,
        description,
        tokenImage: imageUrl, // Use Cloudinary URL directly
        telegramLink,
        websiteLink,
        twitterLink,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "token"), lotteryData);
      setSuccessMessage(`Lottery "${tokenName}" created successfully!`);
      // Reset form
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
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Failed to create lottery. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            className="block text-sm font-medium text-green-300 mb-1 "
          >
            Token Name
          </label>
          <input
            type="text"
            id="lottery-name"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>
        {/* Ticker Input */}
        <div className="w-full">
          <label
            htmlFor="lottery-ticker"
            className="block text-sm font-medium text-green-300 mb-1"
          >
            Ticker
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
              required
            />
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="lottery-pool"
            className="block text-sm font-medium text-green-300 mb-1 "
          >
            Lottery Pool
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
              placeholder="Enter amount"
              required
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="lottery-date"
            className="block text-sm font-medium text-green-300 mb-1"
          >
            Date of lottery
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
            Image
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
                  <span>Select an image</span>
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
          Tip: coin data cannot be changed after creation
        </p>

        {/* Create Lottery Button */}
        <div className="w-full mt-2">
          <button
            type="submit"
            className="w-full bg-green-300 text-gray-600 font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition-colors disabled:opacity-50"
            disabled={isSubmitting || imageUploading}
          >
            {isSubmitting
              ? "Creating..."
              : imageUploading
              ? "Uploading image..."
              : "create lottery"}
          </button>
        </div>
      </form>
    </div>
  );
}
