import { Component, MarkdownView } from "obsidian";
import type { App, TFile } from "obsidian";
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
export class NoteWatcher extends Component {
	private readonly app: App;
	private readonly onSnapshot: SnapshotCallback;
	/** Tracks the currently focused markdown file (null when none). */
	private activeFile: TFile | null = null;

	/**
	 * @param app - Obsidian application instance used to access workspace + metadata APIs.
	 * @param onSnapshot - Callback fired whenever a new snapshot (or `null`) is available.
	 */
	constructor(app: App, onSnapshot: SnapshotCallback) {
		super();
		this.app = app;
		this.onSnapshot = onSnapshot;
	}

	onload(): void {
		this.bindWorkspaceEvents();
		this.setActiveFile(this.getActiveMarkdownFile());
	}

	start(): void {
		this.load();
	}

	stop(): void {
		this.unload();
	}

	/**
	 * Helper for implementations to emit the latest snapshot (or `null` to hide the bar).
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
			this.app.workspace.on("active-leaf-change", (leaf) => {
				const view = leaf?.view instanceof MarkdownView ? (leaf.view as MarkdownView) : null;
				this.setActiveFile(view?.file ?? null);
			}),
		);

		this.registerEvent(
			this.app.metadataCache.on("changed", (file) => {
				this.handleMetadataUpdate(file);
			}),
		);

		this.registerEvent(
			this.app.metadataCache.on("resolve", (file) => {
				this.handleMetadataUpdate(file);
			}),
		);
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
	 * @param file - File whose metadata should be parsed into a snapshot. `null` hides the bar.
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

	private handleMetadataUpdate(file: TFile): void {
		if (this.isActiveFile(file)) {
			this.recalculate(file);
		}
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
