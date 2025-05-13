"use client";

import React, { useState } from "react";

const TokenTradeInterface = ({ tokenSymbol, tokenName }) => {
  const [amount, setAmount] = useState("");
  const [tradeType, setTradeType] = useState("buy"); // "buy" or "sell"
  const [balance, setBalance] = useState({
    token: 0,
    sol: 0.1209, // Example balance
  });

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTradeTypeChange = (type) => {
    setTradeType(type);
  };

  const handleTrade = () => {
    // This would connect to your actual trading logic
    console.log(`${tradeType} ${amount} ${tokenSymbol}`);
    alert(`Trade submitted: ${tradeType} ${amount} ${tokenSymbol}`);
    // Reset form
    setAmount("");
  };

  const handleMaxAmount = () => {
    if (tradeType === "buy") {
      setAmount(balance.sol);
    } else {
      setAmount(balance.token);
    }
  };

  const handlePresetAmount = (value) => {
    setAmount(value);
  };

  return (
    <div className="bg-green-800/30 rounded-xl border border-green-600 p-4 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-green-300">Trade</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTradeTypeChange("buy")}
            className={`px-4 py-1 rounded-lg font-medium text-sm transition-all ${
              tradeType === "buy"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => handleTradeTypeChange("sell")}
            className={`px-4 py-1 rounded-lg font-medium text-sm transition-all ${
              tradeType === "sell"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Balance:</span>
          <span>
            {tradeType === "buy"
              ? `${balance.sol} SOL`
              : `${balance.token} ${tokenSymbol}`}
          </span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-lg focus:outline-none focus:border-green-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 font-medium">
            {tradeType === "buy" ? "SOL" : tokenSymbol}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <button
          onClick={() => handlePresetAmount("0.1")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
        >
          0.1
        </button>
        <button
          onClick={() => handlePresetAmount("0.5")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
        >
          0.5
        </button>
        <button
          onClick={() => handlePresetAmount("1")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
        >
          1
        </button>
        <button
          onClick={handleMaxAmount}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 rounded text-sm"
        >
          MAX
        </button>
      </div>

      <button
        onClick={handleTrade}
        className={`w-full py-2 rounded-lg font-bold text-base transition-all mt-auto ${
          tradeType === "buy"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {tradeType === "buy" ? "Buy" : "Sell"} {tokenSymbol}
      </button>

      <div className="mt-2 text-xs text-gray-500 text-center">
        <p>Trading fees: 0.3% • Slippage: 0.5%</p>
      </div>
    </div>
  );
};

export default TokenTradeInterface;
