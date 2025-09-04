"use client";

import { useState } from "react";

type Language = "javascript" | "python" | "php" | "java" | "csharp" | "go" | "ruby" | "rust" | "swift" | "kotlin";

interface ParsedCurl {
  method: string;
  url: string;
  headers: { [key: string]: string };
  data: string;
  formData: { [key: string]: string };
  files: { [key: string]: string };
  basicAuth: { username: string; password: string } | null;
  cookies: { [key: string]: string };
}

export default function CurlToCode() {
  const [curlCommand, setCurlCommand] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const [parsedCurl, setParsedCurl] = useState<ParsedCurl | null>(null);

  const parseCurl = (command: string): ParsedCurl | null => {
    try {
      const parsed: ParsedCurl = {
        method: "GET",
        url: "",
        headers: {},
        data: "",
        formData: {},
        files: {},
        basicAuth: null,
        cookies: {}
      };

      // Remove 'curl' from the beginning
      let args = command.replace(/^curl\s+/, '').trim();
      
      // Parse method
      const methodMatch = args.match(/^-X\s+(\w+)/);
      if (methodMatch) {
        parsed.method = methodMatch[1].toUpperCase();
        args = args.replace(/^-X\s+\w+\s+/, '');
      }

      // Parse URL (first argument that doesn't start with -)
      const urlMatch = args.match(/^([^-]\S+)/);
      if (urlMatch) {
        parsed.url = urlMatch[1];
        args = args.replace(/^[^-]\S+\s*/, '');
      }

      // Parse headers
      const headerMatches = args.matchAll(/-H\s+['"]([^'"]+)['"]/g);
      for (const match of headerMatches) {
        const [fullMatch, header] = match;
        const [key, value] = header.split(': ');
        if (key && value) {
          parsed.headers[key.trim()] = value.trim();
        }
        args = args.replace(fullMatch, '');
      }

      // Parse data
      const dataMatch = args.match(/-d\s+['"]([^'"]+)['"]/);
      if (dataMatch) {
        parsed.data = dataMatch[1];
        args = args.replace(/-d\s+['"][^'"]+['"]/, '');
      }

      // Parse form data
      const formMatches = args.matchAll(/-F\s+['"]([^'"]+)['"]/g);
      for (const match of formMatches) {
        const [fullMatch, formField] = match;
        const [key, value] = formField.split('=');
        if (key && value) {
          if (value.startsWith('@')) {
            // File upload
            parsed.files[key.trim()] = value.substring(1);
          } else {
            parsed.formData[key.trim()] = value.trim();
          }
        }
        args = args.replace(fullMatch, '');
      }

      // Parse basic auth
      const authMatch = args.match(/-u\s+['"]([^'"]+)['"]/);
      if (authMatch) {
        const [username, password] = authMatch[1].split(':');
        parsed.basicAuth = { username, password: password || '' };
        args = args.replace(/-u\s+['"][^'"]+['"]/, '');
      }

      // Parse cookies
      const cookieMatch = args.match(/-b\s+['"]([^'"]+)['"]/);
      if (cookieMatch) {
        const cookies = cookieMatch[1].split(';');
        cookies.forEach(cookie => {
          const [key, value] = cookie.trim().split('=');
          if (key && value) {
            parsed.cookies[key.trim()] = value.trim();
          }
        });
        args = args.replace(/-b\s+['"][^'"]+['"]/, '');
      }

      return parsed;
    } catch (err) {
      return null;
    }
  };

  const generateCode = () => {
    if (!curlCommand.trim()) {
      setError("Please enter a cURL command");
      return;
    }

    const parsed = parseCurl(curlCommand);
    if (!parsed) {
      setError("Invalid cURL command format");
      return;
    }

    setParsedCurl(parsed);
    setError("");

    let code = "";
    switch (selectedLanguage) {
      case "javascript":
        code = generateJavaScript(parsed);
        break;
      case "python":
        code = generatePython(parsed);
        break;
      case "php":
        code = generatePHP(parsed);
        break;
      case "java":
        code = generateJava(parsed);
        break;
      case "csharp":
        code = generateCSharp(parsed);
        break;
      case "go":
        code = generateGo(parsed);
        break;
      case "ruby":
        code = generateRuby(parsed);
        break;
      case "rust":
        code = generateRust(parsed);
        break;
      case "swift":
        code = generateSwift(parsed);
        break;
      case "kotlin":
        code = generateKotlin(parsed);
        break;
    }

    setGeneratedCode(code);
  };

  const generateJavaScript = (parsed: ParsedCurl): string => {
    let code = "// JavaScript (Fetch API)\n\n";
    
    if (parsed.basicAuth) {
      const auth = btoa(`${parsed.basicAuth.username}:${parsed.basicAuth.password}`);
      code += `const auth = 'Basic ${auth}';\n\n`;
    }

    code += `const url = '${parsed.url}';\n\n`;

    // Headers
    if (Object.keys(parsed.headers).length > 0 || parsed.basicAuth) {
      code += "const headers = {\n";
      if (parsed.basicAuth) {
        code += `  'Authorization': auth,\n`;
      }
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `  '${key}': '${value}',\n`;
      });
      code += "};\n\n";
    }

    // Request options
    code += "const options = {\n";
    code += `  method: '${parsed.method}',\n`;
    if (Object.keys(parsed.headers).length > 0 || parsed.basicAuth) {
      code += "  headers,\n";
    }

    if (parsed.data) {
      code += `  body: '${parsed.data}',\n`;
    } else if (Object.keys(parsed.formData).length > 0 || Object.keys(parsed.files).length > 0) {
      code += "  body: new FormData(),\n";
    }

    code += "};\n\n";

    // Request
    code += "fetch(url, options)\n";
    code += "  .then(response => response.json())\n";
    code += "  .then(data => console.log(data))\n";
    code += "  .catch(error => console.error('Error:', error));";

    return code;
  };

  const generatePython = (parsed: ParsedCurl): string => {
    let code = "# Python (requests library)\n\n";
    code += "import requests\n\n";

    if (parsed.basicAuth) {
      code += `auth = ('${parsed.basicAuth.username}', '${parsed.basicAuth.password}')\n\n`;
    }

    code += `url = '${parsed.url}'\n\n`;

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      code += "headers = {\n";
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `    '${key}': '${value}',\n`;
      });
      code += "}\n\n";
    }

    // Request
    code += `response = requests.${parsed.method.toLowerCase()}(url`;
    if (Object.keys(parsed.headers).length > 0) {
      code += ", headers=headers";
    }
    if (parsed.basicAuth) {
      code += ", auth=auth";
    }
    if (parsed.data) {
      code += `, data='${parsed.data}'`;
    }
    code += ")\n\n";

    code += "print(response.json())";

    return code;
  };

  const generatePHP = (parsed: ParsedCurl): string => {
    let code = "<?php\n// PHP (cURL)\n\n";

    code += `$url = '${parsed.url}';\n\n`;

    // Initialize cURL
    code += "$ch = curl_init();\n\n";

    // Set URL
    code += "curl_setopt($ch, CURLOPT_URL, $url);\n";
    code += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${parsed.method}');\n`;
    code += "curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n\n";

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      code += "$headers = [\n";
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `    '${key}: ${value}',\n`;
      });
      code += "];\n";
      code += "curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n\n";
    }

    // Basic auth
    if (parsed.basicAuth) {
      code += `curl_setopt($ch, CURLOPT_USERPWD, '${parsed.basicAuth.username}:${parsed.basicAuth.password}');\n\n`;
    }

    // Data
    if (parsed.data) {
      code += `curl_setopt($ch, CURLOPT_POSTFIELDS, '${parsed.data}');\n\n`;
    }

    // Execute and close
    code += "$response = curl_exec($ch);\n";
    code += "curl_close($ch);\n\n";
    code += "echo $response;";

    return code;
  };

  const generateJava = (parsed: ParsedCurl): string => {
    let code = "// Java (HttpClient)\n\n";
    code += "import java.net.http.HttpClient;\n";
    code += "import java.net.http.HttpRequest;\n";
    code += "import java.net.http.HttpResponse;\n";
    code += "import java.net.URI;\n\n";

    code += "HttpClient client = HttpClient.newHttpClient();\n\n";

    // Build request
    code += "HttpRequest request = HttpRequest.newBuilder()\n";
    code += `    .uri(URI.create("${parsed.url}"))\n`;
    code += `    .${parsed.method.toLowerCase()}(HttpRequest.BodyPublishers.noBody())\n`;

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `    .header("${key}", "${value}")\n`;
      });
    }

    code += "    .build();\n\n";

    // Execute
    code += "try {\n";
    code += "    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n";
    code += "    System.out.println(response.body());\n";
    code += "} catch (Exception e) {\n";
    code += "    e.printStackTrace();\n";
    code += "}";

    return code;
  };

  const generateCSharp = (parsed: ParsedCurl): string => {
    let code = "// C# (HttpClient)\n\n";
    code += "using System;\n";
    code += "using System.Net.Http;\n";
    code += "using System.Threading.Tasks;\n\n";

    code += "class Program\n{\n";
    code += "    static async Task Main(string[] args)\n";
    code += "    {\n";
    code += "        using var client = new HttpClient();\n\n";

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `        client.DefaultRequestHeaders.Add("${key}", "${value}");\n`;
      });
      code += "\n";
    }

    code += `        var response = await client.${parsed.method.toLowerCase()}Async("${parsed.url}");\n`;
    code += "        var content = await response.Content.ReadAsStringAsync();\n";
    code += "        Console.WriteLine(content);\n";
    code += "    }\n}";

    return code;
  };

  const generateGo = (parsed: ParsedCurl): string => {
    let code = "// Go (net/http)\n\n";
    code += "package main\n\n";
    code += "import (\n";
    code += '    "fmt"\n';
    code += '    "io/ioutil"\n';
    code += '    "net/http"\n';
    code += ")\n\n";

    code += "func main() {\n";
    code += `    url := "${parsed.url}"\n\n`;

    // Create request
    code += `    req, err := http.NewRequest("${parsed.method}", url, nil)\n`;
    code += "    if err != nil {\n";
    code += "        panic(err)\n";
    code += "    }\n\n";

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `    req.Header.Set("${key}", "${value}")\n`;
      });
      code += "\n";
    }

    // Execute
    code += "    client := &http.Client{}\n";
    code += "    resp, err := client.Do(req)\n";
    code += "    if err != nil {\n";
    code += "        panic(err)\n";
    code += "    }\n";
    code += "    defer resp.Body.Close()\n\n";

    code += "    body, err := ioutil.ReadAll(resp.Body)\n";
    code += "    if err != nil {\n";
    code += "        panic(err)\n";
    code += "    }\n\n";

    code += '    fmt.Println(string(body))\n';
    code += "}";

    return code;
  };

  const generateRuby = (parsed: ParsedCurl): string => {
    let code = "# Ruby (net/http)\n\n";
    code += "require 'net/http'\n";
    code += "require 'uri'\n\n";

    code += `url = URI('${parsed.url}')\n\n`;

    // Create request
    code += `http = Net::HTTP.new(url.host, url.port)\n`;
    code += "http.use_ssl = true if url.scheme == 'https'\n\n";

    code += `request = Net::HTTP::${parsed.method.charAt(0).toUpperCase() + parsed.method.slice(1).toLowerCase()}.new(url)\n\n`;

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `request['${key}'] = '${value}'\n`;
      });
      code += "\n";
    }

    // Execute
    code += "response = http.request(request)\n";
    code += "puts response.body";

    return code;
  };

  const generateRust = (parsed: ParsedCurl): string => {
    let code = "// Rust (reqwest)\n\n";
    code += "use reqwest;\n";
    code += "use tokio;\n\n";

    code += "#[tokio::main]\n";
    code += "async fn main() -> Result<(), Box<dyn std::error::Error>> {\n";
    code += `    let url = "${parsed.url}";\n\n`;

    // Create client
    code += "    let client = reqwest::Client::new();\n\n";

    // Build request
    code += `    let response = client.${parsed.method.toLowerCase()}(url)\n`;

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `        .header("${key}", "${value}")\n`;
      });
    }

    code += "        .send()\n";
    code += "        .await?;\n\n";

    code += "    let body = response.text().await?;\n";
    code += "    println!(\"{}\", body);\n\n";

    code += "    Ok(())\n}";

    return code;
  };

  const generateSwift = (parsed: ParsedCurl): string => {
    let code = "// Swift (URLSession)\n\n";
    code += "import Foundation\n\n";

    code += `guard let url = URL(string: "${parsed.url}") else {\n`;
    code += "    fatalError(\"Invalid URL\")\n";
    code += "}\n\n";

    // Create request
    code += `var request = URLRequest(url: url)\n`;
    code += `request.httpMethod = "${parsed.method}"\n\n`;

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `request.setValue("${value}", forHTTPHeaderField: "${key}")\n`;
      });
      code += "\n";
    }

    // Execute
    code += "URLSession.shared.dataTask(with: request) { data, response, error in\n";
    code += "    if let error = error {\n";
    code += "        print(\"Error: \\(error)\")\n";
    code += "        return\n";
    code += "    }\n\n";
    code += "    if let data = data {\n";
    code += "        let responseString = String(data: data, encoding: .utf8)\n";
    code += "        print(responseString ?? \"No response\")\n";
    code += "    }\n";
    code += "}.resume()";

    return code;
  };

  const generateKotlin = (parsed: ParsedCurl): string => {
    let code = "// Kotlin (OkHttp)\n\n";
    code += "import okhttp3.*\n";
    code += "import java.io.IOException\n\n";

    code += "fun main() {\n";
    code += "    val client = OkHttpClient()\n\n";

    // Build request
    code += `    val request = Request.Builder()\n`;
    code += `        .url("${parsed.url}")\n`;
    code += `        .${parsed.method.toLowerCase()}()\n`;

    // Headers
    if (Object.keys(parsed.headers).length > 0) {
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `        .addHeader("${key}", "${value}")\n`;
      });
    }

    code += "        .build()\n\n";

    // Execute
    code += "    client.newCall(request).enqueue(object : Callback {\n";
    code += "        override fun onFailure(call: Call, e: IOException) {\n";
    code += "            e.printStackTrace()\n";
    code += "        }\n\n";
    code += "        override fun onResponse(call: Call, response: Response) {\n";
    code += "            val responseBody = response.body?.string()\n";
    code += "            println(responseBody)\n";
    code += "        }\n";
    code += "    })\n";
    code += "}";

    return code;
  };

  const loadSample = () => {
    const sampleCurl = 'curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -H "Authorization: Bearer token123" -d \'{"name": "John Doe", "email": "john@example.com"}\'';
    setCurlCommand(sampleCurl);
    setGeneratedCode("");
    setError("");
    setParsedCurl(null);
  };

  const clearAll = () => {
    setCurlCommand("");
    setGeneratedCode("");
    setError("");
    setParsedCurl(null);
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="flex items-center justify-center space-x-4">
        <span className="text-white font-medium">Target Language:</span>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as Language)}
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="javascript">JavaScript (Fetch)</option>
          <option value="python">Python (requests)</option>
          <option value="php">PHP (cURL)</option>
          <option value="java">Java (HttpClient)</option>
          <option value="csharp">C# (HttpClient)</option>
          <option value="go">Go (net/http)</option>
          <option value="ruby">Ruby (net/http)</option>
          <option value="rust">Rust (reqwest)</option>
          <option value="swift">Swift (URLSession)</option>
          <option value="kotlin">Kotlin (OkHttp)</option>
        </select>
      </div>

      {/* cURL Input */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">cURL Command</h3>
        <textarea
          value={curlCommand}
          onChange={(e) => setCurlCommand(e.target.value)}
          placeholder="Paste your cURL command here..."
          className="w-full h-32 p-4 bg-gray-800/80 border border-gray-700/50 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateCode}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Generate Code
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

      {/* Parsed cURL Info */}
      {parsedCurl && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Parsed cURL Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Method:</span>
              <span className="text-white ml-2">{parsedCurl.method}</span>
            </div>
            <div>
              <span className="text-gray-400">URL:</span>
              <span className="text-white ml-2 break-all">{parsedCurl.url}</span>
            </div>
            {Object.keys(parsedCurl.headers).length > 0 && (
              <div className="md:col-span-2">
                <span className="text-gray-400">Headers:</span>
                <div className="text-white ml-2 mt-1">
                  {Object.entries(parsedCurl.headers).map(([key, value]) => (
                    <div key={key} className="ml-4">
                      {key}: {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {parsedCurl.data && (
              <div className="md:col-span-2">
                <span className="text-gray-400">Data:</span>
                <span className="text-white ml-2">{parsedCurl.data}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generated Code */}
      {generatedCode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Generated {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Code</h3>
            <button
              onClick={copyCode}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Copy Code
            </button>
          </div>
          
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
            <pre className="text-white font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {generatedCode}
            </pre>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-rose-900/30 border border-rose-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-rose-400 mb-3">About cURL to Code Conversion</h4>
        <div className="text-rose-200 text-sm space-y-2">
          <p>
            <strong>What is cURL?</strong> cURL is a command-line tool for transferring data with URLs. It's commonly used for testing APIs and web services.
          </p>
          <p>
            <strong>Supported Features:</strong> HTTP methods, headers, authentication, form data, file uploads, cookies, and more.
          </p>
          <p>
            <strong>Languages:</strong> Convert to JavaScript, Python, PHP, Java, C#, Go, Ruby, Rust, Swift, and Kotlin.
          </p>
          <p>
            <strong>Usage:</strong> Paste your cURL command, select the target language, and get ready-to-use code.
          </p>
        </div>
      </div>
    </div>
  );
}
