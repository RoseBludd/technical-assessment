import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataGrid from '@/components/DataGrid';
import { StatusData } from '@/types/metrics';

// Mock lucide-react components
jest.mock('lucide-react', () => ({
  ChevronUp: () => <div data-testid="chevron-up" />,
  ChevronDown: () => <div data-testid="chevron-down" />,
  Check: () => <div data-testid="check" />,
}));

const mockStatusData: StatusData[] = [
  {
    id: '1',
    status: 'healthy',
    message: 'All systems operational',
    timestamp: new Date('2024-03-20T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    status: 'warning',
    message: 'High CPU utilization detected',
    timestamp: new Date('2024-03-20T09:45:00Z').toISOString(),
  },
  {
    id: '3',
    status: 'error',
    message: 'Database connection failed',
    timestamp: new Date('2024-03-20T09:30:00Z').toISOString(),
  },
];

describe('DataGrid Component', () => {
  describe('Rendering', () => {
    it('renders the data grid with all columns and header', () => {
      render(<DataGrid data={mockStatusData} />);
      expect(screen.getByText('Status Updates')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByText('Timestamp')).toBeInTheDocument();
    });

    it('renders data within scrollable container', () => {
      render(<DataGrid data={mockStatusData} />);
      const scrollContainer = screen.getByRole('table').parentElement;
      expect(scrollContainer).toHaveClass('h-[400px] overflow-auto');
    });
  });

  describe('Filtering', () => {
    it('filters by status selection', async () => {
      render(<DataGrid data={mockStatusData} />);
      const statusFilter = screen.getByRole('combobox');
      fireEvent.click(statusFilter);
      fireEvent.click(screen.getByText('Warning'));

      expect(
        screen.getByText('High CPU utilization detected')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('All systems operational')
      ).not.toBeInTheDocument();
    });

    it('filters by search text', async () => {
      render(<DataGrid data={mockStatusData} />);
      const searchInput = screen.getByPlaceholderText(/search status/i);
      await userEvent.type(searchInput, 'CPU');

      expect(screen.getByText(/CPU utilization/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/All systems operational/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible search input', () => {
      render(<DataGrid data={mockStatusData} />);
      const searchInput = screen.getByPlaceholderText(/search status/i);
      expect(searchInput).toHaveAttribute(
        'aria-label',
        'Search status updates'
      );
    });

    it('has accessible table structure', () => {
      render(<DataGrid data={mockStatusData} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader').length).toBe(3);
    });
  });
});
