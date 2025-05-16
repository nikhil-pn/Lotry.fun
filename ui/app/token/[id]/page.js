// app/token/[id]/page.js

// This is a Server Component by default in Next.js App Router
import TokenTradingChart from "../../../components/TokenTradingChart";
import TokenTradeInterface from "../../../components/TokenTradeInterface";
import Navbar from "../../components/Navbar";
import CountdownTimer from "../../../components/CountdownTimer";
import LotteryWinner from "../../../components/LotteryWinner";
import { getTokenData } from "../actions";
import { notFound } from "next/navigation";

export default async function TokenPage({ params }) {
  // Await params before destructuring
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch token data from Firebase
  const token = await getTokenData(id);

  // If token is not found, show 404 page
  if (!token) {
    notFound();
  }

  // Default trading view symbol if not specified in token data
  const tradingViewSymbol = token.tradingViewSymbol || "NASDAQ:AAPL";

  // Check if lottery is complete
  const isLotteryComplete = token.lotteryDate === "000";

  // Basic styling for the page - you can expand this with Tailwind CSS classes
  return (
    <div className="min-h-screen bg-[#15161B] text-white p-4">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Header with Token Info */}
        <div className="mb-6 rounded-xl p-4 border ">
          <div className="flex items-center justify-center mb-2">
            {token.tokenImage && (
              <div className="mr-4">
                <img
                  src={token.tokenImage}
                  alt={token.tokenName}
                  className="w-16 h-16 rounded-lg object-cover border-2 "
                />
              </div>
            )}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-green-200 tracking-wider">
                {token.tokenName}
              </h1>
              <p className="text-green-100 mt-1 font-mono text-sm">
                ${token.ticker}
              </p>
            </div>
          </div>

          {token.description && (
            <div className="mt-3 text-center max-w-2xl mx-auto">
              <p className="text-green-100/80 text-sm italic">
                {token.description || "No description provided"}
              </p>
            </div>
          )}
        </div>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column - Trading Chart */}
          <div className="lg:col-span-2 0 rounded-xl border  shadow-lg overflow-hidden">
            <h2 className="text-md font-semibold text-green-100 p-4 border-b border-green-200/30">
              Token Chart
            </h2>
            <div className="h-full">
              <TokenTradingChart symbol={tradingViewSymbol} />
            </div>
          </div>

          {/* Right Column - Token Info and Trading Interface */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Trading Interface */}
            <div className="flex-grow">
              <TokenTradeInterface
                tokenSymbol={token.ticker}
                tokenName={token.tokenName}
              />
            </div>

            {/* Token Info */}
            <div className=" rounded-xl border  shadow-lg p-4">
              <h2 className="text-md font-semibold text-green-100 mb-3">
                Token Information
              </h2>

              <div className="flex items-center mb-4">
                <div className="w-16 h-16  rounded-lg shadow-lg overflow-hidden border border-green-300 flex items-center justify-center mr-4">
                  {token.tokenImage ? (
                    <img
                      src={token.tokenImage}
                      alt={token.tokenName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-green-200"
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
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-200">
                    {token.tokenName}
                  </h3>
                  <p className="text-xs text-green-100 font-mono">
                    Ticker: {token.ticker}
                  </p>
                </div>
              </div>

              {/* Countdown Timer (replaces Rules section) */}
              {!isLotteryComplete && (
                <CountdownTimer targetDate={token.lotteryDate} />
              )}

              {/* Lottery Winner Section - Shows only when lottery is complete */}
              {isLotteryComplete && (
                <LotteryWinner
                  tokenId={token.id}
                  tokenName={token.tokenName}
                  lotteryPool={token.lotteryPool}
                />
              )}

              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="bg-green-200/10 p-2 rounded text-center">
                  <h3 className="text-sm font-medium text-green-200">
                    Lottery Pool
                  </h3>
                  <p className="text-lg font-bold text-white">
                    {token.lotteryPool}
                  </p>
                </div>
                <div className="bg-green-200/10 p-2 rounded text-center">
                  <h3 className="text-sm font-medium text-green-200">
                    Draw Date
                  </h3>
                  <p className="text-md font-medium text-white font-mono">
                    {new Date(token.lotteryDate) < new Date()
                      ? "Completed"
                      : token.lotteryDate}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              {(token.websiteLink ||
                token.twitterLink ||
                token.telegramLink) && (
                <div className="bg-green-200/10 p-2 rounded">
                  <h3 className="text-sm font-medium text-green-200 mb-2">
                    Social Links
                  </h3>
                  <div className="flex gap-3">
                    {token.websiteLink && (
                      <a
                        href={token.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-200 hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </a>
                    )}
                    {token.twitterLink && (
                      <a
                        href={token.twitterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-200 hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05 1.883 0 3.616-.636 5.001-1.721-1.771-.037-3.255-1.197-3.767-2.793.249.037.499.062.761.062.361 0 .724-.05 1.061-.137-1.847-.374-3.23-1.995-3.23-3.953v-.05c.537.299 1.16.486 1.82.511-1.086-.722-1.801-1.957-1.801-3.356 0-.748.199-1.434.548-2.032 1.983 2.443 4.964 4.04 8.306 4.215-.062-.3-.1-.611-.1-.923 0-2.22 1.796-4.028 4.028-4.028 1.16 0 2.207.486 2.943 1.272.91-.175 1.782-.512 2.556-.973-.299.935-.936 1.721-1.771 2.22.811-.088 1.597-.312 2.319-.624-.548.797-1.233 1.496-2.019 2.07z" />
                        </svg>
                      </a>
                    )}
                    {token.telegramLink && (
                      <a
                        href={token.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-200 hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
