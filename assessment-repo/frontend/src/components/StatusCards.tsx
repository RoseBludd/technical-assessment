import React from 'react';
import type { StatusData } from '@/types/metrics';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StatusCardsProps {
  data: StatusData[];
}

const StatusCards: React.FC<StatusCardsProps> = ({ data }) => {
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

  const statusCounts = {
    healthy: data.filter((item) => item.status === 'healthy').length,
    warning: data.filter((item) => item.status === 'warning').length,
    error: data.filter((item) => item.status === 'error').length,
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`mb-2 text-lg font-semibold ${getStatusColor(item.status)}`}
                >
                  {item.status}
                  <span className="ml-2 text-sm">
                    ({statusCounts[item.status]})
                  </span>
                </h3>
                <p className="text-sm text-card-foreground">{item.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <div className={getStatusColor(item.status)}>
                {item.status === 'healthy' && (
                  <CheckCircle className="h-6 w-6" />
                )}
                {item.status === 'warning' && (
                  <AlertTriangle className="h-6 w-6" />
                )}
                {item.status === 'error' && <XCircle className="h-6 w-6" />}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatusCards;
