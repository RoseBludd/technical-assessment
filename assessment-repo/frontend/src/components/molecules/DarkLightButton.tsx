"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../atoms";
import { Moon, Sun } from "lucide-react";

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
      {theme === "light" ? <Moon className="text-black" /> : <Sun />}
    </Button>
  );
};

export default DarkLightButton;
