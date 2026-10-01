/**
 * PJ Center — Approval Service
 * M3 Demo Domain — Approval policy enforcement
 */

import type { ApprovalRequest, ApprovalAction } from '../domain/types';
import { generateId, now } from '../domain/utils';
import { approvalRepository } from '../storage/repositories';
import { auditService } from './audit';

export const approvalService = {
  /**
   * Request approval for an action
   */
  async request(params: {
    action: ApprovalAction;
    requesterId: string;
    targetRef: string;
    reason: string;
    estimatedImpact: string;
    riskLabel: 'low' | 'medium' | 'high';
    context?: Record<string, string>;
  }): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      id: generateId(),
      action: params.action,
      requesterId: params.requesterId,
      targetRef: params.targetRef,
      reason: params.reason,
      estimatedImpact: params.estimatedImpact,
      riskLabel: params.riskLabel,
      createdAt: now(),
      status: 'pending',
      context: params.context,
    };

    await approvalRepository.create(request);

    await auditService.log({
      actorType: 'agent',
      actorId: params.requesterId,
      entityType: 'ApprovalRequest',
      entityId: request.id,
      action: 'approval_requested',
      reason: params.reason,
      metadata: { action: params.action, targetRef: params.targetRef },
    });

    return request;
  },

  /**
   * Approve a request
   */
  async approve(id: string, resolutionNote: string): Promise<ApprovalRequest> {
    const request = await approvalRepository.getById(id);
    if (!request) throw new Error('Approval request not found');

    if (request.status !== 'pending') {
      throw new Error('Approval request is not pending');
    }
    if (request.expiresAt && new Date(request.expiresAt).getTime() <= Date.now()) {
      request.status = 'expired';
      request.resolvedAt = now();
      await approvalRepository.update(request);
      throw new Error('Approval request has expired');
    }

    request.status = 'approved';
    request.resolutionNote = resolutionNote;
    request.resolvedAt = now();

    await approvalRepository.update(request);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'ApprovalRequest',
      entityId: id,
      action: 'approval_resolved',
      reason: resolutionNote,
      metadata: { status: 'approved' },
    });

    return request;
  },

  /**
   * Reject a request
   */
  async reject(id: string, resolutionNote: string): Promise<ApprovalRequest> {
    const request = await approvalRepository.getById(id);
    if (!request) throw new Error('Approval request not found');

    if (request.status !== 'pending') {
      throw new Error('Approval request is not pending');
    }

    request.status = 'rejected';
    request.resolutionNote = resolutionNote;
    request.resolvedAt = now();

    await approvalRepository.update(request);

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'ApprovalRequest',
      entityId: id,
      action: 'approval_resolved',
      reason: resolutionNote,
      metadata: { status: 'rejected' },
    });

    return request;
  },

  /**
   * Get pending approval requests
   */
  async getPending(): Promise<ApprovalRequest[]> {
    return approvalRepository.getPending();
  },

  /**
   * Get all approval requests
   */
  async getAll(): Promise<ApprovalRequest[]> {
    return approvalRepository.getAll();
  },

  /**
   * Check if an action requires approval
   */
  requiresApproval(action: ApprovalAction): boolean {
    // In MVP, all these actions require approval
    const approvalRequired: ApprovalAction[] = [
      'increase-budget',
      'new-round',
      'merge-options',
      'retry',
    ];
    return approvalRequired.includes(action);
  },
};
