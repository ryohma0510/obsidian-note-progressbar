# Developer Guide

This plugin is built with TypeScript, bundled by esbuild, and shipped as a single `main.js` file for Obsidian. Use this guide when you need to work on the codebase, run checks locally, or cut a release.

## Prerequisites

- Node.js 18 or newer (matches Obsidian’s recommendations).
- [pnpm](https://pnpm.io/) for dependency management.
- An Obsidian vault for manual testing.

Install dependencies once by running `pnpm install` from the project root.

## Project layout

- `main.ts` — minimal plugin entry point that wires the controller into Obsidian.
- `src/state` — manages workspace listeners and derived progress snapshots (`ProgressController`, `NoteWatcher`).
- `src/progress` — parsing logic that turns metadata cache results into progress snapshots.
- `src/ui` — DOM renderer for the progress bar.
- `src/types` — shared TypeScript types.
- `tests` / `specs` — Vitest suites and higher-level scenarios.
- `esbuild.config.mjs` — bundler configuration used by the dev and build scripts.

## Scripts

```bash
pnpm run dev         # Incremental build; watches and writes main.js.
pnpm run build       # Type-checks then produces production main.js.
pnpm run lint        # ESLint across main.ts, src/, and tests/.
pnpm run format      # Prettier auto-formatting (use format:check for CI).
pnpm test            # Vitest unit + scenario suites (passWithNoTests enabled).
pnpm version         # Helper for bumping manifest + versions.json (requires clean git state).
```

## Development workflow

1. Start the watcher with `pnpm run dev` so `main.js` stays in sync.
2. Symlink or copy the repository to `<vault>/.obsidian/plugins/note-progressbar/`.
3. Reload Obsidian and enable **Note Progressbar** under **Settings → Community plugins**.
4. Toggle the **Toggle todo progress bar** command or adjust tasks in a note to verify changes.

## Testing and linting

- Unit logic around snapshot calculation lives in `src/progress/calculator.test.ts`.
- Scenario tests under `tests/` rely on Vitest. Add new suites alongside existing ones.
- Run `pnpm run lint` before opening pull requests to catch TypeScript or style issues.
- Formatting is handled by Prettier; run `pnpm run format` or use `format:check` in CI.

## Coding conventions

- Keep `main.ts` limited to lifecycle hooks; push logic into the `src/` modules.
- Use the provided controllers/watchers to manage Obsidian event lifecycles.
- Register cleanup with `registerEvent`, `registerInterval`, etc., to avoid leaks.
- Target browser-safe APIs so the plugin remains mobile compatible.

## Release checklist

1. Update `manifest.json` and `versions.json` with the new version (SemVer).
2. Run `pnpm run build` to produce the release `main.js`.
3. Verify the bundle in Obsidian.
4. Draft a GitHub release whose tag matches the version (no leading `v`).
5. Upload `manifest.json`, `main.js`, and `styles.css` (if present) as release assets.
