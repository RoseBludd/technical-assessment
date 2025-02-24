"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TestCompletePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 30 seconds
    const timeout = setTimeout(() => {
      router.push("/");
    }, 30000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 text-center text-white"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500 flex items-center justify-center"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Application Received!</h1>

        <div className="bg-indigo-900 border border-indigo-700 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-bold text-indigo-300 mb-3">
            🚀 Next Step: Technical Assessment
          </h2>
          <p className="text-gray-200 mb-4">
            Please complete our technical assessment to showcase your skills:
          </p>
          <div className="bg-indigo-800 rounded-lg p-4 mb-4">
            <p className="text-lg font-mono text-white break-all">
              https://github.com/restoremasters/dev-assessment
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-indigo-300 font-semibold mb-2">
                Instructions:
              </h3>
              <ol className="list-decimal list-inside text-gray-200 space-y-2 ml-4">
                <li>Fork the repository to your GitHub account</li>
                <li>Clone your fork and create a new branch</li>
                <li>Complete the assessment tasks for your role</li>
                <li>Submit via Pull Request when ready</li>
              </ol>
            </div>
            <div>
              <h3 className="text-indigo-300 font-semibold mb-2">
                Important Notes:
              </h3>
              <ul className="list-disc list-inside text-gray-200 space-y-2 ml-4">
                <li>Take your time - there's no strict deadline</li>
                <li>Focus on code quality and documentation</li>
                <li>Use AI tools as you would in real work</li>
                <li>Ask questions if anything is unclear</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                1
              </span>
              <span>Complete the technical assessment at your own pace</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                2
              </span>
              <span>Our AI system will analyze your submission</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                3
              </span>
              <span>A senior developer will review your code</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                4
              </span>
              <span>
                We'll schedule a technical discussion about your solution
              </span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-400">
          You will be redirected to the home page in 30 seconds...
        </p>
      </motion.div>
    </div>
  );
}
