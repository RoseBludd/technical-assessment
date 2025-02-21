"use client";

import { StatusUpdate } from "@/api/mock-data";
import { formatTimeAgo } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  ArrowUpDown,
  Edit2Icon,
  MoreHorizontal,
  TrashIcon,
  ViewIcon,
} from "lucide-react";
import StatusPill from "../status-pill/StatusPill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const MetricsColumns: ColumnDef<StatusUpdate>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent hover:text-white"
          >
            Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <p className="text-center font-medium py-5">{row.getValue("id")}</p>
    ),
  },
  {
    accessorKey: "message",
    header: () => <div className="text-center">Message</div>,
    cell: ({ row }) => (
      <p className="text-center font-medium">{row.getValue("message")}</p>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <StatusPill status={row.getValue("status")} />
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent hover:text-white"
          >
            Timestamps
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <p className="text-center">{formatTimeAgo(row.getValue("timestamp"))}</p>
    ),
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-start gap-2">
              <ViewIcon />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center justify-start gap-2">
              <Edit2Icon />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center justify-start gap-2">
              <TrashIcon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
