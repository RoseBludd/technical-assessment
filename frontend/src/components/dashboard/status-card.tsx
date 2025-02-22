"use client";

import { StatusUpdate } from "@/api/mock-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatTimeStamp } from "@/src/lib/utils";
import { CheckCheck, CircleX, TriangleAlert } from "lucide-react";

type TStatusCard = Omit<StatusUpdate, "id">;

export default function StatusCard({
  status,
  message,
  timestamp,
}: TStatusCard) {
  return (
    <Card className="pb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm uppercase">{status}</CardTitle>
        <div>
          {status === "healthy" && <CheckCheck />}
          {status === "warning" && <TriangleAlert />}
          {status === "error" && <CircleX />}
        </div>
      </CardHeader>
      <CardContent className="pb-0 space-y-3">
        <div className="text-lg">{message}</div>
        <p className="text-xs text-muted-foreground">
          {formatTimeStamp(timestamp)}
        </p>
      </CardContent>
    </Card>
  );
}
