"use client";

import { useState, useEffect } from "react";

interface TimeFormat {
  name: string;
  format: string;
  example: string;
}

export default function UnixTimeConverter() {
  const [unixTimestamp, setUnixTimestamp] = useState("");
  const [humanReadable, setHumanReadable] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const timeFormats: TimeFormat[] = [
    {
      name: "ISO 8601",
      format: "ISO",
      example: "2024-01-15T10:30:00.000Z"
    },
    {
      name: "RFC 2822",
      format: "RFC",
      example: "Mon, 15 Jan 2024 10:30:00 GMT"
    },
    {
      name: "Locale String",
      format: "LOCALE",
      example: "1/15/2024, 10:30:00 AM"
    },
    {
      name: "UTC String",
      format: "UTC",
      example: "Mon, 15 Jan 2024 10:30:00 GMT"
    },
    {
      name: "Date Only",
      format: "DATE",
      example: "January 15, 2024"
    },
    {
      name: "Time Only",
      format: "TIME",
      example: "10:30:00 AM"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const convertUnixToHuman = () => {
    try {
      setError("");
      
      if (!unixTimestamp.trim()) {
        setHumanReadable("");
        return;
      }

      const timestamp = parseInt(unixTimestamp);
      
      if (isNaN(timestamp)) {
        throw new Error("Invalid timestamp format");
      }

      // Check if it's seconds or milliseconds
      const date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        throw new Error("Invalid timestamp value");
      }

      const formatted = formatDate(date);
      setHumanReadable(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setHumanReadable("");
    }
  };

  const convertHumanToUnix = () => {
    try {
      setError("");
      
      if (!humanReadable.trim()) {
        setUnixTimestamp("");
        return;
      }

      const date = new Date(humanReadable);
      
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }

      // Return both seconds and milliseconds
      const seconds = Math.floor(date.getTime() / 1000);
      const milliseconds = date.getTime();
      
      setUnixTimestamp(`${seconds} (${milliseconds} ms)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setUnixTimestamp("");
    }
  };

  const formatDate = (date: Date): string => {
    const formats = timeFormats.map(format => {
      let formatted = "";
      
      switch (format.format) {
        case "ISO":
          formatted = date.toISOString();
          break;
        case "RFC":
          formatted = date.toUTCString();
          break;
        case "LOCALE":
          formatted = date.toLocaleString();
          break;
        case "UTC":
          formatted = date.toUTCString();
          break;
        case "DATE":
          formatted = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          break;
        case "TIME":
          formatted = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          break;
      }
      
      return `${format.name}: ${formatted}`;
    });
    
    return formats.join('\n');
  };

  const setCurrentUnixTime = () => {
    const now = Math.floor(Date.now() / 1000);
    setUnixTimestamp(now.toString());
    convertUnixToHuman();
  };

  const setCurrentHumanTime = () => {
    const now = new Date();
    setHumanReadable(now.toISOString());
    convertHumanToUnix();
  };

  const loadSample = () => {
    setUnixTimestamp("1705312200");
    setHumanReadable("");
    setError("");
  };

  const clearAll = () => {
    setUnixTimestamp("");
    setHumanReadable("");
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCurrentUnixTime = () => {
    return Math.floor(Date.now() / 1000);
  };

  const getCurrentUnixTimeMs = () => {
    return Date.now();
  };

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Current Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {currentTime.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Local Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {getCurrentUnixTime()}
            </div>
            <div className="text-gray-400 text-sm">Unix Timestamp (s)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {getCurrentUnixTimeMs()}
            </div>
            <div className="text-gray-400 text-sm">Unix Timestamp (ms)</div>
          </div>
        </div>
      </div>

      {/* Conversion Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unix Timestamp Input */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Unix Timestamp</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={unixTimestamp}
              onChange={(e) => setUnixTimestamp(e.target.value)}
              placeholder="1705312200"
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={convertUnixToHuman}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Convert to Date
              </button>
              <button
                onClick={setCurrentUnixTime}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Now
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Enter Unix timestamp in seconds or milliseconds
          </div>
        </div>

        {/* Human Readable Input */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Human Readable Date</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={humanReadable}
              onChange={(e) => setHumanReadable(e.target.value)}
              placeholder="2024-01-15T10:30:00.000Z"
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={convertHumanToUnix}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Convert to Unix
              </button>
              <button
                onClick={setCurrentHumanTime}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Now
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Enter date in ISO format or any valid date string
          </div>
        </div>
      </div>

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
      {humanReadable && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Converted Date Formats</h3>
          
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-6">
            <div className="space-y-4">
              {humanReadable.split('\n').map((line, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-white font-mono text-sm">{line}</span>
                  <button
                    onClick={() => copyToClipboard(line.split(': ')[1] || line)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Time Format Examples */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Supported Date Formats</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-400">Input Formats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">ISO 8601</span>
                <span className="text-gray-400">2024-01-15T10:30:00.000Z</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">RFC 2822</span>
                <span className="text-gray-400">Mon, 15 Jan 2024 10:30:00 GMT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Locale</span>
                <span className="text-gray-400">1/15/2024, 10:30:00 AM</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-green-400">Unix Timestamps</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Seconds</span>
                <span className="text-gray-400">1705312200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Milliseconds</span>
                <span className="text-gray-400">1705312200000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">Current</span>
                <span className="text-gray-400">{getCurrentUnixTime()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-teal-900/30 border border-teal-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-teal-400 mb-3">About Unix Timestamps</h4>
        <div className="text-teal-200 text-sm space-y-2">
          <p>
            <strong>What is Unix Time?</strong> Unix timestamp is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC (the Unix Epoch).
          </p>
          <p>
            <strong>Formats:</strong> Can be in seconds (10 digits) or milliseconds (13 digits). Most systems use seconds, but JavaScript uses milliseconds.
          </p>
          <p>
            <strong>Use Cases:</strong> Database storage, API responses, logging, and cross-platform date handling.
          </p>
        </div>
      </div>
    </div>
  );
}
