"use client";

import React from "react";
import { Text } from "./typography";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface ErrorProps {
  message?: string;
  reset?: () => void;
}

const Error = ({ message, reset }: ErrorProps) => {
  const { refresh } = useRouter();
  return (
    <div className="w-full p-10 flex items-center justify-center flex-col gap-4">
      <div>
        <Text className="text-red-700">
          {message ? message : "Something went wrong. Please try again later."}
        </Text>
      </div>
      <Button onClick={reset ? reset : refresh}>Retry</Button>
    </div>
  );
};

export default Error;
