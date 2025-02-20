"use client";

import { useState } from "react";

interface ProjectSubmission {
  githubUrl: string;
  prUrl: string;
  timeSpent: string;
  implementation: {
    component: string;
    api: string;
    tests: string;
  };
}

interface TestResult {
  id: string;
  developer: {
    name: string;
    email: string;
    role: string;
  };
  submission: ProjectSubmission;
  score: number;
  status: string;
  completedAt: string;
  aiFeedback: {
    overallFeedback: string;
    technicalAssessment: {
      architecture: { score: number; feedback: string };
      codeQuality: { score: number; feedback: string };
      testing: { score: number; feedback: string };
      performance: { score: number; feedback: string };
    };
    strengths: string[];
    improvements: string[];
    productionReadiness: {
      security: number;
      reliability: number;
      maintainability: number;
      scalability: number;
    };
  };
}

// Mock data for demonstration
const submissions: TestResult[] = [
  {
    id: "1",
    developer: {
      name: "Test Developer",
      email: "test@example.com",
      role: "frontend_specialist",
    },
    submission: {
      githubUrl: "https://github.com/candidate/metrics-dashboard",
      prUrl: "https://github.com/restoremasters/dev-assessment/pull/42",
      timeSpent: "3.5 hours",
      implementation: {
        component: "// MetricsDashboard implementation",
        api: "// API implementation",
        tests: "// Tests implementation",
      },
    },
    score: 92,
    status: "completed",
    completedAt: "2024-02-19T19:08:36.000Z",
    aiFeedback: {
      overallFeedback:
        "Exceptional implementation of the metrics dashboard with strong attention to production readiness",
      technicalAssessment: {
        architecture: {
          score: 95,
          feedback:
            "Excellent component architecture with proper separation of concerns. Good use of TypeScript, error boundaries, and real-time updates.",
        },
        codeQuality: {
          score: 94,
          feedback:
            "Clean, maintainable code with proper TypeScript types. Good error handling and loading states.",
        },
        testing: {
          score: 90,
          feedback:
            "Comprehensive test coverage with proper mocking and error scenarios. Could add more edge cases.",
        },
        performance: {
          score: 88,
          feedback:
            "Good use of caching and rate limiting. Consider implementing virtualization for large datasets.",
        },
      },
      strengths: [
        "Production-ready implementation with error boundaries",
        "Real-time updates with proper cleanup",
        "Strong TypeScript usage throughout",
        "Comprehensive error handling",
        "Clean code structure",
        "Good test coverage",
      ],
      improvements: [
        "Consider implementing data virtualization for large datasets",
        "Add end-to-end tests with Cypress",
        "Implement client-side caching with SWR or React Query",
        "Add performance monitoring",
        "Consider implementing WebSocket for real-time updates",
      ],
      productionReadiness: {
        security: 95,
        reliability: 92,
        maintainability: 94,
        scalability: 88,
      },
    },
  },
];

export default function TestResultsPage() {
  const [selectedSubmission, setSelectedSubmission] =
    useState<TestResult | null>(null);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Submissions List */}
      <div className="col-span-4 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{submission.developer.name}</h3>
                  <p className="text-sm text-gray-400">
                    {submission.developer.role}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 text-sm rounded bg-green-900 text-green-200">
                    {submission.score}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Completed: {new Date(submission.completedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Details */}
      <div className="col-span-8">
        {selectedSubmission ? (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">GitHub Repository</p>
                  <a
                    href={selectedSubmission.submission.githubUrl}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository
                  </a>
                </div>
                <div>
                  <p className="text-gray-400">Pull Request</p>
                  <a
                    href={selectedSubmission.submission.prUrl}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PR
                  </a>
                </div>
                <div>
                  <p className="text-gray-400">Time Spent</p>
                  <p>{selectedSubmission.submission.timeSpent}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Technical Assessment
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  selectedSubmission.aiFeedback.technicalAssessment
                ).map(([category, data]) => (
                  <div key={category} className="border-b border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium capitalize">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <span className="px-2 py-1 rounded bg-blue-900 text-blue-200">
                        {data.score}%
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2">{data.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Strengths</h2>
                <ul className="list-disc list-inside space-y-2">
                  {selectedSubmission.aiFeedback.strengths.map(
                    (strength, index) => (
                      <li key={index} className="text-gray-300">
                        {strength}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Improvements</h2>
                <ul className="list-disc list-inside space-y-2">
                  {selectedSubmission.aiFeedback.improvements.map(
                    (improvement, index) => (
                      <li key={index} className="text-gray-300">
                        {improvement}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Production Readiness
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(
                  selectedSubmission.aiFeedback.productionReadiness
                ).map(([metric, score]) => (
                  <div key={metric} className="text-center">
                    <div className="text-2xl font-bold">{score}%</div>
                    <p className="text-sm text-gray-400 capitalize">{metric}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Implementation Details
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Component Implementation
                  </h3>
                  <pre className="bg-gray-900 p-4 rounded overflow-auto">
                    <code className="text-sm">
                      {selectedSubmission.submission.implementation.component}
                    </code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    API Implementation
                  </h3>
                  <pre className="bg-gray-900 p-4 rounded overflow-auto">
                    <code className="text-sm">
                      {selectedSubmission.submission.implementation.api}
                    </code>
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Tests Implementation
                  </h3>
                  <pre className="bg-gray-900 p-4 rounded overflow-auto">
                    <code className="text-sm">
                      {selectedSubmission.submission.implementation.tests}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a submission to view details
          </div>
        )}
      </div>
    </div>
  );
}
