"use client";

import React from "react";
import { Button } from "../atoms";
import { useRouter } from "next/navigation";

const TopbarMenu = () => {
  const { push } = useRouter();
  return (
    <div>
      <ul className="flex items-center gap-6">
        <li>
          <Button
            variant="link"
            className="font-bold hover:text-gray-500 p-0 text-base"
            onClick={() => push("/")}
          >
            Metrics
          </Button>
        </li>
        <li>
          <Button
            variant="link"
            className="font-bold hover:text-gray-500 p-0 text-base"
            onClick={() => push("/status")}
          >
            Status
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default TopbarMenu;
