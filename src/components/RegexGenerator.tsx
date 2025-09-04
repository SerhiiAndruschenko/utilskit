"use client";

import { useState } from "react";

interface PatternTemplate {
  name: string;
  description: string;
  pattern: string;
  examples: string[];
  category: string;
}

export default function RegexGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customExamples, setCustomExamples] = useState("");
  const [generatedRegex, setGeneratedRegex] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<PatternTemplate | null>(null);

  const patternTemplates: PatternTemplate[] = [
    // Email patterns
    {
      name: "Email Address",
      description: "Basic email validation pattern",
      pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
      examples: ["user@example.com", "john.doe@company.org", "test+tag@domain.co.uk"],
      category: "Email"
    },
    {
      name: "Strict Email",
      description: "More strict email validation with length limits",
      pattern: "^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\\.[a-zA-Z]{2,}$",
      examples: ["user@example.com", "john.doe@company.org"],
      category: "Email"
    },
    
    // URL patterns
    {
      name: "URL",
      description: "Basic URL validation pattern",
      pattern: "https?://[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*",
      examples: ["https://example.com", "http://subdomain.site.org/path", "https://api.example.com/v1/users"],
      category: "URL"
    },
    {
      name: "Domain Name",
      description: "Domain name validation without protocol",
      pattern: "^[a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*$",
      examples: ["example.com", "subdomain.example.org", "my-site.co.uk"],
      category: "URL"
    },
    
    // Phone patterns
    {
      name: "US Phone Number",
      description: "US phone number with various formats",
      pattern: "\\+?1?[-.\\s]?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})",
      examples: ["(555) 123-4567", "555.123.4567", "555-123-4567", "+1 555 123 4567"],
      category: "Phone"
    },
    {
      name: "International Phone",
      description: "International phone number pattern",
      pattern: "\\+[1-9]\\d{1,14}",
      examples: ["+1234567890", "+44 20 7946 0958", "+81 3-1234-5678"],
      category: "Phone"
    },
    
    // Date patterns
    {
      name: "Date (YYYY-MM-DD)",
      description: "ISO date format validation",
      pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
      examples: ["2024-01-15", "2024-12-31", "2023-02-28"],
      category: "Date"
    },
    {
      name: "Date (MM/DD/YYYY)",
      description: "US date format validation",
      pattern: "^(0[1-9]|1[0-2])/(0[1-9]|[12]\\d|3[01])/\\d{4}$",
      examples: ["01/15/2024", "12/31/2024", "02/28/2023"],
      category: "Date"
    },
    
    // Credit Card patterns
    {
      name: "Credit Card Number",
      description: "Basic credit card number validation",
      pattern: "\\b\\d{4}[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}\\b",
      examples: ["1234 5678 9012 3456", "1234-5678-9012-3456", "1234567890123456"],
      category: "Finance"
    },
    
    // Password patterns
    {
      name: "Strong Password",
      description: "Password with uppercase, lowercase, number, and special character",
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      examples: ["MyP@ssw0rd", "Str0ng#Pass", "C0mpl3x!Pass"],
      category: "Security"
    },
    
    // IP Address patterns
    {
      name: "IPv4 Address",
      description: "IPv4 address validation",
      pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
      examples: ["192.168.1.1", "10.0.0.1", "172.16.0.1"],
      category: "Network"
    },
    
    // File patterns
    {
      name: "File Extension",
      description: "File extension validation",
      pattern: "\\.[a-zA-Z0-9]+$",
      examples: [".txt", ".pdf", ".jpg", ".mp4"],
      category: "File"
    },
    
    // Social Security patterns
    {
      name: "US Social Security",
      description: "US Social Security Number format",
      pattern: "\\b\\d{3}-\\d{2}-\\d{4}\\b",
      examples: ["123-45-6789", "987-65-4321"],
      category: "Government"
    }
  ];

  const categories = ["all", ...Array.from(new Set(patternTemplates.map(t => t.category)))];

  const filteredTemplates = patternTemplates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectTemplate = (template: PatternTemplate) => {
    setSelectedTemplate(template);
    setGeneratedRegex(template.pattern);
  };

  const generateCustomRegex = () => {
    if (!customDescription.trim() && !customExamples.trim()) {
      setGeneratedRegex("");
      return;
    }

    // Simple pattern generation based on examples
    let pattern = "";
    
    if (customExamples.trim()) {
      const examples = customExamples.split('\n').filter(ex => ex.trim());
      if (examples.length > 0) {
        // Try to find common patterns
        const firstExample = examples[0].trim();
        if (firstExample.includes('@') && firstExample.includes('.')) {
          pattern = "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b";
        } else if (firstExample.match(/^\d{4}-\d{2}-\d{2}$/)) {
          pattern = "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$";
        } else if (firstExample.match(/^\d{3}-\d{2}-\d{4}$/)) {
          pattern = "\\b\\d{3}-\\d{2}-\\d{4}\\b";
        } else if (firstExample.match(/^\d{10}$/)) {
          pattern = "\\b\\d{10}\\b";
        } else if (firstExample.match(/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/)) {
          pattern = "^[A-Z]{2}\\d{2}[A-Z0-9]{10,30}$";
        } else {
          // Generic pattern based on character types
          pattern = firstExample.replace(/[a-zA-Z]/g, '[a-zA-Z]')
                               .replace(/\d/g, '\\d')
                               .replace(/[^\w\s]/g, '\\$&');
        }
      }
    }

    setGeneratedRegex(pattern);
  };

  const copyRegex = () => {
    if (generatedRegex) {
      navigator.clipboard.writeText(generatedRegex);
    }
  };

  const clearAll = () => {
    setCustomDescription("");
    setCustomExamples("");
    setGeneratedRegex("");
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Search:</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patterns..."
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pattern Templates */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white text-center">Common Pattern Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, index) => (
            <div
              key={index}
              onClick={() => selectTemplate(template)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedTemplate === template
                  ? "border-blue-500 bg-blue-900/30"
                  : "border-gray-700/50 bg-gray-800/50 hover:border-gray-500/50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">{template.name}</h4>
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{template.description}</p>
                <div className="text-xs text-gray-400">
                  <strong>Examples:</strong>
                  <div className="mt-1 space-y-1">
                    {template.examples.slice(0, 2).map((ex, i) => (
                      <div key={i} className="font-mono bg-gray-700 px-2 py-1 rounded">
                        {ex}
                      </div>
                    ))}
                    {template.examples.length > 2 && (
                      <div className="text-gray-500">+{template.examples.length - 2} more</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Pattern Generation */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white text-center">Custom Pattern Generation</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Description (optional)</label>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe the pattern you need..."
                className="w-full h-24 p-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Examples (one per line)</label>
              <textarea
                value={customExamples}
                onChange={(e) => setCustomExamples(e.target.value)}
                placeholder="Enter examples of what should match..."
                className="w-full h-24 p-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={generateCustomRegex}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Generate Pattern
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Generated Regex</label>
              <div className="relative">
                <textarea
                  value={generatedRegex}
                  readOnly
                  placeholder="Generated regex will appear here..."
                  className="w-full h-24 p-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono resize-none focus:outline-none"
                />
                {generatedRegex && (
                  <button
                    onClick={copyRegex}
                    className="absolute top-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                    title="Copy to clipboard"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {generatedRegex && (
              <div className="space-y-2">
                <label className="block text-white font-medium">Test the Pattern</label>
                <div className="text-sm text-gray-300">
                  <p>Copy this regex and test it in our <a href="/regex-tester" className="text-blue-400 hover:underline">Regex Tester</a> tool!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <button
          onClick={clearAll}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Clear All
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">About Regex Generation</h4>
        <div className="text-emerald-200 text-sm space-y-2">
          <p>
            <strong>Template Library:</strong> Browse through common regex patterns for emails, URLs, dates, phone numbers, and more.
          </p>
          <p>
            <strong>Custom Generation:</strong> Provide examples and descriptions to get AI-generated regex patterns tailored to your needs.
          </p>
          <p>
            <strong>Testing:</strong> Use the generated patterns in our Regex Tester tool to validate and refine them.
          </p>
        </div>
      </div>
    </div>
  );
}
