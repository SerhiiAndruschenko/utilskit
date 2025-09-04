"use client";

import { useState } from "react";

interface ValidationError {
  path: string;
  message: string;
  schemaPath: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export default function JsonSchemaValidator() {
  const [jsonData, setJsonData] = useState("");
  const [jsonSchema, setJsonSchema] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState("");

  const validate = () => {
    try {
      setError("");
      
      // Parse JSON data
      const data = JSON.parse(jsonData);
      
      // Parse JSON schema
      const schema = JSON.parse(jsonSchema);
      
      // Simple validation logic (in a real app, you'd use a proper JSON Schema validator)
      const result = validateAgainstSchema(data, schema);
      setValidationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
      setValidationResult(null);
    }
  };

  const validateAgainstSchema = (data: any, schema: any, path = ""): ValidationResult => {
    const errors: ValidationError[] = [];

    // Check required properties
    if (schema.required && Array.isArray(schema.required)) {
      for (const requiredProp of schema.required) {
        if (!(requiredProp in data)) {
          errors.push({
            path: path ? `${path}.${requiredProp}` : requiredProp,
            message: `Missing required property: ${requiredProp}`,
            schemaPath: "/required"
          });
        }
      }
    }

    // Check type constraints
    if (schema.type) {
      const actualType = Array.isArray(data) ? "array" : typeof data;
      if (actualType !== schema.type) {
        errors.push({
          path: path || "/",
          message: `Expected type "${schema.type}", got "${actualType}"`,
          schemaPath: "/type"
        });
      }
    }

    // Check string constraints
    if (schema.type === "string" && typeof data === "string") {
      if (schema.minLength && data.length < schema.minLength) {
        errors.push({
          path: path || "/",
          message: `String length ${data.length} is less than minimum ${schema.minLength}`,
          schemaPath: "/minLength"
        });
      }
      if (schema.maxLength && data.length > schema.maxLength) {
        errors.push({
          path: path || "/",
          message: `String length ${data.length} is greater than maximum ${schema.maxLength}`,
          schemaPath: "/maxLength"
        });
      }
      if (schema.pattern) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(data)) {
          errors.push({
            path: path || "/",
            message: `String does not match pattern: ${schema.pattern}`,
            schemaPath: "/pattern"
          });
        }
      }
    }

    // Check number constraints
    if (schema.type === "number" && typeof data === "number") {
      if (schema.minimum !== undefined && data < schema.minimum) {
        errors.push({
          path: path || "/",
          message: `Value ${data} is less than minimum ${schema.minimum}`,
          schemaPath: "/minimum"
        });
      }
      if (schema.maximum !== undefined && data > schema.maximum) {
        errors.push({
          path: path || "/",
          message: `Value ${data} is greater than maximum ${schema.maximum}`,
          schemaPath: "/maximum"
        });
      }
    }

    // Check array constraints
    if (schema.type === "array" && Array.isArray(data)) {
      if (schema.minItems && data.length < schema.minItems) {
        errors.push({
          path: path || "/",
          message: `Array length ${data.length} is less than minimum ${schema.minItems}`,
          schemaPath: "/minItems"
        });
      }
      if (schema.maxItems && data.length > schema.maxItems) {
        errors.push({
          path: path || "/",
          message: `Array length ${data.length} is greater than maximum ${schema.maxItems}`,
          schemaPath: "/maxItems"
        });
      }
      
      // Validate array items if schema is provided
      if (schema.items) {
        data.forEach((item, index) => {
          const itemErrors = validateAgainstSchema(item, schema.items, `${path}[${index}]`);
          errors.push(...itemErrors.errors);
        });
      }
    }

    // Check object properties
    if (schema.type === "object" && typeof data === "object" && !Array.isArray(data)) {
      if (schema.properties) {
        for (const [propName, propValue] of Object.entries(data)) {
          if (schema.properties[propName]) {
            const propErrors = validateAgainstSchema(propValue, schema.properties[propName], path ? `${path}.${propName}` : propName);
            errors.push(...propErrors.errors);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const loadSampleData = () => {
    const sampleData = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
      },
      hobbies: ["reading", "swimming"]
    };

    setJsonData(JSON.stringify(sampleData, null, 2));
  };

  const loadSampleSchema = () => {
    const sampleSchema = {
      type: "object",
      required: ["name", "age", "email"],
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 50
        },
        age: {
          type: "number",
          minimum: 0,
          maximum: 150
        },
        email: {
          type: "string",
          pattern: "^[^@]+@[^@]+\\.[^@]+$"
        },
        address: {
          type: "object",
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            zipCode: { type: "string" }
          }
        },
        hobbies: {
          type: "array",
          minItems: 1,
          maxItems: 10,
          items: { type: "string" }
        }
      }
    };

    setJsonSchema(JSON.stringify(sampleSchema, null, 2));
  };

  const clearAll = () => {
    setJsonData("");
    setJsonSchema("");
    setValidationResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={validate}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Validate JSON
        </button>
        <button
          onClick={loadSampleData}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Load Sample Data
        </button>
        <button
          onClick={loadSampleSchema}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Load Sample Schema
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

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Data */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">JSON Data</h3>
            <span className="text-sm text-gray-400">
              {jsonData.length} characters
            </span>
          </div>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Paste your JSON data here..."
            className="w-full h-80 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* JSON Schema */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">JSON Schema</h3>
            <span className="text-sm text-gray-400">
              {jsonSchema.length} characters
            </span>
          </div>
          <textarea
            value={jsonSchema}
            onChange={(e) => setJsonSchema(e.target.value)}
            placeholder="Paste your JSON Schema here..."
            className="w-full h-80 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Validation Results</h3>
          
          {/* Summary */}
          <div className={`rounded-xl p-6 border ${
            validationResult.valid 
              ? "bg-green-900/30 border-green-500/50" 
              : "bg-red-900/30 border-red-500/50"
          }`}>
            <div className="flex items-center justify-center space-x-3">
              {validationResult.valid ? (
                <>
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-2xl font-bold text-green-400">Validation Passed</span>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-2xl font-bold text-red-400">Validation Failed</span>
                </>
              )}
            </div>
            
            <div className="text-center mt-4">
              <span className="text-gray-300">
                {validationResult.valid 
                  ? "Your JSON data is valid according to the schema!" 
                  : `Found ${validationResult.errors.length} validation error(s)`
                }
              </span>
            </div>
          </div>

          {/* Error Details */}
          {!validationResult.valid && validationResult.errors.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white text-center">Error Details</h4>
              
              <div className="space-y-3">
                {validationResult.errors.map((error, index) => (
                  <div key={index} className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="text-red-300 font-mono text-sm">
                          <strong>Path:</strong> {error.path || "/"}
                        </div>
                        <div className="text-red-200">
                          <strong>Error:</strong> {error.message}
                        </div>
                        <div className="text-red-300 text-sm">
                          <strong>Schema Path:</strong> {error.schemaPath}
                        </div>
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
      <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-indigo-400 mb-3">About JSON Schema Validation</h4>
        <div className="text-indigo-200 text-sm space-y-2">
          <p>
            <strong>What is JSON Schema?</strong> JSON Schema is a specification for validating JSON documents. It defines the structure, data types, and constraints for JSON data.
          </p>
          <p>
            <strong>Supported Features:</strong> Type validation, required properties, string constraints (length, patterns), number constraints (min/max), array constraints, and nested object validation.
          </p>
          <p>
            <strong>Common Use Cases:</strong> API validation, configuration validation, data quality checks, and ensuring data consistency.
          </p>
        </div>
      </div>
    </div>
  );
}
