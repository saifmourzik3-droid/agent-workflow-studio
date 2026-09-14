/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Lightbulb, 
  Workflow, 
  Layers, 
  TrendingUp, 
  Bot, 
  Calendar, 
  Skull, 
  BookOpen, 
  Terminal,
  Zap,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeProjectCount: number;
  inboxCount: number;
  activeAgentsCount: number;
}

export default function Sidebar({ 
  activeSection, 
  setActiveSection, 
  activeProjectCount, 
  inboxCount,
  activeAgentsCount 
}: SidebarProps) {
  const menuItems = [
    { 
      id: 'inbox', 
      label: 'Ideas Inbox', 
      icon: Lightbulb, 
      count: inboxCount, 
      badgeColor: 'bg-zinc-800 text-zinc-300' 
    },
    { 
      id: 'bmad', 
      label: 'BMAD Pipeline', 
      icon: Workflow, 
      count: null 
    },
    { 
      id: 'active', 
      label: 'Active SaaS Projects', 
      icon: Layers, 
      count: activeProjectCount, 
      badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
    },
    { 
      id: 'metrics', 
      label: 'Validation Metrics', 
      icon: TrendingUp, 
      count: null 
    },
    { 
      id: 'agents', 
      label: 'Agent Tasks', 
      icon: Bot, 
      count: activeAgentsCount, 
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
    },
    { 
      id: 'shipping', 
      label: 'Weekly Shipping Plan', 
      icon: Calendar, 
      count: null 
    },
    { 
      id: 'decisions', 
      label: 'Kill / Pivot / Scale', 
      icon: Skull, 
      count: null 
    },
    { 
      id: 'library', 
      label: 'Source Library', 
      icon: BookOpen, 
      count: null 
    },
  ];

  return (
    <aside id="sidebar-container" className="flex flex-col w-64 border-r border-zinc-800/80 bg-zinc-950 text-zinc-400 select-none h-screen shrink-0 font-sans">
      {/* Brand Header */}
      <div id="sidebar-brand" className="p-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 shadow-md">
            <Zap className="h-5 w-5 fill-amber-500/10" />
          </div>
          <div>
            <span className="block text-sm font-semibold tracking-tight text-zinc-100 font-sans">WORKFLOW STUDIO</span>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500">OS COMMAND CENTER</span>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <span className="block px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">Workspace Modules</span>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group duration-200 ${
                isActive 
                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-inner' 
                  : 'hover:bg-zinc-900/40 hover:text-zinc-200 text-zinc-400 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconComponent className={`h-4.5 w-4.5 transition-colors ${
                  isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'
                }`} />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.count !== null && item.count !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Workspace Status Banner */}
      <div id="sidebar-footer" className="p-4 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/60">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="block text-[11px] font-mono text-zinc-400 truncate tracking-tight">Offline simulation</span>
            <span className="block text-[9px] font-mono text-zinc-500">No agents connected</span>
          </div>
          <Activity className="h-3.5 w-3.5 text-emerald-500 leading-none h-auto" />
        </div>
      </div>
    </aside>
  );
}
