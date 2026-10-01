# PJ Center M4 — Handoff

## Current state

The uploaded M4 prototype was audited against Product Specification v1.1. Source-level M4 checks pass, and the issues found during review were fixed in this package.

## Important: build status

A production build was **not** claimed as passed in this environment. `npm ci` cannot complete because the available npm cache is missing `yallist@3.1.1`. Run dependency installation on a network-enabled machine before release.

## What was fixed

- budget reserve/commit/release accounting
- workflow-run scoping for contributions/options
- exactly-three option guard
- decision confirmation step
- Agent duplicate + restore defaults
- retry approval gate + recovery after approve/reject
- one-shot forced error injection
- Idea Brief revision editing
- contribution source expansion
- approval expiry handling and requester/outcome display
- audit event previous hash chain
- IndexedDB v2 additive migration path
- required PWA icons
- mobile horizontal overflow safety
- functional History filters
- correct Budget summary UI

## Next AI / developer commands

```bash
npm ci
npm run test:m4
npm run build
npm run dev
```

Then test: 360x800 Android, iPad portrait/landscape, refresh/reopen persistence, offline PWA shell, approval approve/reject, error injection/retry, 3-option decision, merge, rerun, and accessibility/XSS/security smoke tests.

## Truth boundary

AI outputs, model processing, token usage, web research, costs and background execution remain simulated in MVP. CRUD, workflow state, approval, budget ledger, audit, local persistence, responsive UI and PWA shell are intended to be real prototype behavior.
