/* ============================================================
   PJ Center — Type Definitions
   M2 UX Skeleton — domain types for screen shells
   ============================================================ */

// --- Navigation ---
export type NavTabId = 'station' | 'sessions' | 'agents' | 'approvals';

export interface NavTab {
  id: NavTabId;
  label: string;
  icon: string;
  path: string;
}

// --- Agent ---
export type AgentRole = 'strategist' | 'advocate' | 'architect' | 'reviewer' | 'synthesizer';

export interface AgentDefinition {
  id: string;
  name: string;
  role: AgentRole;
  personality: string;
  systemPrompt: string;
  modelLabel: string;
  enabled: boolean;
}

// --- Status ---
export type SessionStatus = 'idle' | 'working' | 'waiting-approval' | 'complete' | 'error';

export type WorkflowStage =
  | 'draft-brief'
  | 'ready'
  | 'diverge'
  | 'critique'
  | 'synthesize'
  | 'human-decision'
  | 'complete'
  | 'error';

// --- Idea Brief ---
export interface IdeaBrief {
  id: string;
  revision: number;
  topic: string;
  targetUser: string;
  goal: string;
  constraints: string;
  successSignal: string;
  createdAt: string;
}

// --- Session ---
export interface Session {
  id: string;
  briefId: string;
  status: SessionStatus;
  currentStage: WorkflowStage;
  createdAt: string;
  completedAt?: string;
}

// --- Contribution ---
export interface Contribution {
  id: string;
  agentId: string;
  agentName: string;
  round: number;
  type: 'proposal' | 'critique' | 'synthesis';
  content: string;
  demoGenerated: boolean;
}

// --- Option ---
export interface Option {
  id: string;
  rank: number;
  title: string;
  thesis: string;
  strengths: string;
  weaknesses: string;
  risks: string;
  costLevel: 'low' | 'medium' | 'high';
  nextSteps: string;
  confidenceNote: string;
}

// --- Approval ---
export type ApprovalAction = 'increase-budget' | 'new-round' | 'merge-options' | 'retry';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface ApprovalRequest {
  id: string;
  action: ApprovalAction;
  reason: string;
  estimatedImpact: string;
  status: ApprovalStatus;
  createdAt: string;
}

// --- Budget ---
export interface BudgetEntry {
  id: string;
  type: 'reserve' | 'commit' | 'release';
  amount: number;
  balanceAfter: number;
  description: string;
  demoOnly: boolean;
}

// --- Audit ---
export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  reason: string;
}

// --- Settings ---
export interface AppSettings {
  locale: 'th' | 'en';
  theme: 'light' | 'dark';
  reducedMotion: boolean;
  onboardingComplete: boolean;
  schemaVersion: number;
}
