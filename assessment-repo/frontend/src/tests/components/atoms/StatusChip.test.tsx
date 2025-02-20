import { StatusChip, StatusType } from "@/components/atoms/StatusChip";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("StatusChip Component", () => {
  const statuses: StatusType[] = ["healthy", "warning", "error"];

  it.each(statuses)("renders correctly with status '%s'", (status) => {
    render(<StatusChip status={status} />);

    const chipElement = screen.getByText(status);

    expect(chipElement).toBeInTheDocument();
    expect(chipElement).toHaveTextContent(status);
  });

  it("applies correct styles for 'healthy' status", () => {
    render(<StatusChip status="healthy" />);

    const chipElement = screen.getByText("healthy");

    expect(chipElement).toHaveClass(
      "border-green-500 bg-green-500 text-green-500"
    );
  });

  it("applies correct styles for 'warning' status", () => {
    render(<StatusChip status="warning" />);

    const chipElement = screen.getByText("warning");

    expect(chipElement).toHaveClass(
      "border-yellow-500 bg-yellow-500 text-yellow-500"
    );
  });

  it("applies correct styles for 'error' status", () => {
    render(<StatusChip status="error" />);

    const chipElement = screen.getByText("error");

    expect(chipElement).toHaveClass("border-red-500 bg-red-500 text-red-500");
  });
});
