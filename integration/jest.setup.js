// Increase timeout for integration tests
jest.setTimeout(30000);

// Global setup
beforeAll(async () => {
  // Start mock services
  // Set up test environment
});

// Global teardown
afterAll(async () => {
  // Stop mock services
  // Clean up test environment
});

// Reset state between tests
beforeEach(() => {
  jest.clearAllMocks();
});
