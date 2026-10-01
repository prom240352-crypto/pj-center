/**
 * PJ Center — Decision Service
 * M4 Interactive Prototype — Decision flow (select, merge, rerun)
 */

import type { Decision, DevelopmentOutline } from '../domain/types';
import { generateId, now } from '../domain/utils';
import { decisionRepository, outlineRepository, sessionRepository, optionRepository, workflowRunRepository } from '../storage/repositories';
import { auditService } from './audit';
import { approvalService } from './approval';

async function assertDecisionReady(sessionId: string, optionIds: string[]): Promise<void> {
  const session = await sessionRepository.getById(sessionId);
  if (!session) throw new Error('Session not found');
  if (session.status === 'complete') throw new Error('การตัดสินใจนี้ถูกยืนยันแล้วและแก้โดยตรงไม่ได้');

  const runs = await workflowRunRepository.getBySession(sessionId);
  const run = runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
  if (!run) throw new Error('Workflow run not found');
  const options = await optionRepository.getByWorkflowRun(run.id);
  if (options.length !== 3) throw new Error('ต้องมีตัวเลือกครบ 3 รายการก่อนยืนยันการตัดสินใจ');
  const validIds = new Set(options.map((option) => option.id));
  if (optionIds.some((id) => !validIds.has(id))) throw new Error('ตัวเลือกไม่อยู่ในรอบปัจจุบัน');
}

export const decisionService = {
  /**
   * Select a single option
   */
  async selectOption(
    sessionId: string,
    optionId: string,
    rationale: string
  ): Promise<{ decision: Decision; outline: DevelopmentOutline }> {
    await assertDecisionReady(sessionId, [optionId]);
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    // Create decision
    const decision: Decision = {
      id: generateId(),
      sessionId,
      revision: 1,
      type: 'select',
      selectedOptionIds: [optionId],
      rationale,
      confirmedAt: now(),
    };

    await decisionRepository.create(decision);

    // Generate development outline
    const outline = await this.generateOutline(decision.id, [optionId]);

    // Update session
    session.status = 'complete';
    session.currentStage = 'complete';
    session.completedAt = now();
    await sessionRepository.update(session);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'Decision',
      entityId: decision.id,
      action: 'decision_confirmed',
      reason: rationale || 'เลือกตัวเลือก',
      metadata: { type: 'select', optionId },
    });

    return { decision, outline };
  },

  /**
   * Merge multiple options
   */
  async mergeOptions(
    sessionId: string,
    optionIds: string[],
    rationale: string
  ): Promise<{ decision: Decision; outline: DevelopmentOutline }> {
    if (optionIds.length < 2) {
      throw new Error('ต้องเลือกอย่างน้อย 2 ตัวเลือกเพื่อรวม');
    }

    await assertDecisionReady(sessionId, optionIds);
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    // Create decision
    const decision: Decision = {
      id: generateId(),
      sessionId,
      revision: 1,
      type: 'merge',
      selectedOptionIds: optionIds,
      rationale,
      confirmedAt: now(),
    };

    await decisionRepository.create(decision);

    // Generate development outline
    const outline = await this.generateOutline(decision.id, optionIds);

    // Update session
    session.status = 'complete';
    session.currentStage = 'complete';
    session.completedAt = now();
    await sessionRepository.update(session);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'Decision',
      entityId: decision.id,
      action: 'decision_confirmed',
      reason: rationale || 'รวมตัวเลือก',
      metadata: { type: 'merge', optionIds },
    });

    return { decision, outline };
  },

  /**
   * Request a new round (requires approval)
   */
  async requestNewRound(sessionId: string, reason: string): Promise<void> {
    const session = await sessionRepository.getById(sessionId);
    if (!session) throw new Error('Session not found');

    // Approval is a hard gate before a new round can start.
    session.status = 'waiting-approval';
    await sessionRepository.update(session);

    await approvalService.request({
      action: 'new-round',
      requesterId: 'user',
      targetRef: sessionId,
      reason: reason || 'ต้องการระดมความคิดรอบใหม่',
      estimatedImpact: '+150 Demo credits',
      riskLabel: 'low',
      context: { sessionId, action: 'new-round' },
    });

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'Session',
      entityId: sessionId,
      action: 'approval_requested',
      reason: 'ขอรอบใหม่',
      metadata: { action: 'new-round' },
    });
  },

  /**
   * Generate development outline from decision
   */
  async generateOutline(decisionId: string, _optionIds: string[]): Promise<DevelopmentOutline> {
    const outline: DevelopmentOutline = {
      id: generateId(),
      decisionId,
      problem: 'ปัญหาที่ระบุใน idea brief',
      users: 'กลุ่มผู้ใช้เป้าหมาย',
      mvpItems: [
        'ฟีเจอร์หลัก 1',
        'ฟีเจอร์หลัก 2',
        'ฟีเจอร์หลัก 3',
      ],
      laterItems: [
        'ฟีเจอร์เพิ่มเติม 1',
        'ฟีเจอร์เพิ่มเติม 2',
      ],
      risks: [
        'ความเสี่ยง 1',
        'ความเสี่ยง 2',
      ],
      nextSteps: [
        'Wireframe และ prototype',
        'User testing',
        'Technical design',
        'Development sprint 1',
      ],
      createdAt: now(),
    };

    await outlineRepository.create(outline);

    return outline;
  },

  /**
   * Get decision by session
   */
  async getBySession(sessionId: string): Promise<Decision | null> {
    const decisions = await decisionRepository.getBySession(sessionId);
    return decisions.length > 0 ? decisions[0] : null;
  },

  /**
   * Get outline by decision
   */
  async getOutline(decisionId: string): Promise<DevelopmentOutline | null> {
    return outlineRepository.getByDecision(decisionId);
  },
};
