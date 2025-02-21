import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Add custom matchers if needed
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      // Add other custom matchers here if needed
    }
  }
}
