import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Text } from "@/components/atoms";

describe("Text", () => {
  it("renders the text content", () => {
    render(<Text>Hello World</Text>);

    const textElement = screen.getByText("Hello World");
    expect(textElement).toBeInTheDocument();
  });

  it("applies default and custom class names", () => {
    render(<Text className="text-sm">Styled Text</Text>);

    const textElement = screen.getByText("Styled Text");

    expect(textElement).toHaveClass("dark:text-gray-50 text-black text-sm");
  });
});
