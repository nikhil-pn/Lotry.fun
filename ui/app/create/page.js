"use client";

import CreateLottery from "../components/CreateLottery"; // Adjust path as needed
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar"; // Import the Navbar component

export default function CreateLotteryPage() {
  const router = useRouter();

  // Function to handle going back, to be passed to CreateLottery component
  const handleGoBack = () => {
    router.push("/"); // Or router.back() to go to the previous page in history
  };

  return (
    <div className="flex flex-col min-h-screen text-white items-center justify-center p-4 bg-[#15161B]">
      <Navbar /> {/* Use the Navbar component here */}
      {/* 
        You might want a consistent header here as well, 
        or a simplified one for the create page.
        For now, let's keep it focused on the form.
      */}
      <CreateLottery onGoBack={handleGoBack} />
    </div>
  );
}
