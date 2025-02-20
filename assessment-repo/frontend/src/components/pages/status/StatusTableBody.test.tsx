import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatusUpdate } from "@/api/mock-data";
import StatusTableBody from "@/app/(pages)/status/components/StatusTableBody";

// Mock dependencies
jest.mock("@/components/atoms", () => ({
  Text: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="mock-text">{children}</span>
  ),
  StatusChip: ({ status }: { status: string }) => (
    <span data-testid="mock-status-chip">{status}</span>
  ),
}));

const mockStatusData: StatusUpdate[] = [
  {
    id: "1",
    status: "healthy",
    message: "System is stable",
    timestamp: "2024-07-10",
  },
  {
    id: "2",
    status: "warning",
    message: "High CPU usage",
    timestamp: "2024-07-11",
  },
  {
    id: "3",
    status: "error",
    message: "System failure",
    timestamp: "2024-07-12",
  },
];

describe("StatusTableBody", () => {
  it("renders empty state when there is no data", () => {
    render(
      <table>
        <StatusTableBody filteredStatusData={[]} />
      </table>
    );
    expect(screen.getByText("Empty Data..")).toBeInTheDocument();
  });

  it("renders status data correctly", () => {
    render(
      <table>
        <StatusTableBody filteredStatusData={mockStatusData} />
      </table>
    );

    // Check if messages are rendered
    expect(screen.getByText("System is stable")).toBeInTheDocument();
    expect(screen.getByText("High CPU usage")).toBeInTheDocument();
    expect(screen.getByText("System failure")).toBeInTheDocument();

    // Check if status chips are rendered
    expect(screen.getAllByTestId("mock-status-chip")).toHaveLength(3);
    expect(screen.getByText("healthy")).toBeInTheDocument();
    expect(screen.getByText("warning")).toBeInTheDocument();
    expect(screen.getByText("error")).toBeInTheDocument();

    // Check if timestamps are rendered
    expect(screen.getByText("2024-07-10")).toBeInTheDocument();
    expect(screen.getByText("2024-07-11")).toBeInTheDocument();
    expect(screen.getByText("2024-07-12")).toBeInTheDocument();
  });
});
