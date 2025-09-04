import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UtilsKit - Essential Developer Tools Collection | Free & No Limits",
  description:
    "A comprehensive collection of essential developer tools including JSON formatters, regex testers, encoders, web generators, and more. All tools work locally in your browser.",
  keywords:
    "utilskit, developer tools, json formatter, json diff, yaml json, csv json, json schema validator, json to typescript, regex tester, regex generator, html formatter, css formatter, js formatter, diff tool, base64 encoder, url encoder, jwt decoder, og meta generator, manifest generator, robots generator, unix time, cron parser, semver, curl to code, docx to html",
  openGraph: {
    title: "UtilsKit - Essential Developer Tools Collection",
    description:
      "A comprehensive collection of essential developer tools including JSON formatters, regex testers, encoders, web generators, and more.",
    url: "https://utilskit.com",
    type: "website",
    siteName: "UtilsKit",
  },
  twitter: {
    card: "summary_large_image",
    title: "UtilsKit - Essential Developer Tools Collection",
    description:
      "A comprehensive collection of essential developer tools including JSON formatters, regex testers, encoders, web generators, and more.",
  },
  alternates: {
    canonical: "https://utilskit.com",
  },
};

export default function Home() {
  const tools = [
    // JSON Tools
    {
      title: "JSON Formatter",
      description: "Format and beautify JSON with syntax highlighting and validation",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      href: "/json-formatter",
      gradient: "from-blue-600 to-purple-600",
      hoverGradient: "from-blue-700 to-purple-700",
      category: "JSON"
    },
    {
      title: "JSON Diff",
      description: "Compare two JSON objects and highlight differences",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: "/json-diff",
      gradient: "from-green-600 to-teal-600",
      hoverGradient: "from-green-700 to-teal-700",
      category: "JSON"
    },
    {
      title: "YAML ↔ JSON",
      description: "Convert between YAML and JSON formats seamlessly",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      href: "/yaml-json",
      gradient: "from-orange-600 to-amber-600",
      hoverGradient: "from-orange-700 to-amber-700",
      category: "JSON"
    },
    {
      title: "CSV ↔ JSON",
      description: "Convert CSV data to JSON and vice versa",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: "/csv-json",
      gradient: "from-red-600 to-pink-600",
      hoverGradient: "from-red-700 to-pink-700",
      category: "JSON"
    },
    {
      title: "JSON Schema Validator",
      description: "Validate JSON against JSON Schema specifications",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/json-schema-validator",
      gradient: "from-indigo-600 to-blue-600",
      hoverGradient: "from-indigo-700 to-blue-700",
      category: "JSON"
    },
    {
      title: "JSON to TypeScript",
      description: "Generate TypeScript interfaces from JSON data",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      href: "/json-to-typescript",
      gradient: "from-purple-600 to-violet-600",
      hoverGradient: "from-purple-700 to-violet-700",
      category: "JSON"
    },
    
    // Text/Code Tools
    {
      title: "Regex Tester",
      description: "Test and debug regular expressions with real-time matching",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      href: "/regex-tester",
      gradient: "from-cyan-600 to-blue-600",
      hoverGradient: "from-cyan-700 to-blue-700",
      category: "Text/Code"
    },
    {
      title: "Regex Generator",
      description: "Generate regular expressions from examples and descriptions",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      href: "/regex-generator",
      gradient: "from-emerald-600 to-green-600",
      hoverGradient: "from-emerald-700 to-green-700",
      category: "Text/Code"
    },
    {
      title: "Code Formatter",
      description: "Format HTML, CSS, and JavaScript code with proper indentation",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      href: "/code-formatter",
      gradient: "from-yellow-600 to-orange-600",
      hoverGradient: "from-yellow-700 to-orange-700",
      category: "Text/Code"
    },
    {
      title: "Diff Tool",
      description: "Compare text files and highlight differences line by line",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      href: "/diff-tool",
      gradient: "from-gray-600 to-slate-600",
      hoverGradient: "from-gray-700 to-slate-700",
      category: "Text/Code"
    },
    
    // Encoders
    {
      title: "Base64 Encoder",
      description: "Encode and decode Base64 strings and files",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      href: "/base64-encoder",
      gradient: "from-blue-600 to-indigo-600",
      hoverGradient: "from-blue-700 to-indigo-700",
      category: "Encoders"
    },
    {
      title: "URL Encoder",
      description: "Encode and decode URL parameters and special characters",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      href: "/url-encoder",
      gradient: "from-green-600 to-emerald-600",
      hoverGradient: "from-green-700 to-emerald-700",
      category: "Encoders"
    },
    {
      title: "JWT Decoder",
      description: "Decode and inspect JWT tokens with header and payload details",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/jwt-decoder",
      gradient: "from-purple-600 to-violet-600",
      hoverGradient: "from-purple-700 to-violet-700",
      category: "Encoders"
    },
    
    // Web/SEO Tools
    {
      title: "OG Meta Generator",
      description: "Generate Open Graph meta tags for social media sharing",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
        </svg>
      ),
      href: "/og-meta-generator",
      gradient: "from-pink-600 to-rose-600",
      hoverGradient: "from-pink-700 to-rose-700",
      category: "Web/SEO"
    },
    {
      title: "Manifest Generator",
      description: "Create PWA manifest files for web applications",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: "/manifest-generator",
      gradient: "from-indigo-600 to-purple-600",
      hoverGradient: "from-indigo-700 to-purple-700",
      category: "Web/SEO"
    },
    {
      title: "Robots Generator",
      description: "Generate robots.txt files for search engine crawling",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: "/robots-generator",
      gradient: "from-cyan-600 to-blue-600",
      hoverGradient: "from-cyan-700 to-blue-700",
      category: "Web/SEO"
    },
    
    // Time/Cron/Semver Tools
    {
      title: "Unix Time Converter",
      description: "Convert between Unix timestamps and human-readable dates",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/unix-time",
      gradient: "from-orange-600 to-red-600",
      hoverGradient: "from-orange-700 to-red-700",
      category: "Time/Cron/Semver"
    },
    {
      title: "Cron Parser",
      description: "Parse and validate cron expressions with human-readable output",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/cron-parser",
      gradient: "from-teal-600 to-green-600",
      hoverGradient: "from-teal-700 to-green-700",
      category: "Time/Cron/Semver"
    },
    {
      title: "Semver Checker",
      description: "Validate and compare semantic version numbers",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/semver",
      gradient: "from-violet-600 to-purple-600",
      hoverGradient: "from-violet-700 to-purple-700",
      category: "Time/Cron/Semver"
    },
    
    // Special Tools
    {
      title: "cURL to Code",
      description: "Convert cURL commands to various programming languages",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      href: "/curl-to-code",
      gradient: "from-rose-600 to-pink-600",
      hoverGradient: "from-rose-700 to-pink-700",
      category: "Special"
    },
    {
      title: "DOCX to HTML",
      description: "Convert Word documents to clean HTML markup",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: "/docx-to-html",
      gradient: "from-blue-600 to-cyan-600",
      hoverGradient: "from-blue-700 to-cyan-700",
      category: "Special"
    },
  ];

  const categories = ["JSON", "Text/Code", "Encoders", "Web/SEO", "Time/Cron/Semver", "Special"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="max-w-6xl mx-auto p-6 pb-12 space-y-12">
        {/* UtilsKit Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl mb-8 glow">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            UtilsKit
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Essential developer tools that work locally in your browser - no server limits, 
            complete privacy. Boost your productivity with our comprehensive collection of dev tools.
          </p>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => (
          <div key={category} className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">
              {category} Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter((tool) => tool.category === category)
                .map((tool, index) => (
                  <Link key={index} href={tool.href} className="group">
                    <div
                      className={`relative h-full p-6 rounded-2xl border-2 border-gray-700/50 bg-gray-800/80 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group-hover:border-gray-500/50`}
                    >
                      {/* Background glow effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                      ></div>

                      <div className="relative z-10 space-y-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <div className="text-white">{tool.icon}</div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                          <span className="text-xs font-medium">Try Tool</span>
                          <svg
                            className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}

        {/* UtilsKit Features Section */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-700/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Choose UtilsKit?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">100% Private</h3>
              <p className="text-gray-300">
                All tools work locally in your browser. Your data never leaves your device.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">No Limits</h3>
              <p className="text-gray-300">
                Use all tools without restrictions. No file size limits or usage quotas.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-xl font-semibold text-white">Developer Focused</h3>
              <p className="text-gray-300">
                Built by developers for developers. Essential tools you use every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
