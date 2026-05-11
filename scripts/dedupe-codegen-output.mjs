import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const targetFile = path.join(workspaceRoot, "lib", "optimizely", "types", "generated.ts");

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function writeText(p, text) {
  fs.writeFileSync(p, text, "utf8");
}

function dedupeExportedTypeBlocks(source) {
  // Removes duplicate `export type <Name> = { ... };` blocks by name, keeping the first.
  // This specifically targets the pattern GraphQL Codegen emits for field-arg types (e.g. `FooArgs`).
  const seen = new Set();
  const out = [];

  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^export type ([A-Za-z0-9_]+) = \{$/);
    if (!m) {
      out.push(line);
      continue;
    }

    const typeName = m[1];
    // Capture from `export type ... = {` through the closing `};`
    let j = i;
    while (j < lines.length && lines[j] !== "};") j++;
    if (j >= lines.length) {
      // Malformed/unexpected; don't try to be clever.
      out.push(line);
      continue;
    }

    const block = lines.slice(i, j + 1);
    if (seen.has(typeName)) {
      // Drop it, also drop any immediately following blank lines to avoid accumulating whitespace.
      i = j;
      while (i + 1 < lines.length && lines[i + 1].trim() === "") i++;
      continue;
    }

    seen.add(typeName);
    out.push(...block);
    i = j;
  }

  return out.join("\n");
}

const before = readText(targetFile);
const after = dedupeExportedTypeBlocks(before);

if (after !== before) {
  writeText(targetFile, after);
  // eslint-disable-next-line no-console
  console.log(`[dedupe-codegen-output] Removed duplicate exported type blocks in ${path.relative(workspaceRoot, targetFile)}`);
}
