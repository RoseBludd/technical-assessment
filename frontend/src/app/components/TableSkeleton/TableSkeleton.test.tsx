import { render, screen } from '@testing-library/react';
import TableSkeleton from './TableSkeleton';

describe('Table Skeleton', () => {
  it('renders correctly', () => {
    render(<TableSkeleton />);
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });
});
