import { render, screen } from '@testing-library/react';
import MetricsChart from '../components/MetricsChart';
import { createMockTimeSeriesData } from '../utils/testUtils';
import type { TimeSeriesData } from '../types';

// Mock Recharts components with proper SVG elements
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  Area: () => <path data-testid="area" />,
  XAxis: () => <g data-testid="x-axis" />,
  YAxis: () => <g data-testid="y-axis" />,
  Tooltip: () => <g data-testid="tooltip" />,
  CartesianGrid: () => <g data-testid="grid" />,
}));

describe('MetricsChart Component', () => {
  const mockData: TimeSeriesData[] = createMockTimeSeriesData(24);

  it('renders chart components', () => {
    render(<MetricsChart data={mockData} />);
    
    expect(screen.getByTestId('area')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('applies responsive container classes', () => {
    const { container } = render(<MetricsChart data={mockData} />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('h-[300px]');
  });

  it('handles empty data gracefully', () => {
    render(<MetricsChart data={[]} />);
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });
});