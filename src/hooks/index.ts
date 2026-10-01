/**
 * PJ Center — React Hooks
 * M3 Demo Domain — Hooks for accessing domain services
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  AgentDefinition,
  Session,
  IdeaBrief,
  Contribution,
  Option,
  ApprovalRequest,
  BudgetEntry,
  AuditEvent,
} from '../domain/types';
import {
  agentRepository,
  sessionRepository,
  briefRepository,
  contributionRepository,
  optionRepository,
  approvalRepository,
  budgetRepository,
  auditRepository,
  workflowRunRepository,
} from '../storage/repositories';
import { workflowService } from '../domain/workflow';
import { budgetService } from '../domain/budget';
import { initService } from '../domain/init';

// ============================================================================
// Initialization Hook
// ============================================================================

export function useInitialization() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initService
      .initialize()
      .then(() => setInitialized(true))
      .catch((err) => setError(err));
  }, []);

  return { initialized, error };
}

// ============================================================================
// Agent Hooks
// ============================================================================

export function useAgents() {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await agentRepository.getAll();
    setAgents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { agents, loading, refresh };
}

export function useEnabledAgents() {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await agentRepository.getEnabled();
    setAgents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { agents, loading, refresh };
}

// ============================================================================
// Session Hooks
// ============================================================================

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await sessionRepository.getAll();
    setSessions(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { sessions, loading, refresh };
}

export function useActiveSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await sessionRepository.getActive();
    setSession(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { session, loading, refresh };
}

// ============================================================================
// Brief Hooks
// ============================================================================

export function useBriefs() {
  const [briefs, setBriefs] = useState<IdeaBrief[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await briefRepository.getAll();
    setBriefs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { briefs, loading, refresh };
}

// ============================================================================
// Contribution Hooks
// ============================================================================

export function useContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await contributionRepository.getAll();
    setContributions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { contributions, loading, refresh };
}

// ============================================================================
// Workflow Run Hooks
// ============================================================================

export function useLatestWorkflowRun(sessionId?: string) {
  const [run, setRun] = useState<import('../domain/types').WorkflowRun | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!sessionId) { setRun(null); setLoading(false); return; }
    setLoading(true);
    const runs = await workflowRunRepository.getBySession(sessionId);
    runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    setRun(runs[0] || null);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { run, loading, refresh };
}

// ============================================================================
// Option Hooks
// ============================================================================

export function useOptions(workflowRunId?: string) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    if (workflowRunId) {
      const data = await optionRepository.getByWorkflowRun(workflowRunId);
      setOptions(data);
    } else {
      const data = await optionRepository.getAll();
      setOptions(data);
    }
    setLoading(false);
  }, [workflowRunId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { options, loading, refresh };
}

// ============================================================================
// Approval Hooks
// ============================================================================

export function useApprovals() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await approvalRepository.getAll();
    setApprovals(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { approvals, loading, refresh };
}

export function usePendingApprovals() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await approvalRepository.getPending();
    setApprovals(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { approvals, loading, refresh };
}

// ============================================================================
// Budget Hooks
// ============================================================================

export function useBudget(sessionId?: string) {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [balance, setBalance] = useState(1000);
  const [summary, setSummary] = useState({ total: 1000, used: 0, remaining: 1000, reserved: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await budgetRepository.getBySession(sessionId);
    setEntries(data);
    const bal = await budgetRepository.getBalance(sessionId);
    const nextSummary = await budgetService.getSummary(sessionId);
    setBalance(bal);
    setSummary(nextSummary);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, balance, summary, loading, refresh };
}

// ============================================================================
// Audit Hooks
// ============================================================================

export function useAuditEvents(limit: number = 50) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await auditRepository.getRecent(limit);
    setEvents(data);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { events, loading, refresh };
}

// ============================================================================
// Workflow Hooks
// ============================================================================

export function useWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSession = useCallback(async (briefData: Partial<IdeaBrief>) => {
    setLoading(true);
    setError(null);
    try {
      const session = await workflowService.createSession(briefData);
      return session;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reviseBrief = useCallback(async (sessionId: string, briefData: { topic: string; targetUser?: string; goal: string; constraints?: string; successSignal?: string }) => {
    setLoading(true); setError(null);
    try { return await workflowService.reviseBrief(sessionId, briefData); }
    catch (err) { setError(err as Error); throw err; }
    finally { setLoading(false); }
  }, []);

  const startWorkflow = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const run = await workflowService.startWorkflow(sessionId);
      return run;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeDiverge = useCallback(async (sessionId: string, workflowRunId: string) => {
    setLoading(true);
    setError(null);
    try {
      const contributions = await workflowService.executeDiverge(sessionId, workflowRunId);
      return contributions;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeCritique = useCallback(async (sessionId: string, workflowRunId: string) => {
    setLoading(true);
    setError(null);
    try {
      const contributions = await workflowService.executeCritique(sessionId, workflowRunId);
      return contributions;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSynthesize = useCallback(async (sessionId: string, workflowRunId: string) => {
    setLoading(true);
    setError(null);
    try {
      const options = await workflowService.executeSynthesize(sessionId, workflowRunId);
      return options;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeWorkflow = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await workflowService.completeWorkflow(sessionId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestRetryApproval = useCallback(async (sessionId: string, stage: 'diverge' | 'critique' | 'synthesize') => {
    setLoading(true);
    setError(null);
    try {
      await workflowService.requestRetryApproval(sessionId, stage);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const retryStage = useCallback(async (sessionId: string, stage: 'diverge' | 'critique' | 'synthesize') => {
    setLoading(true);
    setError(null);
    try {
      await workflowService.retryStage(sessionId, stage);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createSession,
    reviseBrief,
    startWorkflow,
    executeDiverge,
    executeCritique,
    executeSynthesize,
    completeWorkflow,
    retryStage,
    requestRetryApproval,
  };
}
