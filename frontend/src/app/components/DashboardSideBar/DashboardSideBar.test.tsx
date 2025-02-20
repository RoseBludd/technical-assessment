import { render, screen } from '@testing-library/react';
import DashboardSideBar from './DashboardSideBar';

describe('Dashboard Side bar', () => {
  it('renders correctly', () => {
    render(<DashboardSideBar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
