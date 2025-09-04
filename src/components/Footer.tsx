import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Company Info */}
           <div className="space-y-4">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
               </div>
               <h3 className="text-xl font-bold text-white">UtilsKit</h3>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed">
               Essential developer tools that work locally in your browser. 
               JSON formatters, regex testers, encoders, and more - all free to use.
             </p>
           </div>

           {/* All Tools by Category */}
           <div className="space-y-4">
             <h4 className="text-lg font-semibold text-white">Developer Tools</h4>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {/* JSON Tools */}
               <div className="space-y-1">
                 <h5 className="text-sm font-medium text-blue-300">JSON</h5>
                 <Link href="/json-formatter" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs">Formatter</Link>
                 <Link href="/json-diff" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs">Diff Tool</Link>
                 <Link href="/yaml-json" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs">YAML ↔ JSON</Link>
                 <Link href="/csv-json" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs">CSV ↔ JSON</Link>
                 <Link href="/json-schema-validator" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs">Schema Validator</Link>
                 <Link href="/json-to-typescript" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-xs">To TypeScript</Link>
               </div>
               
               {/* Text/Code Tools */}
               <div className="space-y-1">
                 <h5 className="text-sm font-medium text-cyan-300">Text/Code</h5>
                 <Link href="/regex-tester" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-xs">Regex Tester</Link>
                 <Link href="/regex-generator" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-xs">Regex Generator</Link>
                 <Link href="/code-formatter" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-xs">Code Formatter</Link>
                 <Link href="/diff-tool" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-xs">Diff Tool</Link>
               </div>
               
               {/* Encoders */}
               <div className="space-y-1">
                 <h5 className="text-sm font-medium text-indigo-300">Encoders</h5>
                 <Link href="/base64-encoder" className="block text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-xs">Base64</Link>
                 <Link href="/url-encoder" className="block text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-xs">URL Encoder</Link>
                 <Link href="/jwt-decoder" className="block text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-xs">JWT Decoder</Link>
               </div>
               
               {/* Web/SEO Tools */}
               <div className="space-y-1">
                 <h5 className="text-sm font-medium text-purple-300">Web/SEO</h5>
                 <Link href="/og-meta-generator" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200 text-xs">OG Meta</Link>
                 <Link href="/manifest-generator" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200 text-xs">Manifest</Link>
                 <Link href="/robots-generator" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200 text-xs">Robots.txt</Link>
               </div>
               
               {/* Time/Cron/Semver */}
               <div className="space-y-1">
                 <h5 className="text-sm font-medium text-green-300">Time/Cron/Semver</h5>
                 <Link href="/unix-time" className="block text-gray-400 hover:text-green-400 transition-colors duration-200 text-xs">Unix Time</Link>
                 <Link href="/cron-parser" className="block text-gray-400 hover:text-green-400 transition-colors duration-200 text-xs">Cron Parser</Link>
                 <Link href="/semver" className="block text-gray-400 hover:text-green-400 transition-colors duration-200 text-xs">Semver</Link>
               </div>
               
               {/* Special Tools */}
               <div className="space-y-1">
                 <h5 className="text-sm font-medium text-pink-300">Special</h5>
                 <Link href="/curl-to-code" className="block text-gray-400 hover:text-pink-400 transition-colors duration-200 text-xs">cURL to Code</Link>
                 <Link href="/docx-to-html" className="block text-gray-400 hover:text-pink-400 transition-colors duration-200 text-xs">DOCX to HTML</Link>
               </div>
             </div>
           </div>
         </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="text-center space-y-2">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} UtilsKit.tech. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
