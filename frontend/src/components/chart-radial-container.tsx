import { ChartRadial } from '@/components/chart-radial';
import { Counter } from './counter';

interface Props {
  value: number;
  range: string;
}

export const ChartRadialContainer = ({ value, range }: Props) => {
  return (
    <div className="relative">
      <ChartRadial value={value} range={range} />
      <div className="absolute w-full top-1/2 -mt-6 text-center">
        <Counter value={value} />
      </div>
    </div>
  );
};
