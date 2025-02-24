"use client";

import { useState, useEffect } from "react";
import { IconBrandGithub, IconRefresh } from "@tabler/icons-react";

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
  test: {
    title: string;
  };
  score: number;
  status: string;
  completed_at: string;
  ai_feedback: {
    overallFeedback: string;
    technicalAssessment: {
      architecture: { score: number; feedback: string };
      codeQuality: { score: number; feedback: string };
      testing: { score: number; feedback: string };
      performance: { score: number; feedback: string };
    };
    strengths: string[];
    improvements: string[];
  };
  github_submission: {
    url: string;
    status: string;
    submitted_at: string;
    last_updated: string;
    pr_number: number;
    tasks_done: number;
    total_tasks: number;
  } | null;
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
    test: {
      title: "Metrics Dashboard",
    },
    score: 92,
    status: "completed",
    completed_at: "2024-02-19T19:08:36.000Z",
    ai_feedback: {
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
    },
    github_submission: {
      url: "https://github.com/candidate/metrics-dashboard",
      status: "completed",
      submitted_at: "2024-02-19T19:08:36.000Z",
      last_updated: "2024-02-19T19:08:36.000Z",
      pr_number: 42,
      tasks_done: 10,
      total_tasks: 10,
    },
  },
];

export default function TestResultsPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchResults = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/admin/test-results/live");
      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch results:", err);
      setError("Failed to fetch test results");
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch only
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Submissions List */}
      <div className="col-span-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Submissions</h2>
          <button
            onClick={fetchResults}
            disabled={isRefreshing}
            className={`p-2 rounded-lg transition-colors ${
              isRefreshing
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gray-800/30 hover:bg-gray-700/30"
            }`}
            title="Refresh submissions"
          >
            <IconRefresh
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedSubmission?.id === result.id
                  ? "bg-indigo-600"
                  : "bg-gray-800/30 hover:bg-gray-700/30"
              }`}
              onClick={() => setSelectedSubmission(result)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{result.developer.name}</h3>
                  <p className="text-sm text-gray-400">
                    {result.developer.role.toLowerCase().replace(/_/g, " ")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 text-sm rounded ${
                      result.status === "completed"
                        ? result.score >= 70
                          ? "bg-green-900/50 text-green-200"
                          : "bg-red-900/50 text-red-200"
                        : result.status === "in_progress"
                        ? "bg-blue-900/50 text-blue-200"
                        : "bg-yellow-900/50 text-yellow-200"
                    }`}
                  >
                    {result.status === "completed"
                      ? `${result.score}%`
                      : result.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <div>Status: {result.status.replace(/_/g, " ")}</div>
                {result.completed_at && (
                  <div>
                    Completed: {new Date(result.completed_at).toLocaleString()}
                  </div>
                )}
              </div>
              {result.github_submission && (
                <div className="mt-2 text-sm">
                  <a
                    href={result.github_submission.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconBrandGithub className="w-4 h-4" />
                    <span>PR #{result.github_submission.pr_number}</span>
                    {result.github_submission.tasks_done !== undefined && (
                      <span className="ml-1">
                        ({result.github_submission.tasks_done}/
                        {result.github_submission.total_tasks})
                      </span>
                    )}
                  </a>
                  <div className="mt-1 text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(
                      result.github_submission.last_updated
                    ).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission Details */}
      <div className="col-span-8">
        {selectedSubmission ? (
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Submission Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Developer</p>
                  <p className="text-white">
                    {selectedSubmission.developer.name}
                  </p>
                  <p className="text-gray-400 mt-1">
                    {selectedSubmission.developer.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Role</p>
                  <p className="text-white">
                    {selectedSubmission.developer.role.replace(/_/g, " ")}
                  </p>
                </div>
                {selectedSubmission.github_submission && (
                  <>
                    <div>
                      <p className="text-gray-400">Pull Request</p>
                      <a
                        href={selectedSubmission.github_submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        PR #{selectedSubmission.github_submission.pr_number}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-400">Progress</p>
                      <p className="text-white">
                        {selectedSubmission.github_submission.tasks_done} of{" "}
                        {selectedSubmission.github_submission.total_tasks} tasks
                        completed
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Submission Date</p>
                      <p className="text-white">
                        {new Date(
                          selectedSubmission.github_submission.submitted_at
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-white">
                        {new Date(
                          selectedSubmission.github_submission.last_updated
                        ).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedSubmission.ai_feedback && (
              <>
                <div className="bg-gray-800/30 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Technical Assessment
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(
                      selectedSubmission.ai_feedback.technicalAssessment
                    ).map(([category, data]) => (
                      <div
                        key={category}
                        className="border-b border-gray-700/50 pb-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium capitalize">
                            {category.replace(/([A-Z])/g, " $1").trim()}
                          </h3>
                          <span className="px-2 py-1 rounded bg-indigo-900/50 text-indigo-200">
                            {data.score}%
                          </span>
                        </div>
                        <p className="text-gray-400 mt-2">{data.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Strengths</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedSubmission.ai_feedback.strengths.map(
                        (strength, index) => (
                          <li key={index} className="text-gray-300">
                            {strength}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Improvements</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {selectedSubmission.ai_feedback.improvements.map(
                        (improvement, index) => (
                          <li key={index} className="text-gray-300">
                            {improvement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </>
            )}
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
