import React from "react";
import { Header } from "../atoms";
import { DarkLightButton } from "../molecules";

const Topbar = () => {
  return (
    <div className="bg-black text-white py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Header variant="h3">Title</Header>
        <div>
          <DarkLightButton />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
