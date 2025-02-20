import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatusUpdate } from "@/api/mock-data";
import StatusTable from "@/app/(pages)/status/components/StatusTable";

jest.mock("@/components/molecules", () => ({
  SelectField: ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <select
      data-testid="mock-select"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      <option value="">Select Status</option>
      <option value="healthy">Healthy</option>
      <option value="warning">Warning</option>
      <option value="error">Error</option>
    </select>
  ),
}));

jest.mock("@/components/atoms", () => ({
  Input: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (e: any) => void;
  }) => <input data-testid="mock-input" value={value} onChange={onChange} />,
  Button: ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button data-testid="mock-button" onClick={onClick}>
      {children}
    </button>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="mock-text">{children}</span>
  ),
}));

jest.mock("@/app/(pages)/status/components/StatusTableBody", () => ({
  __esModule: true,
  default: ({ filteredStatusData }: { filteredStatusData: StatusUpdate[] }) => (
    <tbody data-testid="mock-status-table-body">
      {filteredStatusData.map((status) => (
        <tr key={status.id}>
          <td>{status.message}</td>
          <td>{status.status}</td>
          <td>{status.timestamp}</td>
        </tr>
      ))}
    </tbody>
  ),
}));

const mockStatusData: StatusUpdate[] = [
  {
    id: "1",
    status: "healthy",
    message: "System is stable",
    timestamp: "2024-07-10",
  },
  {
    id: "2",
    status: "warning",
    message: "High CPU usage",
    timestamp: "2024-07-11",
  },
  {
    id: "3",
    status: "error",
    message: "System failure",
    timestamp: "2024-07-12",
  },
];

describe("StatusTable", () => {
  it("renders correctly with initial data", () => {
    render(<StatusTable statusData={mockStatusData} />);

    expect(screen.getByTestId("mock-input")).toBeInTheDocument();
    expect(screen.getByTestId("mock-select")).toBeInTheDocument();
    expect(screen.getByTestId("mock-button")).toBeInTheDocument();
    expect(screen.getByTestId("mock-status-table-body")).toBeInTheDocument();
  });

  it("filters status data based on search input", () => {
    render(<StatusTable statusData={mockStatusData} />);

    const input = screen.getByTestId("mock-input");
    fireEvent.change(input, { target: { value: "CPU" } });

    expect(screen.getByText("High CPU usage")).toBeInTheDocument();
    expect(screen.queryByText("System is stable")).not.toBeInTheDocument();
  });

  it("filters status data based on status selection", () => {
    render(<StatusTable statusData={mockStatusData} />);

    const select = screen.getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "error" } });

    expect(screen.getByText("System failure")).toBeInTheDocument();
    expect(screen.queryByText("System is stable")).not.toBeInTheDocument();
  });

  it("clears filters when clicking the clear button", () => {
    render(<StatusTable statusData={mockStatusData} />);

    const input = screen.getByTestId("mock-input");
    const select = screen.getByTestId("mock-select");
    const clearButton = screen.getByTestId("mock-button");

    fireEvent.change(input, { target: { value: "CPU" } });
    fireEvent.change(select, { target: { value: "error" } });

    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
    expect(select).toHaveValue("");
  });
});
