import clsx from "clsx";
import React, { ReactNode } from "react";

export interface TextProps {
  children: ReactNode;
  className?: string;
}

const Text = ({ children, className }: TextProps) => {
  return (
    <span className={clsx(className, "dark:text-gray-50 text-primary")}>
      {children}
    </span>
  );
};

export default Text;
