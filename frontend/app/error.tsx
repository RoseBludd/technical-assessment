"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex items-center flex-col gap-5 justify-center">
        <h2 className="text-lg font-semibold text-center">
          Opps...Something went wrong!
        </h2>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
