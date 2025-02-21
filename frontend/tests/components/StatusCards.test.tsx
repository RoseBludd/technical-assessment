import React from 'react';
import { render, screen } from '../test-utils';
import StatusCards from '../../components/StatusCards';
import { StatusUpdate } from '../../api/mock-data';

describe('StatusCards', () => {
  const mockData: StatusUpdate[] = [
    { id: "1", status: "healthy", message: "Service A", timestamp: new Date().toISOString() },
    { id: "2", status: "warning", message: "Service B", timestamp: new Date().toISOString() },
  ];

  it('renders status cards with data', () => {
    render(<StatusCards data={mockData} />);
    expect(screen.getByText('Service A')).toBeInTheDocument();
    expect(screen.getByText('Service B')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<StatusCards data={[]} />);
    expect(screen.getByText('No status data available')).toBeInTheDocument();
  });

  it('handles null data', () => {
    render(<StatusCards data={null as unknown as StatusUpdate[]} />);
    expect(screen.getByText('No status data available')).toBeInTheDocument();
  });
});
