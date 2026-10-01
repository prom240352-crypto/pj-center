/**
 * PJ Center — Utility Functions
 */

import type { UUID, ISODateTime } from './types';

/**
 * Generate UUID v4
 */
export function generateId(): UUID {
  return crypto.randomUUID();
}

/**
 * Get current ISO timestamp
 */
export function now(): ISODateTime {
  return new Date().toISOString();
}

/**
 * Format date for display (Thai locale)
 */
export function formatDate(iso: ISODateTime): string {
  const date = new Date(iso);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format datetime for display (Thai locale)
 */
export function formatDateTime(iso: ISODateTime): string {
  const date = new Date(iso);
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Deep clone an object
 */
export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(str: string | undefined | null): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
