// Increase timeout for all tests
jest.setTimeout(30000);

// Global setup
beforeAll(async () => {
  // Add any necessary setup (database connections, etc.)
});

// Global teardown
afterAll(async () => {
  // Add any necessary cleanup
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
