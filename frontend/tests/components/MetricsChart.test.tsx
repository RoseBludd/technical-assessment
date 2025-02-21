/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import MetricsChartClient from '../../components/MetricsChartClient';
import * as mockData from '../../api/mock-data';

// Mock the recharts library
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Area: () => <div data-testid="area">Area</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>
}));

// Mock the API
jest.mock('../../api/mock-data', () => ({
  fetchMetrics: jest.fn()
}));

describe('MetricsChart', () => {
  const testData = [
    { timestamp: new Date('2024-01-01').getTime(), value: 100 },
    { timestamp: new Date('2024-01-02').getTime(), value: 200 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (mockData.fetchMetrics as jest.Mock).mockResolvedValue(testData);
  });

  it('renders with data', async () => {
    render(<MetricsChartClient />);
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    render(<MetricsChartClient />);
    expect(screen.getByText('Loading metrics...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (mockData.fetchMetrics as jest.Mock).mockRejectedValue(new Error('Failed to load metrics data'));
    render(<MetricsChartClient />);
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to load metrics data');
    });
  });
});
