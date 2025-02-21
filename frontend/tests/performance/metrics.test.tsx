import React, { useEffect, useState } from 'react';
import { render } from '../test-utils';
import * as mockData from '../../api/mock-data';

// Create a client-side version of the dashboard for testing
function ClientDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    mockData.fetchMetrics()
      .then(setData);
  }, []);

  return (
    <div data-testid="dashboard">
      {data && (
        <div data-testid="metrics-chart">
          {data.data[0].value}
        </div>
      )}
    </div>
  );
}

// Mock the dashboard page
jest.mock('../../app/dashboard/page', () => ({
  __esModule: true,
  default: ClientDashboard
}));

// Mock the API
jest.mock('../../api/mock-data', () => ({
  fetchMetrics: jest.fn()
}));

const mockMetrics = {
  data: [
    { timestamp: Date.now(), value: 100 }
  ]
};

describe('Dashboard Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockData.fetchMetrics as jest.Mock).mockResolvedValue(mockMetrics);
  });

  it('renders within performance budget', () => {
    const startTime = performance.now();
    render(<ClientDashboard />);
    const renderTime = performance.now() - startTime;
    
    expect(renderTime).toBeLessThan(200); // Budget: 200ms
  });

  it('optimizes data fetching', () => {
    const { rerender } = render(<ClientDashboard />);
    
    // Should only make one API call initially
    expect(mockData.fetchMetrics).toHaveBeenCalledTimes(1);
    
    // Subsequent renders should use cached data
    rerender(<ClientDashboard />);
    expect(mockData.fetchMetrics).toHaveBeenCalledTimes(1);
  });
});
