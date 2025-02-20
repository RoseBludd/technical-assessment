import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageTemplate from "@/components/templates/PageTemplate";

jest.mock("@/components/atoms", () => ({
  Header: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="mock-header">{children}</h3>
  ),
}));

describe("PageTemplate", () => {
  it("renders without crashing", () => {
    render(<PageTemplate title="Test Page">Mock Content</PageTemplate>);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-header")).toHaveTextContent("Test Page");
    expect(screen.getByText("Mock Content")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    render(<PageTemplate title="Another Page">Some Content</PageTemplate>);

    expect(screen.getByText("Some Content")).toBeInTheDocument();
  });
});
