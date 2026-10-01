/**
 * PJ Center — Domain Types
 * M3 Demo Domain — Entity definitions and interfaces
 */

// ============================================================================
// Base Types
// ============================================================================

export type UUID = string;
export type ISODateTime = string;

// ============================================================================
// Enums & Status Types
// ============================================================================

export type AgentRole = 'strategist' | 'advocate' | 'architect' | 'reviewer' | 'synthesizer';

export type AgentStatus = 'idle' | 'working' | 'waiting-approval' | 'complete' | 'error';

export type WorkflowStage =
  | 'draft-brief'
  | 'ready'
  | 'diverge'
  | 'critique'
  | 'synthesize'
  | 'human-decision'
  | 'complete'
  | 'error';

export type SessionStatus = 'idle' | 'working' | 'waiting-approval' | 'complete' | 'error';

export type ContributionType = 'proposal' | 'critique' | 'synthesis';

export type ApprovalAction = 'increase-budget' | 'new-round' | 'merge-options' | 'retry';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type BudgetEntryType = 'reserve' | 'commit' | 'release';

export type AuditAction =
  | 'entity_created'
  | 'entity_updated'
  | 'run_started'
  | 'state_changed'
  | 'approval_requested'
  | 'approval_resolved'
  | 'budget_reserved'
  | 'budget_committed'
  | 'budget_released'
  | 'decision_confirmed'
  | 'error_raised'
  | 'retry_started'
  | 'data_cleared';

// ============================================================================
// Entities
// ============================================================================

export interface Workspace {
  id: UUID;
  name: string;
  locale: 'th' | 'en';
  demoMode: boolean;
  createdAt: ISODateTime;
}

export interface AgentDefinition {
  id: UUID;
  name: string;
  role: AgentRole;
  personality: string;
  systemPrompt: string;
  modelAdapterId: string;
  permissionProfileId: string;
  enabled: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface IdeaBrief {
  id: UUID;
  revision: number;
  topic: string;
  targetUser: string;
  goal: string;
  constraints: string;
  successSignal: string;
  createdAt: ISODateTime;
}

export interface Session {
  id: UUID;
  briefRevisionId: UUID;
  status: SessionStatus;
  currentStage: WorkflowStage;
  budgetLimit: number;
  createdAt: ISODateTime;
  completedAt?: ISODateTime;
}

export interface WorkflowRun {
  id: UUID;
  sessionId: UUID;
  revision: number;
  status: SessionStatus;
  startedAt: ISODateTime;
  endedAt?: ISODateTime;
}

export interface StepRun {
  id: UUID;
  workflowRunId: UUID;
  stage: WorkflowStage;
  agentId: UUID;
  status: AgentStatus;
  attempt: number;
  inputRefs: UUID[];
  outputRefs: UUID[];
  startedAt: ISODateTime;
  completedAt?: ISODateTime;
}

export interface Contribution {
  id: UUID;
  stepRunId: UUID;
  agentId: UUID;
  type: ContributionType;
  content: string;
  assumptions: string[];
  sourceRefs: UUID[];
  demoGenerated: boolean;
  createdAt: ISODateTime;
}

export interface Option {
  id: UUID;
  workflowRunId: UUID;
  rank: number;
  title: string;
  thesis: string;
  primaryUser: string;
  valueProposition: string;
  keyFeatures: string[];
  strengths: string;
  weaknesses: string;
  technicalDifficulty: 'low' | 'medium' | 'high';
  indicativeCostLevel: 'low' | 'medium' | 'high';
  risks: string;
  mvpScope: string;
  nextSteps: string;
  confidenceNote: string;
  recommendationRationale: string;
  contributionRefs: UUID[];
  createdAt: ISODateTime;
}

export interface Decision {
  id: UUID;
  sessionId: UUID;
  revision: number;
  type: 'select' | 'merge' | 'rerun';
  selectedOptionIds: UUID[];
  rationale: string;
  confirmedAt: ISODateTime;
}

export interface DevelopmentOutline {
  id: UUID;
  decisionId: UUID;
  problem: string;
  users: string;
  mvpItems: string[];
  laterItems: string[];
  risks: string[];
  nextSteps: string[];
  createdAt: ISODateTime;
}

export interface ApprovalRequest {
  id: UUID;
  action: ApprovalAction;
  requesterId: UUID;
  targetRef: UUID;
  reason: string;
  estimatedImpact: string;
  riskLabel: 'low' | 'medium' | 'high';
  createdAt: ISODateTime;
  expiresAt?: ISODateTime;
  status: ApprovalStatus;
  resolutionNote?: string;
  context?: Record<string, string>;
  resolvedAt?: ISODateTime;
}

export interface BudgetEntry {
  id: UUID;
  sessionId: UUID;
  stepRunId?: UUID;
  type: BudgetEntryType;
  amount: number;
  balanceAfter: number;
  description: string;
  demoOnly: boolean;
  createdAt: ISODateTime;
}

export interface AuditEvent {
  id: UUID;
  timestamp: ISODateTime;
  actorType: 'user' | 'agent' | 'system';
  actorId: UUID;
  entityType: string;
  entityId: UUID;
  action: AuditAction;
  reason: string;
  metadata: Record<string, unknown>;
  previousEventHash?: string;
}

export interface AppSettings {
  locale: 'th' | 'en';
  theme: 'light' | 'dark';
  reducedMotion: boolean;
  onboardingComplete: boolean;
  schemaVersion: number;
}

// ============================================================================
// Repository Interfaces
// ============================================================================

export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: UUID): Promise<T | null>;
  create(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: UUID): Promise<void>;
}

export interface WorkspaceRepository extends Repository<Workspace> {}

export interface AgentRepository extends Repository<AgentDefinition> {
  getByRole(role: AgentRole): Promise<AgentDefinition[]>;
  getEnabled(): Promise<AgentDefinition[]>;
}

export interface BriefRepository extends Repository<IdeaBrief> {
  getBySession(sessionId: UUID): Promise<IdeaBrief[]>;
}

export interface SessionRepository extends Repository<Session> {
  getActive(): Promise<Session | null>;
  getByStatus(status: SessionStatus): Promise<Session[]>;
}

export interface WorkflowRunRepository extends Repository<WorkflowRun> {
  getBySession(sessionId: UUID): Promise<WorkflowRun[]>;
}

export interface StepRunRepository extends Repository<StepRun> {
  getByWorkflowRun(workflowRunId: UUID): Promise<StepRun[]>;
  getByAgent(agentId: UUID): Promise<StepRun[]>;
}

export interface ContributionRepository extends Repository<Contribution> {
  getByStepRun(stepRunId: UUID): Promise<Contribution[]>;
  getByAgent(agentId: UUID): Promise<Contribution[]>;
}

export interface OptionRepository extends Repository<Option> {
  getByWorkflowRun(workflowRunId: UUID): Promise<Option[]>;
}

export interface DecisionRepository extends Repository<Decision> {
  getBySession(sessionId: UUID): Promise<Decision[]>;
}

export interface OutlineRepository extends Repository<DevelopmentOutline> {
  getByDecision(decisionId: UUID): Promise<DevelopmentOutline | null>;
}

export interface ApprovalRepository extends Repository<ApprovalRequest> {
  getPending(): Promise<ApprovalRequest[]>;
  getBySession(sessionId: UUID): Promise<ApprovalRequest[]>;
}

export interface BudgetRepository extends Repository<BudgetEntry> {
  getBySession(sessionId: UUID): Promise<BudgetEntry[]>;
  getBalance(sessionId: UUID): Promise<number>;
}

export interface AuditRepository extends Repository<AuditEvent> {
  getBySession(sessionId: UUID): Promise<AuditEvent[]>;
  getRecent(limit: number): Promise<AuditEvent[]>;
}

export interface SettingsRepository {
  get(): Promise<AppSettings>;
  update(settings: Partial<AppSettings>): Promise<AppSettings>;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
