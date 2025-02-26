import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChartAreaContainer } from '@/components/chart-area-container';
import { ChartArea } from '@/components/chart-area';

jest.mock('./chart-area');

describe('ChartAreaContainer', () => {
  it('renders by default', async () => {
    const user = userEvent.setup();
    render(<ChartAreaContainer units={['day', 'week', 'hour']} />);
    await waitFor(() => {
      expect(screen.getByText('Area Chart - Time Series')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });
    expect(ChartArea).toHaveBeenNthCalledWith(1, { data: [], unit: 'day' }, {});
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('week'));
    expect(ChartArea).toHaveBeenNthCalledWith(
      2,
      { data: [], unit: 'week' },
      {}
    );
  });
});
