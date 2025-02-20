import Header from "@/components/atoms/typography/Header";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

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

describe("Header", () => {
  it("renders the correct text content", () => {
    render(<Header>Test Header</Header>);

    const headerElement = screen.getByText("Test Header");
    expect(headerElement).toBeInTheDocument();
  });

  it("applies default variant (h1) styles", () => {
    render(<Header>Default H1</Header>);

    const headerElement = screen.getByTestId("mock-text");
    expect(headerElement).toHaveClass("text-4xl lg:text-5xl");
  });

  it.each([
    ["h1", "text-4xl lg:text-5xl"],
    ["h2", "text-3xl"],
    ["h3", "text-2xl"],
    ["h4", "text-xl"],
  ])("applies correct styles for variant %s", (variant, expectedClass) => {
    render(
      <Header variant={variant as "h1" | "h2" | "h3" | "h4"}>
        Variant Test
      </Header>
    );

    const headerElement = screen.getByTestId("mock-text");
    expect(headerElement).toHaveClass(expectedClass);
  });

  it("applies custom class names", () => {
    render(<Header className="custom-class">Styled Header</Header>);

    const headerElement = screen.getByTestId("mock-text");
    expect(headerElement).toHaveClass("custom-class");
  });
});
