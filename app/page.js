import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-grey text-white font-[family-name:var(--font-geist-sans)]">
      {/* Header - Title left, Buttons right */}
      <header className="w-full p-12 sm:p-6 flex justify-center sm:justify-between items-center">
        {/* Title moved back to header */}
        <div className="text-3xl sm:text-2xl font-bold text-green-300">
          LOTRY.FUN
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <button className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors">
            Create new lottery
          </button>
          <button className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors">
            Log In
          </button>
        </div>
      </header>

      {/* Main Content - Centered Search */}
      <main className="flex flex-col flex-grow items-center justify-center gap-6 text-center px-4">
        {/* Title removed from main content */}
        <div className="text-gray-400 text-xl mb-4">[start a new lottery]</div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="search for lottery"
            className="bg-green-300 text-black placeholder-gray-600 rounded-md px-4 py-2 w-72 sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          />
          <button className="bg-green-300 text-black font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition-colors w-full sm:w-auto">
            Search
          </button>
        </div>
      </main>

      {/* Optional Footer Spacer */}
      <footer className="h-10"></footer>
    </div>
  );
}
