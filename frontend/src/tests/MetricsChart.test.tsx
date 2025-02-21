import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MetricsChart from "../components/MetricsChart";

// Mock the fetchMetrics function
jest.mock("../actions/mock-data", () => ({
  fetchMetrics: jest.fn(() =>
    Promise.resolve([
      { timestamp: "2023-01-01T00:00:00Z", value: 50 },
      { timestamp: "2023-01-01T01:00:00Z", value: 60 },
    ])
  ),
}));

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("MetricsChart", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  const mockData = [
    { timestamp: "2023-01-01T00:00:00Z", value: 50 },
    { timestamp: "2023-01-01T01:00:00Z", value: 60 },
  ];

  it("renders the chart and time range buttons", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MetricsChart metricsData={mockData} />
      </QueryClientProvider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Daily Trend")).toBeInTheDocument();
    });

    // Check for buttons
    expect(screen.getByRole("button", { name: "Hour" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Day" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Week" })).toBeInTheDocument();
  });

  it("changes time range when buttons are clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MetricsChart metricsData={mockData} />
      </QueryClientProvider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Daily Trend")).toBeInTheDocument();
    });

    // Click Hour button
    fireEvent.click(screen.getByRole("button", { name: "Hour" }));
    await waitFor(() => {
      expect(screen.getByText("Hourly Trend")).toBeInTheDocument();
    });

    // Click Week button
    fireEvent.click(screen.getByRole("button", { name: "Week" }));
    await waitFor(() => {
      expect(screen.getByText("Weekly Trend")).toBeInTheDocument();
    });
  });

  it("handles loading state", async () => {
    // Mock slow API response
    const mockFetchMetrics = jest.requireMock(
      "../actions/mock-data"
    ).fetchMetrics;
    mockFetchMetrics.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MetricsChart metricsData={[]} />
      </QueryClientProvider>
    );

    // Check for loading skeleton
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });
});
