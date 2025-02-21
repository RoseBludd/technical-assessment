import React from 'react';
import type { StatusData } from '@/types/metrics';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

/**
 * StatusCards Component
 * Displays summary cards showing system status counts and indicators.
 *
 * Features:
 * - Status grouping and counting
 * - Visual status indicators with icons
 * - Responsive grid layout
 * - Color-coded status representation
 */

interface StatusCardsProps {
  /** Array of status updates to summarize */
  data: StatusData[];
}

const StatusCards: React.FC<StatusCardsProps> = ({ data }) => {
  // Calculate counts for each status type
  const statusCounts = {
    healthy: data.filter((item) => item.status === 'healthy').length,
    warning: data.filter((item) => item.status === 'warning').length,
    error: data.filter((item) => item.status === 'error').length,
  };

  // Status configuration for consistent rendering
  const statusConfig = [
    {
      status: 'healthy',
      message: 'Systems Operational',
      icon: CheckCircle,
    },
    {
      status: 'warning',
      message: 'Systems Need Attention',
      icon: AlertTriangle,
    },
    {
      status: 'error',
      message: 'Systems Critical',
      icon: XCircle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statusConfig.map(({ status, message, icon: Icon }) => (
        <Card key={status}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`mb-2 text-lg font-semibold ${getStatusColor(status)}`}
                >
                  {status}
                  <span className="ml-2 text-sm">
                    ({statusCounts[status as keyof typeof statusCounts]})
                  </span>
                </h3>
                <p className="text-sm text-card-foreground">{message}</p>
              </div>
              <div className={getStatusColor(status)}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatusCards;
