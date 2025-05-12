"use client";

import { useState } from "react";

export default function DatePicker({
  selectedDate,
  onDateChange,
  placeholder = "Select date",
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate calendar days for the selected month and year
  const generateCalendarDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

    const days = [];
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleSelectDate = (day) => {
    if (day) {
      const date = new Date(selectedYear, selectedMonth, day);
      const formattedDate = date.toISOString().split("T")[0];
      onDateChange(formattedDate);
      setShowDatePicker(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={formatDisplayDate(selectedDate)}
        readOnly
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
        placeholder={placeholder}
      />
      <span
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        onClick={() => setShowDatePicker(!showDatePicker)}
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </span>

      {showDatePicker && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg">
          <div className="p-3">
            {/* Month and Year Navigation */}
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-gray-400 hover:text-green-300"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="text-white font-medium">
                {months[selectedMonth]} {selectedYear}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-gray-400 hover:text-green-300"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`
                    p-1 text-sm rounded-full
                    ${day ? "cursor-pointer hover:bg-gray-700" : ""}
                    ${
                      day &&
                      new Date(selectedYear, selectedMonth, day)
                        .toISOString()
                        .split("T")[0] === selectedDate
                        ? "bg-green-600 text-white"
                        : day
                        ? "text-white"
                        : ""
                    }
                  `}
                  onClick={() => handleSelectDate(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
