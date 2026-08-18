# Unit 4 Git playground — Lesson 5

A tiny command-line notes tool, used as the practice repo for Unit 4, Lesson 5 (merge conflicts). This repo has two branches, `feature-a` and `feature-b`, that changed the same line in different ways. Merging them creates a conflict on purpose — your job is to have Claude resolve it so both changes survive.

### The app
- `node notes.js add <text>` — add a note
- `node notes.js list` — list all notes
- `node notes.js search <term>` — list notes containing a term
- `node notes.js delete <id>` — delete a note

Layout: `notes.js` is the entry point, `lib/store.js` loads, saves, and searches notes, `lib/config.js` holds settings, and `tests/` holds the test suite (`npm test`).

### Set up
1. Make sure you have your own copy of this repo (created from the lesson on the platform).
2. Clone it locally and open Claude Code in the folder.
3. Ensure that you have copied all the branches. If not, additionally, copy `feature-a` and `feature-b`.

### Lesson 5 task — resolve a merge conflict
Goal: merge two branches that touched the same line, and have Claude resolve the conflict so both changes survive — not just one.

1. **Check the branches are there.** Run `git branch -a` — you should see `feature-a` and `feature-b`. They came with your copy.
2. **Start the merge.** Get onto `feature-a` and ask Claude: *"Merge `feature-b` into `feature-a`."* You'll hit a conflict — that's expected.
3. **Have Claude resolve it.** Ask: *"Resolve the conflict, keeping what both branches were trying to do."*
4. **Review the result.** Does the merged line keep *both* changes — what `feature-a` did and what `feature-b` did — or did one side get dropped? A merge can build and run fine and still have quietly thrown away half the work.
5. **Commit the merge and push `feature-a`.**
6. **Open a pull request from `feature-a` into `main`.** Ask Claude: *"Open a pull request for `feature-a` into `main`."* Then submit the pull request link.

## notes-ops plugin

This repo also hosts a Claude Code plugin, `notes-ops` — subagents, a multi-agent workflow command, a skill, and a hook for working with the notes CLI above.

- `.claude-plugin/plugin.json` — plugin manifest (name, version).
- `agents/` — scoped subagents, each limited to the tools and model its job needs.
- `commands/` — the multi-agent workflow command that orchestrates the subagents (parallel + dependent steps).
- `skills/` — supporting skill.
- `hooks/` — supporting hook.

Status: scaffold only — components are added in later tasks.
