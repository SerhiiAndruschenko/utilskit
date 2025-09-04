"use client";

import { useState, useRef } from "react";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processInput = () => {
    try {
      setError("");
      
      if (mode === "encode") {
        if (inputType === "text") {
          const encoded = btoa(input);
          setOutput(encoded);
        } else {
          // File encoding is handled in handleFileChange
          return;
        }
      } else {
        // Decode
        try {
          const decoded = atob(input);
          setOutput(decoded);
        } catch (err) {
          throw new Error("Invalid Base64 string");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
      setOutput("");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert to Base64
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        const encoded = btoa(binary);
        setInput(encoded);
        setOutput(encoded);
      } catch (err) {
        setError("Failed to encode file");
        setOutput("");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileDownload = () => {
    if (!output || mode !== "decode") return;

    try {
      // Try to decode and create a file
      const decoded = atob(output);
      const uint8Array = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        uint8Array[i] = decoded.charCodeAt(i);
      }

      const blob = new Blob([uint8Array]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'decoded_file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to decode file");
    }
  };

  const swapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setFileName("");
    setFileSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("Hello, World! This is a sample text for Base64 encoding.");
      setInputType("text");
    } else {
      setInput("SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4=");
    }
    setOutput("");
    setError("");
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
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

        {mode === "encode" && (
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">Input Type:</span>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as "text" | "file")}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="file">File</option>
            </select>
          </div>
        )}
      </div>

      {/* File Input */}
      {mode === "encode" && inputType === "file" && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">File Input</h3>
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Choose File
            </button>
            {fileName && (
              <div className="mt-4 text-gray-300">
                <div className="font-medium">{fileName}</div>
                <div className="text-sm">{(fileSize / 1024).toFixed(2)} KB</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        {inputType === "text" && (
          <button
            onClick={processInput}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </button>
        )}
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
              {mode === "encode" ? "Input" : "Base64 Input"}
            </h3>
            <span className="text-sm text-gray-400">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
            className="w-full h-80 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {mode === "encode" ? "Base64 Output" : "Decoded Output"}
            </h3>
            <span className="text-sm text-gray-400">
              {output.length} characters
            </span>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={mode === "encode" ? "Encoded Base64 will appear here..." : "Decoded content will appear here..."}
            className="w-full h-80 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      {output && (
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={copyOutput}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy to Clipboard</span>
          </button>
          
          {mode === "decode" && (
            <button
              onClick={handleFileDownload}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download File</span>
            </button>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">About Base64 Encoding</h4>
        <div className="text-blue-200 text-sm space-y-2">
          <p>
            <strong>What is Base64?</strong> Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format.
          </p>
          <p>
            <strong>Use Cases:</strong> Email attachments, embedding images in HTML/CSS, API responses, and data storage.
          </p>
          <p>
            <strong>Features:</strong> Encode text and files to Base64, decode Base64 back to original content, and download decoded files.
          </p>
        </div>
      </div>
    </div>
  );
}
