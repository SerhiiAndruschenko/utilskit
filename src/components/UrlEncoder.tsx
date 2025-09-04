"use client";

import { useState } from "react";

interface EncodingResult {
  original: string;
  encoded: string;
  decoded: string;
  length: number;
  encodedLength: number;
}

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodingResult, setEncodingResult] = useState<EncodingResult | null>(null);

  const encodeUrl = (text: string): string => {
    try {
      return encodeURIComponent(text);
    } catch (err) {
      throw new Error("Failed to encode URL");
    }
  };

  const decodeUrl = (encodedText: string): string => {
    try {
      return decodeURIComponent(encodedText);
    } catch (err) {
      throw new Error("Failed to decode URL");
    }
  };

  const convert = () => {
    try {
      setError("");
      
      if (!input.trim()) {
        setOutput("");
        setEncodingResult(null);
        return;
      }

      let result: EncodingResult;

      if (mode === "encode") {
        const encoded = encodeUrl(input);
        result = {
          original: input,
          encoded,
          decoded: input,
          length: input.length,
          encodedLength: encoded.length
        };
        setOutput(encoded);
      } else {
        const decoded = decodeUrl(input);
        result = {
          original: decoded,
          encoded: input,
          decoded,
          length: decoded.length,
          encodedLength: input.length
        };
        setOutput(decoded);
      }

      setEncodingResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setOutput("");
      setEncodingResult(null);
    }
  };

  const swapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setEncodingResult(null);
    setError("");
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("Hello World! This is a test with special chars: &?=#");
    } else {
      setInput("Hello%20World%21%20This%20is%20a%20test%20with%20special%20chars%3A%20%26%3F%3D%23");
    }
    setOutput("");
    setEncodingResult(null);
    setError("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setEncodingResult(null);
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getModeColor = (): string => {
    return mode === "encode" ? "from-green-600 to-teal-600" : "from-blue-600 to-purple-600";
  };

  const getModeHoverColor = (): string => {
    return mode === "encode" ? "from-green-700 to-teal-700" : "from-blue-700 to-purple-700";
  };

  const getCommonEncodings = () => {
    const examples = [
      { text: "Hello World", encoded: "Hello%20World" },
      { text: "Special chars: &?=#", encoded: "Special%20chars%3A%20%26%3F%3D%23" },
      { text: "Email: user@example.com", encoded: "Email%3A%20user%40example.com" },
      { text: "Path: /folder/file.txt", encoded: "Path%3A%20%2Ffolder%2Ffile.txt" },
      { text: "Query: name=John&age=30", encoded: "Query%3A%20name%3DJohn%26age%3D30" }
    ];

    return examples;
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Mode:</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "encode" | "decode")}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
        </div>

        <button
          onClick={swapMode}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <div className="text-sm text-gray-400">
          {mode === "encode" ? "Convert text to URL-safe format" : "Convert URL-encoded text back to readable format"}
        </div>
      </div>

      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {mode === "encode" ? "Input Text" : "Input Encoded URL"}
            </h3>
            <span className="text-sm text-gray-400">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter URL-encoded text to decode..."}
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {mode === "encode" ? "Encoded Output" : "Decoded Output"}
            </h3>
            <span className="text-sm text-gray-400">
              {output.length} characters
            </span>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={mode === "encode" ? "Encoded URL will appear here..." : "Decoded text will appear here..."}
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={convert}
          className={`px-6 py-3 bg-gradient-to-r ${getModeColor()} hover:${getModeHoverColor()} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105`}
        >
          {mode === "encode" ? "Encode URL" : "Decode URL"}
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

      {/* Conversion Results */}
      {encodingResult && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Conversion Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Original */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-blue-400">Original</div>
                <div className="text-white font-mono text-sm break-words">
                  {encodingResult.original.length > 50 
                    ? encodingResult.original.substring(0, 50) + "..." 
                    : encodingResult.original
                  }
                </div>
                <div className="text-gray-400 text-sm">
                  {encodingResult.length} chars
                </div>
                <button
                  onClick={() => copyToClipboard(encodingResult.original)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Encoded */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-green-400">Encoded</div>
                <div className="text-white font-mono text-sm break-words">
                  {encodingResult.encoded.length > 50 
                    ? encodingResult.encoded.substring(0, 50) + "..." 
                    : encodingResult.encoded
                  }
                </div>
                <div className="text-gray-400 text-sm">
                  {encodingResult.encodedLength} chars
                </div>
                <button
                  onClick={() => copyToClipboard(encodingResult.encoded)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Decoded */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-purple-400">Decoded</div>
                <div className="text-white font-mono text-sm break-words">
                  {encodingResult.decoded.length > 50 
                    ? encodingResult.decoded.substring(0, 50) + "..." 
                    : encodingResult.decoded
                  }
                </div>
                <div className="text-gray-400 text-sm">
                  {encodingResult.length} chars
                </div>
                <button
                  onClick={() => copyToClipboard(encodingResult.decoded)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Length Change */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-yellow-400">Length Change</div>
                <div className="text-white text-2xl font-bold">
                  {mode === "encode" 
                    ? `+${encodingResult.encodedLength - encodingResult.length}`
                    : `-${encodingResult.encodedLength - encodingResult.length}`
                  }
                </div>
                <div className="text-gray-400 text-sm">
                  {mode === "encode" ? "Increase" : "Decrease"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Common Examples */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Common URL Encoding Examples</h3>
        
        <div className="space-y-3">
          {getCommonEncodings().map((example, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex-1">
                <div className="text-white font-mono text-sm">{example.text}</div>
                <div className="text-gray-400 text-xs">Original text</div>
              </div>
              <div className="mx-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex-1 text-right">
                <div className="text-green-400 font-mono text-sm">{example.encoded}</div>
                <div className="text-gray-400 text-xs">Encoded</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* URL Encoding Information */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">URL Encoding Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-400">What is URL Encoding?</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>URL encoding (percent-encoding) converts special characters into a format that can be safely transmitted in URLs.</p>
              <p>It replaces unsafe characters with a percent sign (%) followed by two hexadecimal digits.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-green-400">Common Encodings</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Space → %20</p>
              <p>• & → %26</p>
              <p>• ? → %3F</p>
              <p>• = → %3D</p>
              <p>• # → %23</p>
              <p>• @ → %40</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-cyan-400 mb-3">About URL Encoding</h4>
        <div className="text-cyan-200 text-sm space-y-2">
          <p>
            <strong>Purpose:</strong> URL encoding ensures that special characters in URLs are properly handled and transmitted across different systems.
          </p>
          <p>
            <strong>Use Cases:</strong> Query parameters, form data, file paths, and any text that needs to be safely included in URLs.
          </p>
          <p>
            <strong>Standards:</strong> Follows RFC 3986 specification for URI encoding, widely supported by all modern browsers and web servers.
          </p>
        </div>
      </div>
    </div>
  );
}
