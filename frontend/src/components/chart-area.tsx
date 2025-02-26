import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { TimeRange, TimeSeriesData } from '@/app/api/metrics/route';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type Data = TimeSeriesData[];
type Unit = TimeRange;

interface Props {
  data: Data;
  unit: Unit;
}

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#a6a09b',
  },
} satisfies ChartConfig;

const getDateUnit = (unit: Unit): string => {
  switch (unit) {
    case 'hour':
      return 'mm:ss';
    case 'day':
      return 'hh:mm';
    default:
      return 'EEE';
  }
};

const formatData = (data: Data, unit: Unit): Data => {
  const dateUnit = getDateUnit(unit);
  return data.map((item) => ({
    ...item,
    timestamp: format(new Date(item.timestamp), dateUnit),
  }));
};

export const ChartArea = ({ data, unit }: Props) => {
  const chartData = formatData(data, unit);
  return (
    <ResponsiveContainer height={400} width="100%">
      <ChartContainer config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            dataKey="value"
            domain={[0, 160]}
            tickLine={false}
            tick={false}
            padding={{ top: 10 }}
            width={0}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="x" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            type="natural"
            fill="url(#x)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};
