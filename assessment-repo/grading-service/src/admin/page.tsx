"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Submission {
  id: string;
  candidateEmail: string;
  role: string;
  status: string;
  score: number | null;
  createdAt: string;
  testResults: {
    details: {
      passed: boolean;
      output: string;
    };
  };
  aiFeedback: {
    overall_score: number;
    categories: {
      code_quality: number;
      best_practices: number;
      error_handling: number;
      documentation: number;
      architecture: number;
    };
    feedback: {
      strengths: string[];
      improvements: string[];
      critical_issues: string[];
    };
  };
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const response = await fetch("/api/admin/submissions");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Assessment Submissions</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id
                        ? "bg-indigo-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {submission.candidateEmail}
                        </p>
                        <p className="text-sm text-gray-300">
                          {submission.role}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-sm ${
                          submission.score && submission.score >= 70
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {submission.score ?? "N/A"}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {format(
                        new Date(submission.createdAt),
                        "MMM d, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Submission Details</h2>
                  <p className="text-gray-300">
                    {selectedSubmission.candidateEmail}
                  </p>
                  <p className="text-indigo-400">{selectedSubmission.role}</p>
                </div>

                {/* Test Results */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Test Results</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Status</span>
                      <span
                        className={`px-2 py-1 rounded ${
                          selectedSubmission.testResults.details.passed
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {selectedSubmission.testResults.details.passed
                          ? "Passed"
                          : "Failed"}
                      </span>
                    </div>
                    <pre className="mt-4 p-4 bg-gray-900 rounded overflow-auto">
                      {selectedSubmission.testResults.details.output}
                    </pre>
                  </div>
                </div>

                {/* AI Feedback */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">AI Review</h3>
                  <div className="space-y-4">
                    {/* Categories */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(
                        selectedSubmission.aiFeedback.categories
                      ).map(([category, score]) => (
                        <div
                          key={category}
                          className="bg-gray-700 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center">
                            <span className="capitalize">
                              {category.replace("_", " ")}
                            </span>
                            <span
                              className={`px-2 py-1 rounded ${
                                score >= 70 ? "bg-green-600" : "bg-red-600"
                              }`}
                            >
                              {score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Feedback Sections */}
                    <div className="space-y-4">
                      <div className="bg-green-900/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Strengths</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedSubmission.aiFeedback.feedback.strengths.map(
                            (strength, i) => (
                              <li key={i}>{strength}</li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="bg-yellow-900/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">
                          Areas for Improvement
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedSubmission.aiFeedback.feedback.improvements.map(
                            (improvement, i) => (
                              <li key={i}>{improvement}</li>
                            )
                          )}
                        </ul>
                      </div>

                      {selectedSubmission.aiFeedback.feedback.critical_issues
                        .length > 0 && (
                        <div className="bg-red-900/50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">
                            Critical Issues
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedSubmission.aiFeedback.feedback.critical_issues.map(
                              (issue, i) => (
                                <li key={i}>{issue}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center h-full">
                <p className="text-gray-400">
                  Select a submission to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
