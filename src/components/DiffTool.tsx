"use client";

import { useState } from "react";

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified";
  lineNumber: number;
  content: string;
  originalLineNumber?: number;
}

interface DiffResult {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
  lines: DiffLine[];
}

export default function DiffTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const compareTexts = () => {
    if (!text1.trim() && !text2.trim()) {
      setDiffResult(null);
      return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    let processedLines1 = lines1;
    let processedLines2 = lines2;

    if (ignoreWhitespace) {
      processedLines1 = lines1.map(line => line.trim()).filter(line => line.length > 0);
      processedLines2 = lines2.map(line => line.trim()).filter(line => line.length > 0);
    }

    if (ignoreCase) {
      processedLines1 = processedLines1.map(line => line.toLowerCase());
      processedLines2 = processedLines2.map(line => line.toLowerCase());
    }

    const result = computeDiff(processedLines1, processedLines2, lines1, lines2);
    setDiffResult(result);
  };

  const computeDiff = (proc1: string[], proc2: string[], orig1: string[], orig2: string[]): DiffResult => {
    const result: DiffResult = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
      lines: []
    };

    const matrix = computeLCSMatrix(proc1, proc2);
    const diff = backtrackDiff(matrix, proc1, proc2, orig1, orig2);

    let lineNumber1 = 1;
    let lineNumber2 = 1;

    for (const item of diff) {
      switch (item.type) {
        case "unchanged":
          result.lines.push({
            type: "unchanged",
            lineNumber: lineNumber1,
            content: item.content,
            originalLineNumber: lineNumber1
          });
          lineNumber1++;
          lineNumber2++;
          result.unchanged++;
          break;
        case "added":
          result.lines.push({
            type: "added",
            lineNumber: lineNumber2,
            content: item.content,
            originalLineNumber: lineNumber2
          });
          lineNumber2++;
          result.added++;
          break;
        case "removed":
          result.lines.push({
            type: "removed",
            lineNumber: lineNumber1,
            content: item.content,
            originalLineNumber: lineNumber1
          });
          lineNumber1++;
          result.removed++;
          break;
        case "modified":
          result.lines.push({
            type: "modified",
            lineNumber: lineNumber1,
            content: item.content,
            originalLineNumber: lineNumber1
          });
          lineNumber1++;
          lineNumber2++;
          result.modified++;
          break;
      }
    }

    return result;
  };

  const computeLCSMatrix = (text1: string[], text2: string[]): number[][] => {
    const m = text1.length;
    const n = text2.length;
    const matrix: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    return matrix;
  };

  const backtrackDiff = (matrix: number[][], proc1: string[], proc2: string[], orig1: string[], orig2: string[]): Array<{type: string, content: string}> => {
    const result: Array<{type: string, content: string}> = [];
    let i = proc1.length;
    let j = proc2.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && proc1[i - 1] === proc2[j - 1]) {
        // Lines match
        result.unshift({
          type: "unchanged",
          content: orig1[i - 1] || orig2[j - 1]
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
        // Line added in text2
        result.unshift({
          type: "added",
          content: orig2[j - 1]
        });
        j--;
      } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
        // Line removed from text1
        result.unshift({
          type: "removed",
          content: orig1[i - 1]
        });
        i--;
      }
    }

    return result;
  };

  const loadSample = () => {
    const sample1 = `<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to My Site</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="content">
            <h2>Main Content</h2>
            <p>This is the main content area.</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 My Website</p>
    </footer>
</body>
</html>`;

    const sample2 = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Updated Website</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico">
</head>
<body>
    <header>
        <h1>Welcome to My Updated Site</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="content">
            <h2>Main Content</h2>
            <p>This is the updated main content area with more information.</p>
            <div class="features">
                <h3>New Features</h3>
                <ul>
                    <li>Responsive design</li>
                    <li>Better navigation</li>
                </ul>
            </div>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`;

    setText1(sample1);
    setText2(sample2);
    setDiffResult(null);
  };

  const clearAll = () => {
    setText1("");
    setText2("");
    setDiffResult(null);
  };

  const getLineClass = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-900/50 border-l-4 border-green-500";
      case "removed":
        return "bg-red-900/50 border-l-4 border-red-500";
      case "modified":
        return "bg-yellow-900/50 border-l-4 border-yellow-500";
      default:
        return "bg-gray-800/50 border-l-4 border-gray-600";
    }
  };

  const getLineIcon = (type: string) => {
    switch (type) {
      case "added":
        return (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case "removed":
        return (
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        );
      case "modified":
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Diff Options</h3>
        <div className="flex flex-wrap gap-6 justify-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white">Show Line Numbers</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white">Ignore Whitespace</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white">Ignore Case</span>
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={compareTexts}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Compare Texts
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

      {/* Input Texts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Text 1</h3>
            <span className="text-sm text-gray-400">
              {text1.split('\n').length} lines
            </span>
          </div>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter or paste first text here..."
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Text 2 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Text 2</h3>
            <span className="text-sm text-gray-400">
              {text2.split('\n').length} lines
            </span>
          </div>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter or paste second text here..."
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Diff Results */}
      {diffResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Diff Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{diffResult.added}</div>
                <div className="text-gray-400 text-sm">Added</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{diffResult.removed}</div>
                <div className="text-gray-400 text-sm">Removed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{diffResult.modified}</div>
                <div className="text-gray-400 text-sm">Modified</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">{diffResult.unchanged}</div>
                <div className="text-gray-400 text-sm">Unchanged</div>
              </div>
            </div>
          </div>

          {/* Diff Output */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white text-center">Diff Output</h3>
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                {diffResult.lines.map((line, index) => (
                  <div key={index} className={`p-2 rounded ${getLineClass(line.type)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getLineIcon(line.type)}
                      </div>
                      {showLineNumbers && (
                        <div className="text-xs text-gray-400 font-mono min-w-[3rem]">
                          {line.originalLineNumber}
                        </div>
                      )}
                      <div className="flex-1 font-mono text-sm text-white whitespace-pre-wrap">
                        {line.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gray-900/30 border border-gray-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-400 mb-3">About Diff Tool</h4>
        <div className="text-gray-300 text-sm space-y-2">
          <p>
            <strong>Line-by-line Comparison:</strong> Compare two texts and see exactly what has changed, been added, or removed.
          </p>
          <p>
            <strong>Smart Options:</strong> Ignore whitespace, case differences, and customize the display with line numbers.
          </p>
          <p>
            <strong>Visual Indicators:</strong> Green for additions, red for removals, yellow for modifications, and gray for unchanged lines.
          </p>
        </div>
      </div>
    </div>
  );
}
