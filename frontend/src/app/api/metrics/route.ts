import { NextRequest, NextResponse } from 'next/server';

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export type TimeRange = 'hour' | 'day' | 'week';

export async function GET(req: NextRequest) {
  // Simulate API delay
  console.log(123, req);
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const timeRange =
    (req.nextUrl.searchParams.get('metric') as TimeRange) ?? 'day';
  const now = Date.now();
  const data: TimeSeriesData[] = [];

  // Generate mock time series data
  const intervals = timeRange === 'hour' ? 60 : timeRange === 'day' ? 24 : 7;
  const step =
    timeRange === 'hour' ? 60000 : timeRange === 'day' ? 3600000 : 86400000;

  for (let i = intervals - 1; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * step).toISOString(),
      value: Math.floor(Math.random() * 100) + 50,
    });
  }

  return NextResponse.json(data);
}
