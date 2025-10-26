import { Plugin } from "obsidian";
import { NoteWatcher } from "./src/state/note-watcher";
import { ProgressBanner } from "./src/ui/progress-banner";
import type { ProgressSnapshot } from "./src/types/progress";

export default class TodoProgressPlugin extends Plugin {
	private watcher: NoteWatcher | null = null;
	private banner: ProgressBanner | null = null;
	private latestSnapshot: ProgressSnapshot | null = null;
	private bannerEnabled = true;

	async onload(): Promise<void> {
		this.banner = new ProgressBanner(this.app);
		this.watcher = new NoteWatcher(this.app, (snapshot) => this.handleSnapshot(snapshot));
		this.watcher.start();

		this.addCommand({
			id: "toggle-todo-progress-banner",
			name: "Toggle todo progress bar",
			callback: () => this.toggleBanner(),
		});

		this.app.workspace.onLayoutReady(() => {
			this.watcher?.refresh();
		});
	}

	onunload(): void {
		this.watcher?.stop();
		this.banner?.destroy();
	}

	private handleSnapshot(snapshot: ProgressSnapshot | null): void {
		this.latestSnapshot = snapshot;

		if (!this.bannerEnabled || !this.banner) {
			this.banner?.hide();
			return;
		}

		if (snapshot) {
			this.banner.show(snapshot);
		} else {
			this.banner.hide();
		}
	}

	private toggleBanner(): void {
		this.bannerEnabled = !this.bannerEnabled;

		if (!this.bannerEnabled) {
			this.banner?.hide();
			return;
		}

		if (this.latestSnapshot) {
			this.banner?.show(this.latestSnapshot);
		} else {
			this.watcher?.refresh();
		}
	}
}
