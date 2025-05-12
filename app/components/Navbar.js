"use client"; // Add if any client-side interactions are planned for Navbar, good practice for components

import Link from "next/link";
import { WalletConnect } from "./WalletConnect.jsx";

export default function Navbar() {
  return (
    <header className="w-full p-12 sm:p-6 flex justify-center sm:justify-between items-center">
      <div className="text-3xl sm:text-2xl font-bold text-green-300">
        <Link href="/" passHref legacyBehavior>
          <a>LOTRY.FUN</a>
        </Link>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <Link href="/create" passHref legacyBehavior>
          <a className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors">
            Create new lottery
          </a>
        </Link>
        <WalletConnect />
      </div>
    </header>
  );
}
