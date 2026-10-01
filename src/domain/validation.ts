/**
 * PJ Center — Validation
 * M3 Demo Domain — Input validation and error handling
 */

import type { IdeaBrief, ValidationResult, ValidationError } from './types';
import { isEmpty } from './utils';

/**
 * Validate idea brief
 */
export function validateBrief(brief: Partial<IdeaBrief>): ValidationResult {
  const errors: ValidationError[] = [];

  if (isEmpty(brief.topic)) {
    errors.push({
      field: 'topic',
      message: 'กรุณากรอกหัวข้อ',
    });
  }

  if (isEmpty(brief.goal)) {
    errors.push({
      field: 'goal',
      message: 'กรุณากรอกเป้าหมาย',
    });
  }

  if (brief.topic && brief.topic.length > 200) {
    errors.push({
      field: 'topic',
      message: 'หัวข้อต้องไม่เกิน 200 ตัวอักษร',
    });
  }

  if (brief.goal && brief.goal.length > 500) {
    errors.push({
      field: 'goal',
      message: 'เป้าหมายต้องไม่เกิน 500 ตัวอักษร',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate agent definition
 */
export function validateAgent(agent: { name: string; systemPrompt: string }): ValidationResult {
  const errors: ValidationError[] = [];

  if (isEmpty(agent.name)) {
    errors.push({
      field: 'name',
      message: 'กรุณากรอกชื่อตัวแทน',
    });
  }

  if (agent.name && agent.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'ชื่อต้องไม่เกิน 100 ตัวอักษร',
    });
  }

  if (isEmpty(agent.systemPrompt)) {
    errors.push({
      field: 'systemPrompt',
      message: 'กรุณากรอก system prompt',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate approval request
 */
export function validateApproval(approval: { reason: string }): ValidationResult {
  const errors: ValidationError[] = [];

  if (isEmpty(approval.reason)) {
    errors.push({
      field: 'reason',
      message: 'กรุณาระบุเหตุผล',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get first error message for a field
 */
export function getFieldError(errors: ValidationError[], field: string): string | null {
  const error = errors.find((e) => e.field === field);
  return error ? error.message : null;
}
