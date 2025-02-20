import React from "react";
import { Text } from "./typography";

interface ErrorProps {
  message?: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <div className="w-full p-10 flex items-center justify-center">
      <Text className="text-red-700">
        {message ? message : "Something went wrong. Please try again later."}
      </Text>
    </div>
  );
};

export default Error;
