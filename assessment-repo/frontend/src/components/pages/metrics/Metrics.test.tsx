import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { fetchMetrics, TimeSeriesData } from "@/api/mock-data";
import Metrics from "@/app/(pages)/(metrics)/page";

jest.mock("@/components/templates/PageTemplate", () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="mock-page-template">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock("@/components/molecules", () => ({
  SelectField: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (val: string) => void;
  }) => (
    <select
      data-testid="mock-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="hour">Hour</option>
      <option value="day">Day</option>
      <option value="week">Week</option>
    </select>
  ),
}));

jest.mock("@/components/atoms", () => ({
  Button: ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button data-testid="mock-button" onClick={onClick}>
      {children}
    </button>
  ),
  Loader: ({ text }: { text: string }) => (
    <div data-testid="mock-loader">{text}</div>
  ),
}));

jest.mock("@/app/(pages)/(metrics)/components/MetricsTable", () => ({
  __esModule: true,
  default: ({
    metricsData,
    error,
    loading,
  }: {
    metricsData: TimeSeriesData[];
    error: string | null;
    loading: boolean;
  }) => (
    <div data-testid="mock-metrics-table">
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>{error}</span>
      ) : metricsData.length ? (
        <span>Data Loaded</span>
      ) : (
        <span>No Data</span>
      )}
    </div>
  ),
}));

jest.mock("@/api/mock-data", () => ({
  fetchMetrics: jest.fn(),
}));

describe("Metrics", () => {
  const mockData: TimeSeriesData[] = [
    { timestamp: "2024-07-10T12:00:00Z", value: 100 },
    { timestamp: "2024-07-11T13:30:00Z", value: 200 },
  ];

  it("renders loader initially", async () => {
    (fetchMetrics as jest.Mock).mockResolvedValue(mockData);

    render(<Metrics />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByTestId("mock-metrics-table")).toHaveTextContent(
        "Data Loaded"
      )
    );
  });

  it("renders error message when API fails", async () => {
    (fetchMetrics as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<Metrics />);
    await waitFor(() =>
      expect(screen.getByTestId("mock-metrics-table")).toHaveTextContent(
        "There was a problem getting metrics data. Please try again later"
      )
    );
  });

  it("updates time range when SelectField changes", async () => {
    (fetchMetrics as jest.Mock).mockResolvedValue(mockData);

    render(<Metrics />);

    fireEvent.change(screen.getByTestId("mock-select"), {
      target: { value: "week" },
    });

    await waitFor(() => expect(fetchMetrics).toHaveBeenCalledWith("week"));
  });

  it("resets filters when Reset Filters button is clicked", async () => {
    (fetchMetrics as jest.Mock).mockResolvedValue(mockData);

    render(<Metrics />);

    fireEvent.change(screen.getByTestId("mock-select"), {
      target: { value: "hour" },
    });

    fireEvent.click(screen.getByTestId("mock-button"));

    await waitFor(() => expect(fetchMetrics).toHaveBeenCalledWith("day"));
  });
});
