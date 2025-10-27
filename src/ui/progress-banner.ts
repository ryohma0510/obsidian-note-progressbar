import { MarkdownView } from "obsidian";
import type { App } from "obsidian";
import type { ProgressSnapshot } from "../types/progress";

export class ProgressBanner {
	/** App instance for locating active views and DOM containers. */
	private readonly app: App;
	/** Root wrapper representing the entire banner DOM subtree. */
	private readonly root: HTMLDivElement;
	/** Span element rendering "X of Y tasks complete". */
	private readonly summaryText: HTMLSpanElement;
	/** Span element rendering the percentage text (e.g., "60%"). */
	private readonly percentageText: HTMLSpanElement;
	/** Native progress element that visualizes completion. */
	private readonly progressEl: HTMLProgressElement;

	/**
	 * @param app - Obsidian application instance for locating the active Markdown view.
	 */
	constructor(app: App) {
		this.app = app;
		this.root = this.createRoot();
		const summary = this.root.querySelector(".todo-progress-banner__summary") as HTMLDivElement;
		this.summaryText = summary.querySelector(".todo-progress-banner__summary-text") as HTMLSpanElement;
		this.percentageText = summary.querySelector(
			".todo-progress-banner__summary-percentage",
		) as HTMLSpanElement;
		this.progressEl = this.root.querySelector(
			".todo-progress-banner__progress",
		) as HTMLProgressElement;
	}

	/**
	 * @param snapshot - Latest progress data to render inside the banner.
	 */
	show(snapshot: ProgressSnapshot): void {
		if (!this.ensureMounted()) return;

		this.summaryText.setText(`${snapshot.completed} of ${snapshot.total} tasks complete`);
		this.percentageText.setText(`${snapshot.percentage}%`);
		this.progressEl.value = snapshot.percentage;
		this.progressEl.title = `${snapshot.percentage}%`;
		this.root.setAttr("aria-label", this.summaryText.textContent ?? "");
	}

	hide(): void {
		if (this.root.parentElement) {
			this.root.parentElement.removeChild(this.root);
		}
	}

	destroy(): void {
		this.hide();
	}

	/**
	 * @returns `true` if the banner is mounted under the active view; `false` otherwise.
	 */
	private ensureMounted(): boolean {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			this.hide();
			return false;
		}

		const container =
			(view.containerEl.querySelector(".inline-title") as HTMLElement | null) ?? view.contentEl;

		if (!container) return false;

		// check already inserted
		if (this.root.parentElement !== container) {
			container.insertAdjacentElement("afterend", this.root);
		}

		return true;
	}

	/**
	 * @returns A detached DOM tree representing the banner; callers must mount it.
	 *
	 * Example structure:
	 * ```html
	 * <div class="todo-progress-banner" role="status" aria-live="polite">
	 *   <div class="todo-progress-banner__summary">
	 *     <span class="todo-progress-banner__summary-text">2 of 5 tasks complete</span>
	 *     <span class="todo-progress-banner__summary-percentage">40%</span>
	 *   </div>
	 *   <progress class="todo-progress-banner__progress" value="40" max="100"></progress>
	 * </div>
	 * ```
	 */
	private createRoot(): HTMLDivElement {
		const root = document.createElement("div");
		root.className = "todo-progress-banner";
		root.setAttr("role", "status");
		root.setAttr("aria-live", "polite");

		const summary = root.createDiv({ cls: "todo-progress-banner__summary" });
		summary
			.createSpan({ cls: "todo-progress-banner__summary-text" })
			.setText("Tracking tasks…");
		summary
			.createSpan({ cls: "todo-progress-banner__summary-percentage" })
			.setText("0%");

		const progress = root.createEl("progress", {
			cls: "todo-progress-banner__progress",
		}) as HTMLProgressElement;
		progress.max = 100;
		progress.value = 0;

		return root;
	}
}
