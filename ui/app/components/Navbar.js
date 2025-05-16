"use client"; // Add if any client-side interactions are planned for Navbar, good practice for components

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { WalletConnect } from "./WalletConnect.jsx";
import LeaderboardModal from "./LeaderboardModal";

export default function Navbar() {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  return (
    <>
      <header className="w-full h-[100px] flex flex-col sm:flex-row justify-center sm:justify-between items-center top-0 z-50 bg-[#15161B]  mb-8">
        {/* Mobile: Logo left, WalletConnect right */}
        <div className="flex w-full items-center justify-between sm:hidden px-6 h-full">
          <Link href="/" passHref legacyBehavior>
            <a className="flex items-center">
              <img
                src="/lotryleaf.png"
                alt="LOTRY.FUN Logo"
                className="w-[80px] h-[80px]"
              />
            </a>
          </Link>
          <WalletConnect />
        </div>
        {/* Desktop: Logo left, actions right */}
        <div className="p-10 hidden sm:block">
          <Link href="/" passHref legacyBehavior>
            <a className="flex items-center">
              <img
                src="/lotryleaf.png"
                alt="LOTRY.FUN Logo"
                className="w-[160px] h-[160px]"
              />
            </a>
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors"
            title="Leaderboard"
          >
            <FaTrophy className="text-lg" />
          </button>
          <Link href="/create" passHref legacyBehavior>
            <a className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors">
              Create new lottery
            </a>
          </Link>
          <WalletConnect />
        </div>
      </header>

      {/* Render the leaderboard modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </>
  );
}
