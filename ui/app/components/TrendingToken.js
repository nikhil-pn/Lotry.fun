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

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {/* The "ticket-style" layout will be primarily handled by CSS and TrendingTokenCard */}
      <div className="flex flex-nowrap overflow-x-auto space-x-4 p-4 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-700">
        {tokens.map((token) => (
          <TrendingTokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
};

export default TrendingToken;
