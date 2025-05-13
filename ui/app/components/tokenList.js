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
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
};

export default TokenList;
