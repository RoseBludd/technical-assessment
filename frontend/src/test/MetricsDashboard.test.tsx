import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MetricsDashboard from "../components/MetricsDashboard";
import { fetchMetrics, fetchStatus } from "../../api/mock-data";

// Mock the API calls
jest.mock("../../../frontend/api/mock-data", () => ({
  fetchMetrics: jest.fn(),
  fetchStatus: jest.fn(),
}));

describe("MetricsDashboard", () => {
  beforeEach(() => {
    (fetchMetrics as jest.Mock).mockResolvedValue([]);
    (fetchStatus as jest.Mock).mockResolvedValue([]);
  });

  it("renders loading state initially", () => {
    render(<MetricsDashboard />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("handles time range changes", async () => {
    render(<MetricsDashboard />);
    
    await userEvent.click(screen.getByText("Hour"));
    
    expect(fetchMetrics).toHaveBeenCalledWith("hour");
  });

  it("displays error state", async () => {
    (fetchMetrics as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));
    
    render(<MetricsDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});