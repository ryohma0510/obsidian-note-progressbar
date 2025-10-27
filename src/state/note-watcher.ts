import { MarkdownView } from "obsidian";
import type { App, EventRef, Events, TFile } from "obsidian";
import { snapshotFromCache } from "../progress/calculator";
import type { ProgressSnapshot, SnapshotCallback } from "../types/progress";

/**
 * Bridges Obsidian workspace events to the UI by emitting derived
 * {@link ProgressSnapshot} instances whenever the active note changes.
 *
 * Concrete event wiring is deferred to user stories; this scaffold provides
 * lifecycle management so `main.ts` can simply call `start()` / `stop()`.
 */
/**
 * Watches workspace + metadata events and emits derived snapshots for the active note.
 *
 * @param app - Obsidian application instance used to access workspace + metadata APIs.
 * @param onSnapshot - Callback fired whenever a new snapshot (or `null`) is available.
 */
export class NoteWatcher {
	private readonly app: App;
	private readonly onSnapshot: SnapshotCallback;
	/** Active event refs paired with their emitters for proper cleanup. */
	private eventRefs: Array<{ emitter: Events; ref: EventRef }> = [];
	/** Tracks the currently focused markdown file (null when none). */
	private activeFile: TFile | null = null;
	/** Indicates whether the watcher has started binding events. */
	private active = false;

	/**
	 * @param app - Obsidian application instance used to access workspace + metadata APIs.
	 * @param onSnapshot - Callback fired whenever a new snapshot (or `null`) is available.
	 */
	constructor(app: App, onSnapshot: SnapshotCallback) {
		this.app = app;
		this.onSnapshot = onSnapshot;
	}

	start(): void {
		if (this.active) return;
		this.active = true;
		this.bindWorkspaceEvents();
		this.setActiveFile(this.getActiveMarkdownFile());
	}

	stop(): void {
		if (!this.active) return;
		this.active = false;
		this.unbindWorkspaceEvents();
	}

	/**
	 * Helper for implementations to emit the latest snapshot (or `null` to hide the banner).
	 */
	/**
	 * @param snapshot - Latest derived snapshot for the active file or `null` when hidden.
	 */
	protected emit(snapshot: ProgressSnapshot | null): void {
		this.onSnapshot(snapshot);
	}

	refresh(): void {
		this.recalculate(this.activeFile);
	}

	protected bindWorkspaceEvents(): void {
		this.registerEvent(
			this.app.workspace,
			this.app.workspace.on("active-leaf-change", (leaf) => {
				const view = leaf?.view instanceof MarkdownView ? (leaf.view as MarkdownView) : null;
				this.setActiveFile(view?.file ?? null);
			}),
		);

		this.registerEvent(
			this.app.metadataCache,
			this.app.metadataCache.on("changed", (file) => {
				if (this.isActiveFile(file)) {
					this.recalculate(file);
				}
			}),
		);

		this.registerEvent(
			this.app.metadataCache,
			this.app.metadataCache.on("resolve", (file) => {
				if (this.isActiveFile(file)) {
					this.recalculate(file);
				}
			}),
		);
	}

	/**
	 * @param ref - Event reference returned by `this.app.workspace.on` or metadata hooks.
	 */
	protected registerEvent(emitter: Events, ref: EventRef | undefined): void {
		if (ref) {
			this.eventRefs.push({ emitter, ref });
		}
	}

	private unbindWorkspaceEvents(): void {
		this.eventRefs.forEach(({ emitter, ref }) => {
			emitter.offref(ref);
		});
		this.eventRefs = [];
	}

	/**
	 * @param file - Newly focused markdown file (or `null` when none).
	 */
	private setActiveFile(file: TFile | null): void {
		if (file?.path === this.activeFile?.path) {
			this.recalculate(file);
			return;
		}
		this.activeFile = file;
		this.recalculate(file);
	}

	/**
	 * @param file - File whose metadata should be parsed into a snapshot. `null` hides the banner.
	 */
	private recalculate(file: TFile | null): void {
		if (!file) {
			this.emit(null);
			return;
		}

		const cache = this.app.metadataCache.getFileCache(file) ?? null;
		const snapshot = snapshotFromCache(file, cache);
		this.emit(snapshot);
	}

	private getActiveMarkdownFile(): TFile | null {
		return this.app.workspace.getActiveViewOfType(MarkdownView)?.file ?? null;
	}

	/**
	 * @param file - Candidate file to compare against the internally tracked active file.
	 */
	private isActiveFile(file: TFile): boolean {
		return this.activeFile?.path === file.path;
	}
}
