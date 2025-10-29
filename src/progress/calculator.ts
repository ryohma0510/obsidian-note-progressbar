import type { CachedMetadata, ListItemCache, TFile } from "obsidian";
import type { NoteTask, ProgressSnapshot } from "../types/progress";

/**
 * Derives a {@link ProgressSnapshot} from the supplied tasks.
 * Returns `null` when no checkbox tasks exist so the bar can hide.
 *
 * @param tasks - Flat list of checkbox entries detected within a note.
 * @param timestamp - Epoch milliseconds indicating when the snapshot was generated.
 */
export function calculateProgressSnapshot(
	tasks: NoteTask[],
	timestamp = Date.now(),
): ProgressSnapshot | null {
	const total = tasks.length;
	if (total === 0) {
		return null;
	}

	const completed = tasks.reduce((count, task) => count + (task.checked ? 1 : 0), 0);
	const percentage = clampPercentage(Math.round((completed / total) * 100));

	return {
		total,
		completed,
		percentage,
		generatedAt: timestamp,
	};
}

/**
 * Convenience helper that converts metadata cache list items into a snapshot.
 *
 * @param file - The Obsidian file the list items belong to.
 * @param cache - Cached metadata for the file (may be undefined if not ready).
 * @param timestamp - Epoch milliseconds used for {@link ProgressSnapshot.generatedAt}.
 */
export function snapshotFromCache(
	file: TFile,
	cache: CachedMetadata | null | undefined,
	timestamp = Date.now(),
): ProgressSnapshot | null {
	const tasks = listItemsToTasks(file, cache?.listItems ?? []);
	return calculateProgressSnapshot(tasks, timestamp);
}

/**
 * Maps Obsidian list item cache entries to {@link NoteTask} records.
 *
 * @param file - The source file used to build stable task IDs.
 * @param listItems - Parsed list item metadata (one entry per checkbox or list row).
 */
export function listItemsToTasks(file: TFile, listItems: ListItemCache[]): NoteTask[] {
	if (!listItems?.length) return [];

	return listItems
		.filter((item) => item.task !== undefined)
		.map((item) => ({
			id: `${file.path}:${item.position.start.line}`,
			checked: Boolean(item.task && item.task.toLowerCase() === "x"),
			line: item.position.start.line,
		}));
}

const clampPercentage = (value: number): number => {
	if (value < 0) return 0;
	if (value > 100) return 100;
	return value;
};
