import type { Metadata } from "next";
import DocxToHtml from "@/components/DocxToHtml";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DOCX to HTML - UtilsKit",
  description: "Convert Word documents to clean HTML markup",
};

export default function DocxToHtmlPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="max-w-6xl mx-auto p-6 pb-12 space-y-8">
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
          <div className="flex items-center mx-auto justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl mb-6 glow">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            DOCX to HTML
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert Word documents to clean HTML markup with formatting
            preservation
          </p>
        </div>
        <DocxToHtml />
      </div>
    </div>
  );
}
