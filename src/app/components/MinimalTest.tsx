"use client";

import { useState } from "react";

export default function MinimalTest() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="border border-gray-700 p-4 rounded-lg">
      <button
        onClick={() => setClicked(true)}
        type="button"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        {clicked ? "Clicked!" : "Click me"}
      </button>
    </div>
  );
}
