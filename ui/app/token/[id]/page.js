// app/token/[id]/page.js

// This is a Server Component by default in Next.js App Router
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
  };
}

export default async function TokenPage({ params }) {
  const { id } = params; // Get the token ID from the route parameters
  const token = await getTokenDetails(id);

  // Basic styling for the page - you can expand this with Tailwind CSS classes
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-green-800/50 shadow-2xl rounded-xl overflow-hidden border-2 border-green-500">
        {/* Header Section */}
        <div className="p-6 md:p-8 bg-green-700/60 border-b-2 border-dashed border-green-500">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-green-300 tracking-wider">
            {token.name}
          </h1>
          <p className="text-center text-green-200 mt-2 font-mono text-sm">
            TICKER: {token.ticker}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Image Column */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-full aspect-square bg-green-700 rounded-lg shadow-lg overflow-hidden border border-green-600 flex items-center justify-center">
              {/* Placeholder for token image - In a real app, use Next/Image */}
              {/* For now, a simple placeholder */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-32 w-32 text-green-400"
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
            <p className="mt-4 text-xs text-green-300 text-center font-mono">
              Serial: #{token.id}
            </p>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2">
            <div className="bg-green-900/40 p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold text-green-300 mb-3">
                Token Description
              </h2>
              <p className="text-green-100 leading-relaxed">
                {token.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-900/40 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-green-300">
                  Lottery Pool
                </h3>
                <p className="text-2xl font-bold text-white">
                  {token.lotteryPool}{" "}
                  <span className="text-sm text-green-200">UNITS</span>
                </p>
              </div>
              <div className="bg-green-900/40 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-green-300">
                  Draw Date
                </h3>
                <p className="text-2xl font-bold text-white font-mono">
                  {token.drawDate}
                </p>
              </div>
            </div>

            <div className="bg-green-900/40 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-green-300 mb-3">
                Lottery Rules
              </h2>
              <ul className="list-disc list-inside text-green-100 space-y-1 whitespace-pre-line">
                {token.rules.split("\n").map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Action Button (Example) */}
        <div className="p-6 md:p-8 border-t-2 border-dashed border-green-500 text-center">
          <button className="bg-green-500 hover:bg-green-400 text-green-900 font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50">
            Enter Lottery (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
