"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "../atoms";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const DarkLightButton = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" aria-label="Toggle theme" />;
  }

  const handleToggleMode = () => {
    setTheme((prevState) => (prevState === "light" ? "dark" : "light"));
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggleMode}>
      {theme === "light" ? <MoonIcon className="text-black" /> : <SunIcon />}
    </Button>
  );
};

export default DarkLightButton;
