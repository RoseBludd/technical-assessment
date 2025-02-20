import React from "react";
import { TextProps, Text } from "./Text";
import clsx from "clsx";

interface HeaderProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "h4";
}

const Header = ({ variant = "h1", children, className }: HeaderProps) => {
  return (
    <Text
      className={clsx(
        "scroll-m-20 font-extrabold tracking-tight",
        {
          "text-4xl lg:text-5xl": variant === "h1",
          "text-3xl": variant === "h2",
          "text-2xl ": variant === "h3",
          "text-xl": variant === "h4",
        },
        className
      )}
    >
      {children}
    </Text>
  );
};

export default Header;
