"use client";

import { useState } from "react";

interface TypeScriptOptions {
  interfaceName: string;
  useInterfaces: boolean;
  useTypes: boolean;
  optionalProperties: boolean;
  strictNullChecks: boolean;
  generateComments: boolean;
}

export default function JsonToTypeScript() {
  const [jsonInput, setJsonInput] = useState("");
  const [typescriptOutput, setTypescriptOutput] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState<TypeScriptOptions>({
    interfaceName: "GeneratedType",
    useInterfaces: true,
    useTypes: false,
    optionalProperties: false,
    strictNullChecks: true,
    generateComments: true
  });

  const generateTypeScript = () => {
    try {
      setError("");
      const data = JSON.parse(jsonInput);
      const output = generateTypeScriptFromJson(data, options);
      setTypescriptOutput(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate TypeScript");
      setTypescriptOutput("");
    }
  };

  const generateTypeScriptFromJson = (data: any, opts: TypeScriptOptions): string => {
    let output = "";
    
    if (opts.generateComments) {
      output += `// Generated TypeScript ${opts.useInterfaces ? 'interface' : 'type'} from JSON data\n`;
      output += `// Generated on: ${new Date().toISOString()}\n\n`;
    }

    if (opts.useInterfaces) {
      output += `interface ${opts.interfaceName} {\n`;
    } else {
      output += `type ${opts.interfaceName} = {\n`;
    }

    const properties = generateProperties(data, opts);
    output += properties;
    
    if (opts.useInterfaces) {
      output += `}\n`;
    } else {
      output += `};\n`;
    }

    return output;
  };

  const generateProperties = (data: any, opts: TypeScriptOptions, indent = "  "): string => {
    if (typeof data !== "object" || data === null) {
      return "";
    }

    let output = "";
    const entries = Object.entries(data);

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      const isLast = i === entries.length - 1;
      
      // Generate property name
      const propertyName = isValidPropertyName(key) ? key : `"${key}"`;
      
      // Generate property type
      const propertyType = generatePropertyType(value, opts, indent + "  ");
      
      // Generate optional marker
      const optionalMarker = opts.optionalProperties ? "?" : "";
      
      // Generate comment if enabled
      let comment = "";
      if (opts.generateComments && typeof value === "string" && value.length > 0) {
        comment = ` // ${value.length > 50 ? value.substring(0, 50) + "..." : value}`;
      }
      
      output += `${indent}${propertyName}${optionalMarker}: ${propertyType};${comment}\n`;
    }

    return output;
  };

  const generatePropertyType = (value: any, opts: TypeScriptOptions, indent: string): string => {
    if (value === null) {
      return opts.strictNullChecks ? "null" : "any";
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "any[]";
      }
      
      // Check if all items have the same type
      const firstType = typeof value[0];
      const allSameType = value.every(item => typeof item === firstType);
      
      if (allSameType) {
        const itemType = generatePropertyType(value[0], opts, indent);
        return `${itemType}[]`;
      } else {
        // Mixed types - use union
        const types = [...new Set(value.map(item => generatePropertyType(item, opts, indent)))];
        return `(${types.join(" | ")})[]`;
      }
    }

    if (typeof value === "object") {
      // Generate inline type for nested objects
      let inlineType = "{\n";
      inlineType += generateProperties(value, opts, indent);
      inlineType += `${indent.substring(0, indent.length - 2)}}`;
      return inlineType;
    }

    // Primitive types
    switch (typeof value) {
      case "string":
        return "string";
      case "number":
        return Number.isInteger(value) ? "number" : "number";
      case "boolean":
        return "boolean";
      default:
        return "any";
    }
  };

  const isValidPropertyName = (name: string): boolean => {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
  };

  const loadSample = () => {
    const sampleJson = {
      user: {
        id: 12345,
        name: "John Doe",
        email: "john@example.com",
        isActive: true,
        profile: {
          avatar: "https://example.com/avatar.jpg",
          bio: "Software developer with 5+ years of experience",
          location: "New York, NY",
          skills: ["JavaScript", "TypeScript", "React", "Node.js"],
          preferences: {
            theme: "dark",
            notifications: true,
            language: "en"
          }
        },
        posts: [
          {
            id: 1,
            title: "Getting Started with TypeScript",
            content: "TypeScript is a powerful superset of JavaScript...",
            tags: ["typescript", "javascript", "tutorial"],
            publishedAt: "2024-01-15T10:00:00Z",
            likes: 42
          }
        ],
        metadata: null
      }
    };

    setJsonInput(JSON.stringify(sampleJson, null, 2));
    setTypescriptOutput("");
    setError("");
  };

  const clearAll = () => {
    setJsonInput("");
    setTypescriptOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">TypeScript Generation Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-white font-medium text-sm">Interface Name:</label>
            <input
              type="text"
              value={options.interfaceName}
              onChange={(e) => setOptions({ ...options, interfaceName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="GeneratedType"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white font-medium text-sm">Type Style:</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={options.useInterfaces}
                  onChange={() => setOptions({ ...options, useInterfaces: true, useTypes: false })}
                  className="text-blue-600"
                />
                <span className="text-white text-sm">Interface</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={options.useTypes}
                  onChange={() => setOptions({ ...options, useTypes: true, useInterfaces: false })}
                  className="text-blue-600"
                />
                <span className="text-white text-sm">Type</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white font-medium text-sm">Properties:</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.optionalProperties}
                  onChange={(e) => setOptions({ ...options, optionalProperties: e.target.checked })}
                  className="text-blue-600"
                />
                <span className="text-white text-sm">Make all properties optional</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.strictNullChecks}
                  onChange={(e) => setOptions({ ...options, strictNullChecks: e.target.checked })}
                  className="text-blue-600"
                />
                <span className="text-white text-sm">Strict null checks</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.generateComments}
                  onChange={(e) => setOptions({ ...options, generateComments: e.target.checked })}
                  className="text-blue-600"
                />
                <span className="text-white text-sm">Generate comments</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateTypeScript}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Generate TypeScript
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
        {/* JSON Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">JSON Input</h3>
            <span className="text-sm text-gray-400">
              {jsonInput.length} characters
            </span>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON data here..."
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* TypeScript Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">TypeScript Output</h3>
            <span className="text-sm text-gray-400">
              {typescriptOutput.length} characters
            </span>
          </div>
          <textarea
            value={typescriptOutput}
            readOnly
            placeholder="Generated TypeScript will appear here..."
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Copy Button */}
      {typescriptOutput && (
        <div className="flex justify-center">
          <button
            onClick={() => navigator.clipboard.writeText(typescriptOutput)}
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
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-purple-400 mb-3">About JSON to TypeScript Conversion</h4>
        <div className="text-purple-200 text-sm space-y-2">
          <p>
            <strong>What it does:</strong> Analyzes your JSON data and generates corresponding TypeScript interfaces or types with proper typing.
          </p>
          <p>
            <strong>Features:</strong> Supports nested objects, arrays, primitive types, and generates clean, readable TypeScript code.
          </p>
          <p>
            <strong>Use cases:</strong> API response types, configuration interfaces, data models, and rapid TypeScript development.
          </p>
        </div>
      </div>
    </div>
  );
}
