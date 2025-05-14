"use client";

import { useState, useEffect } from "react";
import { fetchTokens } from "../utils/firebaseHelpers"; // Assuming the same helper
import TrendingTokenCard from "./@common/TrendingTokenCard"; // We'll create this next

const TrendingToken = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTokens = async () => {
      try {
        setLoading(true);
        const tokenData = await fetchTokens();
        console.log(tokenData, "tokenData");
        // For trending, you might want to sort or filter differently,
        // but for now, we'll use the same data.
        // Potentially, limit the number of trending tokens, e.g., top 5 or 10
        setTokens(tokenData.slice(0, 5)); // Example: Show top 5 as "trending"
      } catch (err) {
        console.error("Error loading trending tokens:", err);
        setError("Failed to load trending tokens.");
      } finally {
        setLoading(false);
      }
    };

    getTokens();
  }, []);

  if (loading) {
    return <div className="text-center py-2">Loading trending...</div>;
  }

  if (error) {
    return <div className="text-center py-2 text-red-400">{error}</div>;
  }

  if (tokens.length === 0) {
    return <div className="text-center py-2">No trending tokens.</div>;
  }

  // Duplicate tokens to create the illusion of infinite scrolling
  const duplicatedTokens = [...tokens, ...tokens, ...tokens];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 overflow-hidden">
      <div className="infinite-scroll-container">
        <div className="infinite-scroll-content">
          {duplicatedTokens.map((token, index) => (
            <TrendingTokenCard key={`${token.id}-${index}`} token={token} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .infinite-scroll-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .infinite-scroll-content {
          display: flex;
          gap: 1rem;
          animation: scroll 30s linear infinite;
          width: max-content;
          padding: 1rem;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        /* Pause animation on hover if desired */
        .infinite-scroll-container:hover .infinite-scroll-content {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TrendingToken;
