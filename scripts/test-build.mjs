import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REQUIRED_OUTPUTS = [
  "dist/.nojekyll",
  "dist/assets/search/docs-search.json",
  "dist/index.html",
  "dist/docs/cli-security-and-configuration/index.html",
];
const REQUIRED_SITE_PATHS = [
  "docs/",
  "docs/getting-started/",
  "docs/manifest-reference/",
  "docs/rules-and-targets/",
  "docs/templating-and-standard-library/",
  "docs/cli-security-and-configuration/",
];

async function main() {
  for (const relativePath of REQUIRED_OUTPUTS) {
    const absolutePath = path.join(ROOT, relativePath);

    try {
      const fileStat = await stat(absolutePath);

      if (!fileStat.isFile()) {
        throw new Error("not a file");
      }
    } catch (error) {
      console.error(`Missing required build output: ${relativePath}`);
      process.exitCode = 1;
      return;
    }
  }

  const searchIndexPath = path.join(
    ROOT,
    "dist/assets/search/docs-search.json",
  );
  const searchIndex = JSON.parse(await readFile(searchIndexPath, "utf8"));

  if (typeof searchIndex.generatedAt !== "string" || searchIndex.generatedAt.length === 0) {
    console.error("Search index is missing generatedAt.");
    process.exitCode = 1;
    return;
  }

  if (typeof searchIndex.index !== "string" || searchIndex.index.length === 0) {
    console.error("Search index payload is missing.");
    process.exitCode = 1;
    return;
  }

  const parsedIndex = JSON.parse(searchIndex.index);
  const indexedPaths = new Set(Object.values(parsedIndex.documentIds ?? {}));

  for (const requiredSitePath of REQUIRED_SITE_PATHS) {
    if (!indexedPaths.has(requiredSitePath)) {
      console.error(`Search index is missing document: ${requiredSitePath}`);
      process.exitCode = 1;
      return;
    }
  }

  console.log("Build smoke test passed.");
}

await main();
