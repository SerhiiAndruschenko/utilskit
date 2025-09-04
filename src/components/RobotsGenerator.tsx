"use client";

import { useState } from "react";

interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
  sitemap?: string[];
}

interface RobotsTemplate {
  name: string;
  description: string;
  rules: RobotsRule[];
  sitemaps: string[];
  customRules: string;
}

export default function RobotsGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("custom");
  const [customRules, setCustomRules] = useState("");
  const [sitemaps, setSitemaps] = useState<string[]>([""]);
  const [rules, setRules] = useState<RobotsRule[]>([
    {
      userAgent: "*",
      allow: [],
      disallow: [],
      crawlDelay: undefined
    }
  ]);
  const [generatedRobots, setGeneratedRobots] = useState("");

  const templates: { [key: string]: RobotsTemplate } = {
    "custom": {
      name: "Custom",
      description: "Build your own robots.txt from scratch",
      rules: [],
      sitemaps: [],
      customRules: ""
    },
    "allow-all": {
      name: "Allow All",
      description: "Allow all search engines to crawl everything",
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: [],
          crawlDelay: undefined
        }
      ],
      sitemaps: [],
      customRules: ""
    },
    "block-all": {
      name: "Block All",
      description: "Block all search engines from crawling",
      rules: [
        {
          userAgent: "*",
          allow: [],
          disallow: ["/"],
          crawlDelay: undefined
        }
      ],
      sitemaps: [],
      customRules: ""
    },
    "ecommerce": {
      name: "E-commerce",
      description: "Typical e-commerce site configuration",
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: [
            "/admin/",
            "/private/",
            "/checkout/",
            "/cart/",
            "/user/",
            "/api/",
            "*.pdf",
            "*.doc",
            "*.docx"
          ],
          crawlDelay: 1
        }
      ],
      sitemaps: ["https://example.com/sitemap.xml"],
      customRules: ""
    },
    "blog": {
      name: "Blog",
      description: "Blog site configuration",
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
          disallow: [
            "/admin/",
            "/draft/",
            "/private/",
            "/api/",
            "*.log"
          ],
          crawlDelay: 1
        }
      ],
      sitemaps: ["https://example.com/sitemap.xml"],
      customRules: ""
    },
    "api": {
      name: "API Site",
      description: "API documentation site configuration",
      rules: [
        {
          userAgent: "*",
          allow: ["/", "/docs/", "/examples/"],
          disallow: [
            "/admin/",
            "/private/",
            "/api/v1/",
            "/api/v2/",
            "*.json",
            "*.xml"
          ],
          crawlDelay: 2
        }
      ],
      sitemaps: ["https://example.com/sitemap.xml"],
      customRules: ""
    }
  };

  const addRule = () => {
    setRules([...rules, {
      userAgent: "*",
      allow: [],
      disallow: [],
      crawlDelay: undefined
    }]);
  };

  const removeRule = (index: number) => {
    if (rules.length > 1) {
      setRules(rules.filter((_, i) => i !== index));
    }
  };

  const updateRule = (index: number, field: keyof RobotsRule, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const addAllowPath = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].allow.push("");
    setRules(newRules);
  };

  const removeAllowPath = (ruleIndex: number, pathIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].allow.splice(pathIndex, 1);
    setRules(newRules);
  };

  const updateAllowPath = (ruleIndex: number, pathIndex: number, value: string) => {
    const newRules = [...rules];
    newRules[ruleIndex].allow[pathIndex] = value;
    setRules(newRules);
  };

  const addDisallowPath = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].disallow.push("");
    setRules(newRules);
  };

  const removeDisallowPath = (ruleIndex: number, pathIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].disallow.splice(pathIndex, 1);
    setRules(newRules);
  };

  const updateDisallowPath = (ruleIndex: number, pathIndex: number, value: string) => {
    const newRules = [...rules];
    newRules[ruleIndex].disallow[pathIndex] = value;
    setRules(newRules);
  };

  const addSitemap = () => {
    setSitemaps([...sitemaps, ""]);
  };

  const removeSitemap = (index: number) => {
    if (sitemaps.length > 1) {
      setSitemaps(sitemaps.filter((_, i) => i !== index));
    }
  };

  const updateSitemap = (index: number, value: string) => {
    const newSitemaps = [...sitemaps];
    newSitemaps[index] = value;
    setSitemaps(newSitemaps);
  };

  const selectTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
    if (templateName !== "custom") {
      const template = templates[templateName];
      setRules(template.rules);
      setSitemaps(template.sitemaps);
      setCustomRules(template.customRules);
    }
  };

  const generateRobots = () => {
    let robotsContent = "";
    
    // Add rules
    rules.forEach(rule => {
      robotsContent += `User-agent: ${rule.userAgent}\n`;
      
      rule.allow.forEach(path => {
        if (path.trim()) {
          robotsContent += `Allow: ${path}\n`;
        }
      });
      
      rule.disallow.forEach(path => {
        if (path.trim()) {
          robotsContent += `Disallow: ${path}\n`;
        }
      });
      
      if (rule.crawlDelay) {
        robotsContent += `Crawl-delay: ${rule.crawlDelay}\n`;
      }
      
      robotsContent += "\n";
    });
    
    // Add sitemaps
    sitemaps.forEach(sitemap => {
      if (sitemap.trim()) {
        robotsContent += `Sitemap: ${sitemap}\n`;
      }
    });
    
    // Add custom rules
    if (customRules.trim()) {
      robotsContent += `\n# Custom Rules\n${customRules}`;
    }
    
    setGeneratedRobots(robotsContent.trim());
  };

  const loadSample = () => {
    setSelectedTemplate("ecommerce");
    selectTemplate("ecommerce");
  };

  const clearAll = () => {
    setRules([{
      userAgent: "*",
      allow: [],
      disallow: [],
      crawlDelay: undefined
    }]);
    setSitemaps([""]);
    setCustomRules("");
    setGeneratedRobots("");
    setSelectedTemplate("custom");
  };

  const copyRobots = () => {
    if (generatedRobots) {
      navigator.clipboard.writeText(generatedRobots);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Choose Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(templates).map(([key, template]) => (
            <div
              key={key}
              onClick={() => selectTemplate(key)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedTemplate === key
                  ? "border-blue-500 bg-blue-900/30"
                  : "border-gray-700/50 bg-gray-800/50 hover:border-gray-500/50"
              }`}
            >
              <h4 className="text-lg font-semibold text-white mb-2">{template.name}</h4>
              <p className="text-sm text-gray-300">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Robots Rules</h3>
          <button
            onClick={addRule}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            Add Rule
          </button>
        </div>
        
        {rules.map((rule, ruleIndex) => (
          <div key={ruleIndex} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Rule {ruleIndex + 1}</h4>
              {rules.length > 1 && (
                <button
                  onClick={() => removeRule(ruleIndex)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white font-medium mb-2">User-agent</label>
                <input
                  type="text"
                  value={rule.userAgent}
                  onChange={(e) => updateRule(ruleIndex, "userAgent", e.target.value)}
                  placeholder="* (all robots)"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Crawl-delay (seconds)</label>
                <input
                  type="number"
                  value={rule.crawlDelay || ""}
                  onChange={(e) => updateRule(ruleIndex, "crawlDelay", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Allow Paths */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white font-medium">Allow Paths</label>
                <button
                  onClick={() => addAllowPath(ruleIndex)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm"
                >
                  Add Path
                </button>
              </div>
              <div className="space-y-2">
                {rule.allow.map((path, pathIndex) => (
                  <div key={pathIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={path}
                      onChange={(e) => updateAllowPath(ruleIndex, pathIndex, e.target.value)}
                      placeholder="/ (allow all) or specific path"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeAllowPath(ruleIndex, pathIndex)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Disallow Paths */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white font-medium">Disallow Paths</label>
                <button
                  onClick={() => addDisallowPath(ruleIndex)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm"
                >
                  Add Path
                </button>
              </div>
              <div className="space-y-2">
                {rule.disallow.map((path, pathIndex) => (
                  <div key={pathIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={path}
                      onChange={(e) => updateDisallowPath(ruleIndex, pathIndex, e.target.value)}
                      placeholder="/ (disallow all) or specific path"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeDisallowPath(ruleIndex, pathIndex)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sitemaps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Sitemaps</h3>
          <button
            onClick={addSitemap}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            Add Sitemap
          </button>
        </div>
        
        <div className="space-y-2">
          {sitemaps.map((sitemap, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="url"
                value={sitemap}
                onChange={(e) => updateSitemap(index, e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {sitemaps.length > 1 && (
                <button
                  onClick={() => removeSitemap(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Rules */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Custom Rules</h3>
        <textarea
          value={customRules}
          onChange={(e) => setCustomRules(e.target.value)}
          placeholder="Add any additional robots.txt directives or comments here..."
          className="w-full h-32 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateRobots}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Generate Robots.txt
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

      {/* Generated Output */}
      {generatedRobots && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Generated robots.txt</h3>
            <button
              onClick={copyRobots}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Copy to Clipboard
            </button>
          </div>
          
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
            <pre className="text-white font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {generatedRobots}
            </pre>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-cyan-400 mb-3">About robots.txt</h4>
        <div className="text-cyan-200 text-sm space-y-2">
          <p>
            <strong>What is robots.txt?</strong> A text file that tells search engine crawlers which pages or sections of your website they can or can't crawl.
          </p>
          <p>
            <strong>User-agent:</strong> Specifies which search engine the rule applies to. Use "*" for all robots.
          </p>
          <p>
            <strong>Allow/Disallow:</strong> Specify which paths robots can or cannot access. Use "/" to allow/disallow everything.
          </p>
          <p>
            <strong>Crawl-delay:</strong> Sets the minimum time (in seconds) between successive requests from the same robot.
          </p>
          <p>
            <strong>Sitemap:</strong> Points to your XML sitemap to help search engines discover and index your pages.
          </p>
        </div>
      </div>
    </div>
  );
}
