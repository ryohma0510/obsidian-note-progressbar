# Research – Todo Progress Banner MVP

## Tasks Dispatched
- Research testing stack options for validating progress calculations and DOM updates in an Obsidian plugin context.
- Find best practices for using the Obsidian API to inject UI into the workspace without breaking themes.
- Find best practices for esbuild bundling in Obsidian plugins to keep `main.js` small and dependency-free.
- Research patterns for listening to workspace events and editor changes to keep progress indicators synced.

## Findings

### Decision: Adopt Vitest + jsdom for automated tests
- **Rationale**: Vitest works naturally with TypeScript, mirrors Vite tooling (compatible with esbuild output), and bundles jsdom support for DOM-level assertions. It runs via `pnpm test`, satisfying the constitution gate, and can execute purely in Node without launching Obsidian, keeping CI fast.
- **Alternatives considered**:
  - Jest: heavier config, slower startup, and redundant with Vitest’s TS support.
  - Playwright end-to-end: unnecessary for MVP since behavior can be simulated through mocked workspace events.

### Decision: Use Obsidian `Workspace.on('active-leaf-change')` + metadata cache parsing for live updates
- **Rationale**: The workspace event fires whenever the focused file changes, ensuring we recalc for the correct note, while metadata cache exposes parsed list items so we avoid parsing raw Markdown ourselves. Supplement with `this.registerEvent` so listeners clean up on unload.
- **Alternatives considered**:
  - Manual DOM mutation observers: brittle across Obsidian versions.
  - Polling the editor contents: wastes CPU and risks lag on mobile.

### Decision: esbuild single-bundle with tree-shaken modules
- **Rationale**: Continue using the existing `esbuild.config.mjs` but ensure new modules are ESM-friendly and avoid importing Node-only APIs, so the final `main.js` stays <50 KB. Tree-shaking keeps unused helper code out of the release artifact.
- **Alternatives considered**:
  - Rollup: would require retooling scripts without clear benefit.
  - Webpack: heavier config not justified for this small plugin.

### Decision: Workspace event bridge (`note-watcher.ts`) publishes `ProgressSnapshot`
- **Rationale**: Encapsulating workspace/editor listeners in a dedicated module makes it easy to stub during testing and keeps `main.ts` minimal. The module emits snapshots via a callback so the UI renderer doesn’t need to know about Obsidian internals.
- **Alternatives considered**:
  - Direct coupling between `main.ts` and calculator: harder to test and violates the constitution’s code-quality gate.
  - Global event bus: overkill for MVP.

### Decision: DOM banner rendered with theme-aware classes only
- **Rationale**: By using Obsidian’s existing CSS variables (e.g., `--text-muted`, `--interactive-accent`) and avoiding inline colors, we maintain compatibility across themes without offering user customization yet.
- **Alternatives considered**:
  - Injecting custom stylesheets: increases maintenance burden and can conflict with user themes.
  - Hard-coded colors: break dark/light support and accessibility.
