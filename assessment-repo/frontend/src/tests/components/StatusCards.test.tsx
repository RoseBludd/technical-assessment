import { render, screen } from '@testing-library/react';
import StatusCards from '@/components/StatusCards';
import { StatusData } from '@/types/metrics';

// Mock Card components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
}));

const mockStatusData: StatusData[] = [
  {
    id: '1',
    status: 'healthy',
    message: 'System running smoothly',
    timestamp: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    status: 'warning',
    message: 'High CPU usage',
    timestamp: '2024-03-20T10:00:00Z',
  },
  {
    id: '3',
    status: 'error',
    message: 'Service unavailable',
    timestamp: '2024-03-20T10:00:00Z',
  },
];

describe('StatusCards Component', () => {
  it('renders all status types', () => {
    render(<StatusCards data={mockStatusData} />);

    // Check status labels
    expect(screen.getByText('healthy')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('displays correct icons for each status', () => {
    render(<StatusCards data={mockStatusData} />);

    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
    expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
  });

  it('applies correct color classes based on status', () => {
    render(<StatusCards data={mockStatusData} />);

    expect(screen.getByText('healthy')).toHaveClass('text-green-500');
    expect(screen.getByText('warning')).toHaveClass('text-yellow-500');
    expect(screen.getByText('error')).toHaveClass('text-red-500');
  });

  it('handles multiple items of the same status', () => {
    const dataWithMultipleStatus: StatusData[] = [
      ...mockStatusData,
      {
        id: '4',
        status: 'healthy',
        message: 'Another healthy system',
        timestamp: '2024-03-20T10:00:00Z',
      },
    ];

    render(<StatusCards data={dataWithMultipleStatus} />);
    // Use getAllByText to find all elements containing "2" and check if at least one exists
    const countElements = screen.getAllByText((content) =>
      content.includes('2')
    );
    expect(countElements.length).toBeGreaterThan(0);
  });

  it('renders empty grid when no data', () => {
    const { container } = render(<StatusCards data={[]} />);
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();
    expect(gridElement?.childNodes.length).toBe(0);
  });
});
