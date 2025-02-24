'use client';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

interface Props {
  value: number;
  range: string;
}

const chartConfig = {
  value: {
    label: '',
  },
  type: {
    label: '',
  },
} satisfies ChartConfig;

export const ChartRadial = ({ value, range }: Props) => {
  const chartData = [{ range, value, fill: '#a6a09b' }];
  const endAngle = Math.floor(Math.random() * 100) + 200;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[180px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={endAngle}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="value" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 25}
                      className="fill-muted-foreground"
                    >
                      {range}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};
