import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Error from "@/components/molecules/Error";

const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

jest.mock("@/components/atoms/typography/Text", () => ({
  __esModule: true,
  Text: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span data-testid="mock-text" className={className}>
      {children}
    </span>
  ),
}));

jest.mock("@/components/atoms/button", () => ({
  __esModule: true,
  Button: ({
    onClick,
    children,
  }: {
    onClick?: () => void;
    children: React.ReactNode;
  }) => (
    <button data-testid="mock-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("Error Component", () => {
  it("renders default error message when no message is provided", () => {
    render(<Error />);

    const textElement = screen.getByTestId("mock-text");
    expect(textElement).toHaveTextContent(
      "Something went wrong. Please try again later."
    );
  });

  it("renders custom error message when provided", () => {
    render(<Error message="Custom error occurred." />);

    const textElement = screen.getByTestId("mock-text");
    expect(textElement).toHaveTextContent("Custom error occurred.");
  });

  it("calls reset function when provided", () => {
    const resetMock = jest.fn();
    render(<Error reset={resetMock} />);

    const buttonElement = screen.getByTestId("mock-button");
    fireEvent.click(buttonElement);

    expect(resetMock).toHaveBeenCalled();
  });

  it("calls refresh function from useRouter when reset is not provided", () => {
    render(<Error />);

    const buttonElement = screen.getByTestId("mock-button");
    fireEvent.click(buttonElement);

    expect(mockRefresh).toHaveBeenCalled();
  });
});
