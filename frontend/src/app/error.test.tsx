import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Error from './error';

const getProps = ({ message = '', reset }) => ({
  error: {
    message,
  },
  reset,
});

describe('Error', () => {
  it('renders by default', () => {
    const message = 'mock error';
    const props = getProps({ message, reset: jest.fn() });
    render(<Error {...props} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
  it('should call the reset fn when selected', async () => {
    const user = userEvent.setup();
    const reset = jest.fn();
    const props = getProps({ reset });
    render(<Error {...props} />);
    await user.click(screen.getByRole('button'));
    expect(reset).toHaveBeenCalled();
  });
});
