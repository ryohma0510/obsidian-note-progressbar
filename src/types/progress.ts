/**
 * Represents a markdown checkbox task extracted from the active note.
 * Calculations rely on Obsidian's metadata cache to produce these entries.
 *
 * @property id - Unique identifier derived from the file path + line number.
 * @property checked - Whether the checkbox is marked complete.
 * @property line - Zero-based line index within the source file.
 */
export interface NoteTask {
	id: string;
	checked: boolean;
	line: number;
}

/**
 * Aggregate snapshot emitted whenever the active note contains at least one task.
 * `percentage` is expected to be clamped between 0 and 100.
 *
 * @property total - Count of checkbox tasks discovered in the note.
 * @property completed - Subset of `total` that are marked complete.
 * @property percentage - Rounded completion percentage (0–100).
 * @property generatedAt - Epoch milliseconds when the snapshot was produced (consumers
 * use this to detect stale data or throttle UI refreshes).
 */
export interface ProgressSnapshot {
	total: number;
	completed: number;
	percentage: number;
	generatedAt: number;
}

/**
 * Callback signature used by the state layer to notify observers (e.g., UI) of
 * a new snapshot or `null` when the bar should hide.
 *
 * @param snapshot - Latest {@link ProgressSnapshot} for the active file, or `null`
 * when there are no tasks and the bar should be hidden.
 */
export type SnapshotCallback = (snapshot: ProgressSnapshot | null) => void;
