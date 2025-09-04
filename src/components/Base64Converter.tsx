"use client";

import { useState, useRef } from "react";

interface ConversionResult {
  text: string;
  base64: string;
  hex: string;
  binary: string;
  size: string;
}

export default function Base64Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeText = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (err) {
      throw new Error("Failed to encode text");
    }
  };

  const decodeText = (base64: string): string => {
    try {
      return decodeURIComponent(escape(atob(base64)));
    } catch (err) {
      throw new Error("Failed to decode base64");
    }
  };

  const encodeFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          resolve(base64);
        } catch (err) {
          reject(new Error("Failed to encode file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const decodeFile = (base64: string): Uint8Array => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch (err) {
      throw new Error("Failed to decode base64 to file");
    }
  };

  const convert = async () => {
    try {
      setError("");
      
      if (!input.trim()) {
        setOutput("");
        setConversionResult(null);
        return;
      }

      let result: ConversionResult;

      if (mode === "encode") {
        if (inputType === "text") {
          const base64 = encodeText(input);
          result = {
            text: input,
            base64,
            hex: textToHex(input),
            binary: textToBinary(input),
            size: `${input.length} characters`
          };
          setOutput(base64);
        } else {
          throw new Error("File encoding not supported in this mode");
        }
      } else {
        // Decode mode
        const decoded = decodeText(input);
        result = {
          text: decoded,
          base64: input,
          hex: textToHex(decoded),
          binary: textToBinary(decoded),
          size: `${decoded.length} characters`
        };
        setOutput(decoded);
      }

      setConversionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setOutput("");
      setConversionResult(null);
    }
  };

  const textToHex = (text: string): string => {
    return Array.from(text)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  };

  const textToBinary = (text: string): string => {
    return Array.from(text)
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      const base64 = await encodeFile(file);
      setInput(base64);
      setMode("decode");
      setInputType("text");
      
      const result: ConversionResult = {
        text: `File: ${file.name}`,
        base64,
        hex: `File size: ${file.size} bytes`,
        binary: `File type: ${file.type || 'unknown'}`,
        size: `${file.size} bytes`
      };
      
      setConversionResult(result);
      setOutput(`File decoded: ${file.name} (${file.size} bytes)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "File processing failed");
    }
  };

  const downloadFile = () => {
    if (!conversionResult || mode !== "decode") return;
    
    try {
      const bytes = decodeFile(input);
      const blob = new Blob([bytes as BlobPart]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'decoded_file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download file");
    }
  };

  const swapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setConversionResult(null);
    setError("");
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("Hello, World! This is a sample text for Base64 encoding.");
    } else {
      setInput("SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4=");
    }
    setOutput("");
    setConversionResult(null);
    setError("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setConversionResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      </div>

      {/* File Upload */}
      {inputType === "file" && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">File Upload</h3>
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <div className="text-sm text-gray-400">
              Upload a file to encode to Base64
            </div>
          </div>
        </div>
      )}

      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {mode === "encode" ? "Input Text" : "Input Base64"}
            </h3>
            <span className="text-sm text-gray-400">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </h3>
            <span className="text-sm text-gray-400">
              {output.length} characters
            </span>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={mode === "encode" ? "Encoded Base64 will appear here..." : "Decoded text will appear here..."}
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
          {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
        </button>
        {mode === "decode" && conversionResult && (
          <button
            onClick={downloadFile}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Download File
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

      {/* Conversion Results */}
      {conversionResult && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Conversion Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Text */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-blue-400">Text</div>
                <div className="text-white font-mono text-sm break-words">
                  {conversionResult.text.length > 50 
                    ? conversionResult.text.substring(0, 50) + "..." 
                    : conversionResult.text
                  }
                </div>
                <button
                  onClick={() => copyToClipboard(conversionResult.text)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Base64 */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-green-400">Base64</div>
                <div className="text-white font-mono text-sm break-words">
                  {conversionResult.base64.length > 50 
                    ? conversionResult.base64.substring(0, 50) + "..." 
                    : conversionResult.base64
                  }
                </div>
                <button
                  onClick={() => copyToClipboard(conversionResult.base64)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Hex */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-purple-400">Hex</div>
                <div className="text-white font-mono text-sm break-words">
                  {conversionResult.hex.length > 50 
                    ? conversionResult.hex.substring(0, 50) + "..." 
                    : conversionResult.hex
                  }
                </div>
                <button
                  onClick={() => copyToClipboard(conversionResult.hex)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Size */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="text-center space-y-3">
                <div className="text-lg font-semibold text-yellow-400">Size</div>
                <div className="text-white text-sm">
                  {conversionResult.size}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Base64 Information */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Base64 Encoding Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-400">What is Base64?</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format.</p>
              <p>It's commonly used for encoding binary data in email messages, storing complex data in JSON, and embedding files in data URLs.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-green-400">Use Cases</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Email attachments and embedded images</p>
              <p>• Data URLs in web applications</p>
              <p>• API responses with binary data</p>
              <p>• Configuration files and certificates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-emerald-400 mb-3">About Base64 Conversion</h4>
        <div className="text-emerald-200 text-sm space-y-2">
          <p>
            <strong>Encoding:</strong> Converts text or binary data to Base64 format for safe transmission and storage.
          </p>
          <p>
            <strong>Decoding:</strong> Converts Base64 data back to its original text or binary format.
          </p>
          <p>
            <strong>Features:</strong> Supports text encoding/decoding, file uploads, and provides multiple output formats including hex and binary.
          </p>
        </div>
      </div>
    </div>
  );
}
