"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-green-900/40 p-3 rounded">
      <h3 className="text-sm font-medium text-green-300 mb-2">
        Draw Countdown
      </h3>
      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="bg-green-800/50 p-2 rounded">
          <div className="text-xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-xs text-green-300">Days</div>
        </div>
        <div className="bg-green-800/50 p-2 rounded">
          <div className="text-xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-xs text-green-300">Hours</div>
        </div>
        <div className="bg-green-800/50 p-2 rounded">
          <div className="text-xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-xs text-green-300">Mins</div>
        </div>
        <div className="bg-green-800/50 p-2 rounded">
          <div className="text-xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-xs text-green-300">Secs</div>
        </div>
      </div>
    </div>
  );
}
