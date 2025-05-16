import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://lotry-fun.vercel.app/` // Use your actual production URL
  : "http://localhost:3000";

// Placeholder FrameEmbed JSON - Replace imageUrl with a real URL
const frameMetadata = {
  version: "next",
  // Use a real image URL (3:2 aspect ratio, <10MB)
  imageUrl: "https://lotry-fun.vercel.app/logo.png", // You need to create/host this image
  button: {
    title: "Open LOTRY.FUN", // Or a better call to action
    action: {
      type: "launch_frame",
      // Optional: specify URL, otherwise uses the page URL
      // url: defaultUrl,
      name: "LOTRY.FUN", // Should match your app name
      // Optional: Add splash screen details if configured in farcaster.json
      // splashImageUrl: "...",
      // splashBackgroundColor:"..."
    },
  },
};

export const metadata = {
  title: "LOTRY",
  description: "Create and participate in fun lotteries!",
  metadataBase: new URL(defaultUrl),
  other: {
    // Add the fc:frame metadata here
    "fc:frame": JSON.stringify(frameMetadata),
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
