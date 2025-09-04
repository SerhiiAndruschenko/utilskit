"use client";

import { useState } from "react";

interface ManifestData {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  orientation: string;
  theme_color: string;
  background_color: string;
  scope: string;
  lang: string;
  categories: string[];
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
    form_factor?: string;
  }>;
}

export default function ManifestGenerator() {
  const [manifestData, setManifestData] = useState<ManifestData>({
    name: "My Web App",
    short_name: "WebApp",
    description: "A Progressive Web Application",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#000000",
    background_color: "#ffffff",
    scope: "/",
    lang: "en",
    categories: ["productivity"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    screenshots: [],
  });

  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const displayOptions = [
    { value: "standalone", label: "Standalone (Full screen)" },
    { value: "minimal-ui", label: "Minimal UI" },
    { value: "fullscreen", label: "Fullscreen" },
    { value: "browser", label: "Browser" },
  ];

  const orientationOptions = [
    { value: "portrait", label: "Portrait" },
    { value: "landscape", label: "Landscape" },
    { value: "any", label: "Any" },
  ];

  const categoryOptions = [
    "productivity",
    "business",
    "education",
    "entertainment",
    "finance",
    "fitness",
    "food",
    "games",
    "health",
    "lifestyle",
    "medical",
    "music",
    "navigation",
    "news",
    "photo",
    "shopping",
    "social",
    "sports",
    "travel",
    "utilities",
  ];

  const updateField = (field: keyof ManifestData, value: any) => {
    setManifestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateArrayField = (
    field: keyof ManifestData,
    index: number,
    value: any
  ) => {
    setManifestData((prev) => ({
      ...prev,
      [field]: ((prev[field] as any[]) || []).map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const addArrayItem = (field: keyof ManifestData, template: any) => {
    setManifestData((prev) => ({
      ...prev,
      [field]: [...((prev[field] as any[]) || []), template],
    }));
  };

  const removeArrayItem = (field: keyof ManifestData, index: number) => {
    setManifestData((prev) => ({
      ...prev,
      [field]: ((prev[field] as any[]) || []).filter((_, i) => i !== index),
    }));
  };

  const generateManifest = () => {
    try {
      setError("");
      const manifest = {
        ...manifestData,
        categories: manifestData.categories.filter((cat) => cat.trim() !== ""),
        screenshots:
          manifestData.screenshots?.filter(
            (screenshot) => screenshot.src && screenshot.sizes
          ) || [],
      };

      const jsonOutput = JSON.stringify(manifest, null, 2);
      setOutput(jsonOutput);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error generating manifest"
      );
    }
  };

  const loadTemplate = (template: string) => {
    const templates: Record<string, ManifestData> = {
      basic: {
        name: "Basic Web App",
        short_name: "Basic",
        description: "A basic Progressive Web Application",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#000000",
        background_color: "#ffffff",
        scope: "/",
        lang: "en",
        categories: ["productivity"],
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [],
      },
      ecommerce: {
        name: "E-commerce Store",
        short_name: "Store",
        description: "Online shopping experience",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        scope: "/",
        lang: "en",
        categories: ["shopping", "business"],
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [],
      },
      social: {
        name: "Social Network",
        short_name: "Social",
        description: "Connect with friends and family",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#8b5cf6",
        background_color: "#ffffff",
        scope: "/",
        lang: "en",
        categories: ["social", "entertainment"],
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [],
      },
    };

    if (templates[template]) {
      setManifestData(templates[template]);
      setOutput("");
    }
  };

  const clearAll = () => {
    setManifestData({
      name: "",
      short_name: "",
      description: "",
      start_url: "/",
      display: "standalone",
      orientation: "portrait",
      theme_color: "#000000",
      background_color: "#ffffff",
      scope: "/",
      lang: "en",
      categories: [],
      icons: [],
      screenshots: [],
    });
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Template Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => loadTemplate("basic")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Load Basic Template
        </button>
        <button
          onClick={() => loadTemplate("ecommerce")}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Load E-commerce Template
        </button>
        <button
          onClick={() => loadTemplate("social")}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Load Social Template
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-400 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">
            Manifest Configuration
          </h3>

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-blue-200">
              Basic Information
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                App Name *
              </label>
              <input
                type="text"
                value={manifestData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full p-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Web App"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Name *
              </label>
              <input
                type="text"
                value={manifestData.short_name}
                onChange={(e) => updateField("short_name", e.target.value)}
                className="w-full p-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="WebApp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={manifestData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full p-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="A Progressive Web Application"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start URL *
              </label>
              <input
                type="text"
                value={manifestData.start_url}
                onChange={(e) => updateField("start_url", e.target.value)}
                className="w-full p-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/"
              />
            </div>
          </div>

          {/* Display Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-blue-200">
              Display Settings
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Mode
              </label>
              <select
                value={manifestData.display}
                onChange={(e) => updateField("display", e.target.value)}
                className="w-full p-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {displayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Orientation
              </label>
              <select
                value={manifestData.orientation}
                onChange={(e) => updateField("orientation", e.target.value)}
                className="w-full p-3 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {orientationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme Color
                </label>
                <input
                  type="color"
                  value={manifestData.theme_color}
                  onChange={(e) => updateField("theme_color", e.target.value)}
                  className="w-full h-12 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  value={manifestData.background_color}
                  onChange={(e) =>
                    updateField("background_color", e.target.value)
                  }
                  className="w-full h-12 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-blue-200">Categories</h4>
            <div className="space-y-2">
              {manifestData.categories.map((category, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={category}
                    onChange={(e) =>
                      updateArrayField("categories", index, e.target.value)
                    }
                    className="flex-1 p-2 bg-gray-800/80 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeArrayItem("categories", index)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem("categories", "")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-blue-200">Icons</h4>
            <div className="space-y-3">
              {manifestData.icons.map((icon, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-800/50 rounded-lg space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={icon.src}
                      onChange={(e) =>
                        updateArrayField("icons", index, {
                          ...icon,
                          src: e.target.value,
                        })
                      }
                      className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Icon path"
                    />
                    <input
                      type="text"
                      value={icon.sizes}
                      onChange={(e) =>
                        updateArrayField("icons", index, {
                          ...icon,
                          sizes: e.target.value,
                        })
                      }
                      className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="192x192"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={icon.type}
                      onChange={(e) =>
                        updateArrayField("icons", index, {
                          ...icon,
                          type: e.target.value,
                        })
                      }
                      className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/svg+xml">SVG</option>
                      <option value="image/webp">WebP</option>
                    </select>
                    <input
                      type="text"
                      value={icon.purpose || ""}
                      onChange={(e) =>
                        updateArrayField("icons", index, {
                          ...icon,
                          purpose: e.target.value,
                        })
                      }
                      className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Purpose (optional)"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem("icons", index)}
                    className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
                  >
                    Remove Icon
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  addArrayItem("icons", {
                    src: "/icon-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "any maskable",
                  })
                }
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Add Icon
              </button>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-blue-200">Screenshots</h4>
          <div className="space-y-3">
            {manifestData.screenshots?.map((screenshot, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800/50 rounded-lg space-y-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={screenshot.src}
                    onChange={(e) =>
                      updateArrayField("screenshots", index, {
                        ...screenshot,
                        src: e.target.value,
                      })
                    }
                    className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Screenshot path"
                  />
                  <input
                    type="text"
                    value={screenshot.sizes}
                    onChange={(e) =>
                      updateArrayField("screenshots", index, {
                        ...screenshot,
                        sizes: e.target.value,
                      })
                    }
                    className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1280x720"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={screenshot.type}
                    onChange={(e) =>
                      updateArrayField("screenshots", index, {
                        ...screenshot,
                        type: e.target.value,
                      })
                    }
                    className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                  <select
                    value={screenshot.form_factor || ""}
                    onChange={(e) =>
                      updateArrayField("screenshots", index, {
                        ...screenshot,
                        form_factor: e.target.value,
                      })
                    }
                    className="p-2 bg-gray-700/80 border border-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any form factor</option>
                    <option value="narrow">Narrow (Mobile)</option>
                    <option value="wide">Wide (Desktop)</option>
                  </select>
                </div>
                <button
                  onClick={() => removeArrayItem("screenshots", index)}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
                >
                  Remove Screenshot
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem("screenshots", {
                  src: "/screenshots/desktop.png",
                  sizes: "1280x720",
                  type: "image/png",
                  form_factor: "wide",
                })
              }
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Add Screenshot
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={generateManifest}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Generate Manifest
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Clear All
          </button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Generated Manifest
            </h3>
            {output && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy</span>
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Generated manifest will appear here..."
            className="w-full h-96 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
