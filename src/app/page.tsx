"use client";

import Image from "next/image";
import ApplicationForm from "./components/ApplicationForm";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="relative w-[300px] h-[60px] flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src="/rm-logo-no-outline.png"
                  alt="RestoreMasters Logo"
                  fill
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 shadow-xl rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium leading-6 text-white mb-4">
              Developer Application
            </h2>
            <p className="text-sm text-gray-300 mb-8">
              Please fill out the form below to apply for a developer position.
            </p>
            <ApplicationForm />
          </div>
        </div>
      </div>
    </main>
  );
}
