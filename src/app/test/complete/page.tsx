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

        <h1 className="text-3xl font-bold mb-4">
          Test Submitted Successfully!
        </h1>

        <div className="bg-indigo-900 border border-indigo-700 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-bold text-indigo-300 mb-3">
            🚀 Next Step for Immediate Review
          </h2>
          <p className="text-gray-200 mb-4">
            To expedite your application process, please send a text message to:
          </p>
          <div className="bg-indigo-800 rounded-lg p-4 mb-4 text-center">
            <p className="text-2xl font-mono text-white">+1 (214) 476-6832</p>
          </div>
          <p className="text-gray-200 mb-2">
            Include the following information:
          </p>
          <ul className="list-disc list-inside text-gray-200 space-y-2 ml-4">
            <li>Your full name</li>
            <li>Confirmation of test completion</li>
            <li>The position you applied for</li>
          </ul>
          <p className="mt-4 text-indigo-300 font-semibold">
            This will trigger an immediate review by our Solution Architect for
            a speedy interview session.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                1
              </span>
              <span>
                Our AI system will analyze your responses and provide an initial
                assessment.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                2
              </span>
              <span>
                After you send the text message, our Solution Architect will
                review your submission.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-1">
                3
              </span>
              <span>
                You will receive a response within 24 hours to schedule your
                interview.
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
