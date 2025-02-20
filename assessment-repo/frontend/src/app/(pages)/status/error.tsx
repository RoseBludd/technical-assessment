"use client";

import { Error as ErrorComponent } from "@/components/molecules";

interface ErrorProps {
  reset: () => void;
}

const Error = ({ reset }: ErrorProps) => {
  return <ErrorComponent reset={reset} />;
};

export default Error;
