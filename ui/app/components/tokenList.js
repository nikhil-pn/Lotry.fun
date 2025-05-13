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
      <h2 className="text-xl font-semibold mb-6 text-center">
        Tokens Available
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="relative bg-gradient-to-br from-green-600 to-green-800 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1 border-2 border-green-400"
          >
            {/* Ticket header with decorative elements */}
            <div className="bg-green-900/50 py-2 px-4 flex justify-between items-center border-b-2 border-dashed border-green-400">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-green-900 font-bold mr-2">
                  L
                </div>
                <span className="font-bold text-green-200">LOTTERY TICKET</span>
              </div>
              <div className="text-green-200 font-mono">
                {token.ticker || "---"}
              </div>
            </div>

            {/* Token image */}
            <div className="relative h-48 w-full border-b-2 border-dashed border-green-400">
              {token.tokenImage ? (
                <Image
                  src={token.tokenImage}
                  alt={token.tokenName || "Token image"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-green-700/50 flex items-center justify-center">
                  <span className="text-green-200">No image</span>
                </div>
              )}

              {/* Overlay with semi-transparent pattern */}
              <div className="absolute inset-0 bg-green-900/10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:8px_8px]"></div>
            </div>

            {/* Ticket body */}
            <div className="p-4">
              <h3 className="font-bold text-xl text-white mb-2 text-center">
                {token.tokenName || "Unnamed Token"}
              </h3>

              {/* Lottery details */}
              <div className="bg-green-900/30 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-200">Pool Amount:</span>
                  <span className="text-white font-bold text-lg">
                    {token.lotteryPool || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Draw Date:</span>
                  <span className="text-white font-mono">
                    {token.lotteryDate || "TBA"}
                  </span>
                </div>
              </div>

              {/* Ticket footer with serial number */}
              <div className="flex justify-center mt-2">
                <div className="bg-green-900/50 px-3 py-1 rounded-full border border-green-400">
                  <span className="font-mono text-xs text-green-200">
                    #{token.id?.substring(0, 8) || "000000"}
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative circles for ticket effect */}
            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-900 rounded-full"></div>
            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-900 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
