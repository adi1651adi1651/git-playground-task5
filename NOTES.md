# notes-ops plugin — notes

## What it does

`notes-ops` bundles tooling for working on this repo's notes CLI (`notes.js` + `lib/store.js` + `lib/config.js`):

- **Subagents** (`agents/`): `notes-reviewer` (read-only correctness/style review) and `notes-test-writer` (adds/updates unit tests and runs `npm test`).
- **Workflow command** (`commands/shipcheck.md`): `/notes-ops:shipcheck` runs both subagents as a pre-commit check.
- **Skill** (`skills/add-subcommand/`): a checklist for adding a new `notes.js` subcommand consistently.
- **Hook** (`hooks/hooks.json`): after any Edit/Write to `notes.js` or `lib/`, runs `npm test` automatically and surfaces failures.

## Install

Local, for development on this repo:

```
claude --plugin-dir .
```

As a marketplace, from anywhere:

```
/plugin marketplace add adi1651adi1651/git-playground-task5
/plugin install notes-ops@git-playground-task5
```

Use `/reload-plugins` to pick up edits to the plugin without restarting the session.

## Scoping decision: why the two subagents differ

`notes-reviewer` gets `tools: Read, Grep, Glob` and `model: sonnet`. It never edits anything, so it doesn't get `Edit`/`Write`/`Bash` — there's no legitimate reason for a review step to be able to change the code it's reviewing, and narrowing the tool list is what actually enforces that (not just the prompt saying "don't edit"). It gets the stronger model because judging whether a merge dropped one side's intent, or whether a change is a real bug versus a style nit, needs real reasoning, not pattern matching.

`notes-test-writer` gets `tools: Read, Grep, Glob, Edit, Write, Bash` and `model: haiku`. It needs to write files and run `npm test` to verify its own output, so it needs the broader tool set. It runs on the cheaper/faster model because its job is narrow and mechanical: follow the one existing test pattern in `tests/notes.test.js` (in-memory array, pure `matches()` calls, no filesystem) and add cases for it. There's little ambiguity to reason through, so the extra reasoning budget of a bigger model isn't buying anything — it would just be slower and pricier for the same output.

## Why `/shipcheck` parallelizes one step and serializes the other

Step 1 launches two `notes-reviewer` instances at once — one scoped to `notes.js`, one to `lib/store.js` + `lib/config.js`. These reviews don't depend on each other's output and touch disjoint files, so running them in parallel is pure time savings with no risk of one clobbering the other's context.

Step 2 (`notes-test-writer`) has to run after, not alongside, Step 1: it's told to write regression tests specifically for whatever bugs the reviewers found, so it literally cannot start until it has that combined findings list as input. Running it in parallel with the reviews would mean it has nothing to act on yet — the dependency is real, not just a convenient ordering.
