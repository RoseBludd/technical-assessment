import React, { useState } from 'react';
import type { StatusData } from '@/types/metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * DataGrid Component
 * Displays status updates in a filterable and searchable table format.
 *
 * Features:
 * - Full-text search across all fields
 * - Status-based filtering
 * - Fixed header with scrollable content
 * - Responsive layout
 */

interface DataGridProps {
  /** Array of status updates to display */
  data: StatusData[];
}

const DataGrid: React.FC<DataGridProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter data based on search query and status selection
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      item.message.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      new Date(item.timestamp)
        .toLocaleString()
        .toLowerCase()
        .includes(searchLower);
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get appropriate color classes based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/10 text-green-500';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'error':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Status Updates</CardTitle>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Search status, message, or timestamp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-sm"
            aria-label="Search status updates"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-10">
        <div className="relative h-[400px] overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="sticky top-0 border-b bg-card">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Message
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" data-testid="data-grid-body">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-card-foreground">{item.message}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataGrid;
