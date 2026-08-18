# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A tiny command-line notes tool used as the practice repo for a Git lesson on resolving merge conflicts. The repo ships with two branches, `feature-a` and `feature-b`, that each changed the same line differently on purpose — merging them conflicts by design, and the exercise is to resolve that conflict so both changes survive rather than letting one side get silently dropped.

## Commands

- `npm test` — run the test suite (Node's built-in test runner, `node --test`)
- `node --test tests/notes.test.js` — run a single test file
- `node notes.js add <text>` — add a note
- `node notes.js list` — list all notes
- `node notes.js search <term>` — list notes containing a term
- `node notes.js delete <id>` — delete a note

CI (`.github/workflows/ci.yml`) runs `npm test` on every pull request via Node 22.

## Architecture

- `notes.js` — CLI entry point; parses `process.argv` and dispatches to `add` / `list` / `search` / `delete` subcommands, printing results directly to stdout.
- `lib/store.js` — data layer. Notes persist to a JSON file (`notes.json`, gitignored) at the repo root, read/written wholesale on every operation (`load()`/`save()`, no incremental writes). Exports `matches(notes, term)` as a pure filter function separate from `search()` specifically so it's unit-testable without touching the filesystem.
- `lib/config.js` — static settings module (e.g. `SESSION_TIMEOUT_MINUTES`).
- `tests/notes.test.js` — exercises `store.matches` directly against an in-memory notes array, avoiding filesystem I/O.

## Working in this repo

This is a teaching sandbox, not a product codebase — when asked to resolve the `feature-a`/`feature-b` merge conflict, preserve the intent of both branches' changes to the conflicting line rather than picking one side.
