"use client";
import { useState, useEffect } from "react";

export default function LeaderboardModal({ isOpen, onClose }) {
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  // Dummy leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      walletAddress: "0xAbC...dEf",
      tokensHeld: 12500,
      winProbability: "25.50%",
    },
    {
      rank: 2,
      walletAddress: "0x123...456",
      tokensHeld: 11200,
      winProbability: "22.80%",
    },
    {
      rank: 3,
      walletAddress: "0xDeF...gH1",
      tokensHeld: 9800,
      winProbability: "18.75%",
    },
    {
      rank: 4,
      walletAddress: "0x789...aBc",
      tokensHeld: 8500,
      winProbability: "15.20%",
    },
    {
      rank: 5,
      walletAddress: "0xGhI...jK2",
      tokensHeld: 7200,
      winProbability: "10.90%",
    },
    {
      rank: 6,
      walletAddress: "0xCdE...fG3",
      tokensHeld: 6100,
      winProbability: "7.85%",
    },
  ];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative bg-gray-900 w-11/12 max-w-4xl max-h-[90vh] rounded-xl border-2 border-green-500 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 flex items-center">
            🏆 Leaderboard 🏆
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content with Scrollable Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-green-500 to-green-600">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Tokens Held
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Win Probability
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {leaderboardData.map((player, index) => (
                  <tr
                    key={player.rank}
                    className={`hover:bg-gray-700 transition-colors duration-150 ${
                      index < 3 ? "bg-opacity-20 bg-green-500" : ""
                    }`}
                  >
                    <td
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md font-medium ${
                        index < 3 ? "text-green-300" : "text-gray-100"
                      }`}
                    >
                      {player.rank}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md text-gray-300 truncate max-w-xs">
                      {player.walletAddress}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md text-gray-300">
                      {player.tokensHeld.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md font-semibold ${
                        parseFloat(player.winProbability) > 20
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      {player.winProbability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
