"use client";

import { Button } from "../components/ui/button";

// This is the Error handler
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-[80vh] flex justify-center items-center bg-slate-100">
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl">Something went wrong!</h2>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
