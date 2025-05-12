"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchTokens } from "../utils/firebaseHelpers";

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
    return <div className="text-center py-4">Loading tokens...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (tokens.length === 0) {
    return <div className="text-center py-4">No tokens available</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Available Tokens
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-green-500/20 transition-all"
          >
            <div className="relative h-40 w-full">
              {token.tokenImage ? (
                <Image
                  src={token.tokenImage}
                  alt={token.tokenName || "Token image"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                  <span>No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">
                {token.tokenName || "Unnamed Token"}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400">{token.ticker || "---"}</span>
                <span className="text-green-400 font-medium">
                  {token.lotteryPool ? `${token.lotteryPool} pool` : "No pool"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
