/**
 * PJ Center — Budget Service
 * M3 Demo Domain — Demo credits ledger management
 */

import type { BudgetEntry } from '../domain/types';
import { generateId, now } from '../domain/utils';
import { budgetRepository } from '../storage/repositories';
import { auditService } from './audit';

const DEFAULT_BUDGET = 1000;

export const budgetService = {
  /**
   * Get current balance for a session
   */
  async getBalance(sessionId: string): Promise<number> {
    return budgetRepository.getBalance(sessionId);
  },

  /**
   * Get all budget entries for a session
   */
  async getEntries(sessionId: string): Promise<BudgetEntry[]> {
    return budgetRepository.getBySession(sessionId);
  },

  /**
   * Reserve budget for a step
   */
  async reserve(
    sessionId: string,
    stepRunId: string,
    amount: number,
    description: string
  ): Promise<BudgetEntry> {
    const currentBalance = await this.getBalance(sessionId);

    if (currentBalance < amount) {
      throw new Error('งบประมาณไม่เพียงพอ');
    }

    const entry: BudgetEntry = {
      id: generateId(),
      sessionId,
      stepRunId,
      type: 'reserve',
      amount: -amount,
      balanceAfter: currentBalance - amount,
      description,
      demoOnly: true,
      createdAt: now(),
    };

    await budgetRepository.create(entry);

    await auditService.log({
      actorType: 'system',
      actorId: 'budget-service',
      entityType: 'BudgetEntry',
      entityId: entry.id,
      action: 'budget_reserved',
      reason: description,
      metadata: { sessionId, amount, balanceAfter: entry.balanceAfter },
    });

    return entry;
  },

  /**
   * Commit reserved budget (after successful step)
   */
  async commit(
    sessionId: string,
    stepRunId: string,
    amount: number,
    description: string
  ): Promise<BudgetEntry> {
    const currentBalance = await this.getBalance(sessionId);

    const entry: BudgetEntry = {
      id: generateId(),
      sessionId,
      stepRunId,
      type: 'commit',
      amount, // Records the committed usage; reserve already reduced available balance
      balanceAfter: currentBalance,
      description: `${description} (committed)`,
      demoOnly: true,
      createdAt: now(),
    };

    await budgetRepository.create(entry);

    await auditService.log({
      actorType: 'system',
      actorId: 'budget-service',
      entityType: 'BudgetEntry',
      entityId: entry.id,
      action: 'budget_committed',
      reason: description,
      metadata: { sessionId, amount },
    });

    return entry;
  },

  /**
   * Release reserved budget (on error or cancellation)
   */
  async release(
    sessionId: string,
    stepRunId: string,
    amount: number,
    description: string
  ): Promise<BudgetEntry> {
    const currentBalance = await this.getBalance(sessionId);

    const entry: BudgetEntry = {
      id: generateId(),
      sessionId,
      stepRunId,
      type: 'release',
      amount: amount,
      balanceAfter: currentBalance + amount,
      description: `${description} (released)`,
      demoOnly: true,
      createdAt: now(),
    };

    await budgetRepository.create(entry);

    await auditService.log({
      actorType: 'system',
      actorId: 'budget-service',
      entityType: 'BudgetEntry',
      entityId: entry.id,
      action: 'budget_released',
      reason: description,
      metadata: { sessionId, amount, balanceAfter: entry.balanceAfter },
    });

    return entry;
  },

  /**
   * Get budget summary
   */
  async getSummary(sessionId: string): Promise<{
    total: number;
    used: number;
    remaining: number;
    reserved: number;
  }> {
    const entries = await this.getEntries(sessionId);
    const total = DEFAULT_BUDGET;

    const used = entries
      .filter((e) => e.type === 'commit')
      .reduce((sum, e) => sum + Math.abs(e.amount), 0);

    const released = entries
      .filter((e) => e.type === 'release')
      .reduce((sum, e) => sum + Math.abs(e.amount), 0);

    const reserved = Math.max(
      0,
      entries
        .filter((e) => e.type === 'reserve')
        .reduce((sum, e) => sum + Math.abs(e.amount), 0) - used - released
    );

    const remaining = total - used - reserved;

    return { total, used, remaining, reserved };
  },
};
