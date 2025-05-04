"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-grey text-white font-[family-name:var(--font-geist-sans)]">
      {/* Header - Title left, Buttons right */}
      <header className="w-full p-12 sm:p-6 flex justify-center sm:justify-between items-center">
        {/* Title moved back to header */}
        <div className="text-3xl sm:text-2xl font-bold text-green-300">
          LOTRY.FUN
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors"
          >
            Create new lottery
          </button>
          <button className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors">
            Log In
          </button>
        </div>
      </header>

      {/* Main Content - Conditionally Rendered */}
      <main className="flex flex-col flex-grow items-center justify-center gap-6 text-center px-4">
        {!showCreateForm ? (
          <>
            {/* Title removed from main content */}
            <div
              onClick={() => setShowCreateForm(true)}
              className="text-gray-400 text-xl mb-4 cursor-pointer hover:text-green-300"
            >
              [start a new lottery]
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="search for lottery"
                className="bg-green-300 text-black placeholder-gray-600 rounded-md px-4 py-2 w-72 sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              />
              <button className="bg-green-300 text-gray-600 font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition-colors w-full sm:w-auto">
                Search
              </button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Placeholder for Create Lottery Form */}
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-green-300 mb-4 self-center text-lg"
            >
              [go back]
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-green-300">
              Create New Lottery
            </h2>
            {/* Form elements will go here */}
            <form className="w-full flex flex-col gap-4 items-start">
              {/* Name Input */}
              <div className="w-full">
                <label
                  htmlFor="lottery-name"
                  className="block text-sm font-medium text-green-300 mb-1 "
                >
                  Lottery Name
                </label>
                <input
                  type="text"
                  id="lottery-name"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
                    className="flex-1 block w-full h-10 rounded-none rounded-r-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

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
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Show More Options (Placeholder) */}
              <div className="w-full text-left mt-2">
                <button
                  type="button"
                  className="text-sm text-green-300 hover:text-green-400"
                >
                  show more options ↓
                </button>
              </div>

              {/* Create Coin Button */}
              <div className="w-full mt-4">
                <button
                  type="submit" // Changed to submit
                  className="w-full bg-green-300 text-gray-600 font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition-colors"
                >
                  create lottery
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Optional Footer Spacer */}
      <footer className="h-10"></footer>
    </div>
  );
}
