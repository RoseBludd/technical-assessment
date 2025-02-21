import { Suspense } from 'react';
// import { MetricsChart, DataGrid, StatusCards } from "./components";

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading... /</div>}>
      {/* Implement your dashboard here */}
    </Suspense>
  );
}
