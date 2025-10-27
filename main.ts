import { Plugin } from "obsidian";
import { ProgressController } from "./src/state/progress-controller";

export default class TodoProgressPlugin extends Plugin {
	private controller: ProgressController | null = null;

	async onload(): Promise<void> {
		this.controller = new ProgressController(this.app);
		this.controller.start();

		this.addCommand({
			id: "toggle-todo-progress-banner",
			name: "Toggle todo progress bar",
			callback: () => this.controller?.toggleBanner(),
		});

		this.app.workspace.onLayoutReady(() => {
			this.controller?.refresh();
		});
	}

	onunload(): void {
		this.controller?.stop();
		this.controller = null;
	}
}
