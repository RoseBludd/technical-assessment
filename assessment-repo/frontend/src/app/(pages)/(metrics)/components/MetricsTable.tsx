"use client";

import { TimeSeriesData } from "@/api/mock-data";
import { Error, Loader, Paragraph, Text } from "@/components/atoms";
import { formatTimestamp } from "@/lib";
import React from "react";

interface MetricsTableProps {
  metricsData: TimeSeriesData[];
  loading: boolean;
  error: string | null;
}

const MetricsTable = ({ metricsData, loading, error }: MetricsTableProps) => {
  const headers = ["Value", "TimeStamp"];

  if (loading) return <Loader text="Metrics" />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase border-b bg-black">
            <tr>
              {headers.map((header) => (
                <th scope="col" className="px-6 py-3" key={header}>
                  <Text className="text-gray-50">{header}</Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricsData.map((data, index) => (
              <tr
                className="border-b dark:border-gray-700 border-gray-200"
                key={`${data.value}-${index}`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Text>{data.value}</Text>
                </th>
                <td className="px-6 py-4">
                  <Text>{formatTimestamp(data.timestamp)}</Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;
