/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProjectStatus = 'Inbox' | 'BMAD Pipeline' | 'Active Project' | 'Killed' | 'Pivoted' | 'Scaled';

export type BMADStep = 
  | 'Analyst' 
  | 'Product Manager' 
  | 'UX Designer' 
  | 'Architect' 
  | 'Developer' 
  | 'QA' 
  | 'Growth' 
  | 'Decision Board';

export interface SaaSProject {
  id: string;
  name: string;
  targetMarket: string;
  problem: string;
  proofOfDemand: string;
  monetization: string;
  confidenceScore: number; // 0 to 100
  status: ProjectStatus;
  currentBMADStep: BMADStep;
  bmadProgress: Record<BMADStep, 'pending' | 'active' | 'completed' | 'failed'>;
  nextAction: string;
  ownerAgent: string;
  deadline: string;
  techStack: string[];
  metrics: {
    waitlistCount: number;
    landingPageViews: number;
    conversionRate: number; // percentage
    cpc: number; // cost per click USD
    preSalesCount: number;
  };
  agentLogs: {
    timestamp: string;
    agentName: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }[];
}

export interface AgentInfo {
  id: string;
  name: string;
  role: BMADStep;
  avatar: string;
  status: 'idle' | 'analyzing' | 'generating' | 'evaluating' | 'sleeping';
  completedTasks: number;
  currentTask: string;
  capabilities: string[];
}

export interface LibrarySnippet {
  id: string;
  title: string;
  category: 'authentication' | 'payment' | 'database' | 'ui-component' | 'ai-prompt';
  description: string;
  code: string;
  language: string;
}

export interface WeeklySprintItem {
  id: string;
  projectName: string;
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  shipProbability: 'High' | 'Medium' | 'Low' | 'Shipped';
}
