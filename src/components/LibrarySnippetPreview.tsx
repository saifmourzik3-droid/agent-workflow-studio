/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LibrarySnippet } from '../types';
import { 
  Code2, 
  Copy, 
  Check, 
  BookOpen, 
  Terminal, 
  Layers, 
  ShieldAlert, 
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

interface LibrarySnippetPreviewProps {
  snippets: LibrarySnippet[];
}

export default function LibrarySnippetPreview({ snippets }: LibrarySnippetPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'authentication', label: 'Security & Auth' },
    { id: 'payment', label: 'Payments & Metering' },
    { id: 'database', label: 'Databases & Proxy' },
    { id: 'ui-component', label: 'UX & Styles' },
    { id: 'ai-prompt', label: 'AI & Prompts' },
  ];

  const filteredSnippets = selectedCategory === 'all' 
    ? snippets
    : snippets.filter(s => s.category === selectedCategory);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'payment': return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'database': return <Terminal className="h-4 w-4 text-blue-400" />;
      case 'ui-component': return <Layers className="h-4 w-4 text-amber-400" />;
      case 'ai-prompt': return <BrainCircuit className="h-4 w-4 text-purple-400" />;
      default: return <BookOpen className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div id="library-snippets-wrapper" className="space-y-6 font-sans">
      
      {/* Search/Filter chips bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-xl p-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-amber-500" />
            Launchpad boilerplate repository
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Tested code scripts copy-pasteable directly into your active repository</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`snippet-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[11px] font-mono px-3 py-1.5 rounded-md transition-all ${
                selectedCategory === cat.id
                  ? 'bg-zinc-800 text-zinc-100 shadow font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSnippets.map((snippet) => (
          <div 
            key={snippet.id} 
            id={`snippet-card-${snippet.id}`}
            className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-800 transition group"
          >
            {/* Snippet Card Header */}
            <div className="px-5 py-4 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-1.5 rounded bg-zinc-900 border border-zinc-800">
                  {getCategoryIcon(snippet.category)}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-zinc-100 transition-colors">
                    {snippet.title}
                  </h4>
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-zinc-650 mt-0.5">
                    {snippet.language} // {snippet.category}
                  </span>
                </div>
              </div>

              <button
                id={`btn-copy-code-${snippet.id}`}
                onClick={() => handleCopy(snippet.id, snippet.code)}
                className="flex items-center gap-1.5 text-[10px] font-mono font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700/80 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg transition"
              >
                {copiedId === snippet.id ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            {/* Description inside */}
            <div className="px-5 py-3.5 bg-zinc-950/60 border-b border-zinc-900">
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{snippet.description}</p>
            </div>

            {/* Code Content Box */}
            <div className="flex-1 bg-zinc-950 p-4 font-mono text-[10px] leading-relaxed text-zinc-300 overflow-x-auto select-all max-h-[220px] scrollbar-thin scrollbar-thumb-zinc-800">
              <pre className="text-zinc-300 select-text whitespace-pre">
                <code>{snippet.code}</code>
              </pre>
            </div>
          </div>
        ))}

        {filteredSnippets.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-zinc-950 border border-zinc-900 rounded-xl font-mono text-zinc-650 text-xs">
            No snippets configured for the chosen category filters
          </div>
        )}
      </div>

    </div>
  );
}
