import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Topbar from "@/components/organisms/Topbar";

jest.mock("@/components/atoms", () => ({
  Header: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="mock-header">{children}</h3>
  ),
}));

jest.mock("@/components/molecules", () => ({
  TopbarMenu: () => <nav data-testid="mock-topbar-menu">Mock Menu</nav>,
  DarkLightButton: () => (
    <button data-testid="mock-dark-light-button">Toggle Theme</button>
  ),
}));

describe("Topbar", () => {
  it("renders without crashing", () => {
    render(<Topbar />);
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-topbar-menu")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dark-light-button")).toBeInTheDocument();
  });

  it("displays the company name", () => {
    render(<Topbar />);
    expect(screen.getByTestId("mock-header")).toHaveTextContent("CompanyX");
  });
});
