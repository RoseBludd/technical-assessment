"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Welcome to RestoreMasters Developer Portal
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join our team of skilled developers and be part of building innovative solutions
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/application"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Apply Now
                </Link>
                <Link
                  href="/auth/signin"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-lg text-gray-300 border-2 border-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">Flexible Work</h3>
              <p className="text-gray-300">Work remotely with flexible hours and competitive compensation</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
              <p className="text-gray-300">Work with cutting-edge technologies and contribute to meaningful projects</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">Growth</h3>
              <p className="text-gray-300">Continuous learning opportunities and career advancement</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
