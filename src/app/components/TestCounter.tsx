"use client";

import React, { useState } from "react";

export default function TestCounter() {
  const [count, setCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    console.log("Button clicked!");
    setCount((prev) => prev + 1);
    setIsClicked(true);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <p className="text-white text-lg mb-3">Counter: {count}</p>
      <p className={`mb-4 ${isClicked ? "text-green-500" : "text-white"}`}>
        Button has {isClicked ? "been clicked" : "not been clicked"}
      </p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Increment Counter
      </button>
    </div>
  );
}
