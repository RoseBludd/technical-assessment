import { ReactNode } from "react";
import { Topbar } from "../organisms";

interface BasicTemplateProps {
  children: ReactNode;
}

const BasicTemplate = ({ children }: BasicTemplateProps) => {
  return (
    <div>
      <Topbar />
      <div className="container mx-auto px-4 py-10">{children}</div>
    </div>
  );
};

export default BasicTemplate;
