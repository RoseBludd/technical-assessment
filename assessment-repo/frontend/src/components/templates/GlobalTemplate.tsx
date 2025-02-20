import { ReactNode } from "react";
import { Topbar } from "../organisms";
import ThemeProvider from "./ThemeProvider";

interface BasicTemplateProps {
  children: ReactNode;
}

const GlobalTemplate = ({ children }: BasicTemplateProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div>
        <Topbar />
        <div className="container mx-auto px-4 py-10">{children}</div>
      </div>
    </ThemeProvider>
  );
};

export default GlobalTemplate;
