# Todo Progress Banner

An Obsidian plugin that displays a lightweight progress banner above the current note, showing how many Markdown checkboxes are complete and updating live as you toggle tasks.

## Features

- Scans the active note for standard `- [ ]` / `- [x]` tasks using Obsidian’s metadata cache.
- Renders a theme-aware banner just above the note content with totals, percentage, and a fill bar.
- Updates automatically when you check/uncheck tasks or switch notes.
- Command palette action **Toggle todo progress bar** to quickly show/hide the banner per vault.

## Developing

```bash
pnpm install         # install dependencies
pnpm run dev         # watch & bundle to main.js
pnpm run build       # type-check + production bundle
pnpm run lint        # run ESLint on TypeScript sources
pnpm test            # run Vitest (unit & scenario suites)
```

Development workflow:
1. `pnpm run dev` keeps `main.js` up to date in the repo root.
2. Symlink or copy the repo to `<Vault>/.obsidian/plugins/obsidian-progressbar/`.
3. Reload Obsidian and enable the plugin under **Settings → Community plugins**.

## Usage

1. Open any note that contains Markdown checkboxes.  
   The banner appears above the note body showing `completed of total tasks complete (xx%)`.
2. Toggle checkboxes while the note is open.  
   The counts, percentage text, and fill bar update in under 200 ms.
3. Run the `Toggle todo progress bar` command (or set a hotkey) to hide/show the banner without disabling the plugin.
4. Notes without tasks keep the layout untouched—the banner hides automatically until tasks exist.

## Release checklist

1. Update `manifest.json` + `versions.json` with the new version.
2. `pnpm run build` to produce the final `main.js`.
3. Upload `manifest.json`, `main.js`, and `styles.css` as assets on the GitHub release matching the version string (no leading `v`).

## Troubleshooting

- **Banner missing?** Ensure the active pane is a Markdown note and contains at least one checkbox task Obsidian can parse.
- **Stuck counts?** Run the toggle command twice to reset, or switch away and back to the note to trigger a recalculation.
- **Styling issues?** The banner inherits theme variables (`--text-normal`, `--interactive-accent`). Verify your theme exposes those tokens.
