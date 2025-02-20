import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph from "@/components/atoms/typography/Paragraph";

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

describe("Paragraph", () => {
  it("renders the text content", () => {
    render(<Paragraph>Hello World</Paragraph>);

    const textElement = screen.getByText("Hello World");
    expect(textElement).toBeInTheDocument();
  });

  it("applies default and custom class names", () => {
    render(<Paragraph className="custom-class">Styled Text</Paragraph>);

    const textElement = screen.getByTestId("mock-text"); // Select mocked Text component

    expect(textElement).toHaveClass("leading-7");
    expect(textElement).toHaveClass("custom-class");
  });
});
