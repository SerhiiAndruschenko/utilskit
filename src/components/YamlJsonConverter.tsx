"use client";

import { useState } from "react";

export default function YamlJsonConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [inputFormat, setInputFormat] = useState<"yaml" | "json">("yaml");
  const [outputFormat, setOutputFormat] = useState<"yaml" | "json">("json");

  const convert = () => {
    try {
      setError("");
      
      if (inputFormat === "yaml") {
        // Convert YAML to JSON
        const yaml = require('js-yaml');
        const obj = yaml.load(input);
        const json = JSON.stringify(obj, null, 2);
        setOutput(json);
      } else {
        // Convert JSON to YAML
        const yaml = require('js-yaml');
        const obj = JSON.parse(input);
        const yamlOutput = yaml.dump(obj, { 
          indent: 2,
          lineWidth: -1,
          noRefs: true
        });
        setOutput(yamlOutput);
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
    if (inputFormat === "yaml") {
      const sampleYaml = `# User configuration
user:
  name: John Doe
  age: 30
  email: john@example.com
  
  address:
    street: 123 Main St
    city: New York
    country: USA
  
  hobbies:
    - reading
    - swimming
    - coding
  
  settings:
    theme: dark
    notifications: true
    language: en`;

      setInput(sampleYaml);
    } else {
      const sampleJson = `{
  "user": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "country": "USA"
    },
    "hobbies": [
      "reading",
      "swimming",
      "coding"
    ],
    "settings": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    }
  }
}`;

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
            onChange={(e) => setInputFormat(e.target.value as "yaml" | "json")}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="yaml">YAML</option>
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
            onChange={(e) => setOutputFormat(e.target.value as "yaml" | "json")}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
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
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">About {inputFormat.toUpperCase()} ↔ {outputFormat.toUpperCase()} Conversion</h4>
        <div className="text-blue-200 text-sm space-y-2">
          <p>
            <strong>YAML to JSON:</strong> Converts YAML documents to JSON format with proper structure preservation.
          </p>
          <p>
            <strong>JSON to YAML:</strong> Converts JSON objects to YAML format with clean, readable indentation.
          </p>
          <p>
            <strong>Features:</strong> Handles nested objects, arrays, and primitive types. Supports comments in YAML (converted to JSON without comments).
          </p>
        </div>
      </div>
    </div>
  );
}
