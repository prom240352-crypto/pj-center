/**
 * PJ Center — Audit Service
 * M3 Demo Domain — Append-only audit logging
 */

import type { AuditEvent, AuditAction } from '../domain/types';
import { generateId, now } from '../domain/utils';
import { auditRepository } from '../storage/repositories';

export const auditService = {
  /**
   * Log an audit event
   */
  async log(params: {
    actorType: 'user' | 'agent' | 'system';
    actorId: string;
    entityType: string;
    entityId: string;
    action: AuditAction;
    reason: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuditEvent> {
    const previous = (await auditRepository.getRecent(1))[0];
    const previousPayload = previous ? JSON.stringify(previous) : 'GENESIS';
    let previousEventHash: string | undefined;
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(previousPayload));
      previousEventHash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } else if (previous) {
      // Fallback keeps the chain link populated in constrained demo runtimes.
      previousEventHash = previous.id;
    }

    const event: AuditEvent = {
      id: generateId(),
      timestamp: now(),
      actorType: params.actorType,
      actorId: params.actorId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      reason: params.reason,
      metadata: params.metadata || {},
      previousEventHash,
    };

    await auditRepository.create(event);
    return event;
  },

  /**
   * Get recent audit events
   */
  async getRecent(limit: number = 50): Promise<AuditEvent[]> {
    return auditRepository.getRecent(limit);
  },

  /**
   * Get audit events for a session
   */
  async getBySession(sessionId: string): Promise<AuditEvent[]> {
    const all = await auditRepository.getAll();
    return all.filter((e) => e.metadata.sessionId === sessionId || e.entityId === sessionId);
  },
};
