import { render, screen } from '@testing-library/react';
import MetricsChart from '@/components/MetricsChart';
import { TimeSeriesData } from '@/types/metrics';

// Mock all required components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock Chart components
jest.mock('@/components/ui/chart', () => ({
  ChartConfig: () => <div data-testid="chart-config" />,
  ChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ChartTooltip: () => <div data-testid="chart-tooltip" />,
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content" />,
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Area: () => <div data-testid="metrics-line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up" />,
  TrendingDown: () => <div data-testid="trending-down" />,
}));

const mockData: TimeSeriesData[] = [
  { timestamp: '2024-03-20T10:00:00Z', value: 45 },
  { timestamp: '2024-03-20T11:00:00Z', value: 55 },
];

describe('MetricsChart Component', () => {
  it('renders chart components', () => {
    render(<MetricsChart data={mockData} />);
    expect(screen.getByTestId('metrics-line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<MetricsChart data={[]} />);
    expect(screen.getByTestId('metrics-line')).toBeInTheDocument();
  });
});
