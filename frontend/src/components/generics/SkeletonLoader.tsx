export default function MetricsChartSkeleton() {
    return (
      <div className="w-full h-[400px] bg-gray-800 rounded-lg animate-pulse">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-600">Loading chart data...</div>
        </div>
      </div>
    );
  }