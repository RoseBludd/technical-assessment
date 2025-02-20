import { DarkLightButton } from "@/components/molecules";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light", setTheme: jest.fn() })),
}));

describe("DarkLightButton", () => {
  it("renders the button and toggles theme on click", () => {
    const { useTheme } = require("next-themes");
    const setThemeMock = jest.fn();
    useTheme.mockReturnValue({ theme: "light", setTheme: setThemeMock });

    render(
      <ThemeProvider>
        <DarkLightButton />
      </ThemeProvider>
    );

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
