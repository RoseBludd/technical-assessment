"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ApplicantDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  submittedAt: string;
  score: number | null;
  prUrl: string | null;
  testResults: {
    passed: number;
    failed: number;
    details: Array<{
      name: string;
      status: "passed" | "failed";
      message?: string;
      githubUrl?: string;
      prUrl?: string;
      timeSpent?: string;
    }>;
  } | null;
  codeReview: {
    summary: string;
    strengths: string[];
    improvements: string[];
    score: number;
    technicalAssessment?: {
      architecture?: {
        score: number;
        feedback: string;
      };
      codeQuality?: {
        score: number;
        feedback: string;
      };
      testing?: {
        score: number;
        feedback: string;
      };
      performance?: {
        score: number;
        feedback: string;
      };
    };
    productionReadiness?: {
      security: number;
      reliability: number;
      maintainability: number;
      scalability: number;
    };
  } | null;
  timeSpent: string;
  whatsappNumber: string | null;
  applicationStatus: string;
  applicationDate: string | null;
  portfolioUrl?: string;
}

export default function ApplicantDetail() {
  const params = useParams();
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicantDetail();
  }, [params.id]);

  async function fetchApplicantDetail() {
    try {
      const response = await fetch(`/api/admin/applicants/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch applicant details");
      }
      const data = await response.json();
      setApplicant(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="space-y-4">
        <div className="bg-red-900 text-red-200 p-4 rounded-lg">
          {error || "Applicant not found"}
        </div>
        <Link
          href="/admin/applicants"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
        >
          <span className="mr-2">←</span>
          Back to Applicants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Link
            href="/admin/applicants"
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
          >
            <span className="mr-2">←</span>
            Back to Applicants
          </Link>
          <h1 className="text-3xl font-bold text-white">{applicant.name}</h1>
          <p className="text-gray-400">{applicant.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              applicant.status === "passed"
                ? "bg-green-900 text-green-200"
                : applicant.status === "failed"
                ? "bg-red-900 text-red-200"
                : "bg-yellow-900 text-yellow-200"
            }`}
          >
            {applicant.status}
          </span>
          {applicant.score !== null && (
            <span className="text-white font-semibold">
              Score: {applicant.score}%
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Basic Information
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-400">Role</dt>
              <dd className="mt-1 text-sm text-white">{applicant.role}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-400">Submitted</dt>
              <dd className="mt-1 text-sm text-white">
                {new Date(applicant.submittedAt).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-400">Time Spent</dt>
              <dd className="mt-1 text-sm text-white">{applicant.timeSpent}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-400">WhatsApp</dt>
              <dd className="mt-1 text-sm text-white">
                {applicant.whatsappNumber}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-400">
                Application Date
              </dt>
              <dd className="mt-1 text-sm text-white">
                {new Date(applicant.applicationDate || "").toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-400">Portfolio</dt>
              <dd className="mt-1 text-sm text-white">
                {applicant.portfolioUrl ? (
                  <a
                    href={applicant.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    View Portfolio →
                  </a>
                ) : (
                  "Not provided"
                )}
              </dd>
            </div>

            {applicant.prUrl && (
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Pull Request
                </dt>
                <dd className="mt-1 text-sm text-white">
                  <a
                    href={applicant.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    View on GitHub →
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Test Results */}
        <div className="lg:col-span-2">
          {applicant.testResults ? (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Test Results
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-900/50 rounded-lg p-4">
                  <p className="text-green-200 text-sm">Passed</p>
                  <p className="text-2xl font-bold text-white">
                    {applicant.testResults.passed}
                  </p>
                </div>
                <div className="bg-red-900/50 rounded-lg p-4">
                  <p className="text-red-200 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-white">
                    {applicant.testResults.failed}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {Array.isArray(applicant.testResults?.details) ? (
                  applicant.testResults.details.map((test, index) => {
                    // Check if this is a project submission
                    const isProjectSubmission =
                      test.message &&
                      test.message.includes("Project submission");

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          test.status === "passed"
                            ? "bg-green-900/20"
                            : "bg-red-900/20"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-medium">
                            {test.name}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              test.status === "passed"
                                ? "bg-green-900 text-green-200"
                                : "bg-red-900 text-red-200"
                            }`}
                          >
                            {test.status}
                          </span>
                        </div>
                        {isProjectSubmission ? (
                          <div className="mt-4 space-y-4">
                            <div className="bg-gray-700/50 p-4 rounded-lg">
                              <h4 className="text-indigo-300 mb-2">
                                Project Implementation
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-gray-400">
                                    GitHub Repository:
                                  </span>
                                  <a
                                    href={test.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-indigo-400 hover:text-indigo-300"
                                  >
                                    View Code →
                                  </a>
                                </div>
                                <div>
                                  <span className="text-gray-400">
                                    Pull Request:
                                  </span>
                                  <a
                                    href={test.prUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-indigo-400 hover:text-indigo-300"
                                  >
                                    View Changes →
                                  </a>
                                </div>
                                <div>
                                  <span className="text-gray-400">
                                    Time Spent:
                                  </span>
                                  <span className="ml-2 text-white">
                                    {test.timeSpent}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          test.message && (
                            <p className="text-sm text-gray-300">
                              {test.message}
                            </p>
                          )
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400">No test details available</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">No test results available</p>
            </div>
          )}

          {/* Code Review */}
          {applicant.codeReview && (
            <div className="bg-gray-800 rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Code Review
                </h2>
                <span className="text-white font-semibold">
                  Score: {applicant.codeReview?.score || 0}%
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-2">Summary</h3>
                  <p className="text-gray-300">
                    {applicant.codeReview?.summary || "No summary available"}
                  </p>
                </div>

                {/* Technical Assessment */}
                <div>
                  <h3 className="text-white font-medium mb-3">
                    Technical Assessment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Architecture</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {applicant.codeReview?.technicalAssessment
                            ?.architecture?.score || 0}
                          /5
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {applicant.codeReview?.technicalAssessment?.architecture
                          ?.feedback || "No feedback available"}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Code Quality</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {applicant.codeReview?.technicalAssessment
                            ?.codeQuality?.score || 0}
                          /5
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {applicant.codeReview?.technicalAssessment?.codeQuality
                          ?.feedback || "No feedback available"}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Testing</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {applicant.codeReview?.technicalAssessment?.testing
                            ?.score || 0}
                          /5
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {applicant.codeReview?.technicalAssessment?.testing
                          ?.feedback || "No feedback available"}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Performance</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {applicant.codeReview?.technicalAssessment
                            ?.performance?.score || 0}
                          /5
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {applicant.codeReview?.technicalAssessment?.performance
                          ?.feedback || "No feedback available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Production Readiness */}
                <div>
                  <h3 className="text-white font-medium mb-3">
                    Production Readiness
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <h4 className="text-indigo-300 mb-2">Security</h4>
                      <span className="text-2xl font-bold text-white">
                        {applicant.codeReview?.productionReadiness?.security ||
                          0}
                        /5
                      </span>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <h4 className="text-indigo-300 mb-2">Reliability</h4>
                      <span className="text-2xl font-bold text-white">
                        {applicant.codeReview?.productionReadiness
                          ?.reliability || 0}
                        /5
                      </span>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <h4 className="text-indigo-300 mb-2">Maintainability</h4>
                      <span className="text-2xl font-bold text-white">
                        {applicant.codeReview?.productionReadiness
                          ?.maintainability || 0}
                        /5
                      </span>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <h4 className="text-indigo-300 mb-2">Scalability</h4>
                      <span className="text-2xl font-bold text-white">
                        {applicant.codeReview?.productionReadiness
                          ?.scalability || 0}
                        /5
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-2">Strengths</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {applicant.codeReview?.strengths?.map((strength, index) => (
                      <li key={index} className="text-gray-300">
                        {strength}
                      </li>
                    )) || (
                      <li className="text-gray-400">No strengths listed</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">
                    Areas for Improvement
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {applicant.codeReview?.improvements?.map(
                      (improvement, index) => (
                        <li key={index} className="text-gray-300">
                          {improvement}
                        </li>
                      )
                    ) || (
                      <li className="text-gray-400">No improvements listed</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
