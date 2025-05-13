// app/token/[id]/page.js

// This is a Server Component by default in Next.js App Router
import TokenTradingChart from "../../../components/TokenTradingChart";
import TokenTradeInterface from "../../../components/TokenTradeInterface";
import Navbar from "../../components/Navbar";

async function getTokenDetails(id) {
  // In a real application, you would fetch token data based on the ID
  // For now, we'll simulate fetching and just return the ID and some placeholder data
  // console.log(`Fetching details for token: ${id}`);
  // const res = await fetch(`https://your-api.com/tokens/${id}`);
  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to fetch token data');
  // }
  // const tokenData = await res.json();
  // return tokenData;

  // Placeholder data structure
  return {
    id: id,
    name: `Token ${id.substring(0, 8)}...`,
    description:
      "This is a detailed description of the token. It includes information about its origins, utility, and the lottery it's associated with. Enjoy the thrill of the draw!",
    imageUrl: "/placeholder-token-image.png", // Replace with a real or dynamic image path
    lotteryPool: "1,000,000",
    drawDate: "2024-12-31",
    rules:
      "1. Must be 18+ to participate.\n2. One entry per person.\n3. Winners announced on the draw date.",
    ticker: id.substring(0, 3).toUpperCase(),
    tradingViewSymbol: "NASDAQ:AAPL", // Placeholder
  };
}

export default async function TokenPage({ params }) {
  const { id } = params; // Get the token ID from the route parameters
  const token = await getTokenDetails(id);

  // Basic styling for the page - you can expand this with Tailwind CSS classes
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-center text-green-300 tracking-wider">
            {token.name}
          </h1>
          <p className="text-center text-green-200 mt-2 font-mono text-sm">
            TICKER: {token.ticker}
          </p>
        </div>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column - Trading Chart */}
          <div className="lg:col-span-2 bg-green-800/30 rounded-xl border border-green-600 shadow-lg overflow-hidden">
            <h2 className="text-xl font-semibold text-green-300 p-4 border-b border-green-600">
              Token Chart
            </h2>
            <div className="h-full">
              <TokenTradingChart
                symbol={token.tradingViewSymbol || "NASDAQ:AAPL"}
              />
            </div>
          </div>

          {/* Right Column - Token Info and Trading Interface */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Trading Interface */}
            <div className="flex-grow">
              <TokenTradeInterface
                tokenSymbol={token.ticker}
                tokenName={token.name}
              />
            </div>

            {/* Token Info */}
            <div className="bg-green-800/30 rounded-xl border border-green-600 shadow-lg p-4">
              <h2 className="text-xl font-semibold text-green-300 mb-3">
                Token Information
              </h2>

              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-green-700 rounded-lg shadow-lg overflow-hidden border border-green-600 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0-2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-300">
                    {token.name}
                  </h3>
                  <p className="text-xs text-green-200 font-mono">
                    ID: #{token.id.substring(0, 8)}...
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-green-900/40 p-2 rounded">
                  <h3 className="text-sm font-medium text-green-300">
                    Lottery Pool
                  </h3>
                  <p className="text-lg font-bold text-white">
                    {token.lotteryPool}
                  </p>
                </div>
                <div className="bg-green-900/40 p-2 rounded">
                  <h3 className="text-sm font-medium text-green-300">
                    Draw Date
                  </h3>
                  <p className="text-lg font-bold text-white font-mono">
                    {token.drawDate}
                  </p>
                </div>
              </div>

              <div className="bg-green-900/40 p-2 rounded mb-3">
                <h3 className="text-sm font-medium text-green-300">
                  Description
                </h3>
                <p className="text-xs text-green-100 leading-tight">
                  {token.description.substring(0, 100)}...
                </p>
              </div>

              <div className="bg-green-900/40 p-2 rounded">
                <h3 className="text-sm font-medium text-green-300">Rules</h3>
                <ul className="text-xs text-green-100 list-disc list-inside space-y-0.5">
                  {token.rules.split("\n").map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
