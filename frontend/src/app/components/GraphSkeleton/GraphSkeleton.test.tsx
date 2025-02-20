import { render, screen } from '@testing-library/react';
import GraphSkeleton from './GraphSkeleton';

describe('Graph Skeleton', () => {
  it('renders correctly', () => {
    render(<GraphSkeleton />);
    expect(screen.getByTestId('graph-skeleton')).toBeInTheDocument();
  });
});
