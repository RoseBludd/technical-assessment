import React from "react";
import Text, { TextProps } from "./Text";
import clsx from "clsx";

interface HeaderProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "h4";
}

const Header = ({ variant = "h1", children, className }: HeaderProps) => {
  return (
    <Text
      className={clsx(
        "scroll-m-20 tracking-tight",
        {
          "text-4xl font-extrabold lg:text-5xl": variant === "h1",
          "text-3xl font-semibold": variant === "h2",
          "text-2xl font-semibold ": variant === "h3",
          "text-xl font-semibold": variant === "h4",
        },
        className
      )}
    >
      {children}
    </Text>
  );
};

export default Header;
