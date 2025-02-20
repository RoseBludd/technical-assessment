import React from "react";
import TestCounter from "../components/TestCounter";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Test Page</h1>
      <p className="text-gray-300 mb-8">
        This is a test page to verify client component hydration.
      </p>
      <TestCounter />
    </div>
  );
}
