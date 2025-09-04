"use client";

import { useState } from "react";

interface CronField {
  name: string;
  value: string;
  description: string;
  min: number;
  max: number;
  examples: string[];
}

interface NextExecution {
  date: Date;
  formatted: string;
  relative: string;
}

export default function CronParser() {
  const [cronExpression, setCronExpression] = useState("");
  const [parsedFields, setParsedFields] = useState<CronField[]>([]);
  const [nextExecutions, setNextExecutions] = useState<NextExecution[]>([]);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const cronFields: CronField[] = [
    {
      name: "Minute",
      value: "",
      description: "Minute of the hour (0-59)",
      min: 0,
      max: 59,
      examples: ["0", "30", "*/15", "0,30", "0-30"]
    },
    {
      name: "Hour",
      value: "",
      description: "Hour of the day (0-23)",
      min: 0,
      max: 23,
      examples: ["0", "12", "*/6", "9-17", "0,12,18"]
    },
    {
      name: "Day of Month",
      value: "",
      description: "Day of the month (1-31)",
      min: 1,
      max: 31,
      examples: ["1", "15", "*/7", "1-15", "1,15,31"]
    },
    {
      name: "Month",
      value: "",
      description: "Month of the year (1-12)",
      min: 1,
      max: 12,
      examples: ["1", "6", "*/3", "1-6", "1,6,12"]
    },
    {
      name: "Day of Week",
      value: "",
      description: "Day of the week (0-7, where 0 and 7 are Sunday)",
      min: 0,
      max: 7,
      examples: ["0", "1", "1-5", "0,6", "*/2"]
    }
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const parseCronExpression = () => {
    try {
      setError("");
      
      if (!cronExpression.trim()) {
        throw new Error("Cron expression cannot be empty");
      }

      const parts = cronExpression.trim().split(/\s+/);
      
      if (parts.length !== 5) {
        throw new Error("Cron expression must have exactly 5 fields: minute hour day month day-of-week");
      }

      const fields = [...cronFields];
      let isValidExpression = true;

      for (let i = 0; i < 5; i++) {
        const field = fields[i];
        const value = parts[i];
        
        if (!validateCronField(value, field.min, field.max)) {
          isValidExpression = false;
          field.value = value;
          field.description = `Invalid: ${field.description}`;
        } else {
          field.value = value;
          field.description = `${field.description} - Valid`;
        }
      }

      setParsedFields(fields);
      setIsValid(isValidExpression);

      if (isValidExpression) {
        generateNextExecutions(parts);
      } else {
        setNextExecutions([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse cron expression");
      setIsValid(false);
      setParsedFields([]);
      setNextExecutions([]);
    }
  };

  const validateCronField = (value: string, min: number, max: number): boolean => {
    // Handle special characters
    if (value === "*") return true;
    if (value === "?") return true;
    
    // Handle ranges
    if (value.includes("-")) {
      const [start, end] = value.split("-");
      const startNum = parseInt(start);
      const endNum = parseInt(end);
      return !isNaN(startNum) && !isNaN(endNum) && 
             startNum >= min && endNum <= max && startNum <= endNum;
    }
    
    // Handle lists
    if (value.includes(",")) {
      return value.split(",").every(item => {
        if (item.includes("/")) {
          const [base, step] = item.split("/");
          const baseNum = parseInt(base);
          const stepNum = parseInt(step);
          return !isNaN(baseNum) && !isNaN(stepNum) && 
                 baseNum >= min && baseNum <= max && stepNum > 0;
        }
        const num = parseInt(item);
        return !isNaN(num) && num >= min && num <= max;
      });
    }
    
    // Handle step values
    if (value.includes("/")) {
      const [base, step] = value.split("/");
      const baseNum = parseInt(base);
      const stepNum = parseInt(step);
      return !isNaN(baseNum) && !isNaN(stepNum) && 
             baseNum >= min && baseNum <= max && stepNum > 0;
    }
    
    // Handle single numbers
    const num = parseInt(value);
    return !isNaN(num) && num >= min && num <= max;
  };

  const generateNextExecutions = (parts: string[]) => {
    const now = new Date();
    const executions: NextExecution[] = [];
    
    // Generate next 5 executions
    for (let i = 0; i < 5; i++) {
      const nextExec = getNextExecution(parts, i === 0 ? now : executions[i - 1].date);
      executions.push(nextExec);
    }
    
    setNextExecutions(executions);
  };

  const getNextExecution = (parts: string[], fromDate: Date): NextExecution => {
    const date = new Date(fromDate);
    
    // Add 1 minute to start from next minute
    if (fromDate === new Date()) {
      date.setMinutes(date.getMinutes() + 1);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }
    
    // Find next valid execution time
    while (!isValidExecutionTime(date, parts)) {
      date.setMinutes(date.getMinutes() + 1);
    }
    
    return {
      date,
      formatted: date.toLocaleString(),
      relative: getRelativeTime(date)
    };
  };

  const isValidExecutionTime = (date: Date, parts: string[]): boolean => {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const dayOfWeek = date.getDay();
    
    return (
      matchesCronField(minute.toString(), parts[0], 0, 59) &&
      matchesCronField(hour.toString(), parts[1], 0, 23) &&
      matchesCronField(dayOfMonth.toString(), parts[2], 1, 31) &&
      matchesCronField(month.toString(), parts[3], 1, 12) &&
      matchesCronField(dayOfWeek.toString(), parts[4], 0, 7)
    );
  };

  const matchesCronField = (value: string, pattern: string, min: number, max: number): boolean => {
    const numValue = parseInt(value);
    
    if (pattern === "*") return true;
    if (pattern === "?") return true;
    
    // Handle ranges
    if (pattern.includes("-")) {
      const [start, end] = pattern.split("-");
      const startNum = parseInt(start);
      const endNum = parseInt(end);
      return numValue >= startNum && numValue <= endNum;
    }
    
    // Handle lists
    if (pattern.includes(",")) {
      return pattern.split(",").some(item => {
        if (item.includes("/")) {
          const [base, step] = item.split("/");
          const baseNum = parseInt(base);
          const stepNum = parseInt(step);
          return (numValue - baseNum) % stepNum === 0;
        }
        return parseInt(item) === numValue;
      });
    }
    
    // Handle step values
    if (pattern.includes("/")) {
      const [base, step] = pattern.split("/");
      const baseNum = parseInt(base);
      const stepNum = parseInt(step);
      return (numValue - baseNum) % stepNum === 0;
    }
    
    // Handle single numbers
    return parseInt(pattern) === numValue;
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `in ${days} day${days === 1 ? '' : 's'}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours === 1 ? '' : 's'}`;
    } else if (minutes > 0) {
      return `in ${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else {
      return "now";
    }
  };

  const loadSample = () => {
    setCronExpression("0 */6 * * *");
    setParsedFields([]);
    setNextExecutions([]);
    setError("");
    setIsValid(false);
  };

  const clearAll = () => {
    setCronExpression("");
    setParsedFields([]);
    setNextExecutions([]);
    setError("");
    setIsValid(false);
  };

  const getFieldColor = (field: CronField): string => {
    if (!field.value) return "border-gray-700";
    return field.description.includes("Invalid") ? "border-red-500" : "border-green-500";
  };

  const getFieldStatusColor = (field: CronField): string => {
    if (!field.value) return "bg-gray-600";
    return field.description.includes("Invalid") ? "bg-red-600" : "bg-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Cron Expression Input */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Cron Expression</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="0 */6 * * *"
            className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={parseCronExpression}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Parse
          </button>
        </div>
        
        <div className="text-sm text-gray-400">
          Format: minute hour day month day-of-week (e.g., "0 */6 * * *" for every 6 hours)
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

      {/* Parsed Fields */}
      {parsedFields.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Parsed Fields</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {parsedFields.map((field, index) => (
              <div key={index} className={`bg-gray-800/50 border rounded-xl p-4 ${getFieldColor(field)}`}>
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getFieldStatusColor(field)}`}>
                      {field.name}
                    </span>
                  </div>
                  
                  <div className="text-2xl font-bold text-white font-mono">
                    {field.value}
                  </div>
                  
                  <div className="text-xs text-gray-400 text-center">
                    {field.description}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Range: {field.min}-{field.max}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Executions */}
      {nextExecutions.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Next Executions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {nextExecutions.map((exec, index) => (
              <div key={index} className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-4">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold text-blue-400">
                    {index === 0 ? "Next" : `#${index + 1}`}
                  </div>
                  
                  <div className="text-sm text-white font-mono">
                    {exec.date.toLocaleDateString()}
                  </div>
                  
                  <div className="text-lg font-bold text-white">
                    {exec.date.toLocaleTimeString()}
                  </div>
                  
                  <div className="text-xs text-blue-300">
                    {exec.relative}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cron Examples */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Common Cron Examples</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-400">Time-based</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">0 */6 * * *</span>
                <span className="text-gray-400">Every 6 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">0 9 * * 1-5</span>
                <span className="text-gray-400">Weekdays at 9 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">0 0 1 * *</span>
                <span className="text-gray-400">Monthly at midnight</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-green-400">Interval-based</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">*/15 * * * *</span>
                <span className="text-gray-400">Every 15 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">0 */2 * * *</span>
                <span className="text-gray-400">Every 2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-mono">0 0 */3 * *</span>
                <span className="text-gray-400">Every 3 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-indigo-400 mb-3">About Cron Expressions</h4>
        <div className="text-indigo-200 text-sm space-y-2">
          <p>
            <strong>What is Cron?</strong> Cron is a time-based job scheduler in Unix-like operating systems. Cron expressions define when recurring jobs should run.
          </p>
          <p>
            <strong>Format:</strong> Five fields separated by spaces: minute hour day month day-of-week
          </p>
          <p>
            <strong>Special Characters:</strong> * (any value), ? (no specific value), / (step values), - (ranges), , (lists)
          </p>
        </div>
      </div>
    </div>
  );
}
