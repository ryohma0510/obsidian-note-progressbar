# Tests

## Running the suite

- `pnpm test` – executes all unit and scenario tests once via Vitest + jsdom.
- `pnpm test -- --watch` – re-runs the suite on file changes during development.

## Directory layout

- `tests/unit/` – logic-level tests (e.g., progress calculator, data transforms).
- `tests/scenario/` – behavior scenarios simulating workspace or UI flows.

Add new specs under the appropriate folder using the `*.test.ts` or `*.spec.ts` suffix so Vitest picks them up via `vitest.config.ts`.
