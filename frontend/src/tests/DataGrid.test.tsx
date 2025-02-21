import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DataGrid from "@/components/DataGrid";

const mockData = [
  { timestamp: "2024-02-21T10:00:00Z", value: 75 },
  { timestamp: "2024-02-21T11:00:00Z", value: 80 },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("DataGrid", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("renders the data grid with initial data", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DataGrid metricsData={mockData} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Metrics Table")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3); // Header + 2 data rows
  });

  it("allows changing time range", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DataGrid metricsData={mockData} />
      </QueryClientProvider>
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const hourOption = screen.getByText("Hour");
    fireEvent.click(hourOption);

    await waitFor(() => {
      expect(select).toHaveTextContent("Hour");
    });
  });

  it("handles pagination", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DataGrid metricsData={mockData} />
      </QueryClientProvider>
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    const previousButton = screen.getByRole("button", { name: /previous/i });

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled(); // Since we only have 2 items and page size is 5
  });
});
