import React from "react";
import { Header } from "../atoms";
import { DarkLightButton, TopbarMenu } from "../molecules";

const Topbar = () => {
  return (
    <div className="text-white py-3 border-b fixed w-full dark:bg-[#09090b] bg-white z-40">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Header variant="h3">CompanyX</Header>
        <div className="flex items-center gap-6 divide-solid">
          <TopbarMenu />
          <DarkLightButton />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
