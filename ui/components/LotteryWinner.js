"use client";

import { useState, useEffect } from "react";
import { lotteryDrawSelect } from "../app/token/actions";

export default function LotteryWinner({ tokenId, tokenName, lotteryPool }) {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWinnerData() {
      try {
        setLoading(true);
        const result = await lotteryDrawSelect(tokenId);
        if (result.success) {
          setWinner(result);
        } else {
          setError("Failed to load winner information");
        }
      } catch (err) {
        setError("An error occurred while fetching the winner");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWinnerData();
  }, [tokenId]);

  if (loading) {
    return (
      <div className="bg-green-900/40 p-3 rounded my-3">
        <h3 className="text-sm font-medium text-green-300 mb-2">
          Lottery Winner
        </h3>
        <div className="text-center py-3">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-300"></div>
          <p className="text-green-300 text-xs mt-2">
            Loading winner details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/40 p-3 rounded my-3">
        <h3 className="text-sm font-medium text-red-300 mb-2">
          Lottery Winner
        </h3>
        <div className="text-center py-2">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-900/40 p-3 rounded my-3">
      <h3 className="text-sm font-medium text-green-300 mb-2">
        Lottery Winner
      </h3>

      <div className="bg-green-800/50 p-4 rounded">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-green-700 rounded-full overflow-hidden border border-green-500 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0-2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-medium text-green-300">
              Congratulations!
            </h4>
            <p className="text-xs text-green-200">
              {winner?.winnerName || "Anonymous User"}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-green-300 mb-1">Winner Address</p>
          <p className="bg-green-900/60 p-2 rounded text-xs font-mono text-green-100 break-all">
            {winner?.winnerAddress || "Address not available"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-xs text-green-300">Prize Token</p>
            <p className="text-sm font-medium text-white">{tokenName}</p>
          </div>
          <div>
            <p className="text-xs text-green-300">Prize Amount</p>
            <p className="text-sm font-medium text-white">{lotteryPool}</p>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Share on Twitter
          </button>
        </div>
      </div>
    </div>
  );
}
