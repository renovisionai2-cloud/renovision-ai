/**
 * Hits the real Next.js API routes (same code path as production) on localhost.
 * Prereq: npm run dev, signed-in session cookie in DIAG_COOKIE env var.
 *
 *   DIAG_COOKIE='sb-...' node --env-file=.env.local scripts/run-diag-via-dev-server.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const base = process.env.DIAG_BASE_URL || "http://localhost:3000";
const cookie = process.env.DIAG_COOKIE;

if (!cookie) {
  console.error("Set DIAG_COOKIE to your Supabase session cookie from DevTools.");
  process.exit(1);
}

const uploadId = crypto.randomUUID();
const storageKey = `room-upload-${uploadId}`;
const imagePath = path.join(root, "public", "demo", "before.jpg");
const bytes = await readFile(imagePath);
const blob = new Blob([bytes], { type: "image/jpeg" });

const form = new FormData();
form.append("uploadId", uploadId);
form.append("storageKey", storageKey);
form.append("file", blob, "before.jpg");

console.info("POST", `${base}/api/upload/room-image`, { uploadId, storageKey });
const uploadRes = await fetch(`${base}/api/upload/room-image`, {
  method: "POST",
  headers: { Cookie: cookie },
  body: form,
});
console.info("upload status", uploadRes.status, await uploadRes.text());

const submitBody = {
  jobId: crypto.randomUUID(),
  styleId: "modern",
  uploadId,
};

console.info("POST", `${base}/api/render/submit`, submitBody);
const submitRes = await fetch(`${base}/api/render/submit`, {
  method: "POST",
  headers: {
    Cookie: cookie,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(submitBody),
});
console.info("submit status", submitRes.status, await submitRes.text());
console.info("Check the terminal running `npm run dev` for [renovision:diag:*] logs.");
