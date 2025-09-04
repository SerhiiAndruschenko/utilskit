"use client";

import { useState } from "react";

interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
}

export default function JsonDiff() {
  const [json1, setJson1] = useState("");
  const [json2, setJson2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState("");

  const compareJson = () => {
    try {
      setError("");
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      
      const result = getDiff(obj1, obj2);
      setDiffResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setDiffResult(null);
    }
  };

  const getDiff = (obj1: any, obj2: any, path = ""): DiffResult => {
    const result: DiffResult = {
      added: [],
      removed: [],
      modified: [],
      unchanged: []
    };

    const keys1 = new Set(Object.keys(obj1));
    const keys2 = new Set(Object.keys(obj2));

    // Find added keys
    for (const key of keys2) {
      if (!keys1.has(key)) {
        result.added.push(path ? `${path}.${key}` : key);
      }
    }

    // Find removed keys
    for (const key of keys1) {
      if (!keys2.has(key)) {
        result.removed.push(path ? `${path}.${key}` : key);
      }
    }

    // Compare common keys
    for (const key of keys1) {
      if (keys2.has(key)) {
        const currentPath = path ? `${path}.${key}` : key;
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
          // Recursively compare nested objects
          const nestedDiff = getDiff(val1, val2, currentPath);
          result.added.push(...nestedDiff.added);
          result.removed.push(...nestedDiff.removed);
          result.modified.push(...nestedDiff.modified);
          result.unchanged.push(...nestedDiff.unchanged);
        } else if (val1 !== val2) {
          result.modified.push(currentPath);
        } else {
          result.unchanged.push(currentPath);
        }
      }
    }

    return result;
  };

  const loadSample = () => {
    const sample1 = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York"
      },
      hobbies: ["reading", "swimming"]
    };

    const sample2 = {
      name: "John Doe",
      age: 31,
      email: "john.doe@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      hobbies: ["reading", "coding"],
      active: true
    };

    setJson1(JSON.stringify(sample1, null, 2));
    setJson2(JSON.stringify(sample2, null, 2));
    setDiffResult(null);
    setError("");
  };

  const clearAll = () => {
    setJson1("");
    setJson2("");
    setDiffResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={compareJson}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Compare JSON
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

      {/* Input JSONs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">JSON 1</h3>
            <span className="text-sm text-gray-400">
              {json1.length} characters
            </span>
          </div>
          <textarea
            value={json1}
            onChange={(e) => setJson1(e.target.value)}
            placeholder="Paste first JSON here..."
            className="w-full h-80 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* JSON 2 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">JSON 2</h3>
            <span className="text-sm text-gray-400">
              {json2.length} characters
            </span>
          </div>
          <textarea
            value={json2}
            onChange={(e) => setJson2(e.target.value)}
            placeholder="Paste second JSON here..."
            className="w-full h-80 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Diff Results */}
      {diffResult && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Comparison Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Added */}
            <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-green-400">Added</h4>
              </div>
              <div className="space-y-1">
                {diffResult.added.length > 0 ? (
                  diffResult.added.map((item, index) => (
                    <div key={index} className="text-green-300 text-sm font-mono">
                      + {item}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No additions</span>
                )}
              </div>
            </div>

            {/* Removed */}
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-red-400">Removed</h4>
              </div>
              <div className="space-y-1">
                {diffResult.removed.length > 0 ? (
                  diffResult.removed.map((item, index) => (
                    <div key={index} className="text-red-300 text-sm font-mono">
                      - {item}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No removals</span>
                )}
              </div>
            </div>

            {/* Modified */}
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-yellow-400">Modified</h4>
              </div>
              <div className="space-y-1">
                {diffResult.modified.length > 0 ? (
                  diffResult.modified.map((item, index) => (
                    <div key={index} className="text-yellow-300 text-sm font-mono">
                      ~ {item}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No modifications</span>
                )}
              </div>
            </div>

            {/* Unchanged */}
            <div className="bg-gray-900/30 border border-gray-500/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-400">Unchanged</h4>
              </div>
              <div className="space-y-1">
                {diffResult.unchanged.length > 0 ? (
                  diffResult.unchanged.map((item, index) => (
                    <div key={index} className="text-gray-300 text-sm font-mono">
                      = {item}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No unchanged</span>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center">
            <h4 className="text-xl font-semibold text-white mb-4">Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Total Changes:</span>
                <div className="text-white font-semibold">
                  {diffResult.added.length + diffResult.removed.length + diffResult.modified.length}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Added:</span>
                <div className="text-green-400 font-semibold">{diffResult.added.length}</div>
              </div>
              <div>
                <span className="text-gray-400">Removed:</span>
                <div className="text-red-400 font-semibold">{diffResult.removed.length}</div>
              </div>
              <div>
                <span className="text-gray-400">Modified:</span>
                <div className="text-yellow-400 font-semibold">{diffResult.modified.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
