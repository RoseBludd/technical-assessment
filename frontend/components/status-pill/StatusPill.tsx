"use client";

import { StatusUpdate } from "@/api/mock-data";

export type StatusCardProp = StatusUpdate["status"];

export default function StatusPill({ status }: { status: StatusCardProp }) {
  const colors = {
    warning:
      "bg-yellow-500/20 border-yellow-500/70 text-yellow-700 dark:text-yellow-500 dark:bg-yellow-400/10",
    healthy:
      "bg-emerald-500/20 border-emerald-500/70 text-emerald-700 dark:text-emerald-500 dark:bg-emerald-400/10",
    error:
      "bg-red-500/20 border-red-500/70 text-red-500 dark:text-red-400 dark:bg-red-400/10",
  };

  return (
    <span
      className={`px-3 py-1 border rounded-full text-xs capitalize ${colors[status]}`}
    >
      {status}
    </span>
  );
}
