'use client';

import React from 'react';
import { StatusUpdate } from '../api/mock-data';

interface StatusCardsProps {
  data: StatusUpdate[];
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'healthy':
      return (
        <div className="rounded-full bg-green-100 dark:bg-green-500/20 p-3">
          <svg
            className="w-6 h-6 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="rounded-full bg-yellow-100 dark:bg-yellow-500/20 p-3">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="rounded-full bg-red-100 dark:bg-red-500/20 p-3">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="rounded-full bg-gray-100 dark:bg-gray-500/20 p-3">
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      );
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'healthy':
      return 'text-green-600 dark:text-green-400';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'error':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default function StatusCards({ data, className = '' }: StatusCardsProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`metrics-grid ${className}`}>
        <div className="status-card" role="status">
          <p className="text-muted-foreground">No status data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`metrics-grid ${className}`}>
      {data.map((item) => (
        <div
          key={item.id}
          className="status-card"
          role="status"
          aria-label={`Status ${item.status}: ${item.message}`}
        >
          <div className="flex items-center justify-between w-full">
            <span
              className={`text-sm font-medium capitalize ${getStatusColor(
                item.status
              )}`}
            >
              {item.status}
            </span>
            {item.timestamp && (
              <time
                className="text-xs text-muted-foreground whitespace-nowrap"
                title={new Date(item.timestamp).toLocaleString()}
                dateTime={item.timestamp}
              >
                {formatTimestamp(item.timestamp)}
              </time>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {getStatusIcon(item.status)}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {item.message}
              </h3>
              <p
                className={`text-base sm:text-lg font-semibold ${getStatusColor(
                  item.status
                )}`}
              >
                {/* Status icon is enough to indicate the status */}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
