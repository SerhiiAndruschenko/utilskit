"use client";

import { useState, useEffect } from "react";

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    unicode: false,
    sticky: false,
    dotAll: false
  });
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (regex && testString) {
      testRegex();
    } else {
      setMatches([]);
      setError("");
    }
  }, [regex, testString, flags]);

  const testRegex = () => {
    try {
      setError("");
      setIsValid(true);
      
      if (!regex.trim()) {
        setMatches([]);
        return;
      }

      // Build flags string
      const flagsString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag, _]) => {
          switch (flag) {
            case 'global': return 'g';
            case 'ignoreCase': return 'i';
            case 'multiline': return 'm';
            case 'unicode': return 'u';
            case 'sticky': return 'y';
            case 'dotAll': return 's';
            default: return '';
          }
        })
        .join('');

      const regexObj = new RegExp(regex, flagsString);
      const results: MatchResult[] = [];
      
      if (flags.global) {
        let match;
        while ((match = regexObj.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      } else {
        const match = testString.match(regexObj);
        if (match) {
          results.push({
            match: match[0],
            index: match.index || 0,
            groups: match.slice(1)
          });
        }
      }
      
      setMatches(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex");
      setIsValid(false);
      setMatches([]);
    }
  };

  const getHighlightedText = () => {
    if (!matches.length) return testString;

    let result = testString;
    let offset = 0;

    // Sort matches by index to handle overlapping matches
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    for (const match of sortedMatches) {
      const start = match.index + offset;
      const end = start + match.match.length;
      
      const before = result.substring(0, start);
      const matched = result.substring(start, end);
      const after = result.substring(end);
      
      result = before + `<span class="bg-yellow-500/50 text-black font-bold px-1 rounded">${matched}</span>` + after;
      offset += `<span class="bg-yellow-500/50 text-black font-bold px-1 rounded">${matched}</span>`.length - match.match.length;
    }

    return result;
  };

  const loadSample = () => {
    setRegex("\\b\\w+@\\w+\\.\\w+\\b");
    setTestString("Contact us at john@example.com or support@company.org for assistance.");
    setFlags({
      global: true,
      ignoreCase: false,
      multiline: false,
      unicode: false,
      sticky: false,
      dotAll: false
    });
  };

  const clearAll = () => {
    setRegex("");
    setTestString("");
    setMatches([]);
    setError("");
    setIsValid(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
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

      {/* Regex Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Regular Expression</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Flags:</span>
            {Object.entries(flags).map(([flag, enabled]) => (
              <label key={flag} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                  className="w-3 h-3 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white text-xs font-mono">{flag.charAt(0).toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
        <input
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter your regex pattern..."
          className={`w-full p-4 bg-gray-800/80 border rounded-xl text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isValid ? 'border-gray-700/50' : 'border-red-500/50'
          }`}
        />
      </div>

      {/* Test String Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Test String</h3>
          <span className="text-sm text-gray-400">
            {testString.length} characters
          </span>
        </div>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against the regex..."
          className="w-full h-32 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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

      {/* Results */}
      {regex && testString && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Results Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{matches.length}</div>
                <div className="text-gray-400 text-sm">Total Matches</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{testString.length}</div>
                <div className="text-gray-400 text-sm">String Length</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{regex.length}</div>
                <div className="text-gray-400 text-sm">Pattern Length</div>
              </div>
            </div>
          </div>

          {/* Highlighted Text */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Highlighted Matches</h3>
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
              <div 
                className="text-white font-mono text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
              />
            </div>
          </div>

          {/* Match Details */}
          {matches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Match Details</h3>
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-400 font-semibold">Match {index + 1}:</span>
                          <span className="text-white font-mono bg-gray-700 px-2 py-1 rounded">
                            {match.match}
                          </span>
                        </div>
                        <div className="text-gray-300 text-sm">
                          <strong>Position:</strong> {match.index} - {match.index + match.match.length}
                        </div>
                        {match.groups.length > 0 && (
                          <div className="text-gray-300 text-sm">
                            <strong>Groups:</strong> {match.groups.map((group, i) => (
                              <span key={i} className="ml-2 bg-gray-700 px-2 py-1 rounded">
                                Group {i + 1}: {group}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-cyan-400 mb-3">About Regex Testing</h4>
        <div className="text-cyan-200 text-sm space-y-2">
          <p>
            <strong>Real-time Testing:</strong> See matches as you type with instant highlighting and validation.
          </p>
          <p>
            <strong>Flag Support:</strong> Test with different regex flags including global, case-insensitive, multiline, and more.
          </p>
          <p>
            <strong>Match Analysis:</strong> Detailed information about each match including position, groups, and captured content.
          </p>
        </div>
      </div>
    </div>
  );
}
