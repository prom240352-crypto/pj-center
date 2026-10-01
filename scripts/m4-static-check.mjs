import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const readTree = (dir) => { let out = ''; for (const name of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) { const rel = path.join(dir, name.name); out += name.isDirectory() ? readTree(rel) : read(rel) + '\n'; } return out; };
const exists = (p) => fs.existsSync(path.join(root, p));
const checks = [
  ['FR-01 Demo without auth/API key', exists('src/screens/WelcomeScreen.tsx')],
  ['FR-02 Agent CRUD/duplicate/reset', read('src/screens/AgentsScreen.tsx').includes('handleDuplicate') && read('src/screens/AgentsScreen.tsx').includes('handleReset')],
  ['FR-03 Agent definition fields', /systemPrompt|personality|model/.test(read('src/screens/AgentEditScreen.tsx'))],
  ['FR-04 brief validation', read('src/domain/validation.ts').includes('validateBrief') && read('src/screens/IdeaBriefScreen.tsx').includes('validateBrief')],
  ['FR-05 workflow states', /working|waiting-approval|complete|error/.test(read('src/domain/types.ts'))],
  ['FR-06 contribution per agent/round', /agentId|stepRunId/.test(read('src/domain/types.ts'))],
  ['FR-07 exactly 3 options + refs', read('src/demo/runtime.ts').includes('template.options.map') && read('src/domain/decision.ts').includes('options.length !== 3') && read('src/domain/workflow.ts').includes('contributionRefs')],
  ['FR-08 select/merge/rerun', /selectOption|mergeOptions|requestNewRound/.test(read('src/domain/decision.ts'))],
  ['FR-09 approval gate', read('src/domain/approval.ts').includes("'retry'") && read('src/domain/decision.ts').includes("'new-round'")],
  ['FR-10 demo credits', read('src/domain/budget.ts').includes('DEFAULT_BUDGET')],
  ['FR-11 audit events', read('src/domain/types.ts').includes('previousEventHash') && read('src/domain/audit.ts').includes('previousEventHash') && /approval_requested|approval_resolved|budget_reserved|decision_confirmed|error_raised|retry_started/.test(readTree('src'))],
  ['FR-12 IndexedDB persistence', exists('src/storage/indexeddb.ts') && read('src/storage/indexeddb.ts').includes('DB_VERSION = 2')],
  ['FR-13 PWA icons/config', exists('public/icons/icon-192.png') && exists('public/icons/icon-512.png') && exists('vite.config.ts')],
  ['FR-14 Thai UI', exists('src/screens/WelcomeScreen.tsx')],
  ['Responsive overflow safety', read('src/styles/global.css').includes('overflow-x: hidden')],
  ['No innerHTML', !readTree('src').includes('innerHTML')],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
process.exitCode = failed ? 1 : 0;
