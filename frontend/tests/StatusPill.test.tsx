import StatusPill from "@/components/status-pill/StatusPill";
import { render, screen } from "@testing-library/react";

describe("StatusPill", () => {
  it("renders the correct status and styling for 'warning'", () => {
    render(<StatusPill status="warning" />);
    const pill = screen.getByText("warning");
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass(
      "bg-yellow-500/20 border-yellow-500/70 text-yellow-700",
    );
  });

  it("renders the correct status and styling for 'healthy'", () => {
    render(<StatusPill status="healthy" />);
    const pill = screen.getByText("healthy");
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass(
      "bg-emerald-500/20 border-emerald-500/70 text-emerald-700",
    );
  });

  it("renders the correct status and styling for 'error'", () => {
    render(<StatusPill status="error" />);
    const pill = screen.getByText("error");
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass("bg-red-500/20 border-red-500/70 text-red-500");
  });
});
