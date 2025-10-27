import type { App } from "obsidian";
import { ProgressBanner } from "../ui/progress-banner";
import type { ProgressSnapshot } from "../types/progress";
import { NoteWatcher } from "./note-watcher";

/**
 * Coordinates the state layer and UI components that render progress information.
 * Keeps `main.ts` focused on plugin lifecycle by owning the watcher, banner, and
 * snapshot handling logic.
 */
export class ProgressController {
	private readonly banner: ProgressBanner;
	private readonly watcher: NoteWatcher;
	private latestSnapshot: ProgressSnapshot | null = null;
	private bannerEnabled = true;

	constructor(app: App) {
		this.banner = new ProgressBanner(app);
		this.watcher = new NoteWatcher(app, (snapshot) => this.handleSnapshot(snapshot));
	}

	/**
	 * Binds workspace listeners and begins tracking the active note’s progress.
	 */
	start(): void {
		this.watcher.start();
	}

	/**
	 * Unregisters listeners and removes the banner from the workspace.
	 */
	stop(): void {
		this.watcher.stop();
		this.banner.destroy();
	}

	/**
	 * Forces an immediate recomputation of the current note’s progress.
	 */
	refresh(): void {
		this.watcher.refresh();
	}

	/**
	 * Toggles the banner visibility, requesting fresh data when re-enabled.
	 */
	toggleBanner(): void {
		this.bannerEnabled = !this.bannerEnabled;

		if (!this.bannerEnabled) {
			this.banner.hide();
			return;
		}

		if (this.latestSnapshot) {
			this.banner.show(this.latestSnapshot);
		} else {
			this.refresh();
		}
	}

	private handleSnapshot(snapshot: ProgressSnapshot | null): void {
		this.latestSnapshot = snapshot;

		if (!this.bannerEnabled) {
			this.banner.hide();
			return;
		}

		if (snapshot) {
			this.banner.show(snapshot);
		} else {
			this.banner.hide();
		}
	}
}
