import React from "react";
import { Text } from "./typography";

interface LoaderProps {
  text: string;
}

const Loader = ({ text }: LoaderProps) => {
  return (
    <div className="w-full p-10 flex items-center justify-center">
      <Text>Loading {text}...</Text>
    </div>
  );
};

export default Loader;
