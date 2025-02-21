import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

// Mock requestAnimationFrame
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Mock getComputedStyle
window.getComputedStyle = (element) => {
  return {
    getPropertyValue: (prop) => {
      return '';
    }
  };
};

// Suppress console errors for tests
console.error = jest.fn();
console.warn = jest.fn();

import React from 'react';

// Make React available globally for JSX
global.React = React;

// Mock Next.js components and hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock usePerformanceMonitor hook
jest.mock('./lib/hooks/usePerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    metrics: {
      fcp: 1000,
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
  }),
}));
