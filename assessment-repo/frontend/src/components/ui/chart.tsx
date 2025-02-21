'use client';

import * as React from 'react';
import { Tooltip as RechartsTooltip } from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartContainerProps {
  config: ChartConfig;
  children: React.ReactNode;
}

export function ChartContainer({ config, children }: ChartContainerProps) {
  const style = Object.entries(config).reduce(
    (acc, [key, value]) => {
      acc[`--color-${key}`] = value.color;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <TooltipProvider>
      <div style={style}>{children}</div>
    </TooltipProvider>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    color: string;
  }>;
  label?: string;
  indicator?: 'dot' | 'line';
  hideLabel?: boolean;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = 'dot',
  hideLabel = false,
}: ChartTooltipContentProps) {
  if (!active || !payload) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {!hideLabel && (
        <div className="text-xs text-muted-foreground">{label}</div>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {indicator === 'dot' && (
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: item.color }}
              />
            )}
            {indicator === 'line' && (
              <div className="h-0.5 w-2" style={{ background: item.color }} />
            )}
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ChartTooltip = RechartsTooltip;
