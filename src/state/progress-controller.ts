import type { App } from "obsidian";
import { ProgressBar } from "../ui/progress-bar";
import type { ProgressSnapshot } from "../types/progress";
import { NoteWatcher } from "./note-watcher";

/**
 * Coordinates the state layer and UI components that render progress information.
 * Keeps `main.ts` focused on plugin lifecycle by owning the watcher, progress bar, and
 * snapshot handling logic.
 */
export class ProgressController {
	private readonly bar: ProgressBar;
	private readonly watcher: NoteWatcher;
	private latestSnapshot: ProgressSnapshot | null = null;
	private barEnabled = true;

	constructor(app: App) {
		this.bar = new ProgressBar(app);
		this.watcher = new NoteWatcher(app, (snapshot) => this.handleSnapshot(snapshot));
	}

	/**
	 * Binds workspace listeners and begins tracking the active note’s progress.
	 */
	start(): void {
		this.watcher.start();
	}

	/**
	 * Unregisters listeners and removes the progress bar from the workspace.
	 */
	stop(): void {
		this.watcher.stop();
		this.bar.destroy();
	}

	/**
	 * Forces an immediate recomputation of the current note’s progress.
	 */
	refresh(): void {
		this.watcher.refresh();
	}

	/**
	 * Toggles the progress bar visibility, requesting fresh data when re-enabled.
	 */
	toggleBar(): void {
		this.barEnabled = !this.barEnabled;

		if (!this.barEnabled) {
			this.bar.hide();
			return;
		}

		if (this.latestSnapshot) {
			this.bar.show(this.latestSnapshot);
		} else {
			this.refresh();
		}
	}

	private handleSnapshot(snapshot: ProgressSnapshot | null): void {
		this.latestSnapshot = snapshot;

		if (!this.barEnabled) {
			this.bar.hide();
			return;
		}

		if (snapshot) {
			this.bar.show(snapshot);
		} else {
			this.bar.hide();
		}
	}
}
