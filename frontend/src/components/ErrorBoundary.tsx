"use client";

import { useState, useEffect } from "react";
import type { ErrorBoundaryTypes } from "../types";


// Error boundary component to gracefully handle and display runtime errors
// Prevents entire app from crashing when components fail
export default function ErrorBoundary({ children, fallback }: ErrorBoundaryTypes) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught error:", error);
      setError(error.error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleReset = () => {
    setError(null);
    setHasError(false);
  };

  if (hasError) {
    return fallback || (
      <div className="p-4 bg-red-900 rounded-lg">
        <h2 className="text-red-200 font-bold mb-2">Something went wrong</h2>
        {error && (
          <p className="text-red-200 mb-4">
            {error.message || "An unexpected error occurred"}
          </p>
        )}
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          onClick={handleReset}
        >
          Try again
        </button>
      </div>
    );
  }

  return children;
}