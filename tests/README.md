# Tests

## Running the suite

- `pnpm test` – executes all unit and scenario tests once via Vitest + jsdom.
- `pnpm test -- --watch` – re-runs the suite on file changes during development.

## Layout

- Source-level and unit specs live beside their implementation files (for example, `src/progress/calculator.test.ts` sits next to `calculator.ts`). Keeping them co-located makes it easier to evolve modules and tests together.
- Scenario or higher-level behavioral specs continue to live under `tests/scenario/`, since they typically span multiple modules or mock workspace state.

Name tests with the `*.test.ts` or `*.spec.ts` suffix so Vitest loads them automatically (see `vitest.config.ts` for the globs that are watched).
