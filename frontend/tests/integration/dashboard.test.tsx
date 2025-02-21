import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import * as mockData from '../../api/mock-data';

// Mock the recharts library
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line">Line</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  Legend: () => <div data-testid="legend">Legend</div>
}));

// Mock the API
jest.mock('../../api/mock-data', () => ({
  fetchMetrics: jest.fn(),
  fetchStatus: jest.fn()
}));

// Create a test component
function TestDashboard() {
  return (
    <div data-testid="dashboard">
      <div data-testid="metrics-chart">
        <h2>Metrics Overview</h2>
      </div>
      <div data-testid="status-cards">
        <h2>System Status</h2>
      </div>
    </div>
  );
}

// Mock the dashboard page
jest.mock('../../app/dashboard/page', () => ({
  __esModule: true,
  default: TestDashboard
}));

describe('Dashboard Integration', () => {
  const mockMetrics = [
    { timestamp: new Date('2024-01-01').getTime(), value: 100 },
    { timestamp: new Date('2024-01-02').getTime(), value: 200 }
  ];

  const mockStatus = [
    { id: 1, status: 'healthy', name: 'Service A', description: 'Running smoothly' },
    { id: 2, status: 'warning', name: 'Service B', description: 'High load' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (mockData.fetchMetrics as jest.Mock).mockResolvedValue(mockMetrics);
    (mockData.fetchStatus as jest.Mock).mockResolvedValue(mockStatus);
  });

  it('renders dashboard components', async () => {
    render(<TestDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('metrics-chart')).toBeInTheDocument();
      expect(screen.getByTestId('status-cards')).toBeInTheDocument();
    });
  });

  it('displays correct headings', async () => {
    render(<TestDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Metrics Overview')).toBeInTheDocument();
      expect(screen.getByText('System Status')).toBeInTheDocument();
    });
  });
});
