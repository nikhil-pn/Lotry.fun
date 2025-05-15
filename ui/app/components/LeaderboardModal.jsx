"use client";
import { useState, useEffect } from "react";
import { FaTrophy } from "react-icons/fa";

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

      {/* Classic Ticket Modal */}
      <div
        className={`relative w-11/12 max-w-4xl max-h-[90vh] transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="classic-ticket">
          <div className="ticket-main">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-2 rounded-full transition-colors z-50"
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

            {/* Header */}
            <div className="ticket-header">
              <h2 className="ticket-title">
                <FaTrophy className="text-3xl inline-block mr-2" /> <span className="text-2xl font-bold">LEADERBOARD</span>{" "}
                <FaTrophy className="text-3xl inline-block " />
              </h2>
            </div>

            {/* Content */}
            <div className="ticket-content">
              <div className="overflow-x-auto w-full">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Wallet Address
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Tokens Held
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Win Probability
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((player, index) => (
                      <tr
                        key={player.rank}
                        className={`border-b border-green-300 ${
                          index < 3 ? "bg-green-100" : ""
                        }`}
                      >
                        <td
                          className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md font-medium ${
                            index < 3 ? "text-green-800" : "text-gray-900"
                          }`}
                        >
                          {player.rank}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md text-gray-900 truncate max-w-xs">
                          {player.walletAddress}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md text-gray-900">
                          {player.tokensHeld.toLocaleString()}
                        </td>
                        <td
                          className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-md font-semibold ${
                            parseFloat(player.winProbability) > 20
                              ? "text-green-800"
                              : "text-gray-900"
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

          {/* Ticket Stub */}
          <div className="ticket-stub">
            <div className="stub-text">TICKET</div>
            <div className="stub-serial">BB96CF</div>
          </div>
        </div>

        <style jsx>{`
          .classic-ticket {
            display: flex;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            max-height: 80vh;
          }

          .ticket-main {
            flex: 1;
            background-color: #4ade80;
            border: 2px solid #4ade80;
            border-radius: 8px;
            padding: 20px;
            position: relative;
            overflow: hidden;
            color: #1a202c;
            min-height: 400px;
            display: flex;
            flex-direction: column;
          }

          .ticket-main::before,
          .ticket-stub::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid #a7f3d0;
            border-radius: 6px;
            pointer-events: none;
            margin: 8px;
          }

          /* Perforated edge between main ticket and stub */
          .ticket-main::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 2px;
            height: 100%;
            background-image: linear-gradient(
              to bottom,
              #4ade80 5px,
              transparent 5px
            );
            background-size: 10px 15px;
            z-index: 5;
          }

          /* Top edges */
          .classic-ticket::before {
            content: "";
            position: absolute;
            top: 0;
            left: 5%;
            right: 5%;
            height: 8px;
            background-image: radial-gradient(
              circle at 5px 0,
              transparent 5px,
              #4ade80 5px
            );
            background-size: 15px 8px;
            background-repeat: repeat-x;
            z-index: 10;
          }

          /* Bottom edges */
          .classic-ticket::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 5%;
            right: 5%;
            height: 8px;
            background-image: radial-gradient(
              circle at 5px 8px,
              transparent 5px,
              #4ade80 5px
            );
            background-size: 15px 8px;
            background-repeat: repeat-x;
            z-index: 10;
          }

          .ticket-header {
            padding: 10px 0;
            margin-bottom: 20px;
            text-align: center;
          }

          .ticket-title {
            font-size: 28px;
            font-weight: bold;
            color: #1a202c;
            text-transform: uppercase;
            font-family: Arial, sans-serif;
            letter-spacing: 1px;
          }

          .ticket-content {
            flex: 1;
            background-color: #fff;
            border-radius: 6px;
            padding: 10px;
            overflow-y: auto;
            max-height: calc(80vh - 100px);
          }

          /* Table styling */
          table {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
          }

          thead {
            background-color: #dcfce7;
          }

          th {
            color: #166534;
          }

          tr:hover {
            background-color: #dcfce7;
          }

          /* Ticket stub */
          .ticket-stub {
            width: 80px;
            background-color: #4ade80;
            border: 2px solid #4ade80;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #1a202c;
            position: relative;
            border-radius: 0 8px 8px 0;
          }

          .stub-text {
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            letter-spacing: 2px;
          }

          .stub-serial {
            writing-mode: vertical-lr;
            font-size: 14px;
            font-family: monospace;
            font-weight: bold;
            margin-top: 20px;
          }
        `}</style>
      </div>
    </div>
  );
}
