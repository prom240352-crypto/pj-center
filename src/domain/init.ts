/**
 * PJ Center — Initialization Service
 * M3 Demo Domain — Setup default data and workspace
 */

import { agentRepository, settingsRepository } from '../storage/repositories';
import { createDefaultAgents } from './defaults';
import { auditService } from './audit';
import { openDB } from '../storage/indexeddb';

export const initService = {
  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    // Open database
    await openDB();

    // Check if already initialized
    const existingAgents = await agentRepository.getAll();
    if (existingAgents.length === 0) {
      // Create default agents
      const defaultAgents = createDefaultAgents();
      for (const agent of defaultAgents) {
        await agentRepository.create(agent);
      }

      await auditService.log({
        actorType: 'system',
        actorId: 'init-service',
        entityType: 'AgentDefinition',
        entityId: defaultAgents[0].id,
        action: 'entity_created',
        reason: 'สร้าง default agents',
        metadata: { count: defaultAgents.length },
      });
    }

    // Initialize settings if not exists
    const settings = await settingsRepository.get();
    if (!settings.onboardingComplete) {
      await settingsRepository.update({ onboardingComplete: true });
    }
  },

  /**
   * Reset all data
   */
  async resetAll(): Promise<void> {
    const { clearAll } = await import('../storage/indexeddb');
    await clearAll();

    await auditService.log({
      actorType: 'user',
      actorId: 'user',
      entityType: 'System',
      entityId: 'all',
      action: 'data_cleared',
      reason: 'ล้างข้อมูลทั้งหมด',
      metadata: {},
    });

    // Re-initialize
    await this.initialize();
  },
};
