"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchTokens } from "../utils/firebaseHelpers";
import TokenCard from "./@common/TokenCard";
import Navbar from "./Navbar";

const TokenList = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTokens = async () => {
      try {
        setLoading(true);
        const tokenData = await fetchTokens();
        setTokens(tokenData);
      } catch (err) {
        console.error("Error loading tokens:", err);
        setError("Failed to load tokens. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getTokens();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-4">
        <Image
          src="/claw.png"
          alt="Loading..."
          width={64}
          height={64}
          className="animate-spin-slow mb-2"
        />
        <span className="text-gray-400">Loading tokens...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (tokens.length === 0) {
    return <div className="text-center py-4">No tokens available</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-sm font-md mb-6 text-left text-gray-400">
        Recent Tokens
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {tokens.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
};

export default TokenList;
