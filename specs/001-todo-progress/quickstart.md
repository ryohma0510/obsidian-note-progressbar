# Quickstart – Todo Progress Bar MVP

## 1. Install dependencies
```bash
pnpm install
```

## 2. Run the dev watcher (hot builds into `main.js`)
```bash
pnpm run dev
```
The watcher bundles `src/**` via esbuild and writes `main.js` at the project root for Obsidian to load.

## 3. Execute automated tests
```bash
pnpm test
```
This runs Vitest with jsdom to cover the progress calculator and workspace scenario simulations.

## 4. Link into a vault for manual validation
1. Copy `main.js`, `manifest.json`, and `styles.css` (if present) into `<Vault>/.obsidian/plugins/sample-plugin/`.
2. Reload Obsidian, enable **Sample Plugin**, and open any note containing checkboxes.
3. Confirm the bar appears above the note title and live-updates as you toggle tasks.

## 5. Release checklist (when ready)
- Bump `manifest.json` + `versions.json` using `pnpm version <level>`.
- Run `pnpm run build` for a production bundle.
- Attach `main.js`, `manifest.json`, `styles.css` to the GitHub release tagged with the same version string.
