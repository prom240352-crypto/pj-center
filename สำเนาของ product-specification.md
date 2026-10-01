# Product Specification — PJ Center

> Working product name: PJ Center  
> เอกสารกลางของโครงการ | Version 1.1 | สถานะ: Approved | 2026-09-30

## 1. Product Definition

### 1.1 Product statement

เว็บแอปแบบติดตั้งได้บน Android และ iPad สำหรับให้ผู้ใช้คนเดียวสร้าง “สภา AI” หลายบทบาท เพื่อระดมความคิด วิจารณ์ สังเคราะห์เป็น 3 ทางเลือก และตัดสินใจว่าจะนำแนวคิดใดไปพัฒนา โดยทุกจุดสำคัญอยู่ภายใต้การอนุมัติของมนุษย์

### 1.2 Problem

- แอป AI แบบแชตให้คำตอบเดียวและไม่แสดงความเห็นต่างอย่างมีโครงสร้าง
- เครื่องมือ multi-agent ส่วนใหญ่ตั้งค่ายาก ตรวจสอบการส่งต่องานยาก และไม่เหมาะกับจอมือถือ
- ผู้ใช้แยกข้อเสนอ ความเสี่ยง ต้นทุน และเหตุผลการตัดสินใจออกจากบทสนทนายาวได้ยาก
- ผู้ใช้ที่มีเพียงโทรศัพท์ต้องสามารถทดลอง ติดตั้ง และจัดการผลิตภัณฑ์ผ่านเบราว์เซอร์ได้

### 1.3 Value proposition

“เปลี่ยนโจทย์หนึ่งบรรทัดให้เป็นทางเลือกพัฒนาผลิตภัณฑ์ 3 แบบ ผ่านทีม AI ต่างมุมมอง พร้อมข้อดี ข้อเสีย ความเสี่ยง และขั้นตอนถัดไป—ทั้งหมดควบคุมได้จากมือถือ”

### 1.4 Goals

1. ทำให้ผู้ใช้สร้าง brief และได้ตัวเลือกที่เปรียบเทียบกันได้โดยไม่ต้องออกแบบ prompt ซับซ้อน
2. ทำให้บทบาท การส่งต่องาน สถานะ จุดอนุมัติ และงบประมาณมองเห็นได้
3. พิสูจน์ UX ผ่าน Demo Mode โดยไม่ต้องล็อกอินหรือใช้ API key
4. วางขอบเขตระบบให้เปลี่ยนจากตัวจำลองเป็น agent runtime บน backend ได้

### 1.5 Non-goals for MVP

- ไม่เรียก AI, ค้นเว็บ, สร้างโค้ด หรือใช้เครื่องมือภายนอกจริง
- ไม่รองรับหลายผู้ใช้, cloud sync หรือองค์กรหลาย tenant
- ไม่มี workflow แบบ branching/canvas, schedule หรือ autonomous background work
- ไม่รับชำระเงิน ไม่คิดค่าใช้จ่ายจริง และไม่อ้างว่าคะแนน/งบประมาณจำลองเป็นข้อมูลจริง

### 1.6 Prototype validation targets

- ผู้ใช้ทำ session แรกตั้งแต่กรอกโจทย์จนเลือก option ได้ครบโดยไม่ต้องอ่านคู่มือ
- ผู้ใช้แยกได้ชัดว่าอะไรเป็นข้อมูลจำลองและอะไรเป็นฟังก์ชันจริง
- refresh หรือปิดแล้วเปิดใหม่ไม่ทำให้ข้อมูล local สูญหาย
- action ที่ต้องอนุมัติไม่สามารถข้าม approval gate ได้
- หน้าหลักไม่มี horizontal scroll ที่ viewport กว้าง 360px และใช้งานได้ดีบน iPad

## 2. Users, Jobs and Experience Principles

### 2.1 Primary user

ผู้ใช้คนเดียวที่พัฒนาแนวคิดผลิตภัณฑ์หรือแอปผ่านโทรศัพท์ เช่น solo founder, เจ้าของกิจการ, product lead, ครีเอเตอร์ หรือนักเรียนที่ต้องการสำรวจทางเลือกก่อนลงมือทำ

### 2.2 Jobs to be done

- “เมื่อฉันมีหัวข้อคร่าว ๆ ฉันต้องการหลายมุมมอง เพื่อไม่ยึดติดกับไอเดียแรก”
- “เมื่อมีหลายแนวทาง ฉันต้องการเห็น trade-off ในรูปแบบเดียวกันเพื่อเลือกได้”
- “เมื่อเลือกแนวคิดแล้ว ฉันต้องการเปลี่ยนเป็นแผนพัฒนาเบื้องต้นและย้อนดูเหตุผลได้”

### 2.3 UX principles

1. **Mobile first:** ใช้รายการและการ์ด ไม่ใช้ canvas เป็น interaction หลัก
2. **Progressive disclosure:** แสดงสรุปก่อน แล้วค่อยเปิด contribution และ prompt รายละเอียด
3. **Human in control:** AI เสนอ แต่มนุษย์เลือก รวม สั่งคิดใหม่ และอนุมัติ
4. **Visible state:** ทุก Agent และ workflow ต้องมีสถานะและเหตุผลที่กำลังรอ
5. **Honest demo:** แสดงป้าย “Demo — ข้อมูลจำลอง” บนทุกผลลัพธ์ที่ไม่ได้มาจาก AI จริง
6. **Recoverable actions:** การลบต้องยืนยัน; error ต้อง retry หรือกลับสู่สถานะที่ปลอดภัยได้

## 3. MVP User Journey and Screens

### 3.1 Golden path

1. เปิดแอปและเข้าสู่ Demo Mode โดยไม่ล็อกอิน
2. แตะ “เริ่มระดมความคิด” และกรอกหัวข้อ ผู้ใช้เป้าหมาย เป้าหมาย และข้อจำกัด
3. เลือกทีมมาตรฐานหรือปรับ Agent
4. ตรวจงบประมาณจำลองและเริ่ม session
5. ดู Agent เสนอแนวคิด → วิจารณ์ข้ามมุมมอง → ผู้สังเคราะห์สร้าง 3 options
6. เปรียบเทียบ options และเปิดดูที่มาจาก contribution
7. เลือกหนึ่ง option, รวม options หรือขอรอบใหม่
8. ยืนยันการตัดสินใจและสร้าง development outline
9. กลับมาดู session, decision, audit trail และงบประมาณได้จาก History

### 3.2 Default council

| Agent | หน้าที่ | Output |
|---|---|---|
| Product Strategist | คุณค่า ตลาด และ differentiation | ข้อเสนอเชิงกลยุทธ์ |
| User Advocate | ปัญหา user journey และ accessibility | ข้อเสนอจากมุมผู้ใช้ |
| Systems Architect | feasibility, architecture และ scope | ข้อเสนอเชิงเทคนิค |
| Risk & Cost Reviewer | security, cost, risk และสิ่งเกิน MVP | critique และข้อควรระวัง |
| Synthesizer | รวมหลักฐานและความเห็นต่าง | option cards 3 แบบ |

### 3.3 Screens

1. **Welcome / Demo Entry:** อธิบายขอบเขต Demo และเริ่มได้ทันที
2. **Station:** session ล่าสุด, Agent status, approval ที่รอ และปุ่มเริ่มงาน
3. **Idea Brief:** แบบฟอร์มหัวข้อ ผู้ใช้ เป้าหมาย ข้อจำกัด และ success signal
4. **Council Setup:** ดู/แก้ชื่อ บทบาท บุคลิก system prompt และ model label
5. **Council Session:** timeline ตามรอบ, สถานะ Agent และ contribution แบบพับได้
6. **Option Compare:** 3 การ์ดในมือถือและตารางเปรียบเทียบบนแท็บเล็ต
7. **Decision & Outline:** เลือก/รวม option, บันทึกเหตุผล และสร้าง development outline
8. **Approval Inbox:** รายการคำขอ เหตุผล ผลกระทบ และ Approve/Reject
9. **Agents:** สร้าง แก้ไข ทำซ้ำ ปิดใช้งาน และคืนค่า default
10. **History:** session, decision, error และตัวกรองสถานะ
11. **Budget & Audit:** ledger จำลองและ event timeline ที่อ่านได้
12. **Settings & Data:** ภาษา ธีม ข้อมูล Demo ล้างข้อมูล และข้อมูลเวอร์ชัน

### 3.4 Navigation

- มือถือ: bottom navigation — Station, Sessions, Agents, Approvals; Settings อยู่ในเมนู
- แท็บเล็ต: navigation rail และแผงรายละเอียดสองคอลัมน์เมื่อพื้นที่เพียงพอ

## 4. MVP Requirements

### 4.1 Must-have functions

| ID | Requirement |
|---|---|
| FR-01 | เริ่ม Demo Mode ได้โดยไม่มีบัญชีหรือ API key |
| FR-02 | สร้าง แก้ไข ทำซ้ำ และปิดใช้งาน Agent definition ได้ |
| FR-03 | Agent มี name, role, personality, system prompt, model label และ permission profile |
| FR-04 | สร้าง idea brief และตรวจ field จำเป็นก่อนเริ่ม session |
| FR-05 | รัน workflow จำลองแบบมีลำดับและแสดง Idle, Working, Waiting Approval, Complete, Error |
| FR-06 | เก็บ contribution แยกตาม Agent และ round |
| FR-07 | สร้าง options 3 แบบด้วย schema เดียวกันและเชื่อมกลับไปยัง contribution |
| FR-08 | เลือกหนึ่ง option, รวมหลาย option หรือขอรอบใหม่ได้ |
| FR-09 | action ที่เพิ่มงบประมาณหรือเปลี่ยนผลลัพธ์ที่ยืนยันแล้วต้องสร้าง approval request |
| FR-10 | แสดง budget estimate, consumed และ remaining เป็น Demo credits |
| FR-11 | บันทึก audit event สำหรับการสร้าง แก้ไข รัน อนุมัติ ปฏิเสธ error และ retry |
| FR-12 | ข้อมูลคงอยู่ใน IndexedDB หลัง refresh และเปิดแอปใหม่ |
| FR-13 | ติดตั้งเป็น PWA และเปิด app shell ที่เคยโหลดแล้วเมื่อ offline |
| FR-14 | UI ภาษาไทยและโครงสร้างข้อความพร้อมเพิ่มภาษาอังกฤษ |

### 4.2 Option schema

แต่ละ option ต้องมี: ชื่อ, thesis, primary user, value proposition, key features, strengths, weaknesses, technical difficulty, indicative cost level, risks, MVP scope, next steps, confidence note และ recommendation rationale

### 4.3 Demo truth boundary

**ทำงานจริง:** CRUD, validation, workflow state, approvals, local persistence, history, budget ledger logic, audit trail, responsive UI และ PWA shell  
**จำลอง:** เนื้อหา AI, ความเห็นต่าง, token usage, ค่าใช้จ่าย, model processing, web research และ background execution

## 5. User Stories and Acceptance Criteria

### US-01 — Start without setup

**As a** mobile-only user **I want** to enter Demo Mode immediately **so that** I can understand the product before creating an account.

**Acceptance criteria**
- Given first launch, when the user continues, then no login or API key is requested.
- The screen explains that AI content, costs and processing are simulated.
- A sample session is optional and can be dismissed.

### US-02 — Define an idea brief

**As a** product thinker **I want** to describe my idea and constraints **so that** all Agents work from the same problem.

**Acceptance criteria**
- Topic and goal are required; optional fields are clearly marked.
- Invalid input shows an inline Thai message and preserves entered values.
- Starting a run creates an immutable brief snapshot; later edits create a new revision.

### US-03 — Configure the council

**As a** user **I want** to inspect and adjust Agent roles **so that** the perspectives fit my problem.

**Acceptance criteria**
- Default council can be used without editing.
- Name, role, personality and system prompt are editable; model shows “Demo Simulator”.
- At least one idea-generating Agent and one Synthesizer are required.
- Reset restores defaults after confirmation.

### US-04 — Observe collaboration

**As a** user **I want** to see who is working and why **so that** the process is understandable.

**Acceptance criteria**
- Current round, active Agent and workflow status are always visible.
- A Waiting Approval state links directly to its approval request.
- Reopening the app restores persisted state without claiming real background processing.

### US-05 — Compare options

**As a** decision maker **I want** three consistently structured alternatives **so that** I can compare trade-offs.

**Acceptance criteria**
- Exactly three distinct option cards appear after a successful synthesis run.
- Missing fields render as “ข้อมูลไม่เพียงพอ” rather than invented values.
- Each option links to the contributions used to compose it.
- Mobile view supports comparison without horizontal scrolling.

### US-06 — Decide and iterate

**As a** user **I want** to select, merge or request another round **so that** I control the final direction.

**Acceptance criteria**
- Selecting an option requires a confirmation step and permits an optional rationale.
- Merge requires choosing at least two options and naming the merged direction.
- A new round shows incremental Demo credit impact before requesting approval.
- Rejected approval does not consume credits or change the confirmed decision.

### US-07 — Review history and controls

**As a** user **I want** to review sessions, approvals and budget events **so that** I can audit what happened.

**Acceptance criteria**
- History survives refresh and is ordered by most recent activity.
- Every approval displays requester, action, reason, estimated impact and outcome.
- Audit events are append-only through normal UI actions.
- The user can clear all local data only after explicit confirmation.

### US-08 — Recover from failure

**As a** user **I want** clear recovery choices **so that** a simulated error does not destroy my work.

**Acceptance criteria**
- An error identifies the failed step and retains completed contributions.
- Retry is idempotent: it does not duplicate completed contributions or ledger charges.
- If recovery is impossible, the user can duplicate the brief into a new session.

## 6. Agent and Workflow Lifecycles

### 6.1 Agent runtime states

```text
Idle ──assign──> Working ──needs decision/budget──> Waiting Approval
  ▲                  │                                  │
  │                  ├──success──> Complete             ├──approve──> Working
  │                  └──failure──> Error                └──reject───> Idle/Error
  └──────────── reset/new assignment <── Complete/Error
```

- สถานะเป็นผลจาก runtime state ไม่ใช่ข้อความที่ Agent ตั้งเอง
- ทุก transition ต้องมี timestamp, actor และ reason ใน audit log
- หนึ่ง Agent ทำงานได้หนึ่ง step ต่อ session ใน MVP

### 6.2 Workflow stages

```text
Draft Brief
   ↓ validate
Ready
   ↓ user starts
Diverge (Strategist + User Advocate + Architect)
   ↓
Critique (Risk & Cost Reviewer)
   ↓
Synthesize (3 options)
   ↓
Human Decision ──rerun/merge requiring approval──┐
   ↓ select                                      │
Development Outline                             │
   ↓                                             │
Complete  <─────────────────────────────────────┘

Any running stage ──failure──> Error ──retry──> last safe stage
```

### 6.3 Workflow invariants

- Synthesize เริ่มไม่ได้จน contribution ที่จำเป็นครบหรือถูกระบุว่า unavailable
- ยืนยัน decision ไม่ได้ก่อนมี options 3 รายการ
- confirmed decision ถูกแก้โดยตรงไม่ได้; การเปลี่ยนต้องสร้าง revision
- completed session ไม่กลับไป Working; iteration สร้าง run revision ใหม่
- Demo จะคำนวณสถานะเมื่อแอปเปิดใหม่จาก persisted events แต่ไม่แสดงว่า AI ทำงานจริงขณะปิดแอป

## 7. Permissions, Approval, Budget and Audit

### 7.1 Permission model

สิทธิ์ยึดหลัก deny-by-default และผูกกับ capability ไม่ผูกกับข้อความใน prompt

| Role | Allowed in MVP | Explicitly denied |
|---|---|---|
| Contributor Agents | อ่าน brief snapshot, สร้าง contribution | แก้ brief, อนุมัติตนเอง, network/file/tool access |
| Reviewer | อ่าน brief/contributions, สร้าง critique | เปลี่ยน contribution ต้นฉบับ, เพิ่มงบ |
| Synthesizer | อ่าน outputs, สร้าง option drafts | เลือก option แทนผู้ใช้, ข้าม approval |
| User | แก้ config, เริ่ม/หยุด, เลือก/รวม, approve/reject, ล้างข้อมูล | ไม่มี provider secret ใน frontend |
| Demo Runtime | validate transition, ledger และ persistence | ให้สิทธิ์ใหม่จาก prompt หรือ content |

### 7.2 Approval policy

ต้องขออนุมัติก่อน: เพิ่ม Demo budget, เริ่มรอบใหม่, รวม/แทนที่ decision ที่ยืนยันแล้ว, retry ที่จะคิด credits เพิ่ม และในระบบจริง—ทุก external side effect

Approval request มี: action type, requester, target, reason, estimated credit/cost impact, risk label, created time, expiry (อนาคต), status และ resolution note

### 7.3 Budget model

- ใช้หน่วย **Demo credits** เท่านั้นและติดป้ายว่าไม่ใช่เงินจริง
- ก่อนเริ่ม step ระบบ reserve estimate; เมื่อสำเร็จจึง commit usage; error ที่ไม่เกิด output ต้อง release reservation
- ถ้า remaining ต่ำกว่า estimate ให้เข้า Waiting Approval แทนการติดลบ
- ค่าเริ่มต้นและต้นทุนต่อ step เป็น configuration เพื่อเปลี่ยนเป็น token/currency ledger ฝั่ง backend ภายหลัง

### 7.4 Audit model

Event ขั้นต่ำ: `entity_created`, `entity_updated`, `run_started`, `state_changed`, `approval_requested`, `approval_resolved`, `budget_reserved`, `budget_committed`, `budget_released`, `decision_confirmed`, `error_raised`, `retry_started`, `data_cleared`

ทุก event มี `id`, `timestamp`, `actorType`, `actorId`, `entityType`, `entityId`, `action`, `reason`, `metadata` และ `previousEventHash` เป็นช่องเตรียมไว้ ระบบจริงต้องสร้าง audit log บน backend ไม่เชื่อ client

## 8. Data Model

### 8.1 Entities

| Entity | Essential fields |
|---|---|
| Workspace | id, name, locale, demoMode, createdAt |
| AgentDefinition | id, name, role, personality, systemPrompt, modelAdapterId, permissionProfileId, enabled |
| IdeaBrief | id, revision, topic, targetUser, goal, constraints, successSignal, createdAt |
| Session | id, briefRevisionId, status, currentStage, budgetLimit, createdAt, completedAt |
| WorkflowRun | id, sessionId, revision, status, startedAt, endedAt |
| StepRun | id, workflowRunId, stage, agentId, status, attempt, inputRefs, outputRefs |
| Contribution | id, stepRunId, agentId, type, content, assumptions, sourceRefs, demoGenerated |
| Option | id, workflowRunId, rank, title, schemaPayload, contributionRefs |
| Decision | id, sessionId, revision, type, selectedOptionIds, rationale, confirmedAt |
| DevelopmentOutline | id, decisionId, problem, users, MVPItems, laterItems, risks, nextSteps |
| ApprovalRequest | id, action, requesterId, targetRef, reason, impact, status, resolution |
| BudgetEntry | id, sessionId, stepRunId, type, amount, balanceAfter, demoOnly |
| AuditEvent | id, timestamp, actor, entityRef, action, reason, metadata, previousEventHash |
| AppSettings | locale, theme, reducedMotion, onboardingComplete, schemaVersion |

### 8.2 Relationships

```text
Workspace 1─* AgentDefinition
Workspace 1─* IdeaBrief 1─* Session 1─* WorkflowRun 1─* StepRun
StepRun 1─* Contribution
WorkflowRun 1─3 Option
Session 1─* Decision 1─0..1 DevelopmentOutline
Session 1─* ApprovalRequest / BudgetEntry / AuditEvent
```

### 8.3 Local data rules

- ใช้ UUID และ ISO timestamps เพื่อรองรับ sync ในอนาคต
- repository interface ซ่อน IndexedDB จาก domain logic
- schema migration ต้องไม่ล้างข้อมูลเงียบ ๆ
- system prompt และ brief ถือเป็นข้อมูลส่วนตัว; MVP ไม่ส่งออกจากอุปกรณ์
- “Clear all data” ลบ object stores ที่เกี่ยวข้องและสร้าง audit marker ก่อนล้างเท่าที่ข้อจำกัด local อนุญาต

## 9. Architecture

### 9.1 MVP architecture

```text
┌──────────────────────── Installable PWA ────────────────────────┐
│ React UI                                                        │
│  ├─ Mobile navigation / responsive screens                      │
│  └─ View models (no direct storage access)                      │
│                 ↓ commands / ↑ state                            │
│ Domain Layer                                                    │
│  ├─ Agent + workflow state machines                             │
│  ├─ Approval policy                                             │
│  ├─ Budget ledger                                               │
│  └─ Validation + audit event creation                           │
│                 ↓ adapter interfaces                            │
│ Demo Runtime                         Local Data                  │
│  ├─ role-based templates             ├─ IndexedDB repositories  │
│  ├─ deterministic scenarios          └─ schema migrations       │
│  └─ injected error scenarios                                   │
│ Service Worker: cache app shell; no provider secrets            │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Proposed MVP stack

- React + TypeScript + Vite
- React Router สำหรับเส้นทางหน้าจอ
- IndexedDB ผ่าน repository adapter (ใช้ไลบรารีขนาดเล็กได้หลังประเมิน)
- Workbox หรือ Vite PWA integration สำหรับ manifest/service worker
- Typed reducer/state machine; ยังไม่เพิ่ม orchestration framework หากไม่จำเป็น
- CSS design tokens และ component primitives ที่รองรับ touch/accessibility

### 9.3 Future production architecture

```text
PWA Client
   │ HTTPS commands / SSE status
   ▼
API / Backend-for-Frontend ── Auth + rate limits
   ├─ Policy & Approval Service
   ├─ Budget Service (authoritative ledger)
   ├─ Agent Runtime ── Provider Adapters ── AI Providers
   ├─ Job Queue ── Workers (long-running tasks)
   ├─ Audit Service (append-only)
   └─ Data Access ── PostgreSQL / object storage

Secrets exist only in backend secret storage.
Workers verify permission, approval and budget before every tool call.
```

### 9.4 Portability rules

- domain objects ไม่อ้าง SDK ของ AI provider
- provider adapter รับ normalized request/response และ capability metadata
- client ไม่ถือ service-role credential หรือ provider API key
- SSE เป็นค่าเริ่มต้นสำหรับ one-way progress; ใช้ WebSocket เมื่อมีเหตุผลด้าน bidirectional realtime จริง
- long-running jobs ต้องรันใน worker และ recover จาก retry/idempotency key ได้

## 10. Security, Privacy and Safety

### 10.1 MVP controls

- Content Security Policy และ dependency review ก่อนปล่อยใช้งาน
- ห้ามใช้ `innerHTML` กับ contribution/prompt; render เป็น text/markdown ที่ sanitize แล้ว
- ไม่บันทึก secret ใน source, localStorage, IndexedDB หรือ service-worker cache
- service worker cache เฉพาะ app shell; ไม่ cache private dynamic payload โดยไม่กำหนดนโยบาย
- การลบ/reset และ action ที่เปลี่ยน decision ต้องยืนยันอย่างชัดเจน
- error UI ไม่แสดง stack trace หรือข้อมูลภายใน

### 10.2 Prompt-injection boundary for production

1. แยก system policy, user brief, Agent contribution และ external content เป็นคนละ typed channel
2. ถือ contribution และ external content เป็น untrusted data เสมอ
3. Agent ไม่มีสิทธิ์แก้ permission, approval หรือ budget policy ผ่านข้อความ
4. tool call ต้องเป็น structured request ที่ backend validate ด้วย allowlist และ schema
5. ตรวจสิทธิ์และงบประมาณใหม่ ณ เวลารัน ไม่เชื่อผลตรวจจากโมเดลหรือ frontend
6. external side effect ใช้ preview → human approval → execute พร้อม idempotency key

### 10.3 Privacy

- MVP เป็น local-first และไม่มี analytics โดยปริยาย
- แสดงคำอธิบายว่าการล้าง browser storage หรือถอนการติดตั้งอาจทำให้ข้อมูลสูญหาย
- ก่อนเชื่อม cloud ต้องมี consent, retention policy, export/delete flow และแยก tenant ด้วย server-side authorization
- ไม่อ้างว่า local data เข้ารหัสอย่างปลอดภัยจากผู้ที่ปลดล็อกอุปกรณ์เดียวกัน

## 11. Quality and Validation

### 11.1 Responsive and accessibility

- รองรับอย่างน้อย 360×800, Android portrait/landscape และ iPad portrait/landscape
- touch target อย่างน้อย 44×44 CSS px
- contrast ระดับ WCAG 2.2 AA, semantic headings, labels, focus order และ screen-reader names
- ไม่ใช้สีเพียงอย่างเดียวสื่อสถานะ; มีข้อความและ icon label
- เคารพ `prefers-reduced-motion`; animation ไม่ขวางการทำงาน
- option comparison บนมือถือใช้ stacked cards และ “compare fields” ไม่บังคับตารางแนวนอน

### 11.2 Required validation before claiming Prototype complete

1. CRUD Agent และ validation
2. Golden path ตั้งแต่ brief ถึง confirmed decision
3. Approve, reject, expired/future-ready และ budget-insufficient paths
4. Error injection และ idempotent retry
5. refresh/reopen persistence และ IndexedDB migration
6. offline app-shell behavior และ PWA installability
7. responsive layout บน target viewports
8. keyboard/screen-reader smoke test และ automated accessibility scan
9. XSS payload rendering, secret scan และ service-worker cache inspection
10. ตรวจทุกหน้าว่าระบุ Demo content/cost ชัดเจน

### 11.3 Honest completion labels

- **Implemented:** มีโค้ดและผ่าน acceptance criteria
- **Tested:** มีผลทดสอบที่บันทึกได้
- **Simulated:** ทำงานผ่าน Demo Runtime ไม่ใช่ AI/backend จริง
- **Planned:** อยู่ใน specification แต่ยังไม่ได้สร้าง

## 12. Scope Roadmap and Decision Log

### 12.1 Milestones and gates

| Milestone | Deliverable | Exit gate |
|---|---|---|
| M1 — Specification | เอกสารฉบับนี้ | ผู้ใช้อนุมัติ MVP และ specification |
| M2 — UX Skeleton | navigation, responsive shells, design tokens | ตรวจหน้าจอหลักบน Android/iPad |
| M3 — Demo Domain | state machines, persistence, approvals, ledger | unit/integration tests ผ่าน |
| M4 — Interactive Prototype | golden path, options, history, PWA | validation checklist ผ่านและระบุ simulated ชัด |
| M5 — Backend Design | auth/data/runtime/queue/provider contracts | อนุมัติก่อนเชื่อมบริการจริง |
| M6 — Production Integration | backend, provider, realtime, security controls | security/cost/error validation ผ่าน |

### 12.2 Deferred scope

- AI provider จริง, web research, code generation และ external tools
- cloud account/sync, backup/export และหลายอุปกรณ์
- multi-user collaboration, RBAC และ organization tenancy
- workflow branching/canvas, marketplace, scheduling และ voice
- payment, real-money billing และ autonomous execution

### 12.3 Risks and mitigations

| Risk | Impact | MVP mitigation |
|---|---|---|
| ผู้ใช้เข้าใจว่า Demo คือ AI จริง | ความเชื่อมั่น/ความโปร่งใส | persistent Demo badge และ truth boundary ทุกผลลัพธ์ |
| Agent outputs ซ้ำหรือดูเป็นบทละคร | คุณค่าการทดลองต่ำ | role-specific templates, assumptions และ critique structure |
| ข้อมูลมากเกินจอมือถือ | ใช้งานยาก | progressive disclosure, stacked compare และ concise defaults |
| ระบบจริงมีค่าใช้จ่ายสูง | budget overrun | capped rounds, preflight estimate, authoritative backend ledger |
| Prompt injection/tool misuse | security incident | typed channels, capability allowlist, backend enforcement, approvals |
| Local data สูญหาย | สูญเสียงาน | แจ้งข้อจำกัดชัด; export/backup เป็นงานหลัง MVP |
| PWA ถูกระบบมือถือพัก | งานหยุด | Demo ไม่อ้าง background; production ใช้ queue/worker |

### 12.4 Approved decisions

- 2026-09-30: เลือก Personal AI Team Station แทน workflow-first หรือ multi-user hub
- 2026-09-30: กรณีใช้งานหลักคือระดมความคิดเพื่อพัฒนาผลิตภัณฑ์/แอป
- 2026-09-30: ผลลัพธ์เป็น 3 options พร้อม trade-offs และ recommendation
- 2026-09-30: MVP เป็น Interactive Demo, local-first, ไม่ล็อกอิน และไม่ใช้ API key
- 2026-09-30: ผู้ใช้อนุมัติ Product Specification Version 1.0 และอนุญาตให้เข้าสู่ Phase 3 Prototype
- 2026-09-30: เลือก visual direction แบบ Playful Studio และรูปแบบชื่อสากลสั้น ๆ
- 2026-09-30: เลือก working product name “PJ Center”; ต้องตรวจสอบความซ้ำและสิทธิ์ก่อนเผยแพร่จริง
- 2026-09-30: “PJ” เป็นนามแฝงส่วนตัวของผู้สร้าง ไม่ใช่ตัวย่อและไม่มีคำขยายสาธารณะ

### 12.5 Open decisions before visual design

1. รูปแบบ option comparison เริ่มต้นบนมือถือ

**Resolved:** working name = PJ Center; “PJ” is the creator's alias with no expansion; visual direction = Playful Studio

### 12.6 Approval requested

การอนุมัติเอกสารนี้หมายถึงยอมรับ MVP scope, user journey, truth boundary, data model, lifecycle, permission model และ architecture direction เพื่อเข้าสู่ Phase 3 Prototype โดย **ไม่ถือว่า feature ใดถูกสร้างหรือทดสอบแล้ว**
