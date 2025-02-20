import { render, screen } from '@testing-library/react';
import MetricsDashboard from '../components/MetricsDashboard';
import { useMetricsData } from '../hooks/useMetricData';
import { createMockTimeSeriesData, createMockStatusUpdates } from '../utils/testUtils';

// Mock the entire hooks module
jest.mock('../hooks/useMetricData');

// Mock Recharts to avoid ResizeObserver and hook issues
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => children,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  CartesianGrid: () => <div data-testid="grid" />,
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('MetricsDashboard', () => {
  const mockMetrics = createMockTimeSeriesData(24);
  const mockStatus = createMockStatusUpdates(3);

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set default mock implementation
    (useMetricsData as jest.Mock).mockReturnValue({
      metrics: mockMetrics,
      status: mockStatus,
      loading: false,
      error: null,
    });
  });

  it('renders dashboard components', () => {
    render(<MetricsDashboard />);
    
    expect(screen.getByText('Metrics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useMetricsData as jest.Mock).mockReturnValueOnce({
      metrics: [],
      status: [],
      loading: true,
      error: null,
    });

    render(<MetricsDashboard />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Test error';
    (useMetricsData as jest.Mock).mockReturnValueOnce({
      metrics: [],
      status: [],
      loading: false,
      error: errorMessage,
    });

    render(<MetricsDashboard />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders metrics chart when data is available', () => {
    render(<MetricsDashboard />);
    
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('renders status list when data is available', () => {
    render(<MetricsDashboard />);
    
    mockStatus.forEach(status => {
      expect(screen.getByText(status.message)).toBeInTheDocument();
    });
  });
});