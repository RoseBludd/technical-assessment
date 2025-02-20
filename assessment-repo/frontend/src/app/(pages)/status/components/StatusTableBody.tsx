import { StatusUpdate } from "@/api/mock-data";
import { StatusChip, Text } from "@/components/atoms";

interface StatusTableBodyProps {
  filteredStatusData: StatusUpdate[];
}

const StatusTableBody = ({ filteredStatusData }: StatusTableBodyProps) => {
  if (filteredStatusData.length === 0) {
    return (
      <tr>
        <td colSpan={3} className="text-center py-4 text-gray-500">
          Empty Data..
        </td>
      </tr>
    );
  }

  return (
    <>
      {filteredStatusData.map((data) => (
        <tr
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
          key={data.id}
        >
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            <Text>{data.message}</Text>
          </th>
          <td className="px-6 py-4">
            <StatusChip status={data.status} />
          </td>
          <td className="px-6 py-4">
            <Text>{data.timestamp}</Text>
          </td>
        </tr>
      ))}
    </>
  );
};

export default StatusTableBody;
