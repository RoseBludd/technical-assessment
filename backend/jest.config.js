module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/**/*.test.ts",
    "<rootDir>/**/*.api.test.ts",
    "<rootDir>/**/*.integration.test.ts",
  ],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
};
