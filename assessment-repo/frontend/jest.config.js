const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@radix-ui/react-select|@radix-ui/react-icons|lucide-react|@radix-ui/react-primitive|@radix-ui/react-portal|@radix-ui/react-use-callback-ref|@radix-ui/react-use-controllable-state|@radix-ui/react-context|@radix-ui/react-collection|@radix-ui/react-direction|@radix-ui/react-use-previous|@radix-ui/react-use-layout-effect|@radix-ui/react-visually-hidden|@radix-ui/react-menu|@radix-ui/react-dialog|@radix-ui/react-focus-guards|@radix-ui/react-focus-scope|@radix-ui/react-id|@radix-ui/react-use-rect|@radix-ui/react-use-size|@radix-ui/react-dismissable-layer|@radix-ui/react-presence|@radix-ui/react-roving-focus|@radix-ui/primitive)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

module.exports = createJestConfig(customJestConfig);
