import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StatusCards from "@/components/StatusCards";
import { StatusUpdate } from "@/types";

const mockStatusUpdates: StatusUpdate[] = [
  {
    id: "1",
    status: "healthy",
    message: "All systems operational",
    timestamp: "2024-02-21T10:00:00Z",
  },
  {
    id: "2",
    status: "warning",
    message: "High CPU utilization",
    timestamp: "2024-02-21T09:45:00Z",
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("StatusCards", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("renders status cards with initial data", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StatusCards statusUpdates={mockStatusUpdates} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Detailed Data")).toBeInTheDocument();
    expect(screen.getByText("All systems operational")).toBeInTheDocument();
    expect(screen.getByText("High CPU utilization")).toBeInTheDocument();
  });

  it("displays correct status icons", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StatusCards statusUpdates={mockStatusUpdates} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("formats timestamps correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StatusCards statusUpdates={mockStatusUpdates} />
      </QueryClientProvider>
    );

    const formattedDate = new Date("2024-02-21T10:00:00Z").toLocaleString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});
