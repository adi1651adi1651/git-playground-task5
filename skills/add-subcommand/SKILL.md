---
name: add-subcommand
description: Use when adding a new subcommand to notes.js (e.g. an `edit`, `tag`, or `export` command) or a new operation to lib/store.js. Walks through the existing argv-dispatch, whole-file JSON persistence, and test-coverage conventions so the new command fits the codebase instead of reinventing patterns.
---

# Adding a subcommand to notes-cli

This repo has one dispatch point and one data layer — new commands should slot into both without changing their shape.

## 1. Wire the dispatch in `notes.js`

`notes.js` parses `process.argv` and dispatches to `add` / `list` / `search` / `delete`. Add the new subcommand as another branch in that same dispatch, matching the existing style (argument validation, usage errors, printing results directly to stdout — no separate output-formatting layer).

## 2. Add the operation to `lib/store.js`

- Persistence is wholesale: `load()` reads the entire `notes.json`, `save()` writes it back whole. Don't introduce incremental/partial writes.
- If the new command needs a pure filter or transform (like `matches()` for search), keep it as a standalone exported function separate from the load/save I/O, specifically so it's unit-testable without touching the filesystem.

## 3. Cover it with tests

Add cases to `tests/notes.test.js` for any new pure function, following the existing pattern: build an in-memory notes array, call the function directly, assert on the result — never go through `notes.json` or the CLI process. The `notes-test-writer` subagent in this plugin follows the same rule and can be used for this step.

## 4. Update docs and verify

- Add the new command to the command list in `README.md`.
- Run `npm test` and confirm it's green before considering the command done.
