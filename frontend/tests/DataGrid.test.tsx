import { render, screen, waitFor } from "@testing-library/react";
import DataGrid from "@/components/DataGrid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";

import { fetchMetrics } from "@/api/mock-data";

jest.mock("@/api/mock-data", () => ({
    fetchMetrics: jest.fn(),
}));


const queryClient = new QueryClient();

const mockDataGrid = [
    { timestamp: "2025-02-21T10:00:00Z", value: 75 },
    { timestamp: "2025-02-21T11:00:00Z", value: 80 },
];

test("renders DataGrid with mock data", async () => {
    (fetchMetrics as jest.Mock).mockResolvedValue(mockDataGrid);

    render(
        <QueryClientProvider client={queryClient}>
            <DataGrid />
        </QueryClientProvider>
    );

    await waitFor(() => {
        expect(screen.getByText("Timestamp")).toBeInTheDocument();
        expect(screen.getByText("Value")).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText("75")).toBeInTheDocument();
        expect(screen.getByText("80")).toBeInTheDocument();
    });


    screen.debug();
});
