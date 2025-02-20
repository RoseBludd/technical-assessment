import { render, screen } from '@testing-library/react';
import StatusList from '../components/StatusList';
import { createMockStatusUpdates } from '../utils/testUtils';

describe('StatusList Component', () => {
  const mockUpdates = createMockStatusUpdates(3);

  it('renders status updates', () => {
    render(<StatusList updates={mockUpdates} />);
    
    mockUpdates.forEach(update => {
      expect(screen.getByText(update.message)).toBeInTheDocument();
      expect(screen.getByText(update.status.charAt(0).toUpperCase() + update.status.slice(1))).toBeInTheDocument();
    });
  });

  it('applies correct status colors', () => {
    const { container } = render(<StatusList updates={mockUpdates} />);
    
    const statusItems = container.querySelectorAll('[class*="rounded-lg"]');
    expect(statusItems[0]).toHaveClass('bg-green-900');
    expect(statusItems[1]).toHaveClass('bg-yellow-900');
    expect(statusItems[2]).toHaveClass('bg-red-900');
  });

  it('renders empty state', () => {
    const { container } = render(<StatusList updates={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});