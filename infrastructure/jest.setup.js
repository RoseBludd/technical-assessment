// Increase timeout for infrastructure tests
jest.setTimeout(60000);

// Global setup
beforeAll(async () => {
  // Initialize test infrastructure
  // Set up mock AWS resources
});

// Global teardown
afterAll(async () => {
  // Clean up test infrastructure
  // Remove mock AWS resources
});

// Reset state between tests
beforeEach(() => {
  jest.clearAllMocks();
});
