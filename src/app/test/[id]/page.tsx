"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Question {
  id: string;
  question: string;
  type: "multiple_choice" | "coding" | "text";
  options?: string[];
  correctAnswer?: string;
}

interface Test {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/tests/${params.id}`);
        const data = await response.json();
        setTest(data);
        setTimeRemaining(data.timeLimit);
      } catch (error) {
        console.error("Failed to fetch test:", error);
      }
    };

    fetchTest();
  }, [params.id]);

  useEffect(() => {
    if (!timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tests/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: params.id,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit test");
      }

      router.push("/test/complete");
    } catch (error) {
      console.error("Error submitting test:", error);
      setIsSubmitting(false);
    }
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const currentQuestionData = test.questions[currentQuestion];
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{test.title}</h1>
          {timeRemaining !== null && (
            <div className="text-xl font-mono">
              Time remaining: {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl mb-4">
              Question {currentQuestion + 1} of {test.questions.length}
            </h2>
            <p className="text-lg mb-6">{currentQuestionData.question}</p>

            {currentQuestionData.type === "multiple_choice" && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionData.id}`}
                      value={option}
                      checked={answers[currentQuestionData.id] === option}
                      onChange={(e) =>
                        handleAnswer(currentQuestionData.id, e.target.value)
                      }
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestionData.type === "coding" && (
              <textarea
                value={answers[currentQuestionData.id] || ""}
                onChange={(e) =>
                  handleAnswer(currentQuestionData.id, e.target.value)
                }
                className="w-full h-48 bg-gray-900 text-white p-4 rounded-lg font-mono"
                placeholder="Write your code here..."
              />
            )}

            {currentQuestionData.type === "text" && (
              <textarea
                value={answers[currentQuestionData.id] || ""}
                onChange={(e) =>
                  handleAnswer(currentQuestionData.id, e.target.value)
                }
                className="w-full h-32 bg-gray-900 text-white p-4 rounded-lg"
                placeholder="Write your answer here..."
              />
            )}
          </motion.div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>

          {currentQuestion < test.questions.length - 1 ? (
            <button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(test.questions.length - 1, prev + 1)
                )
              }
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
