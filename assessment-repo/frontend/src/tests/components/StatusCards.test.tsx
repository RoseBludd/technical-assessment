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
  it('renders status types correctly', () => {
    render(<StatusCards data={mockStatusData} />);

    expect(screen.getByText('healthy')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('displays correct status messages', () => {
    render(<StatusCards data={mockStatusData} />);

    expect(screen.getByText('Systems Operational')).toBeInTheDocument();
    expect(screen.getByText('Systems Need Attention')).toBeInTheDocument();
    expect(screen.getByText('Systems Critical')).toBeInTheDocument();
  });

  it('applies correct color classes', () => {
    render(<StatusCards data={mockStatusData} />);

    expect(screen.getByText('healthy')).toHaveClass('text-green-500');
    expect(screen.getByText('warning')).toHaveClass('text-yellow-500');
    expect(screen.getByText('error')).toHaveClass('text-red-500');
  });

  it('renders in responsive grid layout', () => {
    const { container } = render(<StatusCards data={mockStatusData} />);
    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    );
  });
});
