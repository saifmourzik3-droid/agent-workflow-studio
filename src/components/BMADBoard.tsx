/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SaaSProject, BMADStep, AgentInfo } from '../types';
import { 
  Workflow, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  Bot,
  UserCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface BMADBoardProps {
  projects: SaaSProject[];
  onUpdateProjectProgress: (projectId: string, step: BMADStep, status: 'pending' | 'active' | 'completed' | 'failed') => void;
  onAddAgentLog: (projectId: string, log: { agentName: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }) => void;
  agents: AgentInfo[];
}

const STAGES: BMADStep[] = [
  'Analyst', 
  'Product Manager', 
  'UX Designer', 
  'Architect', 
  'Developer', 
  'QA', 
  'Growth', 
  'Decision Board'
];

const STAGE_DESCRIPTIONS: Record<BMADStep, string> = {
  'Analyst': 'Market sizing, competitor benchmarks, search traffic analysis.',
  'Product Manager': 'PRD synthesis, functional boundaries, MVP tier scope limits.',
  'UX Designer': 'Visual style sheets, typography choice, Figma dynamic spacing rules.',
  'Architect': 'Clickhouse table mappings, index structures, Edge deployment caching.',
  'Developer': 'TypeScript route setups, API hook streams, mock service bindings.',
  'QA': 'Cypress testing suites, boundary assertions, access audit checkpoints.',
  'Growth': 'Landing page layout tests, Facebook/Twitter CPC bid adjustments.',
  'Decision Board': 'The ultimate decision block: Vote to KILL, PIVOT, or SCALE.'
};

export default function BMADBoard({ 
  projects, 
  onUpdateProjectProgress, 
  onAddAgentLog, 
  agents 
}: BMADBoardProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [runningStep, setRunningStep] = useState<BMADStep | null>(null);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);

  const pipelineProjects = projects.filter(
    p => p.status === 'BMAD Pipeline' || p.status === 'Active Project'
  );

  const activeProject = pipelineProjects.find(p => p.id === selectedProjectId) || pipelineProjects[0];

  const handleSimulateStep = (step: BMADStep) => {
    if (!activeProject || runningStep) return;

    setRunningStep(step);
    setSimulationProgress(5);
    onUpdateProjectProgress(activeProject.id, step, 'active');
    
    // Add initial log
    const agent = agents.find(a => a.role === step);
    const agentName = agent?.name || `${step} Agent`;
    
    onAddAgentLog(activeProject.id, {
      agentName,
      message: `Triggered BMAD pipeline routine check on ${activeProject.name}. Playing a deterministic local workflow simulation; no model is called.`,
      type: 'info'
    });

    // Simulate progress bar
    let progress = 5;
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        setRunningStep(null);
        setSimulationProgress(0);

        // Complete step with success
        onUpdateProjectProgress(activeProject.id, step, 'completed');
        
        // Push completed log
        onAddAgentLog(activeProject.id, {
          agentName,
          message: `Pipeline status: SUCCESS. Finished compiling outputs for ${step}. Simulated result only; no external artifact was generated.`,
          type: 'success'
        });

        // Auto move to next step in sequence if possible
        const currentIdx = STAGES.indexOf(step);
        if (currentIdx !== -1 && currentIdx < STAGES.length - 1) {
          const nextStep = STAGES[currentIdx + 1];
          // Update active pointer
          // Parent owns the workflow state.
        }

      } else {
        setSimulationProgress(progress);
        if (progress === 55) {
          onAddAgentLog(activeProject.id, {
            agentName,
            message: `Simulated checkpoint: ready for human review. No performance benchmark was run.`,
            type: 'info'
          });
        }
      }
    }, 800);
  };

  const handleResetPipeline = () => {
    if (!activeProject) return;
    STAGES.forEach(step => {
      onUpdateProjectProgress(activeProject.id, step, step === 'Analyst' ? 'active' : 'pending');
    });
    // Parent owns the workflow state.
    onAddAgentLog(activeProject.id, {
      agentName: 'System Kernel',
      message: 'Workflow pipeline reset. All stages reverted to idle queues.',
      type: 'warning'
    });
  };

  if (!activeProject) {
    return (
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 text-center text-zinc-500 font-mono text-xs">
        No active projects found in the BMAD production sequence. Add an idea in the Inbox first!
      </div>
    );
  }

  return (
    <div id="bmad-dashboard-wrapper" className="grid grid-cols-1 xl:grid-cols-4 gap-8 font-sans">
      
      {/* 1. Left Project Selector Column */}
      <div className="xl:col-span-1 bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col gap-4">
        <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Active Pipelines</span>
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[350px] pr-1">
          {pipelineProjects.map((p) => {
            const isSelected = p.id === activeProject.id;
            return (
              <button
                key={p.id}
                id={`btn-select-pipeline-${p.id}`}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  isSelected 
                    ? 'bg-zinc-900 border-zinc-850 shadow text-zinc-100' 
                    : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-950/60 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold truncate max-w-[120px]">{p.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    STEP: {p.currentBMADStep}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Confidence:</span>
                  <span className="text-amber-400 font-bold">{p.confidenceScore}%</span>
                </div>
                
                {/* Pipeline tiny dot progress indicators */}
                <div className="mt-3 flex items-center justify-between gap-1">
                  {STAGES.map((s, i) => {
                    const status = p.bmadProgress[s];
                    let dotColor = 'bg-zinc-800';
                    if (status === 'completed') dotColor = 'bg-emerald-500';
                    if (status === 'active') dotColor = 'bg-amber-400 animate-pulse';
                    if (status === 'failed') dotColor = 'bg-rose-500';
                    return (
                      <div 
                        key={`lbldot-${i}`} 
                        className={`h-1.5 flex-1 rounded-sm ${dotColor}`}
                        title={`${s}: ${status}`}
                      ></div>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Reset / utility controls */}
        <div className="border-t border-zinc-900 pt-4 flex gap-2">
          <button
            id="btn-reset-current-pipeline"
            onClick={handleResetPipeline}
            className="flex-1 bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 hover:border-zinc-800 py-2 rounded text-[10px] font-mono font-medium text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            RESET STAGES
          </button>
        </div>
      </div>

      {/* 2. Right Interactive Board details (3 columns space) */}
      <div className="xl:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

        {/* Board Top Info Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-semibold py-0.5 px-2 bg-zinc-900 border border-zinc-850 rounded text-amber-400">BMAD WORKFLOW</span>
              <span className="text-zinc-650 font-mono text-xs">/</span>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{activeProject.name}</span>
            </div>
            <h2 className="text-base font-bold text-zinc-100 tracking-tight mt-1.5">Weekly Production Sequence Status</h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-zinc-400 text-[10px]">Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-zinc-400 text-[10px]">Processing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-zinc-800"></div>
              <span className="text-zinc-400 text-[10px]">Pending Queue</span>
            </div>
          </div>
        </div>

        {/* Horizontally Layout Node Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
          {STAGES.map((step) => {
            const status = activeProject.bmadProgress[step];
            const isCurrent = activeProject.currentBMADStep === step;
            
            // Define borders / colors based on status
            let borderClass = 'border-zinc-900 bg-zinc-950/40 text-zinc-400';
            let iconElement = <Clock className="h-3.5 w-3.5 text-zinc-600" />;
            
            if (status === 'completed') {
              borderClass = 'border-zinc-800 bg-zinc-900/10 text-zinc-300';
              iconElement = <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
            } else if (status === 'active') {
              borderClass = 'border-amber-500/30 bg-amber-500/5 text-amber-200 shadow-[0_0_12px_-4px_rgba(245,158,11,0.25)]';
              iconElement = <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />;
            } else if (status === 'failed') {
              borderClass = 'border-rose-500/30 bg-rose-500/5 text-rose-200';
              iconElement = <AlertCircle className="h-3.5 w-3.5 text-rose-500" />;
            } else if (isCurrent) {
              borderClass = 'border-zinc-800 bg-zinc-950 text-zinc-200';
            }

            const agent = agents.find(a => a.role === step);

            return (
              <div 
                key={step} 
                id={`bmad-node-${step}`}
                className={`p-4 rounded-xl border flex flex-col justify-between h-[155px] hover:border-zinc-800 hover:bg-zinc-900/20 group transition ${
                  isCurrent ? 'ring-1 ring-zinc-800/80 ring-offset-1 ring-offset-zinc-950' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[11px] font-mono font-semibold truncate pr-1 text-zinc-300">{step}</span>
                    <span className="shrink-0">{iconElement}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 line-clamp-3 group-hover:text-zinc-400 transition-colors leading-relaxed font-sans">{STAGE_DESCRIPTIONS[step]}</p>
                </div>

                <div className="border-t border-zinc-900/80 pt-2 mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-550 flex items-center gap-1">
                    <Bot className="h-3 w-3 text-zinc-500" />
                    {agent ? agent.name.split(' ')[0] : 'None'}
                  </span>

                  {status === 'active' ? (
                    <div className="w-16 bg-zinc-900 rounded-full h-1 overflow-hidden">
                      <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${simulationProgress}%` }}></div>
                    </div>
                  ) : (
                    <button
                      id={`btn-run-step-${step}`}
                      onClick={() => handleSimulateStep(step)}
                      disabled={runningStep !== null}
                      className={`text-[9px] font-mono py-1 px-2 rounded font-semibold tracking-wider transition-all border ${
                        status === 'completed'
                          ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700/80 text-zinc-400 hover:text-zinc-200'
                          : isCurrent
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40'
                          : 'bg-transparent border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {status === 'completed' ? 'RERUN' : 'RUN'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Active Logs Stream (for the selected project) */}
        <div className="mt-6 bg-zinc-950 border border-zinc-900 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-3.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              Active Agent Logs ({activeProject.agentLogs.length})
            </span>
            <span className="text-[9px] font-mono text-zinc-600">Target Server: Cloud-Native Micro-kernels</span>
          </div>

          <div id="logs-terminal-output" className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-zinc-800">
            {activeProject.agentLogs.map((log, idx) => {
              let textClass = 'text-zinc-400';
              if (log.type === 'success') textClass = 'text-emerald-400/90';
              if (log.type === 'warning') textClass = 'text-amber-400/95';
              if (log.type === 'error') textClass = 'text-rose-400/95';

              return (
                <div key={`log-${idx}`} className="flex items-start gap-3.5 text-xs font-mono leading-relaxed">
                  <span className="text-[10px] text-zinc-650 shrink-0 w-16">{log.timestamp}</span>
                  <span className="text-zinc-500 shrink-0 border-r border-zinc-850 pr-2 font-semibold">[{log.agentName}]</span>
                  <span className={`flex-grow ${textClass}`}>{log.message}</span>
                </div>
              );
            })}

            {activeProject.agentLogs.length === 0 && (
              <div className="text-center py-6 text-[10px] font-mono text-zinc-600">
                Logs cleared. No running agent telemetry traces recorded.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
