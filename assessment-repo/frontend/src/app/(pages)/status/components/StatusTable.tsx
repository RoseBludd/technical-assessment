"use client";

import { StatusUpdate } from "@/api/mock-data";
import { Button, Input, StatusType, Text } from "@/components/atoms";
import { ChangeEvent, useMemo, useState } from "react";
import StatusTableBody from "./StatusTableBody";
import { IOption, SelectField } from "@/components/molecules";

interface StatusTableProps {
  statusData: StatusUpdate[];
}

interface IFilter {
  status: string;
  searchString: string;
}

const intialFilters: IFilter = {
  searchString: "",
  status: "",
};

const statusOptions: IOption[] = [
  { label: "Healthy", value: "healthy" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
];

const StatusTable = ({ statusData }: StatusTableProps) => {
  const [filters, setFilters] = useState<IFilter>(intialFilters);
  const headers: string[] = ["Message", "Status", "TimeStamp"];

  const filteredStatusData = useMemo(() => {
    return statusData.filter((data) => {
      const matchesSearchString = filters.searchString
        ? data.message
            .toLowerCase()
            .includes(filters.searchString.toLowerCase())
        : true;

      const matchesStatus = filters.status
        ? data.status === filters.status
        : true;

      return matchesSearchString && matchesStatus;
    });
  }, [filters, statusData]);

  const handleFilterState = (key: keyof IFilter, value: string) => {
    setFilters((prevState) => {
      const stateCopy = { ...prevState };
      stateCopy[key] = value;
      return stateCopy;
    });
  };

  const handleStatusFilterChange = (status: string) => {
    handleFilterState("status", status);
  };

  const handleFilterStringOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterState("searchString", value);
  };

  const handleClearFilters = () => {
    setFilters(intialFilters);
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-12 gap-6">
        <div className="col-span-full">
          <Input
            value={filters.searchString}
            placeholder="Search by Message"
            onChange={handleFilterStringOnChange}
            type="search"
          />
        </div>
        <div className="col-span-full lg:col-span-6">
          <SelectField
            options={statusOptions}
            placeholder="Select Status"
            value={filters.status}
            onValueChange={handleStatusFilterChange}
          />
        </div>
        <div className="col-span-full text-right lg:col-span-6 lg:text-left">
          <Button onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase border-b bg-black dark:bg-transparent">
            <tr>
              {headers.map((header) => (
                <th scope="col" className="px-6 py-3" key={header}>
                  <Text className="text-gray-50 dark:text-b">{header}</Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <StatusTableBody filteredStatusData={filteredStatusData} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTable;
