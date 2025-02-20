import DarkLightButton from "@/components/molecules/DarkLightButton";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
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

jest.mock("lucide-react", () => ({
  Moon: () => <span data-testid="mock-moon">🌙</span>,
  Sun: () => <span data-testid="mock-sun">☀️</span>,
}));

describe("DarkLightButton", () => {
  let mockSetTheme: jest.Mock;

  beforeEach(() => {
    mockSetTheme = jest.fn((newTheme) => newTheme);
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<DarkLightButton />);
    expect(screen.getByTestId("mock-button")).toBeInTheDocument();
  });

  it("renders the Moon icon when theme is light", () => {
    render(<DarkLightButton />);
    expect(screen.getByTestId("mock-moon")).toBeInTheDocument();
  });

  it("renders the Sun icon when theme is dark", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<DarkLightButton />);
    expect(screen.getByTestId("mock-sun")).toBeInTheDocument();
  });

  it("toggles theme when clicked", () => {
    const { rerender } = render(<DarkLightButton />);

    const button = screen.getByTestId("mock-button");
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });
    rerender(<DarkLightButton />);
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledTimes(2);
  });
});
