import { NextResponse } from 'next/server';

export interface StatusUpdate {
  id: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data: StatusUpdate[] = [
    {
      id: '1',
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    },
    {
      id: '2',
      status: 'warning',
      message: 'High CPU utilization detected',
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    },
    {
      id: '3',
      status: 'error',
      message: 'Database connection timeout',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    },
  ];
  return NextResponse.json(data);
}
