import clsx from "clsx";
import React, { ReactNode } from "react";

export interface TextProps {
  children: ReactNode;
  className?: string;
}

const Text = ({ children, className }: TextProps) => {
  return <span className={clsx(className, "text-primary")}>{children}</span>;
};

export default Text;
