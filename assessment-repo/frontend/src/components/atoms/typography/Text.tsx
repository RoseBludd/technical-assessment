import clsx from "clsx";
import { ReactNode } from "react";

export interface TextProps {
  children: ReactNode;
  className?: string;
}

export const Text = ({ children, className }: TextProps) => {
  return (
    <span className={clsx(className, "dark:text-gray-50 text-black")}>
      {children}
    </span>
  );
};
