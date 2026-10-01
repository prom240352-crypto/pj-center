/**
 * PJ Center — Demo Runtime
 * M3 Demo Domain — Mock AI responses and workflow simulation
 */

import type { AgentDefinition, Contribution, Option, IdeaBrief } from '../domain/types';
import { generateId, now } from '../domain/utils';

// ============================================================================
// Mock Response Templates
// ============================================================================

const STRATEGIST_TEMPLATES = [
  {
    content: 'วิเคราะห์แล้วเห็นว่าตลาดนี้มีช่องว่างสำหรับผลิตภัณฑ์ที่เน้นความเรียบง่าย กลุ่มผู้ใช้หลักคือคนที่ต้องการเครื่องมือเร็ว ไม่ซับซ้อน จุดต่างที่สำคัญคือ UX ที่ลดขั้นตอนให้เหลือเท่าที่จำเป็น',
    assumptions: ['ผู้ใช้ต้องการความเร็ว', 'ตลาดยังไม่อิ่มตัว'],
  },
  {
    content: 'โอกาสทางธุรกิจอยู่ที่การสร้าง differentiation ผ่านประสบการณ์ผู้ใช้ ควรเน้น mobile-first และลด friction ให้มากที่สุด คู่แข่งส่วนใหญ่ยังเน้นฟีเจอร์เยอะเกินไป',
    assumptions: ['Mobile usage สูง', 'Competitors ซับซ้อนเกินไป'],
  },
];

const ADVOCATE_TEMPLATES = [
  {
    content: 'จากมุมมองผู้ใช้ ปัญหาหลักคือเครื่องมือปัจจุบันซับซ้อนเกินไป User journey ควรเริ่มจากสิ่งที่ง่ายที่สุด เช่น สร้างรายการงานใน 3 วินาที Accessibility สำคัญมาก ต้องรองรับทั้งมือใหม่และ power user',
    assumptions: ['Users ต้องการความง่าย', 'Accessibility เป็น must-have'],
  },
  {
    content: 'Pain point ที่พบบ่อยคือการสลับระหว่างโปรเจกต์หลายอัน ผู้ใช้ต้องการเห็นภาพรวมและรายละเอียดพร้อมกัน ควรออกแบบให้ context switching ราบรื่น',
    assumptions: ['Multi-project usage', 'Context switching เป็นปัญหา'],
  },
];

const ARCHITECT_TEMPLATES = [
  {
    content: 'ในแง่เทคนิค แนะนำให้ใช้ React + TypeScript สำหรับ frontend, IndexedDB สำหรับ local storage ใน MVP ส่วน backend ใช้ Node.js + PostgreSQL เมื่อ scale up Architecture ควรเป็น modular เพื่อเปลี่ยนจาก demo เป็น production ได้ง่าย',
    assumptions: ['MVP เป็น local-first', 'Modular architecture'],
  },
  {
    content: 'Tech stack ที่เหมาะสม: React สำหรับ UI, state management ด้วย reducer pattern, IndexedDB สำหรับ persistence จุดที่ต้องระวังคือ data migration และ offline support',
    assumptions: ['Local-first approach', 'Offline support needed'],
  },
];

const REVIEWER_TEMPLATES = [
  {
    content: 'ความเสี่ยงหลัก: 1) Data loss เมื่อล้าง browser 2) Performance กับข้อมูลเยอะ 3) Security ถ้าเพิ่ม cloud sync ภายหลัง ต้นทุน MVP ต่ำ แต่ production อาจสูงถ้าต้อง scale ควรเริ่มเล็กแล้วขยาย',
    assumptions: ['Local storage มีข้อจำกัด', 'Cost uncertainty'],
  },
  {
    content: 'ข้อควรระวัง: 1) อย่าสร้างฟีเจอร์เกิน MVP 2) ตรวจสอบ security ก่อนเชื่อม AI provider 3) วางแผน data migration ตั้งแต่แรก งบประมาณควรเผื่อไว้ 20% สำหรับ unexpected issues',
    assumptions: ['Scope creep เป็นความเสี่ยง', 'Security critical'],
  },
];

const SYNTHESIZER_TEMPLATES = [
  {
    options: [
      {
        title: 'Option A: Minimal Viable Product',
        thesis: 'เน้นความเรียบง่าย ลดฟีเจอร์ให้เหลือเท่าที่จำเป็น',
        strengths: 'พัฒนาเร็ว, UX ดี, ต้นทุนต่ำ',
        weaknesses: 'ฟีเจอร์จำกัด, อาจไม่ตอบโจทย์ power user',
        risks: 'คู่แข่งมีฟีเจอร์มากกว่า',
        costLevel: 'low' as const,
      },
      {
        title: 'Option B: Feature-rich Platform',
        thesis: 'สร้างแพลตฟอร์มครบวงจรตั้งแต่เริ่มต้น',
        strengths: 'ฟีเจอร์ครบ, ตอบโจทย์หลากหลาย',
        weaknesses: 'ซับซ้อน, ต้นทุนสูง, ใช้เวลานาน',
        risks: 'Over-engineering, เสียโอกาส',
        costLevel: 'high' as const,
      },
      {
        title: 'Option C: Progressive Enhancement',
        thesis: 'เริ่มจาก core แล้วค่อยเพิ่มฟีเจอร์ตาม feedback',
        strengths: 'สมดุล, ปรับตัวได้, ลดความเสี่ยง',
        weaknesses: 'ต้องมีการวางแผนดี, อาจช้ากว่า MVP',
        risks: 'ต้อง commit ระยะยาว',
        costLevel: 'medium' as const,
      },
    ],
  },
];

// ============================================================================
// Demo Runtime Functions
// ============================================================================

/**
 * Generate mock contribution from an agent
 */
export function generateMockContribution(
  agent: AgentDefinition,
  _brief: IdeaBrief,
  stepRunId: string
): Contribution {
  let template;

  switch (agent.role) {
    case 'strategist':
      template = STRATEGIST_TEMPLATES[Math.floor(Math.random() * STRATEGIST_TEMPLATES.length)];
      break;
    case 'advocate':
      template = ADVOCATE_TEMPLATES[Math.floor(Math.random() * ADVOCATE_TEMPLATES.length)];
      break;
    case 'architect':
      template = ARCHITECT_TEMPLATES[Math.floor(Math.random() * ARCHITECT_TEMPLATES.length)];
      break;
    case 'reviewer':
      template = REVIEWER_TEMPLATES[Math.floor(Math.random() * REVIEWER_TEMPLATES.length)];
      break;
    case 'synthesizer':
      // Synthesizer generates options, not contributions
      template = { content: 'กำลังสังเคราะห์ตัวเลือก...', assumptions: [] };
      break;
    default:
      template = { content: 'กำลังวิเคราะห์...', assumptions: [] };
  }

  return {
    id: generateId(),
    stepRunId,
    agentId: agent.id,
    type: agent.role === 'reviewer' ? 'critique' : 'proposal',
    content: template.content,
    assumptions: template.assumptions || [],
    sourceRefs: [],
    demoGenerated: true,
    createdAt: now(),
  };
}

/**
 * Generate mock options from synthesizer
 */
export function generateMockOptions(workflowRunId: string, contributionRefs: string[]): Option[] {
  const template = SYNTHESIZER_TEMPLATES[0];

  return template.options.map((opt, index) => ({
    id: generateId(),
    workflowRunId,
    rank: index + 1,
    title: opt.title,
    thesis: opt.thesis,
    primaryUser: 'ผู้ใช้ที่ต้องการเครื่องมือจัดการงานที่ง่ายและเร็ว',
    valueProposition: 'ลดความซับซ้อน เพิ่มประสิทธิภาพ',
    keyFeatures: ['Task management', 'Calendar view', 'Notifications'],
    strengths: opt.strengths,
    weaknesses: opt.weaknesses,
    technicalDifficulty: opt.costLevel,
    indicativeCostLevel: opt.costLevel,
    risks: opt.risks,
    mvpScope: 'Core features สำหรับผู้ใช้หลัก',
    nextSteps: 'Wireframe และ user testing',
    confidenceNote: 'ข้อมูลจำลอง — สร้างโดย Demo Runtime',
    recommendationRationale: index === 2 ? 'สมดุลระหว่างความเร็วและความครบถ้วน' : '',
    contributionRefs,
    createdAt: now(),
  }));
}

/**
 * Simulate processing delay
 */
export function simulateDelay(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if should inject error (for testing)
 * Can be controlled via URL parameter ?error=true for testing
 */
export function shouldInjectError(): boolean {
  // Check URL parameter for forced error
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'true') {
      const key = 'pj-center-demo-error-injected';
      if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, '1'); return true; }
    }
  }
  // 5% chance of error for testing
  return Math.random() < 0.05;
}

/**
 * Simulate an error with message
 */
export function simulateError(stage: string): Error {
  const errors = [
    `Demo Error: ${stage} failed - network timeout`,
    `Demo Error: ${stage} failed - agent unavailable`,
    `Demo Error: ${stage} failed - processing error`,
  ];
  const message = errors[Math.floor(Math.random() * errors.length)];
  return new Error(message);
}
