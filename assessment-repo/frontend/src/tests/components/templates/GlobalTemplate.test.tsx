import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GlobalTemplate from "@/components/templates/GlobalTemplate";

jest.mock("@/components/templates/ThemeProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-theme-provider">{children}</div>
  ),
}));

jest.mock("@/components/organisms", () => ({
  Topbar: () => <div data-testid="mock-topbar">Mock Topbar</div>,
}));

describe("GlobalTemplate", () => {
  it("renders without crashing", () => {
    render(<GlobalTemplate>Mock Content</GlobalTemplate>);

    expect(screen.getByTestId("mock-theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("mock-topbar")).toBeInTheDocument();
    expect(screen.getByText("Mock Content")).toBeInTheDocument();
  });
});
