import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound', () => {
  it('renders by default', () => {
    render(<NotFound />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});
