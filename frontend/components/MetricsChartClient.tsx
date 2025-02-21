'use client';

import React, { useEffect, useState } from 'react';
import { fetchMetrics, TimeSeriesData } from '../api/mock-data';
import MetricsChart from './MetricsChart';

interface MetricsChartClientProps {
  className?: string;
}

const MetricsChartClient: React.FC<MetricsChartClientProps> = ({ className = '' }) => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const metrics = await fetchMetrics();
        setData(metrics);
        setError(null);
      } catch (err) {
        setError('Failed to load metrics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="text-red-500" data-testid="error-message">
        {error}
      </div>
    );
  }

  if (loading) {
    return <div>Loading metrics...</div>;
  }

  return <MetricsChart data={data} className={className} />;
};

export default MetricsChartClient;
