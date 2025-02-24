// Increase timeout for QA tests
jest.setTimeout(30000);

// Global setup
beforeAll(async () => {
  // Set up test environment
  // Initialize test data
});

// Global teardown
afterAll(async () => {
  // Clean up test environment
  // Remove test data
});

// Reset state between tests
beforeEach(() => {
  jest.clearAllMocks();
});
