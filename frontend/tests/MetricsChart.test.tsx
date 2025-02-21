import { render, screen, waitFor } from '@testing-library/react';
import MetricsChart from '@/components/MetricsChart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "@testing-library/jest-dom";
import { fetchMetrics } from "@/api/mock-data";

jest.mock('@/api/mock-data', () => ({
    fetchMetrics: jest.fn(),
}));

const queryClient = new QueryClient();
const mockMetricsData = [
    { timestamp: "2025-02-21T10:00:00Z", value: 69 },
    { timestamp: "2025-02-21T11:00:00Z", value: 80 },
];

test("renders MetricsChart with mock data", async () => {
    (fetchMetrics as jest.Mock).mockResolvedValue(mockMetricsData);

    render(
        <QueryClientProvider client={queryClient}>
            <MetricsChart />
        </QueryClientProvider>
    );

});