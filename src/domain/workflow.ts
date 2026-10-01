/**
 * PJ Center — Workflow Engine
 * M3 Demo Domain — State machine and workflow orchestration
 */

import type {
  Session,
  WorkflowRun,
  StepRun,
  Contribution,
  Option,
  IdeaBrief,
  WorkflowStage,
} from '../domain/types';
import { generateId, now } from '../domain/utils';
import {
  sessionRepository,
  workflowRunRepository,
  stepRunRepository,
  contributionRepository,
  optionRepository,
  agentRepository,
  briefRepository,
} from '../storage/repositories';
import { generateMockContribution, generateMockOptions, simulateDelay, shouldInjectError, simulateError } from '../demo/runtime';
import { auditService } from './audit';
import { budgetService } from './budget';
import { approvalService } from './approval';
import type { ApprovalRequest } from './types';

// ============================================================================
// Workflow Stage Transitions
// ============================================================================

const STAGE_TRANSITIONS: Record<WorkflowStage, WorkflowStage[]> = {
  'draft-brief': ['ready'],
  ready: ['diverge'],
  diverge: ['critique'],
  critique: ['synthesize'],
  synthesize: ['human-decision'],
  'human-decision': ['complete'],
  complete: [],
  error: ['diverge', 'critique', 'synthesize'], // Can retry
};

/**
 * Check if stage transition is valid
 */
export function canTransition(from: WorkflowStage, to: WorkflowStage): boolean {
  return STAGE_TRANSITIONS[from]?.includes(to) || false;
}

// ============================================================================
// Workflow Service
// ============================================================================

export const workflowService = {
  /**
   * Create a new session with brief
   */
  async createSession(briefData: Partial<IdeaBrief>): Promise<Session> {
    // Create brief
    const brief: IdeaBrief = {
      id: generateId(),
      revision: 1,
      topic: briefData.topic || '',
      targetUser: briefData.targetUser || '',
      goal: briefData.goal || '',
      constraints: briefData.constraints || '',
      successSignal: briefData.successSignal || '',
      createdAt: now(),
    };

    await briefRepository.create(brief);

    // Create session
    const session: Session = {
      id: generateId(),
      briefRevisionId: brief.id,
      status: 'idle',
      currentStage: 'ready',
      budgetLimit: 1000,
      createdAt: now(),
    };

    await sessionRepository.create(session);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'Session',
      entityId: session.id,
      action: 'entity_created',
      reason: 'สร้างเซสชันใหม่',
      metadata: { briefId: brief.id },
    });

    return session;
  },

  /**
   * Revise an existing brief (creates a new revision)
   */
  async reviseBrief(sessionId: string, briefData: Partial<IdeaBrief>): Promise<Session> {
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    const oldBrief = await briefRepository.getById(session.briefRevisionId);
    if (!oldBrief) throw new Error('Brief not found');

    // Create new revision
    const newBrief: IdeaBrief = {
      id: generateId(),
      revision: oldBrief.revision + 1,
      topic: briefData.topic || oldBrief.topic,
      targetUser: briefData.targetUser || oldBrief.targetUser,
      goal: briefData.goal || oldBrief.goal,
      constraints: briefData.constraints || oldBrief.constraints,
      successSignal: briefData.successSignal || oldBrief.successSignal,
      createdAt: now(),
    };

    await briefRepository.create(newBrief);

    // Update session to point to new brief
    session.briefRevisionId = newBrief.id;
    await sessionRepository.update(session);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'IdeaBrief',
      entityId: newBrief.id,
      action: 'entity_created',
      reason: `แก้ไข brief (revision ${newBrief.revision})`,
      metadata: { sessionId, previousBriefId: oldBrief.id },
    });

    return session;
  },

  /**
   * Start workflow run
   */
  async startWorkflow(sessionId: string): Promise<WorkflowRun> {
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    // Check budget
    const balance = await budgetService.getBalance(sessionId);
    const estimatedCost = 150; // Total for diverge + critique + synthesize

    if (balance < estimatedCost) {
      throw new Error('งบประมาณไม่เพียงพอ');
    }

    // Create workflow run
    const run: WorkflowRun = {
      id: generateId(),
      sessionId,
      revision: 1,
      status: 'working',
      startedAt: now(),
    };

    await workflowRunRepository.create(run);

    // Update session
    session.status = 'working';
    session.currentStage = 'diverge';
    await sessionRepository.update(session);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'WorkflowRun',
      entityId: run.id,
      action: 'run_started',
      reason: 'เริ่ม workflow',
      metadata: { sessionId },
    });

    return run;
  },

  /**
   * Execute diverge stage
   */
  async executeDiverge(sessionId: string, workflowRunId: string): Promise<Contribution[]> {
    // Check for error injection
    if (shouldInjectError()) {
      const error = simulateError('diverge');
      await auditService.log({
        actorType: 'system',
        actorId: 'workflow-engine',
        entityType: 'WorkflowRun',
        entityId: workflowRunId,
        action: 'error_raised',
        reason: error.message,
        metadata: { stage: 'diverge' },
      });
      throw error;
    }

    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    const brief = await briefRepository.getById(session.briefRevisionId);
    if (!brief) throw new Error('Brief not found');

    const agents = await agentRepository.getEnabled();
    const divergeAgents = agents.filter(
      (a) => a.role === 'strategist' || a.role === 'advocate' || a.role === 'architect'
    );

    const contributions: Contribution[] = [];

    for (const agent of divergeAgents) {
      // Create step run
      const stepRun: StepRun = {
        id: generateId(),
        workflowRunId,
        stage: 'diverge',
        agentId: agent.id,
        status: 'working',
        attempt: 1,
        inputRefs: [brief.id],
        outputRefs: [],
        startedAt: now(),
      };

      await stepRunRepository.create(stepRun);

      // Reserve budget
      await budgetService.reserve(sessionId, stepRun.id, 30, `Diverge: ${agent.name}`);

      // Simulate processing
      await simulateDelay(500);

      // Generate contribution
      const contribution = generateMockContribution(agent, brief, stepRun.id);
      await contributionRepository.create(contribution);

      // Update step run
      stepRun.status = 'complete';
      stepRun.outputRefs = [contribution.id];
      stepRun.completedAt = now();
      await stepRunRepository.update(stepRun);

      // Commit budget
      await budgetService.commit(sessionId, stepRun.id, 30, `Diverge: ${agent.name}`);

      contributions.push(contribution);

      await auditService.log({
        actorType: 'agent',
        actorId: agent.id,
        entityType: 'Contribution',
        entityId: contribution.id,
        action: 'entity_created',
        reason: `Agent ${agent.name} สร้าง contribution`,
        metadata: { stage: 'diverge' },
      });
    }

    // Update session stage
    session.currentStage = 'critique';
    await sessionRepository.update(session);

    return contributions;
  },

  /**
   * Execute critique stage
   */
  async executeCritique(sessionId: string, workflowRunId: string): Promise<Contribution[]> {
    // Check for error injection
    if (shouldInjectError()) {
      const error = simulateError('critique');
      await auditService.log({
        actorType: 'system',
        actorId: 'workflow-engine',
        entityType: 'WorkflowRun',
        entityId: workflowRunId,
        action: 'error_raised',
        reason: error.message,
        metadata: { stage: 'critique' },
      });
      throw error;
    }

    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    const brief = await briefRepository.getById(session.briefRevisionId);
    if (!brief) throw new Error('Brief not found');

    const agents = await agentRepository.getEnabled();
    const reviewer = agents.find((a) => a.role === 'reviewer');
    if (!reviewer) throw new Error('Reviewer agent not found');

    // Create step run
    const stepRun: StepRun = {
      id: generateId(),
      workflowRunId,
      stage: 'critique',
      agentId: reviewer.id,
      status: 'working',
      attempt: 1,
      inputRefs: [],
      outputRefs: [],
      startedAt: now(),
    };

    await stepRunRepository.create(stepRun);

    // Reserve budget
    await budgetService.reserve(sessionId, stepRun.id, 30, `Critique: ${reviewer.name}`);

    // Simulate processing
    await simulateDelay(500);

    // Generate contribution
    const contribution = generateMockContribution(reviewer, brief, stepRun.id);
    contribution.type = 'critique';
    await contributionRepository.create(contribution);

    // Update step run
    stepRun.status = 'complete';
    stepRun.outputRefs = [contribution.id];
    stepRun.completedAt = now();
    await stepRunRepository.update(stepRun);

    // Commit budget
    await budgetService.commit(sessionId, stepRun.id, 30, `Critique: ${reviewer.name}`);

    // Update session stage
    session.currentStage = 'synthesize';
    await sessionRepository.update(session);

    await auditService.log({
      actorType: 'agent',
      actorId: reviewer.id,
      entityType: 'Contribution',
      entityId: contribution.id,
      action: 'entity_created',
      reason: `Agent ${reviewer.name} สร้าง critique`,
      metadata: { stage: 'critique' },
    });

    return [contribution];
  },

  /**
   * Execute synthesize stage
   */
  async executeSynthesize(sessionId: string, workflowRunId: string): Promise<Option[]> {
    // Check for error injection
    if (shouldInjectError()) {
      const error = simulateError('synthesize');
      await auditService.log({
        actorType: 'system',
        actorId: 'workflow-engine',
        entityType: 'WorkflowRun',
        entityId: workflowRunId,
        action: 'error_raised',
        reason: error.message,
        metadata: { stage: 'synthesize' },
      });
      throw error;
    }

    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    const agents = await agentRepository.getEnabled();
    const synthesizer = agents.find((a) => a.role === 'synthesizer');
    if (!synthesizer) throw new Error('Synthesizer agent not found');

    // Only contributions from this workflow run belong in this synthesis.
    const stepRuns = await stepRunRepository.getByWorkflowRun(workflowRunId);
    const contributionLists = await Promise.all(
      stepRuns
        .filter((step) => step.stage === 'diverge' || step.stage === 'critique')
        .map((step) => contributionRepository.getByStepRun(step.id))
    );
    const contributionRefs = contributionLists.flat().map((c) => c.id);

    // Create step run
    const stepRun: StepRun = {
      id: generateId(),
      workflowRunId,
      stage: 'synthesize',
      agentId: synthesizer.id,
      status: 'working',
      attempt: 1,
      inputRefs: contributionRefs,
      outputRefs: [],
      startedAt: now(),
    };

    await stepRunRepository.create(stepRun);

    // Reserve budget
    await budgetService.reserve(sessionId, stepRun.id, 30, `Synthesize: ${synthesizer.name}`);

    // Simulate processing
    await simulateDelay(800);

    // Generate options
    const options = generateMockOptions(workflowRunId, contributionRefs);
    for (const option of options) {
      await optionRepository.create(option);
    }

    // Update step run
    stepRun.status = 'complete';
    stepRun.outputRefs = options.map((o) => o.id);
    stepRun.completedAt = now();
    await stepRunRepository.update(stepRun);

    // Commit budget
    await budgetService.commit(sessionId, stepRun.id, 30, `Synthesize: ${synthesizer.name}`);

    // Update session stage
    session.currentStage = 'human-decision';
    await sessionRepository.update(session);

    await auditService.log({
      actorType: 'agent',
      actorId: synthesizer.id,
      entityType: 'Option',
      entityId: options[0].id,
      action: 'entity_created',
      reason: `Agent ${synthesizer.name} สร้าง 3 options`,
      metadata: { stage: 'synthesize', count: options.length },
    });

    return options;
  },

  /**
   * Retry a failed stage (idempotent - does not duplicate completed work)
   */
  async retryStage(sessionId: string, stage: 'diverge' | 'critique' | 'synthesize'): Promise<void> {
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    const runs = await workflowRunRepository.getBySession(sessionId);
    const currentRun = runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
    if (!currentRun) throw new Error('Workflow run not found');

    const completedSteps = (await stepRunRepository.getByWorkflowRun(currentRun.id))
      .filter((step) => step.stage === stage && step.status === 'complete');
    if (completedSteps.length > 0) {
      // Idempotent retry: never duplicate a completed stage.
      return;
    }

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'Session',
      entityId: sessionId,
      action: 'retry_started',
      reason: `Retry ${stage}`,
      metadata: { stage },
    });

    session.currentStage = stage;
    session.status = 'working';
    await sessionRepository.update(session);
  },

  /** Request approval before retrying a failed stage. */
  async requestRetryApproval(sessionId: string, stage: 'diverge' | 'critique' | 'synthesize'): Promise<void> {
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');
    session.status = 'waiting-approval';
    await sessionRepository.update(session);
    await approvalService.request({
      action: 'retry',
      requesterId: 'user',
      targetRef: sessionId,
      reason: `ขอลองขั้นตอน ${stage} ใหม่`,
      estimatedImpact: '+30 Demo credits',
      riskLabel: 'low',
      context: { sessionId, stage, action: 'retry' },
    });
  },

  /** Apply an already-approved gated action. */
  async applyApprovedAction(request: ApprovalRequest): Promise<void> {
    if (request.status !== 'approved') return;
    const sessionId = request.context?.sessionId || request.targetRef;
    if (request.action === 'retry') {
      const stage = request.context?.stage as 'diverge' | 'critique' | 'synthesize' | undefined;
      if (!stage) throw new Error('Retry approval is missing stage context');
      await this.retryStage(sessionId, stage);
      return;
    }
    if (request.action === 'new-round') {
      const session = await sessionRepository.getById(sessionId);
      if (!session) throw new Error('Session not found');
      session.status = 'idle';
      session.currentStage = 'ready';
      await sessionRepository.update(session);
    }
  },

  async applyRejectedAction(request: ApprovalRequest): Promise<void> {
    if (request.status !== 'rejected') return;
    const sessionId = request.context?.sessionId || request.targetRef;
    const session = await sessionRepository.getById(sessionId);
    if (!session) return;
    const runs = await workflowRunRepository.getBySession(sessionId);
    const latest = runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
    const wasWaitingForApproval = session.status === 'waiting-approval';
    session.status = 'idle';
    session.currentStage = latest?.status === 'complete' ? 'human-decision' : (wasWaitingForApproval ? 'ready' : session.currentStage);
    await sessionRepository.update(session);
  },

  /**
   * Complete workflow
   */
  async completeWorkflow(sessionId: string): Promise<void> {
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'complete';
    session.currentStage = 'complete';
    session.completedAt = now();
    await sessionRepository.update(session);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'Session',
      entityId: sessionId,
      action: 'state_changed',
      reason: 'เซสชันเสร็จสมบูรณ์',
      metadata: { status: 'complete' },
    });
  },
};
