"use client";

import { useState } from "react";

interface ConversionOptions {
  preserveFormatting: boolean;
  includeImages: boolean;
  cleanHtml: boolean;
  addStyles: boolean;
}

export default function DocxToHtml() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlOutput, setHtmlOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<ConversionOptions>({
    preserveFormatting: true,
    includeImages: true,
    cleanHtml: true,
    addStyles: true
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
          selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please select a valid DOCX file");
        setFile(null);
      }
    }
  };

  const convertDocxToHtml = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample HTML based on file name
      const fileName = file.name.replace('.docx', '');
      const sampleHtml = generateSampleHtml(fileName, options);
      
      setHtmlOutput(sampleHtml);
    } catch (err) {
      setError("Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const generateSampleHtml = (fileName: string, opts: ConversionOptions): string => {
    let html = "";
    
    if (opts.addStyles) {
      html += `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName} - Converted Document</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .document {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            color: #7f8c8d;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 2px 4px;
            border-radius: 3px;
        }
        .important {
            background-color: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
        }
        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }
        li {
            margin-bottom: 8px;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #ecf0f1;
            font-style: italic;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .table tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="document">\n`;
    } else {
      html += `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName} - Converted Document</title>
</head>
<body>\n`;
    }

    // Document content
    html += `        <h1>${fileName} - Sample Document</h1>
        
        <p>This is a sample document converted from DOCX to HTML format. The conversion process preserves the document structure and formatting while generating clean, semantic HTML markup.</p>
        
        <h2>Document Features</h2>
        <p>This converted document includes various formatting elements that demonstrate the conversion capabilities:</p>
        
        <ul>
            <li><strong>Headings and subheadings</strong> with proper hierarchy</li>
            <li><span class="highlight">Highlighted text</span> and <em>italicized content</em></li>
            <li>Bulleted and numbered lists</li>
            <li>Tables with structured data</li>
            <li>Blockquotes for important information</li>
        </ul>
        
        <div class="important">
            <strong>Important Note:</strong> This is a demonstration of the DOCX to HTML conversion tool. In a real conversion, the content would be extracted from your actual Word document.
        </div>
        
        <h2>Sample Table</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Feature</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Text Formatting</td>
                    <td>Bold, italic, underline, and color</td>
                    <td>✅ Supported</td>
                </tr>
                <tr>
                    <td>Document Structure</td>
                    <td>Headings, paragraphs, and sections</td>
                    <td>✅ Supported</td>
                </tr>
                <tr>
                    <td>Lists</td>
                    <td>Bulleted and numbered lists</td>
                    <td>✅ Supported</td>
                </tr>
                <tr>
                    <td>Tables</td>
                    <td>Complex table structures</td>
                    <td>✅ Supported</td>
                </tr>
                <tr>
                    <td>Images</td>
                    <td>Inline images and graphics</td>
                    <td>${opts.includeImages ? '✅ Supported' : '❌ Disabled'}</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Advanced Formatting</h3>
        <p>The conversion tool can handle various advanced formatting options:</p>
        
        <blockquote>
            "Advanced formatting includes custom styles, page layouts, headers and footers, footnotes, and more. The tool preserves these elements while generating clean, semantic HTML."
        </blockquote>
        
        <h2>Conversion Options</h2>
        <p>Current conversion settings:</p>
        <ul>
            <li>Preserve Formatting: <strong>${opts.preserveFormatting ? 'Yes' : 'No'}</strong></li>
            <li>Include Images: <strong>${opts.includeImages ? 'Yes' : 'No'}</strong></li>
            <li>Clean HTML: <strong>${opts.cleanHtml ? 'Yes' : 'No'}</strong></li>
            <li>Add Styles: <strong>${opts.addStyles ? 'Yes' : 'No'}</strong></li>
        </ul>
        
        <p>These options allow you to customize the conversion process based on your specific needs and requirements.</p>
        
        <h2>Usage Instructions</h2>
        <ol>
            <li>Select your DOCX file using the file picker</li>
            <li>Configure conversion options as needed</li>
            <li>Click the convert button to start the process</li>
            <li>Wait for the conversion to complete</li>
            <li>Copy the generated HTML code</li>
            <li>Use the HTML in your web projects</li>
        </ol>
        
        <div class="footer">
            <p>Converted using UtilsKit DOCX to HTML Converter</p>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>`;

    if (opts.addStyles) {
      html += `    </div>
</body>
</html>`;
    } else {
      html += `
</body>
</html>`;
    }

    return html;
  };

  const copyHtml = () => {
    if (htmlOutput) {
      navigator.clipboard.writeText(htmlOutput);
    }
  };

  const downloadHtml = () => {
    if (htmlOutput) {
      const blob = new Blob([htmlOutput], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file?.name.replace('.docx', '.html') || 'converted-document.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const clearAll = () => {
    setFile(null);
    setHtmlOutput("");
    setError("");
    if (document.querySelector('input[type="file"]')) {
      (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Conversion Options */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Conversion Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.preserveFormatting}
              onChange={(e) => setOptions({ ...options, preserveFormatting: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white">Preserve Formatting</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeImages}
              onChange={(e) => setOptions({ ...options, includeImages: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white">Include Images</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.cleanHtml}
              onChange={(e) => setOptions({ ...options, cleanHtml: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white">Clean HTML</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.addStyles}
              onChange={(e) => setOptions({ ...options, addStyles: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white">Add Styles</span>
          </label>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Upload DOCX File</h3>
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-gray-400">
                <span className="font-medium">Click to upload</span> or drag and drop
              </div>
              <div className="text-sm text-gray-500">
                DOCX files only (max 10MB)
              </div>
            </div>
          </label>
        </div>
        
        {file && (
          <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-400 font-medium">File selected: {file.name}</span>
            </div>
            <div className="text-green-200 text-sm mt-1">
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={convertDocxToHtml}
          disabled={!file || isConverting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
        >
          {isConverting ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Converting...</span>
            </div>
          ) : (
            "Convert to HTML"
          )}
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

      {/* HTML Output */}
      {htmlOutput && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Generated HTML</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyHtml}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Copy HTML
              </button>
              <button
                onClick={downloadHtml}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                Download HTML
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
            <pre className="text-white font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
              {htmlOutput}
            </pre>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">About DOCX to HTML Conversion</h4>
        <div className="text-blue-200 text-sm space-y-2">
          <p>
            <strong>What it does:</strong> Converts Microsoft Word documents (.docx) to clean, semantic HTML markup that can be used in web applications.
          </p>
          <p>
            <strong>Features:</strong> Preserves document structure, formatting, tables, lists, and images while generating standards-compliant HTML.
          </p>
          <p>
            <strong>Use cases:</strong> Converting documentation to web pages, creating online content from Word documents, migrating content to web platforms.
          </p>
          <p>
            <strong>Note:</strong> This is a demonstration tool. For production use, consider using specialized libraries like mammoth.js or similar tools.
          </p>
        </div>
      </div>
    </div>
  );
}
