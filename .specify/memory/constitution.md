<!--
Sync Impact Report
Version: 0.0.0 → 1.0.0
Modified Principles:
- Template Principle 1 → Principle I: Code Quality Is the Default
- Template Principle 2 → Principle II: Tests Define Done
- Template Principle 3 → Principle III: User Experience Consistency
Removed Sections:
- Placeholder principles IV & V (folded into the three non-negotiable pillars)
Added Sections:
- Engineering Standards
- Workflow & Review Discipline
Templates Updated:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# Obsidian Progressbar Constitution

## Core Principles

### I. Code Quality Is the Default
- Keep `main.ts` limited to plugin lifecycle glue; all feature logic lives in well-named modules under `src/` with single responsibilities.
- TypeScript strictness is mandatory: no implicit `any`, lint clean diffs, and every exported symbol documents intent via either TSDoc or descriptive naming.
- Architectural decisions (state shape, command registrations, settings schema) must be recorded in the relevant `specs/<feature>/` artifacts before coding so reviewers can trace intent.

**Rationale**: Readable, documented modules enable safe refactors, onboarding, and reduce regressions in a small plugin codebase that ships frequently.

### II. Tests Define Done
- Every user story delivers automated coverage before implementation work is marked complete: unit-level for logic modules plus scenario or contract checks for Obsidian command flows.
- Regression tests live beside the code they protect (`src/**/__tests__` or `tests/**`) and must be runnable via `npm test` in CI; manual steps are only supplements.
- Failing tests gate merges; bug fixes require reproduction tests first.

**Rationale**: Fast, deterministic tests are the only scalable way to keep plugin behavior stable while iterating on features.

### III. User Experience Consistency
- Command names, ribbon icons, settings labels, and notices must follow Obsidian style guidelines (sentence case, action verbs) and be documented in specs before implementation.
- Any visual or textual addition must define default states, error copy, and accessibility expectations (keyboard focus, readable contrast, concise notices).
- Breaking UX changes (renaming commands, moving settings) require migration notes in the spec and README before release.

**Rationale**: Consistent UI and copy ensure users trust the plugin and can predict outcomes even as features evolve.

## Engineering Standards

- Source of truth: `src/` hosts feature modules, `main.ts` only wires lifecycle hooks. Shared utilities must live under `src/utils/` with typed contracts.
- Build artifacts are limited to `main.js`, `manifest.json`, and optional `styles.css`; esbuild bundles all runtime dependencies and sourcemaps stay local.
- Configuration: `tsconfig.json` stays strict; `package.json` scripts include `build`, `dev`, and `test` (tests cannot be removed without governance approval).
- Security & privacy: the plugin operates offline by default, never transmits vault contents, and documents any optional network use inside settings with explicit opt-in.

## Workflow & Review Discipline

- **Specs before code**: Every feature update must include an up-to-date spec detailing UX copy, module boundaries, and acceptance tests aligned with the principles above.
- **Plan gates**: Implementation plans must prove compliance with all constitution gates (code quality structure, testing strategy, and UX impact) before Phase 0 research can finish.
- **Task hygiene**: Tasks are organized per user story, and each story lists the required automated tests and UX changes so teams can deliver independently testable increments.
- **Review checklist**: Code reviews block until lint/test pipelines pass, documentation is updated, and UX diffs match the approved spec copy.

## Governance

- **Authority**: This constitution supersedes ad-hoc practices; conflicting guidance must be reconciled here before adoption.
- **Amendments**: Proposals require written rationale, redlines, and approval from the maintainers; upon acceptance, bump the version per semantic rules and update all affected templates.
- **Versioning Policy**: MAJOR for removing or redefining principles, MINOR for adding new mandates or sections, PATCH for clarifications. Record every change in the Sync Impact Report at the top of this file.
- **Compliance Reviews**: Before each release, run a checklist verifying architecture docs, automated tests, and UX notes are current; non-compliance halts the release until remedied.

**Version**: 1.0.0 | **Ratified**: 2025-10-25 | **Last Amended**: 2025-10-25
