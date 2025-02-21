'use client';

import React, { useState } from 'react';
import { TimeSeriesData } from '../api/mock-data';

interface DataGridProps {
  data: TimeSeriesData[];
  className?: string;
}

export default function DataGrid({ data, className = '' }: DataGridProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TimeSeriesData;
    direction: 'asc' | 'desc';
  }>({ key: 'timestamp', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === 'timestamp') {
      return sortConfig.direction === 'asc'
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return sortConfig.direction === 'asc'
      ? a[sortConfig.key] > b[sortConfig.key]
        ? 1
        : -1
      : a[sortConfig.key] < b[sortConfig.key]
      ? 1
      : -1;
  });

  // Filtering logic
  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof TimeSeriesData) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getSortIcon = (key: keyof TimeSeriesData) => {
    if (sortConfig.key !== key) {
      return (
        <svg
          className="w-4 h-4 text-muted-foreground group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg
        className="w-4 h-4 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Metrics Data
        </h3>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search metrics..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="input-select pr-10 w-full"
            aria-label="Search metrics"
          />
          <svg
            className="w-5 h-5 text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th
                className="group cursor-pointer"
                onClick={() => requestSort('timestamp')}
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Timestamp
                  </span>
                  {getSortIcon('timestamp')}
                </div>
              </th>
              <th
                className="group cursor-pointer"
                onClick={() => requestSort('value')}
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Value
                  </span>
                  {getSortIcon('value')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((item, index) => (
              <tr
                key={item.timestamp}
                className={`
                  transition-colors hover:bg-muted/50
                  ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                `}
              >
                <td className="px-4 py-3 text-sm">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-primary">
                  {item.value.toLocaleString()}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} entries
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="input-select px-3 py-1 disabled:opacity-50 transition-opacity"
              aria-label="Previous page"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="input-select px-3 py-1 disabled:opacity-50 transition-opacity"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
