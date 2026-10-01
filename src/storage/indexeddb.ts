/**
 * PJ Center — IndexedDB Storage
 * M3 Demo Domain — Local persistence layer
 */

import type { UUID } from '../domain/types';

const DB_NAME = 'pj-center-db';
const DB_VERSION = 2;

// Object store names
export const STORES = {
  WORKSPACE: 'workspace',
  AGENTS: 'agents',
  BRIEFS: 'briefs',
  SESSIONS: 'sessions',
  WORKFLOW_RUNS: 'workflowRuns',
  STEP_RUNS: 'stepRuns',
  CONTRIBUTIONS: 'contributions',
  OPTIONS: 'options',
  DECISIONS: 'decisions',
  OUTLINES: 'outlines',
  APPROVALS: 'approvals',
  BUDGET: 'budget',
  AUDIT: 'audit',
  SETTINGS: 'settings',
} as const;

type StoreName = typeof STORES[keyof typeof STORES];

let dbInstance: IDBDatabase | null = null;

/**
 * Open IndexedDB database
 */
export function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const request = event.target as IDBOpenDBRequest;
      const db = request.result;
      const oldVersion = event.oldVersion;

      // Migrations are additive only. Never clear existing stores during an upgrade.
      // Version 2 currently only records the schema bump; existing object stores remain intact.
      if (oldVersion > DB_VERSION) {
        reject(new Error(`Unsupported database version: ${oldVersion}`));
        return;
      }

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.WORKSPACE)) {
        db.createObjectStore(STORES.WORKSPACE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.AGENTS)) {
        const agentStore = db.createObjectStore(STORES.AGENTS, { keyPath: 'id' });
        agentStore.createIndex('role', 'role', { unique: false });
        agentStore.createIndex('enabled', 'enabled', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.BRIEFS)) {
        db.createObjectStore(STORES.BRIEFS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
        const sessionStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
        sessionStore.createIndex('status', 'status', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.WORKFLOW_RUNS)) {
        const wfStore = db.createObjectStore(STORES.WORKFLOW_RUNS, { keyPath: 'id' });
        wfStore.createIndex('sessionId', 'sessionId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.STEP_RUNS)) {
        const stepStore = db.createObjectStore(STORES.STEP_RUNS, { keyPath: 'id' });
        stepStore.createIndex('workflowRunId', 'workflowRunId', { unique: false });
        stepStore.createIndex('agentId', 'agentId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.CONTRIBUTIONS)) {
        const contStore = db.createObjectStore(STORES.CONTRIBUTIONS, { keyPath: 'id' });
        contStore.createIndex('stepRunId', 'stepRunId', { unique: false });
        contStore.createIndex('agentId', 'agentId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.OPTIONS)) {
        const optStore = db.createObjectStore(STORES.OPTIONS, { keyPath: 'id' });
        optStore.createIndex('workflowRunId', 'workflowRunId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.DECISIONS)) {
        const decStore = db.createObjectStore(STORES.DECISIONS, { keyPath: 'id' });
        decStore.createIndex('sessionId', 'sessionId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.OUTLINES)) {
        const outStore = db.createObjectStore(STORES.OUTLINES, { keyPath: 'id' });
        outStore.createIndex('decisionId', 'decisionId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.APPROVALS)) {
        const appStore = db.createObjectStore(STORES.APPROVALS, { keyPath: 'id' });
        appStore.createIndex('status', 'status', { unique: false });
        appStore.createIndex('sessionId', 'sessionId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.BUDGET)) {
        const budStore = db.createObjectStore(STORES.BUDGET, { keyPath: 'id' });
        budStore.createIndex('sessionId', 'sessionId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.AUDIT)) {
        db.createObjectStore(STORES.AUDIT, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'locale' });
      }
    };
  });
}

/**
 * Get all items from a store
 */
export async function getAll<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(new Error(`Failed to get all from ${storeName}`));
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Get item by ID
 */
export async function getById<T>(storeName: StoreName, id: UUID): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onerror = () => reject(new Error(`Failed to get ${id} from ${storeName}`));
    request.onsuccess = () => resolve(request.result || null);
  });
}

/**
 * Create item
 */
export async function create<T>(storeName: StoreName, item: T): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onerror = () => reject(new Error(`Failed to create in ${storeName}`));
    request.onsuccess = () => resolve(item);
  });
}

/**
 * Update item
 */
export async function update<T>(storeName: StoreName, item: T): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);

    request.onerror = () => reject(new Error(`Failed to update in ${storeName}`));
    request.onsuccess = () => resolve(item);
  });
}

/**
 * Delete item
 */
export async function remove(storeName: StoreName, id: UUID): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onerror = () => reject(new Error(`Failed to delete ${id} from ${storeName}`));
    request.onsuccess = () => resolve();
  });
}

/**
 * Clear all data from all stores
 */
export async function clearAll(): Promise<void> {
  const db = await openDB();
  const storeNames = Object.values(STORES);

  const transaction = db.transaction(storeNames, 'readwrite');

  for (const storeName of storeNames) {
    const store = transaction.objectStore(storeName);
    store.clear();
  }

  return new Promise((resolve, reject) => {
    transaction.onerror = () => reject(new Error('Failed to clear all stores'));
    transaction.oncomplete = () => resolve();
  });
}

/**
 * Get items by index value
 */
export async function getByIndex<T>(
  storeName: StoreName,
  indexName: string,
  value: unknown
): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value as IDBValidKey | IDBKeyRange);

    request.onerror = () => reject(new Error(`Failed to query index ${indexName}`));
    request.onsuccess = () => resolve(request.result);
  });
}
