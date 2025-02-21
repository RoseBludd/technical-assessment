import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

// Mock the next-themes provider
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

const render = (ui: React.ReactElement, options = {}) => {
  return rtlRender(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { render };
