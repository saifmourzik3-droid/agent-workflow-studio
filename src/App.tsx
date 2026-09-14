/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Flame, 
  ArrowRight, 
  Bot, 
  ChevronRight, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  Settings, 
  Zap, 
  HelpCircle,
  Skull,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';

import { SaaSProject, BMADStep, AgentInfo, LibrarySnippet, WeeklySprintItem } from './types';
import { INITIAL_PROJECTS, AGENTS, WEEKLY_SPRINT, SOURCE_LIBRARY } from './data';

import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import BMADBoard from './components/BMADBoard';
import ValidationCharts from './components/ValidationCharts';
import LibrarySnippetPreview from './components/LibrarySnippetPreview';
import IdeaDetailModal from './components/IdeaDetailModal';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('inbox');
  const [projects, setProjects] = useState<SaaSProject[]>(INITIAL_PROJECTS);
  const [agents, setAgents] = useState<AgentInfo[]>(AGENTS);
  const [sprintItems, setSprintItems] = useState<WeeklySprintItem[]>(WEEKLY_SPRINT);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<SaaSProject | null>(null);

  // New SaaS Idea form inputs
  const [newSaaSName, setNewSaaSName] = useState('');
  const [newSaaSTarget, setNewSaaSTarget] = useState('');
  const [newSaaSProblem, setNewSaaSProblem] = useState('');
  const [newSaaSDemand, setNewSaaSDemand] = useState('');
  const [newSaaSMonetization, setNewSaaSMonetization] = useState('');
  const [newSaaSConfidence, setNewSaaSConfidence] = useState(65);
  const [newSaaSNextAction, setNewSaaSNextAction] = useState('Initiate market depth index analysis check');
  const [newSaaSOwnerAgent, setNewSaaSOwnerAgent] = useState('Analyst Agent Codebase');
  const [newSaaSDeadline, setNewSaaSDeadline] = useState('2030-06-30');
  const [newSaaSTechStack, setNewSaaSTechStack] = useState('Next.js, Tailwind v4, Vercel Edge Runtime, PostgreSQL');

  // Weekly shipping plan checklist check status
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'scope-lock': true,
    'db-scaffolding': true,
    'dns-registration': false,
    'oauth-flow': false,
    'landing-copy': true,
    'cypress-test': false,
    'pipelines-verified': false,
  });

  // Handle modal actions
  const handleUpdateConfidenceScore = (projectId: string, score: number) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, confidenceScore: score } : p));
  };

  const handleUpdateNextAction = (projectId: string, actionText: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, nextAction: actionText } : p));
  };

  const handleUpdateStatus = (projectId: string, status: SaaSProject['status']) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
  };

  // Triggered by BMAD pipeline run simulation
  const handleUpdateProjectProgress = (
    projectId: string, 
    step: BMADStep, 
    status: 'pending' | 'active' | 'completed' | 'failed'
  ) => {
    setAgents(prev => prev.map(a => a.role === step ? {
      ...a,
      completedTasks: a.completedTasks + (status === 'completed' ? 1 : 0),
      status: status === 'active' ? 'generating' : 'idle'
    } : a));
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const nextProgress = { ...p.bmadProgress, [step]: status };
        let nextStep = status === 'active' ? step : p.currentBMADStep;
        
        // If completed, move pointer to next logical step
        if (status === 'completed') {
          const STAGES: BMADStep[] = [
            'Analyst', 'Product Manager', 'UX Designer', 'Architect', 'Developer', 'QA', 'Growth', 'Decision Board'
          ];
          const currIdx = STAGES.indexOf(step);
          if (currIdx !== -1 && currIdx < STAGES.length - 1) {
            nextStep = STAGES[currIdx + 1];
          }
        }

        // Increment associated agent completed task score

        return { 
          ...p, 
          bmadProgress: nextProgress, 
          currentBMADStep: nextStep,
          status: nextStep === 'Decision Board' ? 'Active Project' : p.status  // auto promote if progressive
        };
      }
      return p;
    }));
  };

  const handleAddAgentLog = (
    projectId: string, 
    log: { agentName: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }
  ) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          agentLogs: [
            {
              timestamp: 'Just now',
              agentName: log.agentName,
              message: log.message,
              type: log.type
            },
            ...p.agentLogs
          ]
        };
      }
      return p;
    }));
  };

  // Submit dynamic manual SaaS ideas form
  const handleCreateSaaS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaaSName.trim()) return;

    const newProj: SaaSProject = {
      id: `proj-${Date.now()}`,
      name: newSaaSName,
      targetMarket: newSaaSTarget || 'General internet creators, microbuilders',
      problem: newSaaSProblem || 'Manually editing static templates repetitively',
      proofOfDemand: newSaaSDemand || 'Survey analysis of local hacker space community developers',
      monetization: newSaaSMonetization || '$9 monthly flat micro subscription tier',
      confidenceScore: newSaaSConfidence,
      status: 'Inbox',
      currentBMADStep: 'Analyst',
      bmadProgress: {
        'Analyst': 'active',
        'Product Manager': 'pending',
        'UX Designer': 'pending',
        'Architect': 'pending',
        'Developer': 'pending',
        'QA': 'pending',
        'Growth': 'pending',
        'Decision Board': 'pending'
      },
      nextAction: newSaaSNextAction,
      ownerAgent: newSaaSOwnerAgent,
      deadline: newSaaSDeadline,
      techStack: newSaaSTechStack.split(',').map(s => s.trim()),
      metrics: {
        waitlistCount: 0,
        landingPageViews: 0,
        conversionRate: 0,
        cpc: 0,
        preSalesCount: 0
      },
      agentLogs: [
        {
          timestamp: 'Just now',
          agentName: 'System Core',
          message: `Dynamic setup payload generated. Seeded ideas list under initial target market parameters. Priority: Analyst review.`,
          type: 'info'
        }
      ]
    };

    setProjects(prev => [newProj, ...prev]);
    
    // Clear inputs
    setNewSaaSName('');
    setNewSaaSTarget('');
    setNewSaaSProblem('');
    setNewSaaSDemand('');
    setNewSaaSMonetization('');
    
    // Auto navigation highlight
    setActiveSection('inbox');
  };

  // Promote project from Inbox to Active Pipeline
  const promoteToPipeline = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, status: 'BMAD Pipeline', currentBMADStep: 'Analyst' } 
        : p
    ));
    handleAddAgentLog(projectId, {
      agentName: 'System Linker',
      message: 'Promoted raw concept into live BMAD active sequence tracking system pipelines.',
      type: 'success'
    });
  };

  // Decision buttons (Kill/Pivot/Scale)
  const executeKill = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: 'Killed', nextAction: 'Archived. Core server decommissioned.' } : p
    ));
    handleAddAgentLog(projectId, {
      agentName: 'Decision Board Consensus',
      message: 'VOTED: DECOMMISSION & KILL. Shifting resource pools immediately.',
      type: 'error'
    });
  };

  const executePivot = (projectId: string, pivotConcept: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            status: 'Pivoted', 
            nextAction: `Executing Pivot: Support custom integrations.`,
            problem: `Needs pivot alignment: ${pivotConcept || 'custom automated channels'}`
          } 
        : p
    ));
    handleAddAgentLog(projectId, {
      agentName: 'Decision Board Consensus',
      message: `VOTED: PIVOT ROUTINE AGREED. Shifting market focus matching: ${pivotConcept}`,
      type: 'warning'
    });
  };

  const executeScale = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: 'Scaled', confidenceScore: 99, nextAction: 'Scaling infrastructure node layers to support high-throughput.' } : p
    ));
    handleAddAgentLog(projectId, {
      agentName: 'Decision Board Consensus',
      message: 'VOTED: SCALE & SEED FIRST-ROUND BUDGET COHORTS. Full launch validation confirmed.',
      type: 'success'
    });
  };

  // Command console executor handler
  const handleCommandRun = (commandText: string): string | null => {
    const textClean = commandText.trim().toLowerCase();
    
    if (textClean === 'help') {
      return 'Available: "help", "add project [name]", "kill [id]", "scale [id]", "pivot [id] [new goal]", "score [id] [val]".';
    }

    if (textClean.startsWith('add project ')) {
      const name = commandText.substring(12).trim();
      if (!name) return 'Error: Provide a descriptive SaaS title.';
      
      const newProj: SaaSProject = {
        id: `proj-cmd-${Date.now()}`,
        name,
        targetMarket: 'General developers, micro-saas buyers',
        problem: 'Tedious, repetitive boilerplate writing tasks',
        proofOfDemand: 'Injected via terminal developer override commands',
        monetization: '$19/mo base subscriptions tier',
        confidenceScore: 70,
        status: 'Inbox',
        currentBMADStep: 'Analyst',
        bmadProgress: {
          'Analyst': 'active',
          'Product Manager': 'pending',
          'UX Designer': 'pending',
          'Architect': 'pending',
          'Developer': 'pending',
          'QA': 'pending',
          'Growth': 'pending',
          'Decision Board': 'pending',
        },
        nextAction: 'Ready analyst profiling benchmark',
        ownerAgent: 'Analyst Agent Codebase',
        deadline: '2030-07-04',
        techStack: ['Next.js', 'Vite', 'Tailwind CSS'],
        metrics: { waitlistCount: 75, landingPageViews: 320, conversionRate: 12, cpc: 1.05, preSalesCount: 1 },
        agentLogs: [{ timestamp: 'Just now', agentName: 'Terminal Shell', message: 'Seeded via console inject override module lines.', type: 'info' }]
      };
      setProjects(prev => [newProj, ...prev]);
      return `Success: Seeded SaaS blueprint "${name}" directly into raw Inbox!`;
    }

    if (textClean.startsWith('kill ')) {
      const id = textClean.substring(5).trim();
      const proj = projects.find(p => p.id === id || p.id.endsWith(id));
      if (!proj) return `Error: Could not locate project matching ID: ${id}`;
      executeKill(proj.id);
      return `Success: Terminated "${proj.name}" servers and moved status to Killed directory.`;
    }

    if (textClean.startsWith('scale ')) {
      const id = textClean.substring(6).trim();
      const proj = projects.find(p => p.id === id || p.id.endsWith(id));
      if (!proj) return `Error: Could not locate project matching ID: ${id}`;
      executeScale(proj.id);
      return `Success: Commenced full cloud scaling pipelines for "${proj.name}".`;
    }

    if (textClean.startsWith('score ')) {
      const remainingBytes = textClean.substring(6).trim();
      const parts = remainingBytes.split(/\s+/);
      if (parts.length < 2) return 'Syntax Error: Try "score [id] [0-100]" value params.';
      const id = parts[0];
      const newVal = parseInt(parts[1], 10);
      if (isNaN(newVal) || newVal < 0 || newVal > 100) return 'Error: Confidence value must fall between 0 and 100.';
      
      const proj = projects.find(p => p.id === id || p.id.endsWith(id));
      if (!proj) return `Error: Could not find project matching ID: ${id}`;
      handleUpdateConfidenceScore(proj.id, newVal);
      return `Success: Score for "${proj.name}" set to ${newVal}%.`;
    }

    if (textClean.startsWith('pivot ')) {
      const remainingBytes = commandText.substring(6).trim();
      const firstSpaceIdx = remainingBytes.indexOf(' ');
      if (firstSpaceIdx === -1) return 'Syntax Error: Try "pivot [id] [new programmatic goal]"';
      
      const id = remainingBytes.substring(0, firstSpaceIdx).toLowerCase();
      const newGoal = remainingBytes.substring(firstSpaceIdx).trim();

      const proj = projects.find(p => p.id === id || p.id.endsWith(id));
      if (!proj) return `Error: Could not find project matching ID: ${id}`;
      executePivot(proj.id, newGoal);
      return `Success: Pivoted "${proj.name}" to: ${newGoal}`;
    }

    return `Command not recognized. Type "help" to display script syntax options.`;
  };

  // Filter project arrays based on search matching
  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.targetMarket.toLowerCase().includes(q) ||
      p.problem.toLowerCase().includes(q) ||
      p.techStack.some(t => t.toLowerCase().includes(q)) ||
      p.ownerAgent.toLowerCase().includes(q)
    );
  });

  // Derived high levels stats
  const activeSaaSList = projects.filter(p => p.status === 'Active Project');
  const inboxProjects = projects.filter(p => p.status === 'Inbox');
  const activeAgents = agents.filter(a => a.status !== 'sleeping');
  
  const totalPresalesValue = projects.reduce((acc, curr) => acc + curr.metrics.preSalesCount, 0);
  const successRatePercentage = Math.round(
    (projects.filter(p => p.status === 'Scaled' || p.status === 'Active Project').length / 
     Math.max(projects.filter(p => p.status !== 'Inbox').length, 1)) * 100
  );

  return (
    <div id="workflow-studio-app-container" className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none antialiased">
      
      {/* 1. LEFT SIDEBAR PANEL RAIL */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        activeProjectCount={activeSaaSList.length}
        inboxCount={inboxProjects.length}
        activeAgentsCount={activeAgents.length}
      />

      {/* 2. RIGHT WORKSPACE AREA */}
      <div id="workspace-layout-container" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP COMMAND BAR AND SEARCH HEADER */}
        <DashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExecuteCommand={handleCommandRun}
          totalSaaSCount={projects.filter(p => p.status === 'Active Project' || p.status === 'BMAD Pipeline').length}
          totalPreSales={totalPresalesValue}
          successRate={successRatePercentage}
        />

        {/* INNER SCROLLABLE WORKSPACE PAGES */}
        <main id="workspace-dynamic-views" className="flex-grow overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-zinc-800">
          
          {/* SEARCH SUGGESTIONS FILTER NOTIFICATION */}
          {searchQuery && (
            <div className="mb-4 bg-zinc-900/60 border border-zinc-800 p-2 text-xs rounded-lg text-amber-400 font-mono">
              Filtered views active: Displaying matches for "{searchQuery}" ({filteredProjects.length} projects matched)
            </div>
          )}

          {/* SECTION A: IDEAS INBOX */}
          {activeSection === 'inbox' && (
            <div id="section-inbox-deck" className="space-y-8 animate-fade-in">
              
              {/* Top Summary Info layout */}
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 text-amber-400 mt-0.5">
                    <Zap className="h-5 w-5 fill-amber-500/10" />
                  </span>
                  <div>
                    <h1 className="text-base font-bold tracking-tight text-zinc-100">Startup Ideas Sandbox</h1>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">Initial holding queue for incoming SaaS concepts before pipeline progression</p>
                  </div>
                </div>

                <div className="flex bg-zinc-950 px-4 py-2 rounded-lg border border-zinc-900 gap-4 text-xs font-mono">
                  <div>
                    <span className="block text-[9px] text-zinc-650 uppercase">Sandbox Count</span>
                    <span className="font-bold text-zinc-100">{inboxProjects.length} Ideas</span>
                  </div>
                  <div className="w-px bg-zinc-900"></div>
                  <div>
                    <span className="block text-[9px] text-zinc-650 uppercase">Avg Confidence</span>
                    <span className="font-bold text-amber-400">
                      {Math.round(inboxProjects.reduce((acc,curr) => acc + curr.confidenceScore, 0) / Math.max(inboxProjects.length, 1))}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid: Create Form on Left, Catalog list on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. Add Idea form */}
                <form 
                  onSubmit={handleCreateSaaS}
                  className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 relative overflow-hidden"
                >
                  <div className="absolute right-0 top-0 -mr-6 -mt-6 h-28 w-28 rounded-full bg-indigo-500/5 blur-2xl"></div>
                  
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-2">Prototype SaaS blueprint parameters</h3>
                  
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">PROTOTYPE PRODUCT CODENAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., MailScraper AI"
                      value={newSaaSName}
                      onChange={(e) => setNewSaaSName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">TARGET DEMOGRAPHIC / MARKET *</label>
                    <input
                      type="text"
                      placeholder="e.g., newsletter operators, sales executives"
                      value={newSaaSTarget}
                      onChange={(e) => setNewSaaSTarget(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">FRICTION POINT (THE CORE PROBLEM) *</label>
                    <textarea
                      placeholder="e.g., copy pasting sales prospects takes hours of tedious manual formatting"
                      value={newSaaSProblem}
                      onChange={(e) => setNewSaaSProblem(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">DEMAND SIGNAL</label>
                      <input
                        type="text"
                        placeholder="e.g., Reddit survey logs"
                        value={newSaaSDemand}
                        onChange={(e) => setNewSaaSDemand(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">MONETIZATION</label>
                      <input
                        type="text"
                        placeholder="e.g., $19 monthly flat"
                        value={newSaaSMonetization}
                        onChange={(e) => setNewSaaSMonetization(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 px-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">CONFIDENCE ({newSaaSConfidence}%)</label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={newSaaSConfidence}
                        onChange={(e) => setNewSaaSConfidence(Number(e.target.value))}
                        className="w-full accent-amber-500 mt-2 cursor-pointer h-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">SPRINT DEADLINE</label>
                      <input
                        type="date"
                        value={newSaaSDeadline}
                        onChange={(e) => setNewSaaSDeadline(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1 px-2 text-xs text-zinc-300 font-mono focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">PROPOSED TECH BLUEPRINT</label>
                    <input
                      type="text"
                      value={newSaaSTechStack}
                      onChange={(e) => setNewSaaSTechStack(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-1.5 px-3 text-[11px] font-mono text-zinc-400 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs py-2.5 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-4 w-4 stroke-[3px]" />
                    INJECT CONCEPT TO INBOX
                  </button>
                </form>

                {/* 2. Sandbox items catalog */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-2">Active Concepts in Inbox sandbox ({filteredProjects.filter(p=>p.status==='Inbox').length})</h3>
                  
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                    {filteredProjects.filter(p => p.status === 'Inbox').map((p) => (
                      <div 
                        key={p.id} 
                        id={`inbox-concept-${p.id}`}
                        className="bg-zinc-950 border border-zinc-900 rounded-xl p-4.5 hover:border-zinc-850 transition relative group flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">{p.name}</h4>
                              <span className="text-[10px] font-mono text-zinc-500">#{p.id.substring(p.id.length-4)}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{p.targetMarket}</p>
                            <p className="text-[11px] text-zinc-500 mt-2 italic font-sans break-words bg-zinc-900/40 p-2 rounded">"{p.problem}"</p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="block text-[11px] font-mono font-bold text-amber-500">{p.confidenceScore}% Score</span>
                            <span className="block text-[9px] font-mono text-zinc-650 mt-1 uppercase">DEADLINE: {p.deadline}</span>
                          </div>
                        </div>

                        {/* Interactive promotion strip */}
                        <div className="border-t border-zinc-900/80 pt-3.5 mt-4 flex items-center justify-between text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => setSelectedProject(p)}
                            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                          >
                            <Settings className="h-3.5 w-3.5 text-zinc-600" />
                            VIEW BLUEPRINT
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setProjects(prev => prev.filter(x => x.id !== p.id));
                              }}
                              className="text-zinc-600 hover:text-rose-400 p-1.5 rounded hover:bg-zinc-900 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => promoteToPipeline(p.id)}
                              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-[10px] font-semibold tracking-wider text-amber-400 py-1.5 px-3 rounded-lg transition-all flex items-center gap-1"
                            >
                              START PRODUCTION
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredProjects.filter(p => p.status === 'Inbox').length === 0 && (
                      <div className="text-center py-16 bg-zinc-900/10 border border-zinc-900 rounded-xl text-zinc-650 font-mono text-xs">
                        No pending inbox ideas found. Type a codename on the left to spawn one!
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SECTION B: BMAD PIPELINE BOARD */}
          {activeSection === 'bmad' && (
            <div id="section-bmad-deck" className="space-y-6 animate-fade-in">
              <BMADBoard 
                projects={projects}
                onUpdateProjectProgress={handleUpdateProjectProgress}
                onAddAgentLog={handleAddAgentLog}
                agents={agents}
              />
            </div>
          )}

          {/* SECTION C: ACTIVE SAAS PROJECTS */}
          {activeSection === 'active' && (
            <div id="section-active-deck" className="space-y-8 animate-fade-in">
              
              <div className="bg-zinc-900/40 p-4.5 rounded-xl border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-amber-500" />
                    Live Production Repositories ({filteredProjects.filter(p=>p.status==='Active Project').length})
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">Micro-SaaS operations undergoing coding integrations or pre-release analytics checkups</p>
                </div>

                <div className="text-xs font-mono bg-zinc-950 border border-zinc-900 py-1.5 px-3 rounded text-zinc-400">
                  Sprint cycle: <strong className="text-zinc-200">1 Launch / Week</strong> setup
                </div>
              </div>

              {/* Listings grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.filter(p => p.status === 'Active Project').map((p) => {
                  
                  // calculate steps completed
                  const bmadStates = Object.values(p.bmadProgress);
                  const completed = bmadStates.filter(v => v === 'completed').length;
                  const percent = Math.round((completed / bmadStates.length) * 100);

                  return (
                    <div 
                      key={p.id} 
                      id={`active-card-${p.id}`}
                      className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition flex flex-col justify-between group h-[295px]"
                    >
                      <div>
                        {/* Title line */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition">{p.name}</h3>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400">
                            STEP: {p.currentBMADStep}
                          </span>
                        </div>

                        {/* Tech flags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {p.techStack.slice(0, 3).map((tech) => (
                            <span key={tech} className="text-[8.5px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Description block */}
                        <p className="text-xs text-zinc-400 mt-3 line-clamp-2 font-sans">{p.problem}</p>

                        {/* Micro performance parameters block */}
                        <div className="grid grid-cols-3 gap-2 mt-4 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900/80">
                          <div>
                            <span className="block text-[8px] font-mono text-zinc-650 uppercase">Waitlist</span>
                            <span className="text-[11px] font-mono font-bold text-zinc-300">{p.metrics.waitlistCount} leads</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-mono text-zinc-650 uppercase">Views</span>
                            <span className="text-[11px] font-mono font-bold text-zinc-300">{(p.metrics.landingPageViews).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-mono text-zinc-650 uppercase">Acquisition</span>
                            <span className="text-[11px] font-mono font-bold text-emerald-400">${p.metrics.cpc.toFixed(2)} CPC</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom progress representation */}
                      <div className="border-t border-zinc-900 pt-3.5 mt-4">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-550 mb-1.5">
                          <span>BMAD Assembly:</span>
                          <span className="text-zinc-300 font-semibold">{percent}% ({completed}/8 compiled)</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => setSelectedProject(p)}
                            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:underline"
                          >
                            <Settings className="h-3 w-3 text-zinc-600" />
                            ADAPT PARAMETERS
                          </button>

                          <button
                            onClick={() => {
                              setActiveSection('bmad');
                            }}
                            className="text-[10px] text-amber-500 hover:text-amber-400 font-bold tracking-wider flex items-center gap-0.5"
                          >
                            OPEN TELEMETRY
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProjects.filter(p => p.status === 'Active Project').length === 0 && (
                  <div className="col-span-full text-center py-24 bg-zinc-900/15 border border-zinc-900 rounded-xl text-zinc-600 font-mono text-xs">
                    No active production repositories detected. Promote an Inbox concept to begin coding!
                  </div>
                )}
              </div>

            </div>
          )}

          {/* SECTION D: VALIDATION METRICS */}
          {activeSection === 'metrics' && (
            <div id="section-metrics-deck" className="space-y-6 animate-fade-in">
              <ValidationCharts projects={projects} />
            </div>
          )}

          {/* SECTION E: AGENT TASKS */}
          {activeSection === 'agents' && (
            <div id="section-agents-deck" className="space-y-8 animate-fade-in">
              
              <div className="bg-zinc-900/40 p-4.5 rounded-xl border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                    <Bot className="h-5 w-5 text-amber-500" />
                    System Sub-Agent Cohorts ({agents.length} active)
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">Specialized AI worker processes listening to the BMAD event stream and pipeline queries</p>
                </div>

                <div className="flex gap-2 text-xs font-mono">
                  <div className="bg-zinc-950 px-3 py-1.5 rounded border border-zinc-900 text-zinc-400">
                    Active: <strong className="text-zinc-200">{activeAgents.length} running</strong>
                  </div>
                </div>
              </div>

              {/* Agents listing grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div 
                    key={agent.id} 
                    id={`agent-card-${agent.id}`}
                    className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition flex flex-col justify-between h-[280px]"
                  >
                    <div>
                      {/* Avatar name line */}
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={agent.avatar} 
                          alt="avatar" 
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-lg object-cover border border-zinc-800 bg-zinc-900" 
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-bold text-zinc-100 truncate">{agent.name}</h3>
                          <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{agent.role}</span>
                        </div>

                        {/* Status badge */}
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          agent.status === 'sleeping' 
                            ? 'bg-zinc-900 text-zinc-550' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
                        }`}>
                          {agent.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Current task box */}
                      <div className="mt-4 bg-zinc-900 border border-zinc-850 p-3 rounded-lg flex items-start gap-2 max-h-[70px] overflow-hidden">
                        <span className="text-[10px] font-mono font-bold text-zinc-650 shrink-0">TASK:</span>
                        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed line-clamp-2">{agent.currentTask}</p>
                      </div>

                      {/* Capabilities bullets */}
                      <div className="mt-4">
                        <span className="block text-[10px] font-mono text-zinc-650 uppercase mb-1.5">Expert capabilities</span>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.slice(0,2).map((cap) => (
                            <span key={cap} className="text-[9px] font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 text-zinc-500 truncate max-w-[160px]">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-3.5 mt-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-zinc-550">
                        Operational hits: <strong className="text-zinc-300">{agent.completedTasks}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          // Change state temporary
                          setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'generating', completedTasks: a.completedTasks + 1 } : a));
                          setTimeout(() => {
                            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'idle' } : a));
                          }, 2000);
                        }}
                        className="bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white px-3 py-1.5 rounded border border-zinc-800 text-[10px] font-semibold tracking-wider transition-all"
                      >
                        RUN MANIFEST
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* SECTION F: WEEKLY SHIPPING PLAN */}
          {activeSection === 'shipping' && (
            <div id="section-shipping-deck" className="space-y-8 animate-fade-in">
              
              <div className="bg-zinc-900/40 p-4.5 rounded-xl border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded bg-zinc-950 border border-zinc-850 text-indigo-400 mt-0.5">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <h1 className="text-base font-bold tracking-tight text-zinc-100">Weekly Shipping Sprint Log</h1>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">Enforcing a strict chronological cadence of 1 launch every Friday</p>
                  </div>
                </div>

                <div className="text-xs font-mono bg-zinc-950 border border-zinc-900 p-2 rounded text-amber-500">
                  Sprint Week: №48
                </div>
              </div>

              {/* Grid timeline on left, checklist on right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Left shipping timeline card list */}
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Chronological targets</span>
                  
                  <div className="space-y-4 relative pl-3.5 border-l border-zinc-850">
                    {sprintItems.map((item) => (
                      <div 
                        key={item.id} 
                        id={`sprint-entry-${item.id}`}
                        className="relative bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-zinc-800 transition"
                      >
                        {/* Timeline node dot */}
                        <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-indigo-500 border-2 border-zinc-950"></div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-zinc-200">{item.projectName}</h4>
                          <span className="block text-[10.5px] font-mono text-zinc-550 mt-1">{item.date}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`inline-block text-[9px] font-mono py-1 px-2 rounded-lg font-bold ${
                            item.shipProbability === 'Shipped'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : item.shipProbability === 'High'
                              ? 'bg-indigo-500/10 text-indigo-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {item.shipProbability.toUpperCase()}
                          </span>
                          <span className="block text-[10px] font-mono text-zinc-650 mt-1">{item.tasksCompleted}/{item.totalTasks} checks passed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Checklist for active sprint */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-1">
                      <CheckSquare className="h-4 w-4 text-amber-500" />
                      Dynamic Release Checklist
                    </span>

                    <div className="space-y-3.5 select-none">
                      {[
                        { id: 'scope-lock', title: 'Scope Lock reached (PM Agent)' },
                        { id: 'db-scaffolding', title: 'Database table mappings ready' },
                        { id: 'dns-registration', title: 'Route DNS & SSL secure proxies' },
                        { id: 'oauth-flow', title: 'OAuth API credentials callback loaded' },
                        { id: 'landing-copy', title: 'Marketing and waitlist copy lock' },
                        { id: 'cypress-test', title: 'QA E2E stress validations passed' },
                        { id: 'pipelines-verified', title: 'Cloud-Run deployment checks clear' },
                      ].map((chk) => (
                        <label 
                          key={chk.id} 
                          id={`chk-label-${chk.id}`}
                          className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-zinc-900/60 transition"
                        >
                          <input
                            type="checkbox"
                            checked={checklist[chk.id] || false}
                            onChange={() => {
                              setChecklist(prev => ({ ...prev, [chk.id]: !prev[chk.id] }));
                            }}
                            className="mt-0.5 accent-amber-500 cursor-pointer h-3.5 w-3.5 rounded bg-zinc-900 border-zinc-800"
                          />
                          <span className={`text-xs ${
                            checklist[chk.id] 
                              ? 'text-zinc-500 line-through' 
                              : 'text-zinc-350 hover:text-white'
                          } transition`}>
                            {chk.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-900 pt-4 mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        // Mark all done
                        setChecklist({
                          'scope-lock': true,
                          'db-scaffolding': true,
                          'dns-registration': true,
                          'oauth-flow': true,
                          'landing-copy': true,
                          'cypress-test': true,
                          'pipelines-verified': true,
                        });
                        setSprintItems(prev => prev.map(s => s.id === 'sprint-1' ? { ...s, shipProbability: 'Shipped', tasksCompleted: 8 } : s));
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700/85 text-[10.5px] font-mono font-bold tracking-wider text-zinc-300 py-2.5 rounded-lg transition"
                    >
                      FORCE CONFIRM SHIP READY
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SECTION G: KILL / PIVOT / SCALE CABINET */}
          {activeSection === 'decisions' && (
            <div id="section-decisions-deck" className="space-y-8 animate-fade-in">
              
              <div className="bg-zinc-900/40 p-4.5 rounded-xl border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                    <Skull className="h-5 w-5 text-zinc-400" />
                    Strategic Decisions Cabinet
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">Kill, Pivot, or Scale consensus triggers for active production pipelines</p>
                </div>

                <div className="text-[10px] font-mono text-zinc-500">
                  Consensus mandate: <strong className="text-amber-400">&gt;70% confidence check</strong>
                </div>
              </div>

              {/* Grid: Actions column, archived decisions history on right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Active Decisions Actions Selector */}
                <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Initiate Board Action</span>
                  
                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                    {projects.filter(p => p.status === 'Active Project' || p.status === 'BMAD Pipeline').map((p) => (
                      <div 
                        key={p.id} 
                        id={`decision-action-${p.id}`}
                        className="bg-zinc-900/20 border border-zinc-900/80 hover:border-zinc-800/80 rounded-xl p-4.5 transition flex flex-col"
                      >
                        <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-900">
                          <div>
                            <h4 className="text-xs font-bold text-zinc-150">{p.name}</h4>
                            <span className="block text-[10px] font-mono text-zinc-550 mt-1">Confidence Score: <strong className="text-amber-400">{p.confidenceScore}%</strong></span>
                          </div>

                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-200">
                            STEP: {p.currentBMADStep}
                          </span>
                        </div>

                        {/* Summary of validation results */}
                        <div className="py-3 text-xs text-zinc-400 space-y-1">
                          <p className="line-clamp-1"><strong className="text-zinc-500 font-mono text-[10px]">DEMAND:</strong> {p.proofOfDemand}</p>
                          <p className="line-clamp-1"><strong className="text-zinc-500 font-mono text-[10px]">MONETIZATION:</strong> {p.monetization}</p>
                        </div>

                        {/* Interactive Board triggers */}
                        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-zinc-900">
                          
                          <button
                            id={`btn-decision-kill-${p.id}`}
                            onClick={() => executeKill(p.id)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold tracking-wider text-rose-450 py-2 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            KILL
                          </button>

                          <button
                            id={`btn-decision-pivot-${p.id}`}
                            onClick={() => {
                              const note = prompt('Type new pivot direction or target domain model:', 'Target corporate teams via dedicated plugin hook instead.');
                              if (note !== null) {
                                executePivot(p.id, note);
                              }
                            }}
                            className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold tracking-wider text-amber-450 py-2 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            PIVOT
                          </button>

                          <button
                            id={`btn-decision-scale-${p.id}`}
                            onClick={() => executeScale(p.id)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold tracking-wider text-emerald-400 py-2 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            SCALE
                          </button>

                        </div>

                      </div>
                    ))}

                    {projects.filter(p => p.status === 'Active Project' || p.status === 'BMAD Pipeline').length === 0 && (
                      <div className="text-center py-20 text-zinc-650 font-mono text-xs">
                        No active products or pipelines await board decisions. Go to the Inbox!
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Decisions history cemetery log */}
                <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Decision Registry logs</span>
                  
                  <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                    {filteredProjects.filter(p => p.status === 'Killed' || p.status === 'Pivoted' || p.status === 'Scaled').map((p) => {
                      let statusBadgeColor = 'bg-zinc-900 text-zinc-400 border border-zinc-800';
                      if (p.status === 'Killed') statusBadgeColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                      if (p.status === 'Pivoted') statusBadgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                      if (p.status === 'Scaled') statusBadgeColor = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]';

                      return (
                        <div 
                          key={p.id} 
                          id={`historic-decision-${p.id}`}
                          className="bg-zinc-900/15 border border-zinc-900/60 p-4 rounded-xl flex items-start justify-between gap-3 hover:border-zinc-850 transition"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-zinc-300">{p.name}</span>
                            <span className="block text-[10px] text-zinc-500 mt-1 leading-relaxed font-mono">Next: {p.nextAction}</span>
                          </div>

                          <span className={`text-[9px] font-mono py-0.5 px-2 rounded-lg font-bold shrink-0 uppercase ${statusBadgeColor}`}>
                            {p.status}
                          </span>
                        </div>
                      );
                    })}

                    {filteredProjects.filter(p => p.status === 'Killed' || p.status === 'Pivoted' || p.status === 'Scaled').length === 0 && (
                      <div className="text-center py-16 text-zinc-650 font-mono text-xs">
                        Decision registry log is clear.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SECTION H: SOURCE LIBRARY BROWSER */}
          {activeSection === 'library' && (
            <div id="section-library-deck" className="space-y-6 animate-fade-in">
              <LibrarySnippetPreview snippets={SOURCE_LIBRARY} />
            </div>
          )}

        </main>
      </div>

      {/* DYNAMIC BLUEPRINT MODAL OVERLAY */}
      {selectedProject && (
        <IdeaDetailModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdateConfidenceScore={handleUpdateConfidenceScore}
          onUpdateNextAction={handleUpdateNextAction}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

    </div>
  );
}
