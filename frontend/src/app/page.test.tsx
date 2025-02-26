import { act, render, screen } from '@testing-library/react';
import Home from './page';

jest.mock('../components/chart-area-container');
jest.mock('../components/status', () => jest.fn(() => <div></div>));
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: (props) => <div {...props} />,
}));

describe('Layout', () => {
  it('renders by default', () => {
    render(<Home />);
    act(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });
  });
});
