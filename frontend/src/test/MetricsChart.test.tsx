import { render, screen } from "@testing-library/react";
import MetricsChart from "../components/MetricsChart";

const mockData = [
  {
    timestamp: "2024-01-01T12:00:00Z",
    value: 75
  },
  {
    timestamp: "2024-01-01T13:00:00Z",
    value: 82
  },
  {
    timestamp: "2024-01-01T14:00:00Z",
    value: 68
  }
];

describe("MetricsChart", () => {
  it("renders without crashing", () => {
    render(<MetricsChart data={mockData} />);
    expect(screen.getByRole("img", { name: /area chart/i })).toBeInTheDocument();
  });

  it("renders correct number of data points", () => {
    render(<MetricsChart data={mockData} />);
    const dataPoints = screen.getAllByRole("img", { name: /area chart/i });
    expect(dataPoints).toHaveLength(mockData.length);
  });

  it("renders skeleton when no data is provided", () => {
    render(<MetricsChart data={[]} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });
});