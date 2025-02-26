import { render } from '@testing-library/react';
import { ChartArea } from '@/components/chart-area';

jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '100%', height: '400px' }}>{children}</div>
    ),
  };
});

describe('ChartArea', () => {
  it('renders by default', async () => {
    const data = [
      {
        timestamp: new Date(Date.now()).toISOString(),
        value: Math.floor(Math.random() * 100) + 50,
      },
    ];
    const { container } = render(<ChartArea data={data} unit="day" />);
    expect(container.querySelectorAll('[data-chart]')).toHaveLength(1);
  });
});
