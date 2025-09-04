"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';

// Use require for prettify-html to avoid TypeScript issues
const prettifyHtml = require('prettify-html');


export default function DocxToHtml() {
  const [htmlOutput, setHtmlOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const indentSize = 2; // Fixed indent size

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Paste your formatted text here...',
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px]',
      },
    },
    onUpdate: ({ editor }) => {
      // Force re-render to update button states
      setForceUpdate(prev => prev + 1);
    },
    onSelectionUpdate: ({ editor }) => {
      // Force re-render when selection changes
      setForceUpdate(prev => prev + 1);
    },
  });

  // Force re-render when editor state changes
  useEffect(() => {
    if (mounted && editor) {
      // This will trigger a re-render and update button states
    }
  }, [forceUpdate, mounted, editor]);

  // Listen to editor state changes
  useEffect(() => {
    if (!mounted || !editor) return;

    const updateStates = () => {
      setForceUpdate(prev => prev + 1);
    };

    // Subscribe to editor state changes
    editor.on('update', updateStates);
    editor.on('selectionUpdate', updateStates);

    return () => {
      editor.off('update', updateStates);
      editor.off('selectionUpdate', updateStates);
    };
  }, [mounted, editor]);

  // Memoized functions for better performance
  const isActive = useCallback((name: string, attributes?: Record<string, any>) => {
    if (!mounted || !editor) return false;
    return editor.isActive(name, attributes) || false;
  }, [editor, mounted, forceUpdate]);

  const formatHtml = useCallback((html: string): string => {
    try {
      // Clean up TipTap's extra <p> tags inside <li> elements and other unnecessary nesting
      let cleanedHtml = html
        // Remove <p> tags inside <li> elements
        .replace(/<li>\s*<p[^>]*>/g, '<li>')
        .replace(/<\/p>\s*<\/li>/g, '</li>')
        // Remove <p> tags inside <div> elements that are just wrappers
        .replace(/<div[^>]*>\s*<p[^>]*>/g, '<div>')
        .replace(/<\/p>\s*<\/div>/g, '</div>')
        // Remove <u> tags inside <a> elements (unnecessary underline in links)
        .replace(/<a([^>]*)>\s*<u>/g, '<a$1>')
        .replace(/<\/u>\s*<\/a>/g, '</a>')
        // Clean up multiple consecutive <br> tags
        .replace(/(<br[^>]*>)\s*\1/g, '$1')
        // Remove empty <p> tags
        .replace(/<p[^>]*>\s*<\/p>/g, '');

      // Use prettify-html library for better HTML formatting
      return prettifyHtml(cleanedHtml, {
        indent_size: indentSize,
        indent_char: ' ',
        max_char: 0, // No line wrapping
        preserve_newlines: true,
        end_with_newline: true,
        indent_inner_html: true
      });
    } catch (err) {
      // If prettify-html fails, return original HTML
      return html;
    }
  }, [indentSize]);

  const minifyHtml = useCallback((html: string): string => {
    try {
      // Use prettify-html with minimal formatting for minification
      return prettifyHtml(html, {
        indent_size: 0,
        indent_char: '',
        max_char: 0,
        preserve_newlines: false,
        end_with_newline: false,
        indent_inner_html: false
      }).replace(/\s+/g, ' ').trim();
    } catch (err) {
      // If prettify-html fails, use fallback minification
      return html
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    }
  }, []);

  const convertToHtml = useCallback(() => {
    if (!mounted || !editor || !editor.getHTML().trim()) {
      setHtmlOutput("");
      return;
    }

    setIsConverting(true);

    try {
      // Simulate conversion process
      setTimeout(() => {
        // Get HTML content from editor and format it
        const rawHtml = editor.getHTML();
        const formattedHtml = formatHtml(rawHtml);
        setHtmlOutput(formattedHtml);
        setIsConverting(false);
      }, 1000);
    } catch (err) {
      setHtmlOutput("Conversion error. Please try again.");
      setIsConverting(false);
    }
  }, [mounted, editor, formatHtml]);

  const copyHtml = useCallback(() => {
    if (htmlOutput) {
      navigator.clipboard.writeText(htmlOutput);
    }
  }, [htmlOutput]);

  const clearAll = useCallback(() => {
    if (mounted && editor) {
      editor.commands.clearContent();
    }
    setHtmlOutput("");
  }, [mounted, editor]);

  // Toolbar button component
  const ToolbarButton = useCallback(({ 
    onClick, 
    isActive, 
    children, 
    title, 
    className = "" 
  }: {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    title: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={!mounted || !editor}
      className={`p-2 rounded transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'
      } ${!mounted || !editor ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={title}
    >
      {children}
    </button>
  ), [mounted, editor, forceUpdate]);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Paste formatted text from DOCX</h3>
        <div className="relative">
          <div className="bg-gray-800/80 border border-gray-600 rounded-xl overflow-hidden">
            {/* Enhanced Toolbar */}
            <div className="flex flex-wrap gap-2 p-3 border-b border-gray-600 bg-gray-700/50">
                             {/* Text Formatting */}
               <div className="flex gap-1">
                                   <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleBold().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('bold')}
                    title="Bold (Ctrl+B)"
                  >
                    <strong>B</strong>
                  </ToolbarButton>
                                   <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleItalic().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('italic')}
                    title="Italic (Ctrl+I)"
                  >
                    <em>I</em>
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleStrike().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('strike')}
                    title="Strikethrough"
                  >
                    <del>S</del>
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleUnderline().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('underline')}
                    title="Underline (Ctrl+U)"
                  >
                    <u>U</u>
                  </ToolbarButton>
               </div>

              <div className="w-px h-8 bg-gray-600 mx-2"></div>

                             {/* Headings */}
               <div className="flex gap-1">
                                   <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleHeading({ level: 1 }).run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('heading', { level: 1 })}
                    title="Heading 1"
                  >
                    H1
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleHeading({ level: 2 }).run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('heading', { level: 2 })}
                    title="Heading 2"
                  >
                    H2
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleHeading({ level: 3 }).run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('heading', { level: 3 })}
                    title="Heading 3"
                  >
                    H3
                  </ToolbarButton>
               </div>

              <div className="w-px h-8 bg-gray-600 mx-2"></div>

                             {/* Lists */}
               <div className="flex gap-1">
                                   <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleBulletList().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('bulletList')}
                    title="Bullet List"
                  >
                    •
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleOrderedList().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('orderedList')}
                    title="Numbered List"
                  >
                    1.
                  </ToolbarButton>
               </div>

              <div className="w-px h-8 bg-gray-600 mx-2"></div>

                             {/* Advanced Formatting */}
               <div className="flex gap-1">
                                   <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleBlockquote().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('blockquote')}
                    title="Quote"
                  >
                    "
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().toggleCodeBlock().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={isActive('codeBlock')}
                    title="Code Block"
                  >
                    {'</>'}
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().setHorizontalRule().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={false}
                    title="Horizontal Rule"
                  >
                    —
                  </ToolbarButton>
               </div>

              <div className="w-px h-8 bg-gray-600 mx-2"></div>

                             {/* Actions */}
               <div className="flex gap-1">
                                   <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().clearNodes().unsetAllMarks().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={false}
                    title="Clear Formatting"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    🗑️
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().undo().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={false}
                    title="Undo (Ctrl+Z)"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    ↶
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      if (mounted && editor) {
                        editor.chain().focus().redo().run();
                        setForceUpdate(prev => prev + 1);
                      }
                    }}
                    isActive={false}
                    title="Redo (Ctrl+Y)"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    ↷
                  </ToolbarButton>
               </div>
            </div>
            
            {/* Editor Content */}
            <div className="p-4">
              {mounted && editor && <EditorContent editor={editor} />}
            </div>
          </div>
          
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {mounted && editor && editor.storage.characterCount ? editor.storage.characterCount.characters() : 0} characters
          </div>
        </div>
      </div>



      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={convertToHtml}
          disabled={!mounted || !editor || !editor.getHTML().trim() || isConverting}
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

      {/* HTML Output */}
      {htmlOutput && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Generated HTML</h3>
                    <div className="flex gap-2">
          <button
            onClick={() => {
              if (htmlOutput) {
                const reformatted = formatHtml(htmlOutput);
                setHtmlOutput(reformatted);
              }
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            title="Reformat HTML with current indent settings"
          >
            Reformat
          </button>
          <button
            onClick={() => {
              if (htmlOutput) {
                const minified = minifyHtml(htmlOutput);
                setHtmlOutput(minified);
              }
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
            title="Minify HTML (remove all formatting)"
          >
            Minify
          </button>
          <button
            onClick={copyHtml}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Copy HTML
          </button>
        </div>
          </div>
          
          <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4">
            <div className="mb-2 text-xs text-gray-400">
              {htmlOutput.includes('\n') ? 
                'Formatted HTML with 2 spaces indentation' : 
                'Minified HTML (no formatting)'
              }
            </div>
            <pre className="text-white font-mono text-sm whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
              {htmlOutput}
            </pre>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-400 mb-3">How to use</h4>
        <div className="text-blue-200 text-sm space-y-2">
          <p>
            <strong>1.</strong> Open your Word document
          </p>
          <p>
            <strong>2.</strong> Copy the text you want to convert (Ctrl+A, Ctrl+C)
          </p>
          <p>
            <strong>3.</strong> Paste the text into the editor above
          </p>
          <p>
            <strong>4.</strong> Use the toolbar to format your text as needed
          </p>
          <p>
            <strong>5.</strong> Click "Convert to HTML" to generate the HTML code
          </p>
          <p>
            <strong>6.</strong> Copy the generated HTML code for use in your projects
          </p>
        </div>
      </div>
    </div>
  );
}
