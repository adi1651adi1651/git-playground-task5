#!/usr/bin/env node
// PostToolUse hook: after an Edit/Write touches notes.js or lib/, run the
// suite immediately so a regression surfaces before it's committed.

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let input = {};
  try {
    input = JSON.parse(raw || "{}");
  } catch {
    process.exit(0);
  }

  const filePath = (input.tool_input && input.tool_input.file_path) || "";
  const touchesNotesCode = /(^|[\\/])notes\.js$/.test(filePath) || /[\\/]lib[\\/]/.test(filePath);
  if (!touchesNotesCode) process.exit(0);

  const { execSync } = require("child_process");
  const cwd = input.cwd || process.cwd();

  try {
    execSync("npm test", { cwd, encoding: "utf8", stdio: "pipe" });
    console.log(`[notes-ops] npm test passed after edit to ${filePath}`);
    process.exit(0);
  } catch (err) {
    const output = (err.stdout || "") + (err.stderr || "");
    console.error(`[notes-ops] npm test FAILED after edit to ${filePath}:\n${output}`);
    process.exit(2);
  }
});
