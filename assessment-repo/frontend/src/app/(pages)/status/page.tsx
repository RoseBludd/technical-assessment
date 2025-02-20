import { fetchStatus } from "@/api/mock-data";
import PageTemplate from "@/components/templates/PageTemplate";
import StatusTable from "./components/StatusTable";

const Status = async () => {
  const statusData = await fetchStatus();

  return (
    <PageTemplate title="Status Update">
      <StatusTable statusData={statusData} />
    </PageTemplate>
  );
};

export default Status;
