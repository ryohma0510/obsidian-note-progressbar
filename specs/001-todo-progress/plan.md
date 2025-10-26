# Implementation Plan: Todo Progress Banner MVP

**Branch**: `001-todo-progress` | **Date**: 2025-10-25 | **Spec**: [`specs/001-todo-progress/spec.md`](./spec.md)
**Input**: Feature specification from `/specs/001-todo-progress/spec.md`

## Summary

Deliver an Obsidian plugin feature that renders a lightweight progress banner above every note, showing the completion percentage of Markdown checkboxes and updating live as users toggle tasks. Implementation centers on a deterministic Markdown task parser, a DOM banner component that respects existing themes, and lifecycle wiring in `main.ts` to keep the UI synchronized without manual refreshes.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 4.7 targeting ES6 (per existing tsconfig)  
**Primary Dependencies**: Obsidian plugin API (`obsidian`), esbuild bundler, tslib  
**Storage**: N/A (MVP has no persisted settings)  
**Testing**: Vitest + jsdom via `npm test` for unit and scenario coverage  
**Target Platform**: Obsidian desktop (Electron) and mobile (iOS/Android) apps  
**Project Type**: Single plugin project (`main.ts` + `src/**`)  
**Performance Goals**: Parse and render within 500 ms on note load; reflect checkbox toggles within 200 ms  
**Constraints**: Offline-only, strict TypeScript, theme-inheriting styles, `main.ts` limited to lifecycle glue  
**Scale/Scope**: Single-user vault data; operates per-note with up to hundreds of checkboxes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality Gate**: `main.ts` will only register commands/events and delegate to new modules: `src/progress/calculator.ts` (Markdown checkbox parser returning `ProgressSnapshot`), `src/ui/progress-banner.ts` (DOM creation + updates), and `src/state/note-watcher.ts` (workspace/file events). Each module owns a single responsibility with TSDoc summaries.
- **Testing Gate**: Plan introduces `npm test` powered by a TypeScript-friendly runner (decision pending research) plus jsdom for DOM assertions. Coverage targets: calculator unit tests (nested lists, empty notes, performance caps) and scenario tests simulating checkbox toggles via mocked workspace events.
- **UX Consistency Gate**: Only one UI surface—the “Todo progress” banner fixed below the note title—plus a command palette entry “Toggle todo progress bar.” Copy will be sentence case, default theme colors auto-inherited, and celebratory state text “All tasks done” keeps layout stable. No settings panel in MVP, so no additional copy required.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── progress/
│   └── calculator.ts
├── ui/
│   └── progress-banner.ts
└── state/
    └── note-watcher.ts

tests/
├── unit/
│   └── progress-calculator.test.ts
└── scenario/
    └── note-watcher-progress.test.ts
```

**Structure Decision**: Keep the existing single-project layout. Add focused folders under `src/` for calculation, UI, and state management, while `main.ts` wires them together. Tests mirror modules under `tests/unit` and `tests/scenario` so coverage stays close to the code they validate.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Constitution Re-check (post-design)
- **Code Quality Gate**: PASS – Modules, data model, and event bridge are fully documented; `main.ts` remains a lightweight orchestrator.
- **Testing Gate**: PASS – Vitest + jsdom stack chosen, contracts + data model specify what to assert, and `npm test` will run both unit and scenario suites.
- **UX Consistency Gate**: PASS – Single banner surface with fixed copy (“Todo progress”, “All tasks done”), celebratory state defined in spec, and no extra settings that could drift from guidelines.
