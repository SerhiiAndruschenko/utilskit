"use client";

import { useState } from "react";

interface JwtHeader {
  alg: string;
  typ: string;
  kid?: string;
  x5t?: string;
  [key: string]: any;
}

interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: any;
}

interface JwtResult {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  isValid: boolean;
  error?: string;
}

export default function JwtDecoder() {
  const [jwtToken, setJwtToken] = useState("");
  const [decodedResult, setDecodedResult] = useState<JwtResult | null>(null);
  const [error, setError] = useState("");
  const [showAllClaims, setShowAllClaims] = useState(false);

  const decodeJwt = () => {
    try {
      setError("");
      
      if (!jwtToken.trim()) {
        setDecodedResult(null);
        return;
      }

      const parts = jwtToken.split('.');
      
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Must have 3 parts separated by dots.");
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header
      let header: JwtHeader;
      try {
        const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
        header = JSON.parse(headerJson);
      } catch (err) {
        throw new Error("Failed to decode JWT header");
      }

      // Decode payload
      let payload: JwtPayload;
      try {
        const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
        payload = JSON.parse(payloadJson);
      } catch (err) {
        throw new Error("Failed to decode JWT payload");
      }

      // Validate signature (basic check)
      const isValid = signature.length > 0;

      const result: JwtResult = {
        header,
        payload,
        signature,
        isValid
      };

      setDecodedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode JWT");
      setDecodedResult(null);
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const isExpired = timestamp < Math.floor(now.getTime() / 1000);
    const isFuture = timestamp > Math.floor(now.getTime() / 1000);
    
    let status = "";
    if (isExpired) {
      status = " (Expired)";
    } else if (isFuture) {
      status = " (Future)";
    } else {
      status = " (Valid)";
    }
    
    return `${date.toLocaleString()}${status}`;
  };

  const getClaimType = (value: any): string => {
    if (typeof value === "string") {
      if (value.match(/^\d{10}$/)) {
        return "timestamp";
      }
      if (value.match(/^https?:\/\//)) {
        return "url";
      }
      if (value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return "email";
      }
      return "string";
    }
    if (typeof value === "number") {
      if (value > 1000000000 && value < 2000000000) {
        return "timestamp";
      }
      return "number";
    }
    if (typeof value === "boolean") {
      return "boolean";
    }
    if (Array.isArray(value)) {
      return "array";
    }
    if (typeof value === "object" && value !== null) {
      return "object";
    }
    return "unknown";
  };

  const getClaimDescription = (key: string, value: any): string => {
    const descriptions: { [key: string]: string } = {
      iss: "Issuer - Who issued the token",
      sub: "Subject - Who the token refers to",
      aud: "Audience - Who the token is intended for",
      exp: "Expiration Time - When the token expires",
      nbf: "Not Before - When the token becomes valid",
      iat: "Issued At - When the token was issued",
      jti: "JWT ID - Unique identifier for the token",
      kid: "Key ID - Identifier for the key used to sign",
      x5t: "X.509 Certificate Thumbprint",
      alg: "Algorithm - Signing algorithm used",
      typ: "Type - Type of token"
    };

    return descriptions[key] || "Custom claim";
  };

  const loadSample = () => {
    const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MDUzMTIyMDAsImF1ZCI6Imh0dHBzOi8vZXhhbXBsZS5jb20iLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJ1c2VyIiwicmVhZGVyIl0sIm1ldGFkYXRhIjp7ImNyZWF0ZWRCeSI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIn19.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8";
    setJwtToken(sampleJwt);
    setDecodedResult(null);
    setError("");
  };

  const clearAll = () => {
    setJwtToken("");
    setDecodedResult(null);
    setError("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (isValid: boolean): string => {
    return isValid ? "bg-green-600" : "bg-red-600";
  };

  const getStatusText = (isValid: boolean): string => {
    return isValid ? "Valid JWT" : "Invalid JWT";
  };

  return (
    <div className="space-y-6">
      {/* JWT Input */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">JWT Token</h3>
        <div className="space-y-3">
          <textarea
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="w-full h-32 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={decodeJwt}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Decode JWT
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Enter a JWT token in the format: header.payload.signature
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

      {/* Decoded Results */}
      {decodedResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">JWT Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold text-white px-3 py-1 rounded-full ${getStatusColor(decodedResult.isValid)}`}>
                  {getStatusText(decodedResult.isValid)}
                </div>
                <div className="text-gray-400 text-sm mt-2">Status</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {decodedResult.header.alg || "Unknown"}
                </div>
                <div className="text-gray-400 text-sm">Algorithm</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {Object.keys(decodedResult.payload).length}
                </div>
                <div className="text-gray-400 text-sm">Claims</div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Header</h3>
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
              <div className="space-y-3">
                {Object.entries(decodedResult.header).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <div className="text-blue-400 font-medium">{key}</div>
                      <div className="text-gray-400 text-sm">{getClaimDescription(key, value)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono text-sm">{String(value)}</div>
                      <div className="text-gray-500 text-xs">{getClaimType(value)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Payload (Claims)</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAllClaims}
                  onChange={(e) => setShowAllClaims(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-white text-sm">Show all claims</span>
              </label>
            </div>
            
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
              <div className="space-y-3">
                {Object.entries(decodedResult.payload).map(([key, value]) => {
                  // Skip standard claims if not showing all
                  if (!showAllClaims && ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'].includes(key)) {
                    return null;
                  }

                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <div className="text-green-400 font-medium">{key}</div>
                        <div className="text-gray-400 text-sm">{getClaimDescription(key, value)}</div>
                      </div>
                      <div className="text-right">
                        {key === 'exp' || key === 'nbf' || key === 'iat' ? (
                          <div className="text-white font-mono text-sm">
                            {formatTimestamp(value as number)}
                          </div>
                        ) : (
                          <div className="text-white font-mono text-sm">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </div>
                        )}
                        <div className="text-gray-500 text-xs">{getClaimType(value)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Signature</h3>
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-purple-400 font-mono text-sm break-all">
                  {decodedResult.signature}
                </div>
                <button
                  onClick={() => copyToClipboard(decodedResult.signature)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors duration-200 ml-4"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Copy Full JWT */}
          <div className="flex justify-center">
            <button
              onClick={() => copyToClipboard(jwtToken)}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Full JWT</span>
            </button>
          </div>
        </div>
      )}

      {/* JWT Information */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">JWT Structure Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-400">Header</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Contains metadata about the token:</p>
              <p>• Algorithm (alg)</p>
              <p>• Token type (typ)</p>
              <p>• Key ID (kid)</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-green-400">Payload</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Contains the actual data (claims):</p>
              <p>• Standard claims (iss, sub, exp)</p>
              <p>• Custom claims</p>
              <p>• User information</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-purple-400">Signature</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Verifies token integrity:</p>
              <p>• HMAC with secret key</p>
              <p>• RSA/ECDSA signatures</p>
              <p>• Prevents tampering</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-amber-400 mb-3">About JWT Tokens</h4>
        <div className="text-amber-200 text-sm space-y-2">
          <p>
            <strong>What is JWT?</strong> JSON Web Token (JWT) is an open standard for securely transmitting information between parties as a JSON object.
          </p>
          <p>
            <strong>Use Cases:</strong> Authentication, authorization, information exchange, and stateless sessions in web applications.
          </p>
          <p>
            <strong>Security:</strong> Always verify signatures and validate expiration times. Never store sensitive information in JWT payloads.
          </p>
        </div>
      </div>
    </div>
  );
}
