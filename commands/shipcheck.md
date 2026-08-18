---
description: Review the notes CLI changes and back-fill test coverage — parallel review, then dependent test writing.
---

Run the notes-cli pre-commit workflow, end to end.

**Step 1 — parallel review.** Launch two `notes-reviewer` subagents at the same time, each scoped to a different, independent part of the codebase so they don't overlap:
- one reviewing `notes.js` (CLI entry point and argument dispatch)
- one reviewing `lib/store.js` and `lib/config.js` (the data layer)

Do not start Step 2 until both have returned their findings.

**Step 2 — dependent test coverage.** Once both reviews are back, combine their findings into one list. Then launch a single `notes-test-writer` subagent, passing it that combined list, and ask it to add or update regression tests in `tests/notes.test.js` specifically for any real bugs the reviewers surfaced (skip this if both reviewers reported nothing actionable). This step depends on Step 1's output and must not start earlier.

**Step 3 — report.** Summarize the outcome for the user in one pass: the reviewers' findings (grouped by file), what tests were added or changed, and the final `npm test` result. If nothing needed fixing, say so plainly.
