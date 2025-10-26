import type { App, EventRef } from "obsidian";
import type { ProgressSnapshot, SnapshotCallback } from "../types/progress";

/**
 * Bridges Obsidian workspace events to the UI by emitting derived
 * {@link ProgressSnapshot} instances whenever the active note changes.
 *
 * Concrete event wiring is deferred to user stories; this scaffold provides
 * lifecycle management so `main.ts` can simply call `start()` / `stop()`.
 */
export class NoteWatcher {
	private readonly app: App;
	private readonly onSnapshot: SnapshotCallback;
	private eventRefs: EventRef[] = [];
	private active = false;

	constructor(app: App, onSnapshot: SnapshotCallback) {
		this.app = app;
		this.onSnapshot = onSnapshot;
	}

	start(): void {
		if (this.active) return;
		this.active = true;
		this.bindWorkspaceEvents();
	}

	stop(): void {
		if (!this.active) return;
		this.active = false;
		this.unbindWorkspaceEvents();
	}

	/**
	 * Helper for implementations to emit the latest snapshot (or `null` to hide the banner).
	 */
	protected emit(snapshot: ProgressSnapshot | null): void {
		this.onSnapshot(snapshot);
	}

		/**
		 * Hooks for registering workspace/vault event listeners once the feature logic lands.
		 */
		protected bindWorkspaceEvents(): void {
			// Implementation provided in user-story tasks.
		}

	protected registerEvent(ref: EventRef | undefined): void {
		if (ref) {
			this.eventRefs.push(ref);
		}
	}

	private unbindWorkspaceEvents(): void {
		this.eventRefs.forEach((ref) => {
			this.app.workspace.offref(ref);
		});
		this.eventRefs = [];
	}
}
