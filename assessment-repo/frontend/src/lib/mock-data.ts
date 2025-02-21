export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface StatusUpdate {
  id: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export async function fetchMetrics(
  timeRange: 'hour' | 'day' | 'week' = 'day'
): Promise<TimeSeriesData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  return data;
}

export async function fetchStatus(): Promise<StatusUpdate[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000; // milliseconds in a day

  return [
    {
      id: '1',
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date(now - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    },
    {
      id: '2',
      status: 'warning',
      message: 'High CPU utilization detected',
      timestamp: new Date(now - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    },
    {
      id: '3',
      status: 'error',
      message: 'Database connection timeout',
      timestamp: new Date(now - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
    {
      id: '4',
      status: 'healthy',
      message: 'System backup completed successfully',
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '5',
      status: 'warning',
      message: 'Memory usage above 80%',
      timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: '6',
      status: 'healthy',
      message: 'API response time normal',
      timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      id: '7',
      status: 'error',
      message: 'Authentication service down',
      timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    {
      id: '8',
      status: 'healthy',
      message: 'Cache cleared successfully',
      timestamp: new Date(now - day).toISOString(), // 1 day ago
    },
    {
      id: '9',
      status: 'warning',
      message: 'Disk space running low',
      timestamp: new Date(now - 2 * day).toISOString(), // 2 days ago
    },
    {
      id: '10',
      status: 'healthy',
      message: 'SSL certificates renewed',
      timestamp: new Date(now - 3 * day).toISOString(), // 3 days ago
    },
    {
      id: '11',
      status: 'error',
      message: 'Payment gateway timeout',
      timestamp: new Date(now - 4 * day).toISOString(), // 4 days ago
    },
    {
      id: '12',
      status: 'warning',
      message: 'High network latency detected',
      timestamp: new Date(now - 5 * day).toISOString(), // 5 days ago
    },
    {
      id: '13',
      status: 'healthy',
      message: 'Security scan completed',
      timestamp: new Date(now - 6 * day).toISOString(), // 6 days ago
    },
    {
      id: '14',
      status: 'error',
      message: 'File storage service unavailable',
      timestamp: new Date(now - 7 * day).toISOString(), // 1 week ago
    },
    {
      id: '15',
      status: 'warning',
      message: 'API rate limit reached',
      timestamp: new Date(now - 8 * day).toISOString(), // 8 days ago
    },
    {
      id: '16',
      status: 'healthy',
      message: 'Database optimization completed',
      timestamp: new Date(now - 9 * day).toISOString(), // 9 days ago
    },
    {
      id: '17',
      status: 'error',
      message: 'Email service not responding',
      timestamp: new Date(now - 10 * day).toISOString(), // 10 days ago
    },
    {
      id: '18',
      status: 'warning',
      message: 'Cache hit ratio below threshold',
      timestamp: new Date(now - 11 * day).toISOString(), // 11 days ago
    },
    {
      id: '19',
      status: 'healthy',
      message: 'Load balancer configuration updated',
      timestamp: new Date(now - 12 * day).toISOString(), // 12 days ago
    },
    {
      id: '20',
      status: 'error',
      message: 'CDN propagation failed',
      timestamp: new Date(now - 13 * day).toISOString(), // 13 days ago
    },
  ];
}
