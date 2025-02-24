module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/**/*.test.ts",
    "<rootDir>/**/*.integration.test.ts",
    "<rootDir>/**/*.e2e.test.ts",
  ],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  testTimeout: 30000,
};
