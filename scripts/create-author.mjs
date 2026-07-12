#!/usr/bin/env node
/**
 * Interactive scaffold for creating or updating an author.
 *
 * Creates/updates:
 * - src/content/authors/<slug>.yml
 *
 * Usage:
 *   npm run create:author
 *   node scripts/create-author.mjs
 */
import { readdir, readFile, mkdir, writeFile, stat } from "node:fs/promises";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import { load as loadYaml, dump as dumpYaml } from "js-yaml";

const AUTHORS_DIR = "src/content/authors";

const LINK_FIELDS = [
  "github",
  "gitlab",
  "linkedin",
  "x",
  "bluesky",
  "mastodon",
  "youtube",
  "orcid",
  "researchgate",
];

const isInteractive = input.isTTY;
let pendingLines = [];

async function loadPendingLines() {
  if (isInteractive) return;
  const chunks = [];
  for await (const chunk of input) {
    chunks.push(chunk);
  }
  pendingLines = Buffer.concat(chunks)
    .toString("utf-8")
    .split(/\r?\n/);
}

const rl = isInteractive
  ? readline.createInterface({ input, output })
  : null;

function ask(question) {
  if (!isInteractive) {
    output.write(question);
    const line = pendingLines.shift() ?? "";
    return Promise.resolve(line);
  }
  return rl.question(question);
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function loadAuthor(slug) {
  const filePath = path.join(AUTHORS_DIR, `${slug}.yml`);
  try {
    const raw = await readFile(filePath, "utf-8");
    return loadYaml(raw) ?? {};
  } catch {
    return null;
  }
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function askWithDefault(question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]: ` : ": ";
  const answer = (await ask(question + suffix)).trim();
  return answer || defaultValue;
}

async function askOptional(question, defaultValue = "") {
  const value = await askWithDefault(question, defaultValue);
  return value || undefined;
}

async function loadExistingSlugs() {
  try {
    const files = await readdir(AUTHORS_DIR);
    return files
      .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
      .map((f) => path.basename(f, path.extname(f)));
  } catch {
    return [];
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await loadPendingLines();

  console.log("\nCreate or update a NukeHub blog author\n");

  await mkdir(AUTHORS_DIR, { recursive: true });

  const existingSlugs = await loadExistingSlugs();
  if (existingSlugs.length > 0) {
    console.log("Existing authors:");
    existingSlugs.forEach((s) => console.log(`  - ${s}`));
    console.log();
  }

  const slugInput = (await ask("Author slug (e.g. jane-doe): ")).trim();
  const slug = slugInput || slugify(await ask("Author name: "));
  if (!slug) {
    console.error("Author slug is required.");
    process.exit(1);
  }

  const isUpdate = await exists(path.join(AUTHORS_DIR, `${slug}.yml`));
  const existing = isUpdate ? await loadAuthor(slug) : {};

  if (isUpdate) {
    console.log(`\nUpdating existing author: ${slug}\n`);
  }

  const name = (await askWithDefault("Name", existing.name ?? "")).trim();
  if (!name) {
    console.error("Name is required.");
    process.exit(1);
  }

  const bio = await askOptional("Bio", existing.bio ?? "");
  const role = await askOptional("Role", existing.role ?? "");
  const organization = await askOptional(
    "Organization",
    existing.organization ?? "",
  );
  const location = await askOptional("Location", existing.location ?? "");

  let email = await askOptional("Email", existing.email ?? "");
  while (email && !isValidEmail(email)) {
    console.log("Invalid email. Leave blank to skip.");
    email = await askOptional("Email", existing.email ?? "");
  }

  let url = await askOptional("Website URL", existing.url ?? "");
  while (url && !isValidUrl(url)) {
    console.log("Invalid URL. Leave blank to skip.");
    url = await askOptional("Website URL", existing.url ?? "");
  }

  const avatar = await askOptional("Avatar URL", existing.avatar ?? "");

  console.log("\nSocial links (leave blank to skip):");
  const links = {};
  for (const key of LINK_FIELDS) {
    const value = await askOptional(
      `  ${key}`,
      existing.links?.[key] ?? "",
    );
    if (value) {
      links[key] = value;
    }
  }

  const data = {
    name,
    ...(bio && { bio }),
    ...(avatar && { avatar }),
    ...(role && { role }),
    ...(organization && { organization }),
    ...(location && { location }),
    ...(email && { email }),
    ...(url && { url }),
    ...(Object.keys(links).length > 0 && { links }),
  };

  const filePath = path.join(AUTHORS_DIR, `${slug}.yml`);
  await writeFile(filePath, dumpYaml(data, { lineWidth: -1 }), "utf-8");

  console.log("\nDone:");
  console.log(`  ${filePath}`);
  console.log(`\nUse this slug in post frontmatter: author: ${slug}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    rl?.close();
  });
