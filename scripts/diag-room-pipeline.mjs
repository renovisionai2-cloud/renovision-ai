/**
 * Temporary: exercise upload cache → resolve → Fal submit logging locally.
 * Run: node scripts/diag-room-pipeline.mjs
 * Requires FAL_KEY in .env.local (loaded below).
 */
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const uploadId = `diag-${Date.now()}`;
const storageKey = `room-upload-${uploadId}`;
const imagePath = path.join(root, "public", "demo", "before.jpg");

const buffer = await readFile(imagePath);
const mimeType = "image/jpeg";
const sizeBytes = buffer.length;

console.info("[renovision:diag:upload] after upload cached (simulated)", {
  uploadId,
  mimeType,
  sizeBytes,
  storageKey,
});

// Inline cache (same module the API uses — load via require after transpile is hard; mirror bufferToImageDataUrl)
function bufferToImageDataUrl(buf, mt) {
  return `data:${mt};base64,${buf.toString("base64")}`;
}

const dataUri = bufferToImageDataUrl(buffer, mimeType);
console.info("[renovision:diag:resolve-before-image]", {
  uploadId,
  mimeType,
  sizeBytes,
  source: "simulated-cache",
  dataUriLength: dataUri.length,
  dataUriPrefix100: dataUri.slice(0, 100),
});

const falKey = process.env.FAL_KEY || process.env.FAL_AI_API_KEY;
if (!falKey) {
  console.warn("FAL_KEY not set — skipping fal.queue.submit diagnostic log");
  process.exit(0);
}

const { fal } = await import("@fal-ai/client");
fal.config({ credentials: falKey.trim() });

const modelId =
  process.env.FAL_MODEL_ID?.trim() || "fal-ai/flux/dev/image-to-image";
const prompt =
  "Modern minimalist living room renovation, photorealistic, same layout and architecture";

console.info("[renovision:diag:fal-provider] before fal.queue.submit", {
  modelId,
  prompt,
  image_url_length: dataUri.length,
  image_url_starts_with_data_image: dataUri.startsWith("data:image/"),
  uploadId,
});

const submission = await fal.queue.submit(modelId, {
  input: {
    image_url: dataUri,
    prompt,
    strength: 0.95,
    guidance_scale: 3.5,
    num_inference_steps: 40,
    output_format: "jpeg",
    num_images: 1,
  },
});

console.info("[renovision:diag] Fal queue submitted", {
  requestId: submission.request_id,
});
