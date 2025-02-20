"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    questionScores: Array<{
      questionId: string;
      score: number;
      feedback: string;
    }>;
  };
}

export default function TestResultsPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/admin/test-results");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Test Results Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results List */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Recent Submissions
          </h2>
          <div className="space-y-4">
            {results.map((result) => (
              <motion.div
                key={result.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedResult?.id === result.id
                    ? "bg-indigo-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">
                      {result.developer.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {result.developer.role}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-sm ${
                      result.score >= 70 ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {result.score}%
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Completed:{" "}
                  {new Date(result.completed_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2">
          {selectedResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedResult.developer.name}
                  </h2>
                  <p className="text-gray-300">
                    {selectedResult.developer.email}
                  </p>
                  <p className="text-indigo-400">{selectedResult.test.title}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                    selectedResult.score >= 70 ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  Score: {selectedResult.score}%
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Overall Feedback
                </h3>
                <p className="bg-gray-700 rounded-lg p-4 text-gray-300">
                  {selectedResult.ai_feedback.overallFeedback}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Question Breakdown
                </h3>
                <div className="space-y-4">
                  {selectedResult.ai_feedback.questionScores.map(
                    (question, index) => (
                      <div
                        key={question.questionId}
                        className="bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-white">
                            Question {index + 1}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded ${
                              question.score >= 70
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {question.score}%
                          </span>
                        </div>
                        <p className="text-gray-300">{question.feedback}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
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
  );
}
