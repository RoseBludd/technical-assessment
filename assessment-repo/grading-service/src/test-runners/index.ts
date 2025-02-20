import { TestResults } from "../types";
import { execSync } from "child_process";
import * as path from "path";

async function runTests(
  testDir: string,
  command: string
): Promise<TestResults> {
  try {
    const output = execSync(command, {
      cwd: testDir,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    return {
      score: 100, // Base score, will be adjusted based on test results
      details: {
        output,
        passed: true,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        score: 0,
        details: {
          output: error.message,
          passed: false,
        },
        errors: [error.message],
      };
    }
    throw error;
  }
}

export async function runFrontendTests(testDir: string): Promise<TestResults> {
  return runTests(testDir, "npm run test");
}

export async function runBackendTests(testDir: string): Promise<TestResults> {
  return runTests(testDir, "npm run test:api");
}

export async function runIntegrationTests(
  testDir: string
): Promise<TestResults> {
  return runTests(testDir, "npm run test:integration");
}

export async function runInfrastructureTests(
  testDir: string
): Promise<TestResults> {
  return runTests(testDir, "npm run test:infra");
}

export async function runQATests(testDir: string): Promise<TestResults> {
  return runTests(testDir, "npm run test:qa");
}
