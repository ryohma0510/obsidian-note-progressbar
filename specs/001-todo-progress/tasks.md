---

description: "Task list template for feature implementation"
---

# Tasks: Todo Progress Banner MVP

**Input**: Design documents from `/specs/001-todo-progress/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated tests are MANDATORY. Every user story lists the unit/contract/scenario tests that must be written and executed (they block implementation tasks).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions
- Include UX copy/settings updates as explicit tasks so reviewers can track Principle III compliance.

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configure tooling and directory scaffolding required for all user stories.

- [X] T001 Update `package.json` devDependencies with `vitest`, `jsdom`, and `@types/jsdom`, and add a `test` script (run via `pnpm test`) that executes `vitest run`.
- [X] T002 Create `vitest.config.ts` at repo root configured for the `jsdom` environment and include `tests/**/*.(test|spec).ts` globs.
- [X] T003 Create `tests/unit/` and `tests/scenario/` folders (add `.gitkeep` if needed) plus a short testing guide in `tests/README.md` describing how to run `pnpm test` locally.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, state scaffolding, and styling hooks required before implementing any user story logic.

- [ ] T004 Define shared interfaces `NoteTask`, `ProgressSnapshot`, and `BannerState` in `src/types/progress.ts` according to `data-model.md`.
- [ ] T005 Scaffold `src/state/note-watcher.ts` with a `NoteWatcher` class that accepts the Obsidian `App`, exposes `start()`/`stop()`, and emits snapshot callbacks (implementation TBD in user stories).
- [ ] T006 Add a `.todo-progress-banner` style block to `styles.css` (or create it if missing) that inherits typography/colors from Obsidian CSS variables while reserving space for the banner.

**Checkpoint**: Shared types, watcher skeleton, and styling exist—user stories can now plug in behavior independently.

---

## Phase 3: User Story 1 - See note completion status (Priority: P1) 🎯 MVP

**Goal**: Display a banner above the note title showing the completion percentage whenever the active note contains Markdown checkboxes.

**Independent Test**: Open a note with 10 tasks (4 complete) and confirm the banner renders “40%” with the correct fill ratio; open a note with zero checkboxes and confirm no banner is injected.

### Tests for User Story 1 ⚠️ (mandatory)

- [ ] T007 [P] [US1] Implement calculator unit tests in `tests/unit/progress-calculator.test.ts` covering mixed checked/unchecked boxes, nested lists, and zero-task notes.

### Implementation for User Story 1

- [ ] T008 [US1] Implement checkbox parsing in `src/progress/calculator.ts` to convert metadata cache list items into `ProgressSnapshot` objects (hide banner when `total = 0`).
- [ ] T009 [US1] Build the DOM renderer in `src/ui/progress-banner.ts` that inserts the banner beneath the note title, sets text to the rounded percentage, and exposes `show(snapshot)` / `hide()` methods.
- [ ] T010 [US1] Extend `src/state/note-watcher.ts` to recalculate on `workspace.on('active-leaf-change')` and deliver snapshots to the banner renderer.
- [ ] T011 [US1] Update `main.ts` to instantiate the calculator, banner, and watcher, register the “Toggle todo progress bar” command, and dispose everything in `onunload`.
- [ ] T012 [US1] Document activation instructions and the banner UX in `README.md` (usage section) so users know what to expect for MVP.

**Checkpoint**: User Story 1 delivers an independently testable banner that appears on note open and hides when no tasks exist.

---

## Phase 4: User Story 2 - Watch progress update live (Priority: P2)

**Goal**: Keep the banner accurate as users toggle checkboxes or switch notes during a session.

**Independent Test**: While a note is open, toggle tasks and confirm the banner percentage and fill ratio update within 200 ms; switch to a different file and verify the new note’s percentage replaces the old one.

### Tests for User Story 2 ⚠️ (mandatory)

- [ ] T013 [P] [US2] Create scenario tests in `tests/scenario/note-watcher-progress.test.ts` that simulate checkbox toggles and note switches using mocked workspace events, asserting debounced updates.

### Implementation for User Story 2

- [ ] T014 [US2] Enhance `src/state/note-watcher.ts` to listen for `metadataCache.on('changed')` (or vault modify) events and emit fresh snapshots when checkboxes toggle.
- [ ] T015 [US2] Update `src/ui/progress-banner.ts` to animate fill changes, show the celebratory “All tasks done” state, and ensure layout remains stable.
- [ ] T016 [US2] Wire the new watcher events and celebratory UX in `main.ts`, ensuring the command toggle still hides/shows the banner without stale listeners.
- [ ] T017 [US2] Expand `quickstart.md` with live-update verification steps so testers can follow the scenario described in the spec.

**Checkpoint**: User Story 2 ensures the banner stays in sync with live task edits and note navigation without manual refreshes.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening tasks spanning multiple user stories.

- [ ] T018 [P] Add performance logging/timing hooks in `src/state/note-watcher.ts` (guarded by `process.env.NODE_ENV`) to confirm parsing stays under 500 ms for large notes.
- [ ] T019 Audit accessibility by ensuring `src/ui/progress-banner.ts` sets `aria-live="polite"` and descriptive text for screen readers, updating `styles.css` if needed for contrast.
- [ ] T020 Refresh `README.md` and `docs` (if any) with troubleshooting tips (e.g., what happens when metadata cache is disabled) and include a GIF screenshot of the banner.

---

## Dependencies & Execution Order

### User Story Ordering
- **US1 (P1)** must ship first; it provides the baseline banner experience.
- **US2 (P2)** depends on US1 components (calculator, banner, watcher) and only adds live-update behavior.

### Phase Dependencies
1. Setup → Foundational → User Stories → Polish.
2. Foundational assets (types, watcher skeleton, base styles) are required before US1 coding begins.
3. US2 cannot start until US1 passes its independent tests.

## Parallel Execution Examples

- While T001–T002 run (package + config edits), another contributor can create the testing guide (T003).
- During US1, calculator tests (T007) can run in parallel with DOM renderer implementation (T009) because they touch different files.
- For US2, the scenario tests (T013) can be built concurrently with banner animation updates (T015) once watcher hooks from T014 are stubbed.

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phases 1–2 (tooling, shared scaffolding).
2. Deliver US1 tasks (T007–T012) and verify the independent test scenario.
3. Release internally for feedback if live updates are not yet required.

### Incremental Delivery
1. After MVP validation, proceed to US2 to add live updates.
2. Use scenario tests (T013) to guard regressions before merging.
3. Finish with Polish tasks (T018–T020) prior to public release.
