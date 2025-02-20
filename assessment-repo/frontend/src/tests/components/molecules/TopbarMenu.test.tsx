import TopbarMenu from "@/components/molecules/TopbarMenu";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/atoms/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="mock-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("TopbarMenu Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the menu items correctly", () => {
    render(<TopbarMenu />);

    expect(screen.getByText("Metrics")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("navigates to '/' when 'Metrics' is clicked", () => {
    render(<TopbarMenu />);

    fireEvent.click(screen.getByText("Metrics"));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("navigates to '/status' when 'Status' is clicked", () => {
    render(<TopbarMenu />);

    fireEvent.click(screen.getByText("Status"));

    expect(mockPush).toHaveBeenCalledWith("/status");
  });
});
