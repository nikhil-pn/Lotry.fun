"use client";

// import Image from "next/image"; // If you need images

const TrendingTokenCard = ({ token }) => {
  console.log(token, "token");
  if (!token || !token.id) {
    return null;
  }

  return (
    <div className="bg-gray-800 border border-green-600 p-3 rounded-lg shadow-lg min-w-[200px] max-w-[240px] flex-shrink-0 text-xs hover:shadow-green-500/50 transition-shadow duration-300 cursor-pointer">
      {/* Basic "ticket" like structure */}
      <div className="flex justify-between items-center mb-2">
        <h3
          className="font-bold text-sm truncate text-green-400"
          title={token.tokenName}
        >
          {token.tokenName || "Unnamed Token"}
        </h3>
        <span className="text-gray-400 text-xs">{token.ticker || "N/S"}</span>
      </div>

      {/* Placeholder for an image or icon if you have one */}
      {/* {token.imageURL && (
        <div className="my-2 h-20 w-full bg-gray-700 rounded flex items-center justify-center">
          <Image src={token.imageURL} alt={token.name || "Token image"} width={60} height={60} className="object-contain rounded" />
        </div>
      )} */}

      <div className="space-y-1">
        <p className="text-gray-300">
          <span className="font-semibold">Price:</span> $
          {token.tokenPrice || "N/A"}
        </p>
        <p className="text-gray-300">
          <span className="font-semibold">Total Supply:</span>{" "}
          {token.maxSupply || "N/A"}
        </p>
        <p className="text-gray-400">
          <span className="font-semibold">Ends:</span>{" "}
          {token.lotteryEndDate
            ? new Date(token.lotteryEndDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-dashed border-gray-600">
        <p className="text-center text-green-500 font-semibold">View Lottery</p>
      </div>
    </div>
  );
};

export default TrendingTokenCard;
