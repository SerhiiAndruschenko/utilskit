import type { Metadata } from "next";
import RobotsGenerator from "@/components/RobotsGenerator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Robots Generator - UtilsKit",
  description: "Generate robots.txt files for search engine crawling",
};

export default function RobotsGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="max-w-6xl mx-auto p-6 pb-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <Link
              href="/"
              className="absolute left-0 top-0  p-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-xl transition-colors duration-200 backdrop-blur-sm border border-gray-700/50"
            >
              <svg
                className="w-5 h-5 text-gray-300 hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-2xl mb-6 glow">
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
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Robots Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate robots.txt files for search engine crawling with
            customizable rules and directives
          </p>
        </div>
        <RobotsGenerator />
      </div>
    </div>
  );
}
