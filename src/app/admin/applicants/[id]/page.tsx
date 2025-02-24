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
  testResults: {
    status: string;
    startedAt: string;
    completedAt: string;
    details: any[];
  } | null;
  codeReview: {
    finalScore: number;
    overallFeedback: string;
    recommendedAction: string;
    technicalAssessment: {
      testing: {
        score: number;
        feedback: string;
      };
      codeQuality: {
        score: number;
        feedback: string;
      };
      implementation: {
        score: number;
        feedback: string;
      };
      problemSolving: {
        score: number;
        feedback: string;
      };
    };
  } | null;
  timeSpent: string;
  whatsappNumber: string | null;
  applicationStatus: string;
  applicationDate: string | null;
  github_submission: {
    status: string;
    pr_number: number;
    last_updated: string;
  } | null;
  meetingNotes?: string;
  interestLevel?: "interested" | "not_interested" | "undecided";
  lastMeetingDate?: string;
  nextMeetingDate?: string;
  portfolioUrl?: string;
}

export default function ApplicantDetail() {
  const params = useParams();
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [interestLevel, setInterestLevel] = useState<
    "interested" | "not_interested" | "undecided"
  >("undecided");
  const [lastMeetingDate, setLastMeetingDate] = useState("");
  const [nextMeetingDate, setNextMeetingDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApplicantDetail();
  }, [params.id]);

  useEffect(() => {
    if (applicant) {
      setNotes(applicant.meetingNotes || "");
      setInterestLevel(applicant.interestLevel || "undecided");
      setLastMeetingDate(applicant.lastMeetingDate || "");
      setNextMeetingDate(applicant.nextMeetingDate || "");
    }
  }, [applicant]);

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

  async function handleSaveNotes() {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/applications/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingNotes: notes,
          interestLevel,
          lastMeetingDate,
          nextMeetingDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notes");
      }

      setEditingNotes(false);
      await fetchApplicantDetail();
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setSaving(false);
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

            {applicant.github_submission && (
              <div>
                <dt className="text-sm font-medium text-gray-400">
                  Pull Request
                </dt>
                <dd className="mt-1 text-sm text-white">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      applicant.github_submission.status === "passed"
                        ? "bg-green-900 text-green-200"
                        : "bg-yellow-900 text-yellow-200"
                    }`}
                  >
                    PR #{applicant.github_submission.pr_number}
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Test Results */}
        <div className="lg:col-span-2">
          {applicant.testResults && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Test Results
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-900/50 rounded-lg p-4">
                  <p className="text-green-200 text-sm">Status</p>
                  <p className="text-2xl font-bold text-white">
                    {applicant.testResults.status}
                  </p>
                </div>
                <div className="bg-blue-900/50 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">Score</p>
                  <p className="text-2xl font-bold text-white">
                    {applicant.score || "N/A"}
                  </p>
                </div>
              </div>
              {applicant.testResults.details.length > 0 ? (
                <div className="space-y-4">
                  {applicant.testResults.details.map((detail, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-300">
                        {JSON.stringify(detail, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">No test details available</div>
              )}
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
                  Score: {applicant.codeReview.finalScore}%
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-2">
                    Overall Feedback
                  </h3>
                  <p className="text-gray-300">
                    {applicant.codeReview.overallFeedback}
                  </p>
                </div>

                {/* Technical Assessment */}
                <div>
                  <h3 className="text-white font-medium mb-3">
                    Technical Assessment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Code Quality</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {
                            applicant.codeReview.technicalAssessment.codeQuality
                              .score
                          }
                          %
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {
                          applicant.codeReview.technicalAssessment.codeQuality
                            .feedback
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Testing</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {
                            applicant.codeReview.technicalAssessment.testing
                              .score
                          }
                          %
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {
                          applicant.codeReview.technicalAssessment.testing
                            .feedback
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Implementation</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {
                            applicant.codeReview.technicalAssessment
                              .implementation.score
                          }
                          %
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {
                          applicant.codeReview.technicalAssessment
                            .implementation.feedback
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-indigo-300 mb-2">Problem Solving</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Score:</span>
                        <span className="text-white font-medium">
                          {
                            applicant.codeReview.technicalAssessment
                              .problemSolving.score
                          }
                          %
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {
                          applicant.codeReview.technicalAssessment
                            .problemSolving.feedback
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Meeting Notes */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Meeting Notes
              </h2>
              <button
                onClick={() => setEditingNotes(!editingNotes)}
                className="text-indigo-400 hover:text-indigo-300"
              >
                {editingNotes ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingNotes ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Interest Level
                  </label>
                  <select
                    value={interestLevel}
                    onChange={(e) => setInterestLevel(e.target.value as any)}
                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                  >
                    <option value="undecided">Undecided</option>
                    <option value="interested">Interested</option>
                    <option value="not_interested">Not Interested</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Meeting Date
                  </label>
                  <input
                    type="datetime-local"
                    value={lastMeetingDate}
                    onChange={(e) => setLastMeetingDate(e.target.value)}
                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Next Meeting Date
                  </label>
                  <input
                    type="datetime-local"
                    value={nextMeetingDate}
                    onChange={(e) => setNextMeetingDate(e.target.value)}
                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter meeting notes..."
                  />
                </div>

                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Notes"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-400">
                    Interest Level:
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-sm ${
                      applicant.interestLevel === "interested"
                        ? "bg-green-900 text-green-200"
                        : applicant.interestLevel === "not_interested"
                        ? "bg-red-900 text-red-200"
                        : "bg-gray-900 text-gray-200"
                    }`}
                  >
                    {applicant.interestLevel
                      ? applicant.interestLevel.replace("_", " ")
                      : "Undecided"}
                  </span>
                </div>

                {applicant.lastMeetingDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-400">
                      Last Meeting:
                    </span>
                    <span className="ml-2 text-white">
                      {new Date(applicant.lastMeetingDate).toLocaleString()}
                    </span>
                  </div>
                )}

                {applicant.nextMeetingDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-400">
                      Next Meeting:
                    </span>
                    <span className="ml-2 text-white">
                      {new Date(applicant.nextMeetingDate).toLocaleString()}
                    </span>
                  </div>
                )}

                <div>
                  <span className="block text-sm font-medium text-gray-400 mb-2">
                    Notes:
                  </span>
                  <p className="text-white whitespace-pre-wrap">
                    {applicant.meetingNotes || "No meeting notes yet."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
