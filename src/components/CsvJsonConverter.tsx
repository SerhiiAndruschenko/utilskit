"use client";

import { useState } from "react";

export default function CsvJsonConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [inputFormat, setInputFormat] = useState<"csv" | "json">("csv");
  const [outputFormat, setOutputFormat] = useState<"json" | "csv">("json");
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");

  const convert = () => {
    try {
      setError("");
      
      if (inputFormat === "csv") {
        // Convert CSV to JSON
        const lines = input.trim().split('\n');
        if (lines.length === 0) {
          throw new Error("Empty CSV input");
        }

        let headers: string[] = [];
        let data: any[] = [];

        if (hasHeader) {
          headers = lines[0].split(delimiter).map(h => h.trim());
          data = lines.slice(1).map(line => {
            const values = line.split(delimiter).map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || "";
            });
            return obj;
          });
        } else {
          // Generate generic headers
          const firstLine = lines[0].split(delimiter);
          headers = firstLine.map((_, index) => `column${index + 1}`);
          data = lines.map(line => {
            const values = line.split(delimiter).map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || "";
            });
            return obj;
          });
        }

        setOutput(JSON.stringify(data, null, 2));
      } else {
        // Convert JSON to CSV
        const data = JSON.parse(input);
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("JSON must be a non-empty array of objects");
        }

        const headers = Object.keys(data[0]);
        let csv = "";

        if (hasHeader) {
          csv += headers.join(delimiter) + '\n';
        }

        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            // Handle values that contain the delimiter
            if (typeof value === 'string' && value.includes(delimiter)) {
              return `"${value}"`;
            }
            return value || "";
          });
          csv += values.join(delimiter) + '\n';
        });

        setOutput(csv.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setOutput("");
    }
  };

  const swapFormats = () => {
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
    setInput(output);
    setOutput("");
    setError("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadSample = () => {
    if (inputFormat === "csv") {
      const sampleCsv = `name,age,email,city
John Doe,30,john@example.com,New York
Jane Smith,25,jane@example.com,Los Angeles
Bob Johnson,35,bob@example.com,Chicago
Alice Brown,28,alice@example.com,Boston`;

      setInput(sampleCsv);
    } else {
      const sampleJson = `[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "city": "New York"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com",
    "city": "Los Angeles"
  },
  {
    "name": "Bob Johnson",
    "age": 35,
    "email": "bob@example.com",
    "city": "Chicago"
  }
]`;

      setInput(sampleJson);
    }
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Input:</span>
          <select
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value as "csv" | "json")}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <button
          onClick={swapFormats}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Output:</span>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as "json" | "csv")}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasHeader"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="hasHeader" className="text-white font-medium">
            Has Header Row
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Delimiter:</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={convert}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Convert {inputFormat.toUpperCase()} to {outputFormat.toUpperCase()}
        </button>
        <button
          onClick={loadSample}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Load Sample
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Clear All
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Input {inputFormat.toUpperCase()}
            </h3>
            <span className="text-sm text-gray-400">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${inputFormat.toUpperCase()} here...`}
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Output {outputFormat.toUpperCase()}
            </h3>
            <span className="text-sm text-gray-400">
              {output.length} characters
            </span>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={`Converted ${outputFormat.toUpperCase()} will appear here...`}
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Copy Button */}
      {output && (
        <div className="flex justify-center">
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy to Clipboard</span>
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-green-400 mb-3">About {inputFormat.toUpperCase()} ↔ {outputFormat.toUpperCase()} Conversion</h4>
        <div className="text-green-200 text-sm space-y-2">
          <p>
            <strong>CSV to JSON:</strong> Converts CSV data to JSON array format. Each row becomes an object with column headers as keys.
          </p>
          <p>
            <strong>JSON to CSV:</strong> Converts JSON array of objects to CSV format. Object keys become column headers.
          </p>
          <p>
            <strong>Features:</strong> Supports custom delimiters, header row options, and handles special characters in CSV values.
          </p>
        </div>
      </div>
    </div>
  );
}
