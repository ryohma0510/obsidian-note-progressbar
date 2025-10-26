import { describe, it, expect } from "vitest";
import type { NoteTask } from "../../src/types/progress";
import { calculateProgressSnapshot } from "../../src/progress/calculator";

const task = (id: string, checked: boolean, line = 0): NoteTask => ({
	id,
	checked,
	line,
});

describe("calculateProgressSnapshot", () => {
	it("returns counts and percentage for mixed tasks", () => {
		const snapshot = calculateProgressSnapshot([
			task("a", true),
			task("b", false),
			task("c", true),
			task("d", false),
		]);

		expect(snapshot).toMatchObject({
			total: 4,
			completed: 2,
			percentage: 50,
		});
	});

	it("flattens nested tasks by treating all entries equally", () => {
		const snapshot = calculateProgressSnapshot([
			task("parent", true, 0),
			task("child-1", false, 1),
			task("child-2", true, 2),
		]);

		expect(snapshot).toMatchObject({
			total: 3,
			completed: 2,
			percentage: 67,
		});
	});

	it("returns null when there are no tasks", () => {
		const snapshot = calculateProgressSnapshot([]);
		expect(snapshot).toBeNull();
	});

	it("rounds percentage to nearest whole number and clamps to 100", () => {
		const snapshot = calculateProgressSnapshot([
			task("a", true),
			task("b", true),
		]);

		expect(snapshot).toMatchObject({
			total: 2,
			completed: 2,
			percentage: 100,
		});
	});
});
