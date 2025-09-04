"use client";

import { useState } from "react";

interface OgMetaData {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  type: string;
  locale: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
}

export default function OgMetaGenerator() {
  const [metaData, setMetaData] = useState<OgMetaData>({
    title: "",
    description: "",
    url: "",
    image: "",
    siteName: "",
    type: "website",
    locale: "en_US",
    twitterCard: "summary_large_image",
    twitterSite: "",
    twitterCreator: ""
  });

  const [generatedHtml, setGeneratedHtml] = useState("");
  const [previewData, setPreviewData] = useState<OgMetaData | null>(null);

  const handleInputChange = (field: keyof OgMetaData, value: string) => {
    setMetaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateMetaTags = () => {
    const tags = [
      // Open Graph tags
      `<meta property="og:title" content="${metaData.title}" />`,
      `<meta property="og:description" content="${metaData.description}" />`,
      `<meta property="og:url" content="${metaData.url}" />`,
      `<meta property="og:image" content="${metaData.image}" />`,
      `<meta property="og:site_name" content="${metaData.siteName}" />`,
      `<meta property="og:type" content="${metaData.type}" />`,
      `<meta property="og:locale" content="${metaData.locale}" />`,
      
      // Twitter Card tags
      `<meta name="twitter:card" content="${metaData.twitterCard}" />`,
      `<meta name="twitter:title" content="${metaData.title}" />`,
      `<meta name="twitter:description" content="${metaData.description}" />`,
      `<meta name="twitter:image" content="${metaData.image}" />`
    ];

    // Add optional Twitter tags
    if (metaData.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${metaData.twitterSite}" />`);
    }
    if (metaData.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${metaData.twitterCreator}" />`);
    }

    // Add basic meta tags
    tags.unshift(
      `<meta name="description" content="${metaData.description}" />`,
      `<meta name="author" content="${metaData.siteName}" />`
    );

    const html = tags.join('\n');
    setGeneratedHtml(html);
    setPreviewData({ ...metaData });
  };

  const loadSample = () => {
    const sampleData: OgMetaData = {
      title: "Amazing Product - Transform Your Life Today",
      description: "Discover the revolutionary product that will change everything. Learn how thousands of users have already transformed their lives with our innovative solution.",
      url: "https://example.com/amazing-product",
      image: "https://example.com/images/product-preview.jpg",
      siteName: "Example Company",
      type: "product",
      locale: "en_US",
      twitterCard: "summary_large_image",
      twitterSite: "@examplecompany",
      twitterCreator: "@productteam"
    };
    
    setMetaData(sampleData);
    setGeneratedHtml("");
    setPreviewData(null);
  };

  const clearAll = () => {
    const emptyData: OgMetaData = {
      title: "",
      description: "",
      url: "",
      image: "",
      siteName: "",
      type: "website",
      locale: "en_US",
      twitterCard: "summary_large_image",
      twitterSite: "",
      twitterCreator: ""
    };
    
    setMetaData(emptyData);
    setGeneratedHtml("");
    setPreviewData(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeOptions = () => [
    { value: "website", label: "Website" },
    { value: "article", label: "Article" },
    { value: "book", label: "Book" },
    { value: "profile", label: "Profile" },
    { value: "music.song", label: "Music Song" },
    { value: "music.album", label: "Music Album" },
    { value: "music.playlist", label: "Music Playlist" },
    { value: "music.radio_station", label: "Music Radio Station" },
    { value: "video.movie", label: "Video Movie" },
    { value: "video.episode", label: "Video Episode" },
    { value: "video.tv_show", label: "Video TV Show" },
    { value: "video.other", label: "Video Other" },
    { value: "product", label: "Product" },
    { value: "business.business", label: "Business" }
  ];

  const getLocaleOptions = () => [
    { value: "en_US", label: "English (US)" },
    { value: "en_GB", label: "English (UK)" },
    { value: "es_LA", label: "Spanish (Latin America)" },
    { value: "es_ES", label: "Spanish (Spain)" },
    { value: "fr_FR", label: "French (France)" },
    { value: "de_DE", label: "German (Germany)" },
    { value: "it_IT", label: "Italian (Italy)" },
    { value: "pt_BR", label: "Portuguese (Brazil)" },
    { value: "pt_PT", label: "Portuguese (Portugal)" },
    { value: "ru_RU", label: "Russian (Russia)" },
    { value: "ja_JP", label: "Japanese (Japan)" },
    { value: "ko_KR", label: "Korean (Korea)" },
    { value: "zh_CN", label: "Chinese (Simplified)" },
    { value: "zh_TW", label: "Chinese (Traditional)" }
  ];

  const getTwitterCardOptions = () => [
    { value: "summary", label: "Summary" },
    { value: "summary_large_image", label: "Summary Large Image" },
    { value: "app", label: "App" },
    { value: "player", label: "Player" }
  ];

  return (
    <div className="space-y-6">
      {/* Meta Data Form */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Open Graph Meta Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium text-sm mb-2">Title *</label>
              <input
                type="text"
                value={metaData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter page title..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">Description *</label>
              <textarea
                value={metaData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter page description..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">URL *</label>
              <input
                type="url"
                value={metaData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">Image URL *</label>
              <input
                type="url"
                value={metaData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium text-sm mb-2">Site Name</label>
              <input
                type="text"
                value={metaData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="Your Company Name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">Content Type</label>
              <select
                value={metaData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">Locale</label>
              <select
                value={metaData.locale}
                onChange={(e) => handleInputChange('locale', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getLocaleOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">Twitter Card Type</label>
              <select
                value={metaData.twitterCard}
                onChange={(e) => handleInputChange('twitterCard', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getTwitterCardOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">Twitter Site (@username)</label>
              <input
                type="text"
                value={metaData.twitterSite}
                onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                placeholder="@company"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-2">Twitter Creator (@username)</label>
              <input
                type="text"
                value={metaData.twitterCreator}
                onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
                placeholder="@author"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateMetaTags}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Generate Meta Tags
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

      {/* Generated HTML */}
      {generatedHtml && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Generated Meta Tags</h3>
          
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">HTML Code</h4>
              <button
                onClick={() => copyToClipboard(generatedHtml)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
              >
                Copy HTML
              </button>
            </div>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code className="text-green-400 text-sm">{generatedHtml}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Social Media Preview */}
      {previewData && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-white text-center">Social Media Preview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook/Open Graph Preview */}
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-4">Facebook / Open Graph</h4>
              <div className="bg-white rounded-lg p-4 text-black">
                <div className="space-y-3">
                  {previewData.image && (
                    <img 
                      src={previewData.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="text-sm text-gray-500 uppercase tracking-wide">
                    {previewData.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {previewData.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {previewData.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Twitter Preview */}
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-4">Twitter Card</h4>
              <div className="bg-white rounded-lg p-4 text-black">
                <div className="space-y-3">
                  {previewData.image && (
                    <img 
                      src={previewData.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="text-sm text-gray-500">
                    {previewData.twitterSite && `${previewData.twitterSite} • `}
                    {previewData.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {previewData.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {previewData.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Graph Information */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Open Graph Meta Tags Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-blue-400">What are Open Graph Tags?</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Open Graph meta tags control how your content appears when shared on social media platforms like Facebook, LinkedIn, and Twitter.</p>
              <p>They provide rich previews with images, titles, and descriptions instead of plain URLs.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-green-400">Key Benefits</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Better social media engagement</p>
              <p>• Professional appearance when shared</p>
              <p>• Increased click-through rates</p>
              <p>• Better SEO and social signals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">About Open Graph Meta Tags</h4>
        <div className="text-blue-200 text-sm space-y-2">
          <p>
            <strong>Purpose:</strong> Open Graph meta tags were created by Facebook to standardize how web pages are represented when shared on social media.
          </p>
          <p>
            <strong>Platforms:</strong> Supported by Facebook, LinkedIn, Twitter, WhatsApp, Telegram, and many other social platforms.
          </p>
          <p>
            <strong>Best Practices:</strong> Use compelling titles (50-60 characters), descriptive summaries (150-160 characters), and high-quality images (1200x630px recommended).
          </p>
        </div>
      </div>
    </div>
  );
}
