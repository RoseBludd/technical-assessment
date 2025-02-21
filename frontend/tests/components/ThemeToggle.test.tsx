import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders theme toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    // Initial theme should be system
    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
    
    // Click to toggle theme
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBeTruthy();
    
    // Click again to toggle back
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
  });

  it('persists theme preference in localStorage', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    // Click to set theme to dark
    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('dark');

    // Click again to set theme to light
    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
