# PJ Center — M4 QA Report

Date: 2026-09-30
Scope: uploaded M4 ZIP vs Product Specification v1.1

## Automated/static result

All 16 repository/source checks pass via `npm run test:m4` (the script itself can be run without installing dependencies):

- FR-01 through FR-14: PASS (source/domain/config verification)
- responsive overflow safety: PASS
- no `innerHTML` usage: PASS
- PWA 192/512 icons present: PASS
- IndexedDB schema version/migration path present: PASS

## Fixes applied

1. Fixed Demo budget ledger semantics: committed usage is now counted separately from active reservations/releases.
2. Scoped synthesis contributions to the current WorkflowRun.
3. Scoped Option Compare and Decision to the active session's latest WorkflowRun.
4. Enforced exactly 3 options before decision confirmation.
5. Added explicit confirmation before select/merge decisions.
6. Added Agent duplicate and restore-default behavior.
7. Added approval-gated retry and approval application/rejection recovery.
8. Made forced `?error=true` injection one-shot so an approved retry can recover.
9. Added Idea Brief revision editing/persistence.
10. Added contribution-source expansion in Option Compare.
11. Added approval expiry check and requester/outcome display.
12. Added audit previous-event hash chaining/fallback link.
13. Added IndexedDB version 2 additive migration path.
14. Added PWA icons required by Vite PWA config.
15. Fixed mobile horizontal overflow safety.
16. Made History status filters functional.
17. Corrected Budget screen to use session summary (used/remaining/reserved) rather than `total - balance`.

## Verification limits

`npm ci` could not complete in this environment because the npm cache lacks `yallist@3.1.1`; therefore a real Vite production build and browser runtime test could not be honestly marked PASS here. A syntax-only TypeScript invocation found no TS parse/JSX syntax errors after the fixes, but it still reports missing dependency type definitions because dependencies are not installed.

## Runtime checks still required on a machine with network/package installation

- `npm ci`
- `npm run build`
- `npm run test:m4`
- Golden path: Welcome → Brief → Council → Session → 3 Options → Decision → Outline
- Approval approve/reject/retry/new-round
- Error injection + idempotent retry
- Refresh/reopen IndexedDB persistence
- PWA install/offline app shell
- Android 360x800 and iPad portrait/landscape visual check
- keyboard/screen-reader smoke + accessibility scan
- XSS payload rendering, secret scan, service-worker cache inspection

## Labels

- Implemented: source changes are present and static checks pass.
- Tested: only items actually executed are marked tested.
- Simulated: Demo Runtime content/cost/processing.
- Planned/Unverified: requires dependency installation or browser/device execution.
