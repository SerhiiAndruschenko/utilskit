import type { Metadata } from "next";
import JsonSchemaValidator from "../../components/JsonSchemaValidator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JSON Schema Validator - UtilsKit",
  description: "Validate JSON against JSON Schema specifications",
};

export default function JsonSchemaValidatorPage() {
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-2xl mb-6 glow">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            JSON Schema Validator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Validate JSON data against JSON Schema with detailed error reporting
            and validation results
          </p>
        </div>
        <JsonSchemaValidator />
      </div>
    </div>
  );
}
