#!/usr/bin/env node
/**
 * Interactive scaffold for a new folder-based blog post.
 *
 * Creates:
 * - src/content/posts/<slug>/index.mdx  (post source)
 * - src/content/posts/<slug>/           (asset folder for images)
 *
 * Usage:
 *   npm run create:post
 *   node scripts/create-post.mjs
 */
import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";

const POSTS_DIR = "src/content/posts";
const AUTHORS_DIR = "src/content/authors";

const CATEGORIES = [
  "news",
  "tutorials",
  "nuclear-industry",
  "community",
  "project-updates",
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

function today() {
  return new Date().toISOString().split("T")[0];
}

async function loadAuthors() {
  try {
    const files = await readdir(AUTHORS_DIR);
    return files
      .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
      .map((f) => path.basename(f, path.extname(f)));
  } catch {
    return [];
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

async function chooseOne(message, options) {
  console.log(message);
  options.forEach((opt, i) => {
    console.log(`  ${i + 1}. ${opt}`);
  });

  while (true) {
    const answer = await ask("Enter number: ");
    const index = Number.parseInt(answer.trim(), 10) - 1;
    if (index >= 0 && index < options.length) {
      return options[index];
    }
    console.log("Invalid choice. Please enter a number from the list.");
  }
}

async function confirm(question, defaultValue = false) {
  const suffix = defaultValue ? " [Y/n]: " : " [y/N]: ";
  const answer = (await ask(question + suffix)).trim().toLowerCase();
  if (!answer) return defaultValue;
  return answer.startsWith("y");
}

async function main() {
  await loadPendingLines();

  console.log("\nCreate a new NukeHub blog post\n");

  const authors = await loadAuthors();
  if (authors.length === 0) {
    console.error(
      `No authors found in ${AUTHORS_DIR}. Create an author with \`npm run create:author\` first.`,
    );
    process.exit(1);
  }

  const title = (await ask("Title: ")).trim();
  if (!title) {
    console.error("Title is required.");
    process.exit(1);
  }

  const description = (await ask("Description: ")).trim();
  if (!description) {
    console.error("Description is required.");
    process.exit(1);
  }

  const category = await chooseOne("Choose a category:", CATEGORIES);
  const author = await chooseOne("Choose an author:", authors);

  const tagsInput = (await ask("Tags (comma-separated, optional): ")).trim();
  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join('", "')
    : "";

  const featured = await confirm("Feature this post?", false);
  const draft = await confirm("Start as a draft?", true);
  const coverName = (
    await ask("Cover image filename (e.g. hero.png, leave blank for none): ")
  ).trim();

  const slug = slugify(title);
  const postDir = path.join(POSTS_DIR, slug);
  const postPath = path.join(postDir, "index.mdx");

  if (await exists(postPath)) {
    console.error(`\nA post already exists at ${postPath}. Aborting.`);
    process.exit(1);
  }

  let coverImageFrontmatter = "";
  if (coverName) {
    coverImageFrontmatter = `\ncoverImage: ${coverName}`;
  }

  const frontmatterTags = tags ? `["${tags}"]` : "[]";

  const content = `---
title: ${title}
description: ${description}
publishedDate: ${today()}
category: ${category}
author: ${author}
tags: ${frontmatterTags}
featured: ${featured}
draft: ${draft}${coverImageFrontmatter}
---

{/*
Welcome to your new post. Delete these comments as you go.

MARKDOWN BASICS
- Headings: ## H2, ### H3, etc. (the post title is already H1).
- Paragraphs are separated by blank lines.
- Bold: **important**, italic: *emphasis*, inline code: \`code\`.
- Links: [link text](https://example.com).
- Lists: start lines with - or 1.
- Code blocks: wrap with ${"```"}language ... ${"```"}.
- Tables, blockquotes, and horizontal rules work too.

IMAGES
- Drop image files into this folder (src/content/posts/${slug}/).
- Reference them by filename only, e.g. src="diagram.png".
- For figures with captions and automatic aspect-ratio detection, use ImageFigure.

AVAILABLE MDX COMPONENTS
- <YouTube id="VIDEO_ID" title="Optional title" />
- <Odysee url="https://odysee.com/$/embed/name/claimId" title="Optional title" />
- <Video src="demo.mp4" title="Optional title" />
- <ImageFigure src="diagram.png" alt="..." caption="..." />
- <Callout type="tip|note|warning|danger">...</Callout>
- <Citation id="ref-id" /> (add matching entry to frontmatter references)
*/}

## Introduction

Start with a short paragraph that tells readers what they will learn or why this post matters.

## Main content

Add your sections here.

${
  coverName
    ? `<ImageFigure
  src="${coverName}"
  alt="TODO: describe this image"
  caption="Figure 1: TODO — add a caption or remove this component."
/>`
    : `{/* Example image component (delete or uncomment and update):
<ImageFigure
  src="figure-1.png"
  alt="Describe the image"
  caption="Figure 1: A descriptive caption."
/>
*/}`
}

{/* Example callout (delete or uncomment):
<Callout type="tip">
  Use callouts to highlight tips, notes, warnings, or dangers.
</Callout>
*/}

## Next steps

- Replace the placeholders above with your content.
- Add images to \`src/content/posts/${slug}/\`.
- Run \`npm run dev\` and open http://localhost:4321/posts/${slug} to preview.
- When ready, set \`draft: false\` and run the build checks:
  \`npm run lint && npm run format:check && npm run build && npx astro check\`
`;

  await mkdir(postDir, { recursive: true });
  await writeFile(postPath, content, "utf-8");

  console.log("\nCreated:");
  console.log(`  ${postPath}`);
  console.log(`  ${postDir}/`);
  console.log("\nNext steps:");
  if (coverName) {
    console.log(`  1. Add your cover image to ${postDir}/${coverName}`);
  } else {
    console.log(`  1. Add images to ${postDir}/ when needed`);
  }
  console.log(`  2. Edit ${postPath}`);
  console.log(`  3. Preview at http://localhost:4321/posts/${slug}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    rl?.close();
  });
