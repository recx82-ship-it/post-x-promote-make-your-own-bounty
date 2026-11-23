// Entry program for make.fun's "Promote make.fun's make-your-own-bounty post on X"
// bounty (post-x-promote-make-your-own-bounty-01). Node 22, standard library only.
//
// The post itself is the entry: Rex's own post on X quoting make.fun's
// make-your-own-bounty post, with a photo of its own attached. This program
// does one thing: it copies POST.json from the repository root to /output,
// where the gate reads it and then reads the post from X. Nothing this
// program writes about the post is scored.
//
// Run locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(OUTPUT_DIR, { recursive: true });

// Validate POST.json before handing it to the gate: it must be a JSON object
// with a string url naming the post on X.
const postPath = join(BOT_DIR, "POST.json");
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== "object" || post === null || typeof (post as { url?: unknown }).url !== "string") {
  console.error("POST.json must be a JSON object with a string url");
  process.exit(1);
}

try {
  copyFileSync(postPath, join(OUTPUT_DIR, "POST.json"));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
