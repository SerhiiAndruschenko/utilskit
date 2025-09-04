"use client";

import { useState } from "react";

type Language = "html" | "css" | "javascript" | "json" | "xml";

export default function CodeFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<Language>("html");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState("");

  const formatCode = () => {
    try {
      setError("");
      let formatted = "";

      switch (language) {
        case "html":
          formatted = formatHTML(input, indentSize);
          break;
        case "css":
          formatted = formatCSS(input, indentSize);
          break;
        case "javascript":
          formatted = formatJavaScript(input, indentSize);
          break;
        case "json":
          formatted = formatJSON(input, indentSize);
          break;
        case "xml":
          formatted = formatXML(input, indentSize);
          break;
        default:
          formatted = input;
      }

      setOutput(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Formatting failed");
      setOutput("");
    }
  };

  const formatHTML = (html: string, indent: number): string => {
    const indentStr = " ".repeat(indent);
    let formatted = "";
    let level = 0;
    let inTag = false;
    let inAttribute = false;
    let currentLine = "";

    for (let i = 0; i < html.length; i++) {
      const char = html[i];
      const nextChar = html[i + 1];

      if (char === '<' && nextChar !== '/') {
        // Opening tag
        if (currentLine.trim()) {
          formatted += currentLine.trim() + "\n";
          currentLine = "";
        }
        formatted += indentStr.repeat(level) + char;
        inTag = true;
        level++;
      } else if (char === '<' && nextChar === '/') {
        // Closing tag
        level = Math.max(0, level - 1);
        if (currentLine.trim()) {
          formatted += currentLine.trim() + "\n";
          currentLine = "";
        }
        formatted += indentStr.repeat(level) + char;
        inTag = true;
      } else if (char === '>') {
        // End of tag
        formatted += char;
        if (nextChar === '\n' || nextChar === ' ') {
          formatted += "\n";
        }
        inTag = false;
        inAttribute = false;
      } else if (char === '"' && inTag) {
        // Toggle attribute state
        inAttribute = !inAttribute;
        formatted += char;
      } else if (char === '\n' || char === '\r') {
        // Handle line breaks
        if (!inTag && !inAttribute) {
          if (currentLine.trim()) {
            formatted += currentLine.trim() + "\n";
            currentLine = "";
          }
        } else {
          formatted += char;
        }
      } else {
        formatted += char;
      }
    }

    if (currentLine.trim()) {
      formatted += currentLine.trim();
    }

    return formatted;
  };

  const formatCSS = (css: string, indent: number): string => {
    const indentStr = " ".repeat(indent);
    let formatted = "";
    let level = 0;
    let inRule = false;
    let inProperty = false;

    // Split into lines and process
    const lines = css.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.includes('{')) {
        // Rule start
        formatted += indentStr.repeat(level) + trimmed + "\n";
        level++;
        inRule = true;
      } else if (trimmed.includes('}')) {
        // Rule end
        level = Math.max(0, level - 1);
        formatted += indentStr.repeat(level) + trimmed + "\n";
        inRule = false;
      } else if (inRule && trimmed.includes(':')) {
        // Property
        formatted += indentStr.repeat(level) + trimmed + "\n";
      } else {
        // Other content
        formatted += indentStr.repeat(level) + trimmed + "\n";
      }
    }

    return formatted.trim();
  };

  const formatJavaScript = (js: string, indent: number): string => {
    try {
      // Try to parse and format as JSON first
      const parsed = JSON.parse(js);
      return JSON.stringify(parsed, null, indent);
    } catch {
      // If not JSON, do basic formatting
      const indentStr = " ".repeat(indent);
      let formatted = "";
      let level = 0;
      let inString = false;
      let inComment = false;
      let currentLine = "";

      for (let i = 0; i < js.length; i++) {
        const char = js[i];
        const nextChar = js[i + 1];

        if (char === '"' || char === "'") {
          inString = !inString;
          currentLine += char;
        } else if (char === '/' && nextChar === '/' && !inString) {
          // Single line comment
          currentLine += char + nextChar;
          i++;
          while (i < js.length && js[i] !== '\n') {
            currentLine += js[i];
            i++;
          }
          if (i < js.length) currentLine += js[i];
        } else if (char === '/' && nextChar === '*' && !inString) {
          // Multi-line comment
          currentLine += char + nextChar;
          i += 2;
          while (i < js.length && !(js[i] === '*' && js[i + 1] === '/')) {
            currentLine += js[i];
            i++;
          }
          if (i < js.length) {
            currentLine += js[i] + js[i + 1];
            i++;
          }
        } else if (char === '{' && !inString) {
          currentLine += char;
          formatted += indentStr.repeat(level) + currentLine.trim() + "\n";
          currentLine = "";
          level++;
        } else if (char === '}' && !inString) {
          level = Math.max(0, level - 1);
          if (currentLine.trim()) {
            formatted += indentStr.repeat(level) + currentLine.trim() + "\n";
            currentLine = "";
          }
          currentLine += char;
        } else if (char === ';' && !inString) {
          currentLine += char;
          formatted += indentStr.repeat(level) + currentLine.trim() + "\n";
          currentLine = "";
        } else if (char === '\n') {
          if (currentLine.trim()) {
            formatted += indentStr.repeat(level) + currentLine.trim() + "\n";
            currentLine = "";
          }
        } else {
          currentLine += char;
        }
      }

      if (currentLine.trim()) {
        formatted += indentStr.repeat(level) + currentLine.trim();
      }

      return formatted;
    }
  };

  const formatJSON = (json: string, indent: number): string => {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, indent);
    } catch (err) {
      throw new Error("Invalid JSON: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const formatXML = (xml: string, indent: number): string => {
    // Simple XML formatting - similar to HTML
    return formatHTML(xml, indent);
  };

  const minifyCode = () => {
    try {
      setError("");
      let minified = "";

      switch (language) {
        case "html":
          minified = input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
          break;
        case "css":
          minified = input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
          break;
        case "javascript":
          minified = input.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
          break;
        case "json":
          minified = JSON.stringify(JSON.parse(input));
          break;
        case "xml":
          minified = input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
          break;
        default:
          minified = input;
      }

      setOutput(minified);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Minification failed");
      setOutput("");
    }
  };

  const loadSample = () => {
    const samples = {
      html: `<!DOCTYPE html>
<html>
<head>
<title>Sample Page</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<header>
<h1>Welcome</h1>
<nav>
<ul>
<li><a href="#home">Home</a></li>
<li><a href="#about">About</a></li>
</ul>
</nav>
</header>
<main>
<section id="content">
<p>This is a sample HTML document.</p>
</section>
</main>
</body>
</html>`,
      css: `body{margin:0;padding:0;font-family:Arial,sans-serif}header{background:#333;color:white;padding:1rem}nav ul{list-style:none;display:flex;gap:1rem}nav a{color:white;text-decoration:none}main{padding:2rem}section{border:1px solid #ddd;padding:1rem;border-radius:4px}`,
      javascript: `function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){total+=items[i].price}return total}const products=[{name:"Product 1",price:10},{name:"Product 2",price:20}];console.log("Total:",calculateTotal(products));`,
      json: `{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York"},"hobbies":["reading","swimming","coding"]}`,
      xml: `<?xml version="1.0" encoding="UTF-8"?><root><item id="1"><name>Sample Item</name><description>This is a sample XML item</description></item><item id="2"><name>Another Item</name><description>Another sample item</description></item></root>`
    };

    setInput(samples[language]);
    setOutput("");
    setError("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language and Options Selection */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Indent Size:</span>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={formatCode}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Format Code
        </button>
        <button
          onClick={minifyCode}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Minify Code
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
            <h3 className="text-xl font-semibold text-white">Input Code</h3>
            <span className="text-sm text-gray-400">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Formatted Output</h3>
            <span className="text-sm text-gray-400">
              {output.length} characters
            </span>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={`Formatted ${language.toUpperCase()} will appear here...`}
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Copy Button */}
      {output && (
        <div className="flex justify-center">
          <button
            onClick={copyOutput}
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
      <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-yellow-400 mb-3">About Code Formatting</h4>
        <div className="text-yellow-200 text-sm space-y-2">
          <p>
            <strong>HTML:</strong> Formats HTML with proper indentation, line breaks, and structure.
          </p>
          <p>
            <strong>CSS:</strong> Formats CSS with consistent spacing, indentation, and rule organization.
          </p>
          <p>
            <strong>JavaScript:</strong> Formats JavaScript with proper indentation and structure.
          </p>
          <p>
            <strong>JSON:</strong> Formats JSON with proper indentation and structure.
          </p>
          <p>
            <strong>XML:</strong> Formats XML with proper indentation and structure.
          </p>
        </div>
      </div>
    </div>
  );
}
