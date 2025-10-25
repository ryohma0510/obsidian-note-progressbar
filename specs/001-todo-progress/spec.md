# Feature Specification: Progress Bar for Note Todos

**Feature Branch**: `001-todo-progress`  
**Created**: 2025-10-25  
**Status**: Draft  
**Input**: User description: "I want to create an obsidian-plugin to display progress bar at the top of page which shows how many todos in a page is done"

## User Scenarios & Testing *(mandatory)*

> Constitution alignment: For every story capture the intended module touchpoints (Code Quality), the automated tests that will be written (Tests Define Done), and the user-facing copy/states (User Experience Consistency).

### User Story 1 - See note completion status (Priority: P1)

Daily note takers want to understand how far they are through the tasks inside the current note without scrolling.

**Why this priority**: Surfacing completion at a glance is the core value proposition and the baseline for every other enhancement.

**Independent Test**: Open a note containing 6 unchecked tasks and 4 completed ones; verify a banner appears before the first heading showing "6 of 10 tasks complete (60%)" with a proportional bar.

**Acceptance Scenarios**:

1. **Given** a note containing at least one markdown checkbox task, **When** the user opens the note in reading or editing view, **Then** a progress bar renders above the note title showing count of completed vs total tasks and the percentage filled accordingly.
2. **Given** a note without any checkbox tasks, **When** the user opens it, **Then** no progress bar is shown and no empty placeholder shifts the content.

---

### User Story 2 - Watch progress update live (Priority: P2)

Writers updating checklists need the bar to stay accurate as they tick items off during a session.

**Why this priority**: Without live updates the bar becomes misleading, undermining trust in the plugin.

**Independent Test**: With the note from Story 1 open, toggle one unchecked task to checked and confirm the counts/percentage update within 200 ms without requiring a manual refresh.

**Acceptance Scenarios**:

1. **Given** the progress bar is visible, **When** the user checks or unchecks a markdown checkbox, **Then** the counts and fill animation update immediately to reflect the new totals.
2. **Given** the user navigates to another file, **When** the workspace focus changes, **Then** the bar recalculates for the newly opened note using that file’s tasks only.

---

### User Story 3 - Configure the display (Priority: P3)

Some users want the bar’s position, color, and visibility rules to match their theme and workflow.

**Why this priority**: Customization avoids clash with dark/light themes and prevents distraction on notes where progress is irrelevant.

**Independent Test**: From the plugin settings tab, set the bar color to a custom hex value, move it from “fixed top” to “inline below title,” and enable “Hide when completed”; verify the changes take effect the next time a note opens.

**Acceptance Scenarios**:

1. **Given** the settings tab is opened, **When** the user adjusts options for bar color, height, and hide-on-complete, **Then** the selections persist and apply across notes after saving.
2. **Given** the user disables the feature via a toggle, **When** they open a note with todos, **Then** no bar renders until the toggle is re-enabled.

---

### Edge Cases

- Notes with hundreds of checkboxes must compute totals without noticeable lag (<500 ms) and should cap the displayed percentage to two decimal places.
- Nested or indented checkboxes (subtasks) count toward totals the same as top-level tasks so completion remains intuitive.
- Mixed content such as code blocks or quoted checklists should be ignored to avoid counting non-actionable items.
- When all todos are complete, the bar should either disappear (if user enabled “hide when complete”) or display a celebratory state that still leaves the layout stable.
- If the note is extremely short and the bar would push content off-screen, it should collapse to a compact mode with just text.

## Quality, Testing & UX Alignment *(constitution-mandated)*

- **Code Quality Plan**: Introduce `src/progress/calculator.ts` for parsing Markdown tokens and returning a `ProgressSnapshot`, `src/ui/progress-banner.ts` for rendering the top-of-note element, and `src/settings/progress-settings.ts` for managing persisted preferences. `main.ts` simply wires lifecycle hooks to these modules and registers settings/commands.
- **Automated Testing Plan**: Add logic tests for `ProgressSnapshot` generation covering nested lists, zero-task notes, and large documents; add scenario tests that simulate toggling checkboxes and note navigation to assert the bar updates. All tests run via `npm test` so CI gates merges per the constitution.
- **UX Consistency Plan**: UI strings use sentence case (e.g., “Todo progress”), the settings tab includes controls labeled “Bar color,” “Hide when complete,” and “Display position.” The bar appears directly beneath the note title by default with subtle animation matching Obsidian guidelines. README gains a short section describing activation and customization. Command palette entry: “Toggle todo progress bar.”

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The plugin MUST scan the active note for standard Obsidian Markdown checkbox syntax (`- [ ]`, `- [x]`) whenever a note is opened or gains focus.
- **FR-002**: When at least one checkbox exists, the system MUST display a progress banner above the note content showing completed count, total count, and completion percentage rounded to the nearest whole number by default.
- **FR-003**: The system MUST hide the banner entirely when a note contains zero checkboxes to avoid visual noise.
- **FR-004**: The banner MUST update within 200 ms whenever a checkbox is toggled or a note is switched, ensuring the displayed percentage remains accurate.
- **FR-005**: Users MUST be able to configure banner color, height, display position (fixed top vs inline), and whether to hide the bar when completion reaches 100% via a settings tab.
- **FR-006**: User preferences MUST persist across Obsidian restarts using the standard plugin data store and apply immediately after saving.
- **FR-007**: The plugin MUST respect Obsidian themes by default (inherit font and respect dark/light contrast) and expose accessible text describing completion (e.g., “4 of 7 tasks complete”).
- **FR-008**: A command palette action MUST allow users to temporarily toggle the banner on/off without disabling the plugin entirely.

### Key Entities *(include if feature involves data)*

- **ProgressSnapshot**: Derived data structure containing total tasks, completed tasks, percentage, and a timestamp for when it was calculated; used to render the banner and to debounce updates.
- **ProgressPreferences**: Persisted settings object storing color, height, hide-when-complete toggle, and display position to ensure consistent UX across notes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For notes with at least one checkbox, the progress banner appears with accurate counts within 500 ms of opening the file on desktop and mobile.
- **SC-002**: Toggling a checkbox updates the displayed percentage within 200 ms in 95% of interactions measured over 20 consecutive toggles.
- **SC-003**: In user testing, 90% of participants report that the banner made it easier to judge note completion without scrolling, improving perceived productivity.
- **SC-004**: At least 80% of surveyed beta users customize at least one setting and report the new color/position persists after restarting Obsidian.

## Assumptions

- Only standard Markdown checkboxes should influence the progress percentage; other symbols or Kanban-specific syntax are out of scope for the initial release.
- The banner will appear directly under the note title by default and will not be draggable; alternative placements (e.g., sidebar) may be considered later.
- Performance targets assume notes smaller than 1 MB; extremely large files will be optimized separately if needed.
