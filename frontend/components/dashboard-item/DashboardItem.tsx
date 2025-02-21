"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";

export interface DashboardItemProps {
  title: string;
  children: React.ReactNode;
}

export default async function DashboardItem({
  children,
  title,
}: DashboardItemProps) {
  return (
    <Card className="rounded-none shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {formatTimestamp(new Date(Date.now()).toISOString(), {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">{children}</CardContent>
    </Card>
  );
}
