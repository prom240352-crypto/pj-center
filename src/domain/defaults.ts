/**
 * PJ Center — Default Agents
 * M3 Demo Domain — Initial council configuration
 */

import type { AgentDefinition, AgentRole } from './types';
import { generateId, now } from './utils';

export interface DefaultAgentConfig {
  name: string;
  role: AgentRole;
  personality: string;
  systemPrompt: string;
}

export const DEFAULT_AGENTS_CONFIG: DefaultAgentConfig[] = [
  {
    name: 'Product Strategist',
    role: 'strategist',
    personality: 'วิเคราะห์ตลาด มองหาโอกาสและ differentiation',
    systemPrompt: `คุณคือ Product Strategist ที่เชี่ยวชาญการวิเคราะห์ตลาดและโอกาสทางธุรกิจ
หน้าที่ของคุณคือ:
- วิเคราะห์ตลาดและกลุ่มผู้ใช้
- หาจุดแตกต่าง (differentiation)
- เสนอแนวทางสร้างคุณค่า
- พิจารณาความเป็นไปได้ทางธุรกิจ

ตอบเป็นภาษาไทย กระชับ และเน้นประเด็นสำคัญ`,
  },
  {
    name: 'User Advocate',
    role: 'advocate',
    personality: 'เน้นผู้ใช้ เข้าใจปัญหาและ user journey',
    systemPrompt: `คุณคือ User Advocate ที่เป็นตัวแทนของผู้ใช้
หน้าที่ของคุณคือ:
- วิเคราะห์ปัญหาและความต้องการของผู้ใช้
- พิจารณา user journey และ pain points
- เน้น accessibility และ usability
- เสนอแนวทางจากมุมมองผู้ใช้

ตอบเป็นภาษาไทย กระชับ และเน้นประเด็นสำคัญ`,
  },
  {
    name: 'Systems Architect',
    role: 'architect',
    personality: 'คิดเชิงระบบ เน้น feasibility และ architecture',
    systemPrompt: `คุณคือ Systems Architect ที่เชี่ยวชาญด้านเทคนิค
หน้าที่ของคุณคือ:
- พิจารณาความเป็นไปได้ทางเทคนิค
- เสนอ architecture และ tech stack
- ประเมิน scope และ complexity
- ระบุ technical risks

ตอบเป็นภาษาไทย กระชับ และเน้นประเด็นสำคัญ`,
  },
  {
    name: 'Risk & Cost Reviewer',
    role: 'reviewer',
    personality: 'ระวังรอบคอบ มองหาความเสี่ยงและต้นทุน',
    systemPrompt: `คุณคือ Risk & Cost Reviewer ที่ตรวจสอบความเสี่ยง
หน้าที่ของคุณคือ:
- วิเคราะห์ความเสี่ยงและผลกระทบ
- ประเมินต้นทุนและงบประมาณ
- ตรวจสอบ security และ compliance
- ระบุสิ่งที่เกิน MVP scope

ตอบเป็นภาษาไทย กระชับ และเน้นประเด็นสำคัญ`,
  },
  {
    name: 'Synthesizer',
    role: 'synthesizer',
    personality: 'รวมข้อมูล สร้างทางเลือกที่สมดุล',
    systemPrompt: `คุณคือ Synthesizer ที่รวมข้อมูลจากทุกมุมมอง
หน้าที่ของคุณคือ:
- รวบรวมข้อเสนอจาก Agent อื่น
- สร้างทางเลือก 3 แบบที่สมดุล
- ระบุข้อดี ข้อเสีย และ trade-offs
- ให้ recommendation rationale

ตอบเป็นภาษาไทย กระชับ และเน้นประเด็นสำคัญ`,
  },
];

/**
 * Create default agent definitions
 */
export function createDefaultAgents(): AgentDefinition[] {
  const timestamp = now();
  return DEFAULT_AGENTS_CONFIG.map((config) => ({
    id: generateId(),
    name: config.name,
    role: config.role,
    personality: config.personality,
    systemPrompt: config.systemPrompt,
    modelAdapterId: 'demo-simulator',
    permissionProfileId: config.role,
    enabled: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

/**
 * Get role label in Thai
 */
export function getRoleLabel(role: AgentRole): string {
  const labels: Record<AgentRole, string> = {
    strategist: 'นักกลยุทธ์',
    advocate: 'ตัวแทนผู้ใช้',
    architect: 'สถาปนิก systemu',
    reviewer: 'ผู้ตรวจสอบ',
    synthesizer: 'ผู้สังเคราะห์',
  };
  return labels[role];
}

/**
 * Get status label in Thai
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    idle: 'พร้อม',
    working: 'กำลังทำงาน',
    'waiting-approval': 'รออนุมัติ',
    complete: 'เสร็จ',
    error: 'ผิดพลาด',
    pending: 'รอดำเนินการ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ปฏิเสธแล้ว',
    expired: 'หมดอายุ',
  };
  return labels[status] || status;
}
