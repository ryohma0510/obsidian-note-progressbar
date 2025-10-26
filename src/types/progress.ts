/**
 * Represents a markdown checkbox task extracted from the active note.
 * Calculations rely on Obsidian's metadata cache to produce these entries.
 */
export interface NoteTask {
	id: string;
	checked: boolean;
	line: number;
}

/**
 * Aggregate snapshot emitted whenever the active note contains at least one task.
 * `percentage` is expected to be clamped between 0 and 100.
 */
export interface ProgressSnapshot {
	total: number;
	completed: number;
	percentage: number;
	generatedAt: number;
}

/**
 * UI-friendly representation of the banner state derived from a snapshot
 * and user-toggle preference.
 */
export interface BannerState {
	visible: boolean;
	text: string;
	fillRatio: number;
	celebratory: boolean;
}

/**
 * Callback signature used by the state layer to notify observers (e.g., UI) of
 * a new snapshot or `null` when the banner should hide.
 */
export type SnapshotCallback = (snapshot: ProgressSnapshot | null) => void;
