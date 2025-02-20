import { ReactNode } from "react";
import { Header } from "../atoms";

interface PageTemplateProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
}

const PageTemplate = ({ title, children }: PageTemplateProps) => {
  return (
    <div>
      <Header variant="h3">{title}</Header>
      <div className="mt-10">{children}</div>
    </div>
  );
};

export default PageTemplate;
