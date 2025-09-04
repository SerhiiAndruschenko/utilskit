"use client";

import { useState } from "react";

interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
  build: string[];
  isValid: boolean;
  error?: string;
}

interface ComparisonResult {
  comparison: string;
  description: string;
  breaking: boolean;
  feature: boolean;
  patch: boolean;
}

export default function SemverChecker() {
  const [version1, setVersion1] = useState("");
  const [version2, setVersion2] = useState("");
  const [parsedVersion1, setParsedVersion1] = useState<VersionInfo | null>(null);
  const [parsedVersion2, setParsedVersion2] = useState<VersionInfo | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState("");

  const parseVersion = (version: string): VersionInfo => {
    try {
      if (!version.trim()) {
        return {
          major: 0,
          minor: 0,
          patch: 0,
          prerelease: [],
          build: [],
          isValid: false,
          error: "Version cannot be empty"
        };
      }

      // Basic semver regex
      const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
      const match = version.match(semverRegex);

      if (!match) {
        return {
          major: 0,
          minor: 0,
          patch: 0,
          prerelease: [],
          build: [],
          isValid: false,
          error: "Invalid semver format"
        };
      }

      const [, major, minor, patch, prerelease, build] = match;

      return {
        major: parseInt(major),
        minor: parseInt(minor),
        patch: parseInt(patch),
        prerelease: prerelease ? prerelease.split('.') : [],
        build: build ? build.split('.') : [],
        isValid: true
      };
    } catch (err) {
      return {
        major: 0,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: [],
        isValid: false,
        error: "Failed to parse version"
      };
    }
  };

  const validateVersion = (version: string) => {
    const parsed = parseVersion(version);
    
    if (version === version1) {
      setParsedVersion1(parsed);
    } else if (version === version2) {
      setParsedVersion2(parsed);
    }
  };

  const compareVersions = () => {
    try {
      setError("");
      
      if (!parsedVersion1?.isValid || !parsedVersion2?.isValid) {
        throw new Error("Both versions must be valid to compare");
      }

      const v1 = parsedVersion1;
      const v2 = parsedVersion2;

      let comparison = "";
      let description = "";
      let breaking = false;
      let feature = false;
      let patch = false;

      if (v1.major > v2.major) {
        comparison = ">";
        description = "Major version increase";
        breaking = true;
      } else if (v1.major < v2.major) {
        comparison = "<";
        description = "Major version decrease";
        breaking = true;
      } else if (v1.minor > v2.minor) {
        comparison = ">";
        description = "Minor version increase (new features)";
        feature = true;
      } else if (v1.minor < v2.minor) {
        comparison = "<";
        description = "Minor version decrease";
        feature = true;
      } else if (v1.patch > v2.patch) {
        comparison = ">";
        description = "Patch version increase (bug fixes)";
        patch = true;
      } else if (v1.patch < v2.patch) {
        comparison = "<";
        description = "Patch version decrease";
        patch = true;
      } else {
        // Same major.minor.patch, check prerelease
        if (v1.prerelease.length === 0 && v2.prerelease.length > 0) {
          comparison = ">";
          description = "Stable version vs prerelease";
        } else if (v1.prerelease.length > 0 && v2.prerelease.length === 0) {
          comparison = "<";
          description = "Prerelease vs stable version";
        } else if (v1.prerelease.length > 0 && v2.prerelease.length > 0) {
          // Compare prerelease versions
          const result = comparePrerelease(v1.prerelease, v2.prerelease);
          comparison = result.comparison;
          description = `Prerelease comparison: ${result.description}`;
        } else {
          comparison = "=";
          description = "Versions are identical";
        }
      }

      setComparisonResult({
        comparison,
        description,
        breaking,
        feature,
        patch
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
      setComparisonResult(null);
    }
  };

  const comparePrerelease = (pre1: string[], pre2: string[]): { comparison: string; description: string } => {
    const maxLength = Math.max(pre1.length, pre2.length);
    
    for (let i = 0; i < maxLength; i++) {
      const p1 = pre1[i] || "0";
      const p2 = pre2[i] || "0";
      
      const num1 = parseInt(p1);
      const num2 = parseInt(p2);
      
      if (!isNaN(num1) && !isNaN(num2)) {
        if (num1 > num2) return { comparison: ">", description: "Higher prerelease number" };
        if (num1 < num2) return { comparison: "<", description: "Lower prerelease number" };
      } else {
        // String comparison
        if (p1 > p2) return { comparison: ">", description: "Higher prerelease string" };
        if (p1 < p2) return { comparison: "<", description: "Lower prerelease string" };
      }
    }
    
    return { comparison: "=", description: "Prereleases are identical" };
  };

  const loadSample = () => {
    setVersion1("1.2.3");
    setVersion2("2.0.0");
    setParsedVersion1(null);
    setParsedVersion2(null);
    setComparisonResult(null);
    setError("");
  };

  const clearAll = () => {
    setVersion1("");
    setVersion2("");
    setParsedVersion1(null);
    setParsedVersion2(null);
    setComparisonResult(null);
    setError("");
  };

  const swapVersions = () => {
    setVersion1(version2);
    setVersion2(version1);
    setParsedVersion1(parsedVersion2);
    setParsedVersion2(parsedVersion1);
    setComparisonResult(null);
  };

  const getVersionColor = (version: VersionInfo | null): string => {
    if (!version) return "border-gray-700";
    return version.isValid ? "border-green-500" : "border-red-500";
  };

  const getComparisonColor = (): string => {
    if (!comparisonResult) return "bg-gray-800";
    
    if (comparisonResult.breaking) return "bg-red-900/30 border-red-500/50";
    if (comparisonResult.feature) return "bg-blue-900/30 border-blue-500/50";
    if (comparisonResult.patch) return "bg-green-900/30 border-green-500/50";
    
    return "bg-gray-800/30 border-gray-500/50";
  };

  return (
    <div className="space-y-6">
      {/* Version Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Version 1 */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Version 1</h3>
          <input
            type="text"
            value={version1}
            onChange={(e) => {
              setVersion1(e.target.value);
              validateVersion(e.target.value);
            }}
            placeholder="1.0.0"
            className={`w-full px-4 py-3 bg-gray-800/80 border rounded-xl text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getVersionColor(parsedVersion1)}`}
          />
          
          {parsedVersion1 && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    parsedVersion1.isValid ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {parsedVersion1.isValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                
                {parsedVersion1.isValid ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white font-mono">
                        {parsedVersion1.major}.{parsedVersion1.minor}.{parsedVersion1.patch}
                      </span>
                    </div>
                    {parsedVersion1.prerelease.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Prerelease:</span>
                        <span className="text-yellow-400 font-mono">
                          {parsedVersion1.prerelease.join('.')}
                        </span>
                      </div>
                    )}
                    {parsedVersion1.build.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Build:</span>
                        <span className="text-blue-400 font-mono">
                          {parsedVersion1.build.join('.')}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-red-400 text-sm">
                    {parsedVersion1.error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Version 2 */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Version 2</h3>
          <input
            type="text"
            value={version2}
            onChange={(e) => {
              setVersion2(e.target.value);
              validateVersion(e.target.value);
            }}
            placeholder="2.0.0"
            className={`w-full px-4 py-3 bg-gray-800/80 border rounded-xl text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getVersionColor(parsedVersion2)}`}
          />
          
          {parsedVersion2 && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    parsedVersion2.isValid ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {parsedVersion2.isValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                
                {parsedVersion2.isValid ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white font-mono">
                        {parsedVersion2.major}.{parsedVersion2.minor}.{parsedVersion2.patch}
                      </span>
                    </div>
                    {parsedVersion2.prerelease.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Prerelease:</span>
                        <span className="text-yellow-400 font-mono">
                          {parsedVersion2.prerelease.join('.')}
                        </span>
                      </div>
                    )}
                    {parsedVersion2.build.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Build:</span>
                        <span className="text-blue-400 font-mono">
                          {parsedVersion2.build.join('.')}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-red-400 text-sm">
                    {parsedVersion2.error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={compareVersions}
          disabled={!parsedVersion1?.isValid || !parsedVersion2?.isValid}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
        >
          Compare Versions
        </button>
        <button
          onClick={swapVersions}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Swap Versions
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

      {/* Comparison Results */}
      {comparisonResult && (
        <div className={`rounded-xl p-6 border ${getComparisonColor()}`}>
          <h3 className="text-2xl font-semibold text-white text-center mb-6">Version Comparison</h3>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-2xl font-bold text-white">{version1}</div>
              <div className="text-4xl font-bold text-blue-400">{comparisonResult.comparison}</div>
              <div className="text-2xl font-bold text-white">{version2}</div>
            </div>
            
            <div className="text-xl text-gray-300">
              {comparisonResult.description}
            </div>
            
            <div className="flex justify-center space-x-4">
              {comparisonResult.breaking && (
                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
                  Breaking Changes
                </span>
              )}
              {comparisonResult.feature && (
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  New Features
                </span>
              )}
              {comparisonResult.patch && (
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                  Bug Fixes
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Semver Information */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Semantic Versioning Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-red-400">Major Version</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Incompatible API changes</p>
              <p>Breaking changes</p>
              <p>Major rewrites</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-400">Minor Version</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>New functionality added</p>
              <p>Backward compatible</p>
              <p>New features</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-green-400">Patch Version</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Bug fixes only</p>
              <p>Backward compatible</p>
              <p>No new features</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
          <h4 className="text-lg font-medium text-yellow-400 mb-2">Format: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]</h4>
          <div className="text-gray-300 text-sm space-y-1">
            <p><strong>Examples:</strong></p>
            <p className="font-mono">1.0.0 - Initial release</p>
            <p className="font-mono">1.2.3 - Minor update with bug fixes</p>
            <p className="font-mono">2.0.0-beta.1 - Major version prerelease</p>
            <p className="font-mono">1.0.0+20231201 - Build metadata</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-violet-900/30 border border-violet-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-violet-400 mb-3">About Semantic Versioning</h4>
        <div className="text-violet-200 text-sm space-y-2">
          <p>
            <strong>What is Semver?</strong> Semantic Versioning (Semver) is a versioning scheme that conveys meaning about the underlying changes in software releases.
          </p>
          <p>
            <strong>Benefits:</strong> Clear communication about changes, dependency management, and release planning for developers and users.
          </p>
          <p>
            <strong>Standards:</strong> Follows the Semver 2.0.0 specification, widely adopted in the software development community.
          </p>
        </div>
      </div>
    </div>
  );
}
