import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './breadcrumbs';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Breadcrumbs', () => {
  it('does not render by default', () => {
    render(<Breadcrumbs />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
  it('renders the / route', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Breadcrumbs />);
    expect(screen.queryByText('Dashboard')).toBeInTheDocument();
  });
  it('renders the /about route', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');
    render(<Breadcrumbs />);
    expect(screen.queryByText('about')).toBeInTheDocument();
  });
});
