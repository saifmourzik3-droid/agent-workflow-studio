/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  ChevronRight, 
  Grid, 
  HelpCircle,
  CopyCheck,
  Flame,
  UserCheck
} from 'lucide-react';

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExecuteCommand: (commandText: string) => string | null;
  totalSaaSCount: number;
  totalPreSales: number;
  successRate: number;
}

export default function DashboardHeader({
  searchQuery,
  setSearchQuery,
  onExecuteCommand,
  totalSaaSCount,
  totalPreSales,
  successRate
}: DashboardHeaderProps) {
  const [commandInput, setCommandInput] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const feedback = onExecuteCommand(commandInput);
    if (feedback) {
      setCommandFeedback(feedback);
      // Auto clear feedback after 4 seconds
      setTimeout(() => {
        setCommandFeedback(null);
      }, 4000);
    }
    setCommandInput('');
  };

  return (
    <header id="dashboard-header-container" className="flex flex-col border-b border-zinc-800/80 bg-zinc-950 px-8 py-4 shrink-0 font-sans">
      <p className="text-xs text-amber-300 mb-4" role="status">PORTFOLIO DEMO — All projects, metrics and execution logs are fictional. No AI, database, connector or publishing service is connected.</p>
      {/* Top row: search & stats & profile info */}
      <div className="flex items-center justify-between gap-6 pb-4">
        {/* Left Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            id="search-input"
            type="text"
            placeholder="Search across ideas, target markets, tech stacks, or agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800/80 rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700/80 focus:ring-1 focus:ring-zinc-700/50 transition-all font-sans"
          />
        </div>

        {/* Global Key Metrics Counters */}
        <div id="header-stats-grid" className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-right text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Fictional Projects</span>
            <span className="text-sm font-semibold text-zinc-200 mt-0.5">{totalSaaSCount} SaaS Products</span>
          </div>
          <div className="h-4 w-px bg-zinc-800"></div>
          <div className="flex flex-col items-right text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Synthetic Revenue</span>
            <span className="text-sm font-semibold text-amber-400 mt-0.5">${(totalPreSales * 29).toLocaleString()} presales value</span>
          </div>
          <div className="h-4 w-px bg-zinc-800"></div>
          <div className="flex flex-col items-right text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Demo Completion</span>
            <span className="text-sm font-semibold text-emerald-400 mt-0.5">{successRate}% simulated</span>
          </div>
          <div className="h-4 w-px bg-zinc-800"></div>
          
          {/* User profile */}
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-850">
            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
              WS
            </div>
            <span className="text-xs font-mono text-zinc-300">Demo Architect</span>
          </div>
        </div>
      </div>

      {/* OS Command Bar Prompt Box */}
      <div id="interactive-prompt-block" className="mt-2 bg-zinc-900 rounded-lg border border-zinc-800/80 p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-mono">
          <Terminal className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] text-zinc-300 font-semibold uppercase tracking-wider">Command Console:</span>
          <span className="text-[10px] text-zinc-500 hidden md:inline">Local demo commands only</span>
        </div>

        <form onSubmit={handleCommandSubmit} className="flex-1 max-w-xl flex items-center gap-2">
          <div className="relative flex-grow flex items-center">
            <span className="absolute left-2.5 text-zinc-500 font-mono text-[11px] select-none">$</span>
            <input
              id="terminal-input"
              type="text"
              placeholder="Type 'help', 'add project [name]', 'kill [id]', 'pivot [id]', 'score [id] [val]'"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-1.5 pl-6 pr-3 text-[11px] font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition"
            />
          </div>
          <button
            id="terminal-exec-btn"
            type="submit"
            className="bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono font-semibold uppercase text-zinc-200 px-3 py-1.5 rounded border border-zinc-700 tracking-wider transition-colors"
          >
            EXEC
          </button>
        </form>

        {commandFeedback ? (
          <div id="terminal-feedback" className="text-[10px] font-mono bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded text-amber-400 max-w-md animate-fade-in truncate">
            {commandFeedback}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
            <HelpCircle className="h-3 w-3 inline text-zinc-600" />
            <span>Type <strong className="text-zinc-400">help</strong> to unlock syntax overrides</span>
          </div>
        )}
      </div>
    </header>
  );
}
