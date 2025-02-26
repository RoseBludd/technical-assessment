import { act, render, screen } from '@testing-library/react';
import About from './page';

describe('About', () => {
  it('renders by default', () => {
    render(<About />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
