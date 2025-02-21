import { render, screen } from "@testing-library/react";
import StatusCards from "@/components/StatusCards";
import { fetchStatus } from "@/api/mock-data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// Mock React Query
const queryClient = new QueryClient();

jest.mock("@/api/mock-data", () => ({
    fetchStatus: jest.fn(),
}));

const mockStatusData = [
    { id: "1", status: "healthy", message: "All systems operational", timestamp: "2025-02-21T10:00:00Z" },
    { id: "2", status: "warning", message: "High CPU usage", timestamp: "2025-02-21T09:50:00Z" },
];

test("renders StatusCards with mock data", async () => {
    (fetchStatus as jest.Mock).mockResolvedValue(mockStatusData);

    render(
        <QueryClientProvider client={queryClient}>
            <StatusCards />
        </QueryClientProvider>
    );

    expect(await screen.findByText("All systems operational")).toBeInTheDocument();
    expect(await screen.findByText("High CPU usage")).toBeInTheDocument();
});
