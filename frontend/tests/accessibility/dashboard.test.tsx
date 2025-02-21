import React from 'react';
import { render } from '../test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import MetricsChart from '../../components/MetricsChart';
import { TimeSeriesData } from '../../api/mock-data';

// Mock the recharts library
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Area: () => <div>Area</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>
}));

expect.extend(toHaveNoViolations);

describe('Dashboard Accessibility', () => {
  const mockData = {
    data: [
      { timestamp: new Date('2024-01-01').toISOString(), value: 100 },
      { timestamp: new Date('2024-01-02').toISOString(), value: 200 },
    ] as TimeSeriesData[]
  };

  it('should have no accessibility violations', async () => {
    const { container } = render(<MetricsChart data={mockData.data} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
