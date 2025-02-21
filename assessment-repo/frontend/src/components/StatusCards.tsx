import React from 'react';
import type { StatusData } from '@/types/metrics';
import { Card, CardContent } from '@/components/ui/card';

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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <h3
              className={`mb-2 text-lg font-semibold ${getStatusColor(item.status)}`}
            >
              {item.status}
            </h3>
            <p className="text-sm text-card-foreground">{item.message}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatusCards;
