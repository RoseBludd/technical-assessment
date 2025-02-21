"use server";

import DataTable from "../data-table/DataTable";
import { MetricsColumns } from "../metrics-columns/MetricsColumns";

const URL_WHERE_TO_FETCH_DATA = "http://localhost:3000";

export default async function DataGrid() {
  const response = await fetch(`${URL_WHERE_TO_FETCH_DATA}/api/status`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  const statusData = await response.json();

  return <DataTable columns={MetricsColumns} data={statusData} />;
}
