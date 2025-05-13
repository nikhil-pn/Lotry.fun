"use client";

import React from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const TokenTradingChart = ({ symbol }) => {
  // if (!symbol) {
  //   // Fallback or error handling if symbol is not provided
  //   return (
  //     <div className="text-red-500">Trading chart symbol not provided.</div>
  //   );
  // }

  const testSymbol = "BITSTAMP:BTCUSD"; // Using a common, hardcoded symbol for testing

  return (
    <div className="h-[calc(100%-56px)]">
      {" "}
      {/* Adjust height to account for header */}
      <AdvancedRealTimeChart
        theme="dark"
        symbol={testSymbol} // Using the hardcoded test symbol
        autosize
        // You can customize other props here:
        // interval="D"
        // timezone="Etc/UTC"
        // style="1"
        // locale="en"
        // allow_symbol_change={true}
        // studies={["Volume@tv-basicstudies"]}
        // container_id="tradingview_chart_container" // Ensure this is unique if you have multiple charts
      />
    </div>
  );
};

export default TokenTradingChart;
