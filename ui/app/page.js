"use client";

// import { sdk } from "@farcaster/frame-sdk"; // This seems unused now, can be removed if not needed elsewhere
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar"; // Corrected path
import TokenList from "./components/tokenList";
// import CreateLottery from "./components/CreateLottery"; // No longer directly used here

export default function Home() {
  // const [showCreateForm, setShowCreateForm] = useState(false); // Removed state
  const [currentLottery, setCurrentLottery] = useState(null);

  // useEffect(() => {
  //   sdk.actions.ready(); // This seems unused now
  // }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 text-white ">
      <Navbar /> {/* Use the Navbar component here */}
      {/* Main Content - Conditionally Rendered */}
      <main className="flex flex-col flex-grow items-center justify-center gap-6 text-center px-4">
        {/* Content that was previously shown when showCreateForm was false */}
        <Link href="/create" passHref legacyBehavior>
          <a className="text-gray-400 text-xl mb-4 cursor-pointer hover:text-green-300">
            [start a new lottery]
          </a>
        </Link>
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
      </main>
      {/* Token List Section */}
      <div className="w-full py-8">
        <TokenList />
      </div>
      <footer className="h-10"></footer>
    </div>
  );
}
