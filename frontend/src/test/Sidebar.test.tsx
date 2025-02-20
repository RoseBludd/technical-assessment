import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../components/Sidebar';

describe('Sidebar Component', () => {
  // Mock ref
  const mockRef = { current: document.createElement('div') };
  
  // Base props
  const defaultProps = {
    isOpen: true,
    sidebarRef: mockRef,
  };

  it('renders correctly when open', () => {
    render(<Sidebar {...defaultProps} />);
    
    // Check if navigation title exists
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    
    // Check if all navigation links are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('applies correct classes when open', () => {
    const { container } = render(<Sidebar {...defaultProps} />);
    
    const sidebar = container.firstChild as HTMLElement;
    expect(sidebar).toHaveClass('translate-x-0');
    expect(sidebar).not.toHaveClass('-translate-x-full');
  });

  it('applies correct classes when closed', () => {
    const { container } = render(
      <Sidebar {...defaultProps} isOpen={false} />
    );
    
    const sidebar = container.firstChild as HTMLElement;
    expect(sidebar).toHaveClass('-translate-x-full');
    expect(sidebar).not.toHaveClass('translate-x-0');
  });

  it('has correct accessibility attributes', () => {
    render(<Sidebar {...defaultProps} />);
    
    // Check if navigation is accessible
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Check if links are accessible
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });
});