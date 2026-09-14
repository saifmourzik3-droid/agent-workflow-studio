/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SaaSProject } from '../types';
import { 
  X, 
  HelpCircle, 
  Settings, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Compass, 
  Flame, 
  UserPlus2, 
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface IdeaDetailModalProps {
  project: SaaSProject;
  onClose: () => void;
  onUpdateConfidenceScore: (projectId: string, score: number) => void;
  onUpdateNextAction: (projectId: string, actionText: string) => void;
  onUpdateStatus: (projectId: string, status: SaaSProject['status']) => void;
}

export default function IdeaDetailModal({ 
  project, 
  onClose, 
  onUpdateConfidenceScore, 
  onUpdateNextAction,
  onUpdateStatus
}: IdeaDetailModalProps) {
  const [confidence, setConfidence] = useState<number>(project.confidenceScore);
  const [nextAction, setNextAction] = useState<string>(project.nextAction);

  const statuses: SaaSProject['status'][] = [
    'Inbox', 
    'BMAD Pipeline', 
    'Active Project', 
    'Killed', 
    'Pivoted', 
    'Scaled'
  ];

  const handleSave = () => {
    onUpdateConfidenceScore(project.id, confidence);
    onUpdateNextAction(project.id, nextAction);
    onClose();
  };

  return (
    <div id="idea-detail-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm select-none font-sans">
      
      {/* Container Card */}
      <div 
        id="idea-detail-modal-card" 
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[90vh]"
      >
        {/* Glowing visual effect top ambient highlight */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header */}
        <div id="modal-header-container" className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between gap-4 z-10 relative">
          <div className="min-w-0">
            <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block mb-1.5">
              SaaS Operational Blueprint
            </span>
            <h2 className="text-base font-bold text-zinc-100 truncate tracking-tight">{project.name}</h2>
          </div>
          
          <button 
            id="modal-close-icon-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-550 hover:text-zinc-200 bg-zinc-900 border border-zinc-850 hover:border-zinc-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Middle scrollable details forms block */}
        <div id="modal-scrollable-body" className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          
          {/* Status & Next Actions settings strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Operational Status</label>
              <select
                id="modal-status-selector"
                value={project.status}
                onChange={(e) => onUpdateStatus(project.id, e.target.value as SaaSProject['status'])}
                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2 px-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-zinc-700 font-medium"
              >
                {statuses.map((statusVal) => (
                  <option key={statusVal} value={statusVal}>{statusVal}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Assigned Agent</label>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-850 rounded-lg py-2 px-3">
                <div className="h-4.5 w-4.5 rounded-full bg-zinc-850 flex items-center justify-center text-[9px] font-mono font-bold text-zinc-400">
                  AI
                </div>
                <span className="text-xs text-zinc-300 truncate font-mono">{project.ownerAgent}</span>
              </div>
            </div>
          </div>

          {/* Core Target Market & Problem Statement */}
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Target Demographic Segment</span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-1.5 bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                {project.targetMarket}
              </p>
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Primary Core Friction Point (Problem)</span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-1.5 bg-zinc-950 border border-zinc-900 p-3 rounded-lg font-medium">
                {project.problem}
              </p>
            </div>
          </div>

          {/* Validation indicators Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Proof of Demand Signal
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-1.5 font-sans">
                {project.proofOfDemand}
              </p>
            </div>
            
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-amber-500" />
                SaaS Monetization Vector
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-1.5 font-sans">
                {project.monetization}
              </p>
            </div>
          </div>

          {/* Next Action input inline */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Immediate Task Checklist Action</label>
            <input
              id="modal-next-action-input"
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2.5 px-3 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700/80 transition-all font-sans"
            />
          </div>

          {/* Confidence Slider bar */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-indigo-500" />
                Confidence Score Vector
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-zinc-900 px-1.5 py-0.5 rounded">{confidence}% Match</span>
            </div>
            <input
              id="confidence-score-slider"
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-1"
            />
            <span className="block text-[9px] font-mono text-zinc-550">Dynamic slider adjusts estimated conversion efficiency matrix</span>
          </div>

          {/* Tech stack badges tags list */}
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Target Technical Blueprint Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span 
                  key={tech} 
                  className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Save Action Controls Bar */}
        <div id="modal-footer-container" className="px-6 py-4 border-t border-zinc-900 bg-zinc-950 flex items-center justify-end gap-3 rounded-b-xl">
          <button
            id="btn-cancel-modal"
            onClick={onClose}
            className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 py-2 px-4 rounded-lg font-medium transition"
          >
            Cancel
          </button>

          <button
            id="btn-save-modal"
            onClick={handleSave}
            className="bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-zinc-950 py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-zinc-950 fill-zinc-950/20" />
            Update SaaS Blueprint
          </button>
        </div>

      </div>

    </div>
  );
}
