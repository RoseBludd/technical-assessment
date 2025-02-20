import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TimeSeriesData } from "@/api/mock-data";
import MetricsTable from "@/app/(pages)/(metrics)/components/MetricsTable";

jest.mock("@/components/atoms", () => ({
  Text: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span data-testid="mock-text" className={className}>
      {children}
    </span>
  ),
  Loader: ({ text }: { text: string }) => (
    <div data-testid="mock-loader">{text}</div>
  ),
}));

jest.mock("@/components/molecules", () => ({
  Error: ({ message }: { message: string }) => (
    <div data-testid="mock-error">{message}</div>
  ),
}));

jest.mock("@/lib", () => ({
  formatTimestamp: (timestamp: string) => `Formatted: ${timestamp}`,
}));

const mockMetricsData: TimeSeriesData[] = [
  { timestamp: "2024-07-10T12:00:00Z", value: 100 },
  { timestamp: "2024-07-11T13:30:00Z", value: 200 },
];

describe("MetricsTable", () => {
  it("renders loader when loading", () => {
    render(<MetricsTable metricsData={[]} loading={true} error={null} />);
    expect(screen.getByTestId("mock-loader")).toHaveTextContent("Metrics");
  });

  it("renders error message when error exists", () => {
    render(
      <MetricsTable metricsData={[]} loading={false} error="Failed to load" />
    );
    expect(screen.getByTestId("mock-error")).toHaveTextContent(
      "Failed to load"
    );
  });

  it("renders metric data correctly", () => {
    render(
      <MetricsTable
        metricsData={mockMetricsData}
        loading={false}
        error={null}
      />
    );

    // Check if headers exist
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("TimeStamp")).toBeInTheDocument();

    // Check if data values are rendered
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();

    // Check if timestamps are formatted and rendered
    expect(
      screen.getByText("Formatted: 2024-07-10T12:00:00Z")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Formatted: 2024-07-11T13:30:00Z")
    ).toBeInTheDocument();
  });
});
