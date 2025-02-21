import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataGrid from '@/components/DataGrid';
import { fetchStatus } from '@/lib/mock-data';
import { StatusData } from '@/types/metrics';

// Mock lucide-react components
jest.mock('lucide-react', () => ({
  ChevronUp: () => <div data-testid="chevron-up" />,
  ChevronDown: () => <div data-testid="chevron-down" />,
  Check: () => <div data-testid="check" />,
}));

// Mock data with typed interface
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

// Mock the fetchStatus function
jest.mock('@/lib/mock-data', () => ({
  fetchStatus: jest.fn(() => Promise.resolve(mockStatusData)),
}));

describe('DataGrid Component', () => {
  let mockData: StatusData[];

  beforeEach(async () => {
    mockData = await fetchStatus();
  });

  describe('Rendering', () => {
    it('renders the data grid with all columns and header', () => {
      render(<DataGrid data={mockData} />);

      expect(screen.getByText('Status Updates')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByText('Timestamp')).toBeInTheDocument();
    });

    it('renders all data rows correctly', () => {
      render(<DataGrid data={mockData} />);

      mockData.forEach((item) => {
        expect(screen.getByText(item.message)).toBeInTheDocument();
        expect(screen.getByText(item.status)).toBeInTheDocument();
      });
    });

    it('renders empty state when no data is provided', () => {
      render(<DataGrid data={[]} />);
      expect(screen.getByText('Status Updates')).toBeInTheDocument();
      const tbody = screen.getByTestId('data-grid-body');
      expect(tbody.children.length).toBe(0);
    });
  });

  describe('Search Functionality', () => {
    it('filters data based on message search', async () => {
      render(<DataGrid data={mockData} />);

      const searchInput = screen.getByPlaceholderText(/search status/i);
      await userEvent.type(searchInput, 'CPU');

      expect(screen.getByText(/CPU utilization/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/All systems operational/i)
      ).not.toBeInTheDocument();
    });

    it('filters data based on status search', async () => {
      render(<DataGrid data={mockData} />);

      const searchInput = screen.getByPlaceholderText(/search status/i);
      await userEvent.type(searchInput, 'healthy');

      expect(screen.getByText('All systems operational')).toBeInTheDocument();
      expect(
        screen.queryByText('High CPU utilization detected')
      ).not.toBeInTheDocument();
    });

    it('shows no results when search has no matches', async () => {
      render(<DataGrid data={mockData} />);

      const searchInput = screen.getByPlaceholderText(/search status/i);
      await userEvent.type(searchInput, 'nonexistent');

      const tbody = screen.getByTestId('data-grid-body');
      expect(tbody.children.length).toBe(0);
    });
  });

  describe('Status Filter', () => {
    it('filters by status selection', async () => {
      render(<DataGrid data={mockData} />);

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

    it('shows all statuses when "All Status" is selected', async () => {
      render(<DataGrid data={mockData} />);

      const statusFilter = screen.getByRole('combobox');
      fireEvent.click(statusFilter);
      fireEvent.click(screen.getByText('Warning'));
      fireEvent.click(statusFilter);
      fireEvent.click(screen.getByText('All Status'));

      mockData.forEach((item) => {
        expect(screen.getByText(item.message)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible table structure', () => {
      render(<DataGrid data={mockData} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row').length).toBe(mockData.length + 1); // +1 for header row
      expect(screen.getAllByRole('columnheader').length).toBe(3);
    });

    it('has accessible search input', () => {
      render(<DataGrid data={mockData} />);

      const searchInput = screen.getByPlaceholderText(/search status/i);
      expect(searchInput).toHaveAttribute(
        'aria-label',
        'Search status updates'
      );
    });
  });
});
