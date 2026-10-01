/**
 * PJ Center — Repository Implementations
 * M3 Demo Domain — Concrete repositories using IndexedDB
 */

import type {
  AgentDefinition,
  AgentRole,
  Session,
  SessionStatus,
  ApprovalRequest,
  ApprovalStatus,
  BudgetEntry,
  AuditEvent,
  Contribution,
  Option,
  WorkflowRun,
  StepRun,
  Decision,
  DevelopmentOutline,
  IdeaBrief,
  AppSettings,
} from '../domain/types';
import * as db from './indexeddb';
import { STORES } from './indexeddb';

// ============================================================================
// Agent Repository
// ============================================================================

export const agentRepository = {
  async getAll(): Promise<AgentDefinition[]> {
    return db.getAll<AgentDefinition>(STORES.AGENTS);
  },

  async getById(id: string): Promise<AgentDefinition | null> {
    return db.getById<AgentDefinition>(STORES.AGENTS, id);
  },

  async create(agent: AgentDefinition): Promise<AgentDefinition> {
    return db.create(STORES.AGENTS, agent);
  },

  async update(agent: AgentDefinition): Promise<AgentDefinition> {
    return db.update(STORES.AGENTS, agent);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.AGENTS, id);
  },

  async getByRole(role: AgentRole): Promise<AgentDefinition[]> {
    return db.getByIndex<AgentDefinition>(STORES.AGENTS, 'role', role);
  },

  async getEnabled(): Promise<AgentDefinition[]> {
    const all = await this.getAll();
    return all.filter((a) => a.enabled);
  },
};

// ============================================================================
// Brief Repository
// ============================================================================

export const briefRepository = {
  async getAll(): Promise<IdeaBrief[]> {
    return db.getAll<IdeaBrief>(STORES.BRIEFS);
  },

  async getById(id: string): Promise<IdeaBrief | null> {
    return db.getById<IdeaBrief>(STORES.BRIEFS, id);
  },

  async create(brief: IdeaBrief): Promise<IdeaBrief> {
    return db.create(STORES.BRIEFS, brief);
  },

  async update(brief: IdeaBrief): Promise<IdeaBrief> {
    return db.update(STORES.BRIEFS, brief);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.BRIEFS, id);
  },
};

// ============================================================================
// Session Repository
// ============================================================================

export const sessionRepository = {
  async getAll(): Promise<Session[]> {
    return db.getAll<Session>(STORES.SESSIONS);
  },

  async getById(id: string): Promise<Session | null> {
    return db.getById<Session>(STORES.SESSIONS, id);
  },

  async create(session: Session): Promise<Session> {
    return db.create(STORES.SESSIONS, session);
  },

  async update(session: Session): Promise<Session> {
    return db.update(STORES.SESSIONS, session);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.SESSIONS, id);
  },

  async getActive(): Promise<Session | null> {
    const all = await this.getAll();
    const active = all.find(
      (s) => s.status === 'working' || s.status === 'waiting-approval' || s.status === 'idle'
    );
    return active || null;
  },

  async getByStatus(status: SessionStatus): Promise<Session[]> {
    return db.getByIndex<Session>(STORES.SESSIONS, 'status', status);
  },
};

// ============================================================================
// Workflow Run Repository
// ============================================================================

export const workflowRunRepository = {
  async getAll(): Promise<WorkflowRun[]> {
    return db.getAll<WorkflowRun>(STORES.WORKFLOW_RUNS);
  },

  async getById(id: string): Promise<WorkflowRun | null> {
    return db.getById<WorkflowRun>(STORES.WORKFLOW_RUNS, id);
  },

  async create(run: WorkflowRun): Promise<WorkflowRun> {
    return db.create(STORES.WORKFLOW_RUNS, run);
  },

  async update(run: WorkflowRun): Promise<WorkflowRun> {
    return db.update(STORES.WORKFLOW_RUNS, run);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.WORKFLOW_RUNS, id);
  },

  async getBySession(sessionId: string): Promise<WorkflowRun[]> {
    return db.getByIndex<WorkflowRun>(STORES.WORKFLOW_RUNS, 'sessionId', sessionId);
  },
};

// ============================================================================
// Step Run Repository
// ============================================================================

export const stepRunRepository = {
  async getAll(): Promise<StepRun[]> {
    return db.getAll<StepRun>(STORES.STEP_RUNS);
  },

  async getById(id: string): Promise<StepRun | null> {
    return db.getById<StepRun>(STORES.STEP_RUNS, id);
  },

  async create(step: StepRun): Promise<StepRun> {
    return db.create(STORES.STEP_RUNS, step);
  },

  async update(step: StepRun): Promise<StepRun> {
    return db.update(STORES.STEP_RUNS, step);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.STEP_RUNS, id);
  },

  async getByWorkflowRun(workflowRunId: string): Promise<StepRun[]> {
    return db.getByIndex<StepRun>(STORES.STEP_RUNS, 'workflowRunId', workflowRunId);
  },

  async getByAgent(agentId: string): Promise<StepRun[]> {
    return db.getByIndex<StepRun>(STORES.STEP_RUNS, 'agentId', agentId);
  },
};

// ============================================================================
// Contribution Repository
// ============================================================================

export const contributionRepository = {
  async getAll(): Promise<Contribution[]> {
    return db.getAll<Contribution>(STORES.CONTRIBUTIONS);
  },

  async getById(id: string): Promise<Contribution | null> {
    return db.getById<Contribution>(STORES.CONTRIBUTIONS, id);
  },

  async create(contribution: Contribution): Promise<Contribution> {
    return db.create(STORES.CONTRIBUTIONS, contribution);
  },

  async update(contribution: Contribution): Promise<Contribution> {
    return db.update(STORES.CONTRIBUTIONS, contribution);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.CONTRIBUTIONS, id);
  },

  async getByStepRun(stepRunId: string): Promise<Contribution[]> {
    return db.getByIndex<Contribution>(STORES.CONTRIBUTIONS, 'stepRunId', stepRunId);
  },

  async getByAgent(agentId: string): Promise<Contribution[]> {
    return db.getByIndex<Contribution>(STORES.CONTRIBUTIONS, 'agentId', agentId);
  },
};

// ============================================================================
// Option Repository
// ============================================================================

export const optionRepository = {
  async getAll(): Promise<Option[]> {
    return db.getAll<Option>(STORES.OPTIONS);
  },

  async getById(id: string): Promise<Option | null> {
    return db.getById<Option>(STORES.OPTIONS, id);
  },

  async create(option: Option): Promise<Option> {
    return db.create(STORES.OPTIONS, option);
  },

  async update(option: Option): Promise<Option> {
    return db.update(STORES.OPTIONS, option);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.OPTIONS, id);
  },

  async getByWorkflowRun(workflowRunId: string): Promise<Option[]> {
    return db.getByIndex<Option>(STORES.OPTIONS, 'workflowRunId', workflowRunId);
  },
};

// ============================================================================
// Decision Repository
// ============================================================================

export const decisionRepository = {
  async getAll(): Promise<Decision[]> {
    return db.getAll<Decision>(STORES.DECISIONS);
  },

  async getById(id: string): Promise<Decision | null> {
    return db.getById<Decision>(STORES.DECISIONS, id);
  },

  async create(decision: Decision): Promise<Decision> {
    return db.create(STORES.DECISIONS, decision);
  },

  async update(decision: Decision): Promise<Decision> {
    return db.update(STORES.DECISIONS, decision);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.DECISIONS, id);
  },

  async getBySession(sessionId: string): Promise<Decision[]> {
    return db.getByIndex<Decision>(STORES.DECISIONS, 'sessionId', sessionId);
  },
};

// ============================================================================
// Outline Repository
// ============================================================================

export const outlineRepository = {
  async getAll(): Promise<DevelopmentOutline[]> {
    return db.getAll<DevelopmentOutline>(STORES.OUTLINES);
  },

  async getById(id: string): Promise<DevelopmentOutline | null> {
    return db.getById<DevelopmentOutline>(STORES.OUTLINES, id);
  },

  async create(outline: DevelopmentOutline): Promise<DevelopmentOutline> {
    return db.create(STORES.OUTLINES, outline);
  },

  async update(outline: DevelopmentOutline): Promise<DevelopmentOutline> {
    return db.update(STORES.OUTLINES, outline);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.OUTLINES, id);
  },

  async getByDecision(decisionId: string): Promise<DevelopmentOutline | null> {
    const results = await db.getByIndex<DevelopmentOutline>(
      STORES.OUTLINES,
      'decisionId',
      decisionId
    );
    return results[0] || null;
  },
};

// ============================================================================
// Approval Repository
// ============================================================================

export const approvalRepository = {
  async getAll(): Promise<ApprovalRequest[]> {
    return db.getAll<ApprovalRequest>(STORES.APPROVALS);
  },

  async getById(id: string): Promise<ApprovalRequest | null> {
    return db.getById<ApprovalRequest>(STORES.APPROVALS, id);
  },

  async create(approval: ApprovalRequest): Promise<ApprovalRequest> {
    return db.create(STORES.APPROVALS, approval);
  },

  async update(approval: ApprovalRequest): Promise<ApprovalRequest> {
    return db.update(STORES.APPROVALS, approval);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.APPROVALS, id);
  },

  async getPending(): Promise<ApprovalRequest[]> {
    return db.getByIndex<ApprovalRequest>(STORES.APPROVALS, 'status', 'pending' as ApprovalStatus);
  },

  async getBySession(sessionId: string): Promise<ApprovalRequest[]> {
    return db.getByIndex<ApprovalRequest>(STORES.APPROVALS, 'sessionId', sessionId);
  },
};

// ============================================================================
// Budget Repository
// ============================================================================

export const budgetRepository = {
  async getAll(): Promise<BudgetEntry[]> {
    return db.getAll<BudgetEntry>(STORES.BUDGET);
  },

  async getById(id: string): Promise<BudgetEntry | null> {
    return db.getById<BudgetEntry>(STORES.BUDGET, id);
  },

  async create(entry: BudgetEntry): Promise<BudgetEntry> {
    return db.create(STORES.BUDGET, entry);
  },

  async update(entry: BudgetEntry): Promise<BudgetEntry> {
    return db.update(STORES.BUDGET, entry);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.BUDGET, id);
  },

  async getBySession(sessionId: string): Promise<BudgetEntry[]> {
    return db.getByIndex<BudgetEntry>(STORES.BUDGET, 'sessionId', sessionId);
  },

  async getBalance(sessionId: string): Promise<number> {
    const entries = await this.getBySession(sessionId);
    if (entries.length === 0) return 1000; // Default budget
    const lastEntry = entries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    return lastEntry.balanceAfter;
  },
};

// ============================================================================
// Audit Repository
// ============================================================================

export const auditRepository = {
  async getAll(): Promise<AuditEvent[]> {
    return db.getAll<AuditEvent>(STORES.AUDIT);
  },

  async getById(id: string): Promise<AuditEvent | null> {
    return db.getById<AuditEvent>(STORES.AUDIT, id);
  },

  async create(event: AuditEvent): Promise<AuditEvent> {
    return db.create(STORES.AUDIT, event);
  },

  async update(event: AuditEvent): Promise<AuditEvent> {
    return db.update(STORES.AUDIT, event);
  },

  async delete(id: string): Promise<void> {
    return db.remove(STORES.AUDIT, id);
  },

  async getRecent(limit: number): Promise<AuditEvent[]> {
    const all = await this.getAll();
    return all
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
};

// ============================================================================
// Settings Repository
// ============================================================================

export const settingsRepository = {
  async get(): Promise<AppSettings> {
    const settings = await db.getAll<AppSettings>(STORES.SETTINGS);
    if (settings.length === 0) {
      // Return defaults
      return {
        locale: 'th',
        theme: 'light',
        reducedMotion: false,
        onboardingComplete: false,
        schemaVersion: 1,
      };
    }
    return settings[0];
  },

  async update(updates: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get();
    const updated = { ...current, ...updates };
    await db.update(STORES.SETTINGS, updated);
    return updated;
  },
};
