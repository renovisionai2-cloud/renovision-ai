/**
 * Kitchen prompt A/B/C experiment — same image, three prompts, Kontext Pro.
 *
 * Run:
 *   PROMPT_EXPERIMENT_IMAGE_PATH=./scripts/prompt-experiment-input/kitchen-before.jpg \
 *     node --env-file=.env.local scripts/run-prompt-experiment-kitchen.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fal } from "@fal-ai/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const defaultImage = path.join(root, "scripts/prompt-experiment-input/kitchen-before.jpg");
const imagePath = process.env.PROMPT_EXPERIMENT_IMAGE_PATH || defaultImage;
const outDir = path.join(root, "scripts/prompt-experiment-output/kitchen");
const MODEL_ID = process.env.FAL_MODEL_ID?.trim() || "fal-ai/flux-pro/kontext";
const GUIDANCE = Number(process.env.FAL_GUIDANCE_SCALE) || 3.5;

/** Variant A — matches production `buildStyleRenderPrompt("modern")`. */
const PROMPT_VARIANT_A = [
  "Redesign this exact room into a realistic Modern interior design.",
  "modern interior design with clean lines, neutral palette, contemporary furniture, minimal clutter, and balanced natural lighting",
  "Keep the SAME room structure, walls, windows, floor, ceiling, and camera angle.",
  "Only change furniture, finishes, lighting, decor, cabinetry, colors, and materials.",
  "Do NOT generate outdoor scenes, streets, bridges, cities, landscapes, or fantasy environments.",
  "Preserve the original architecture and room proportions exactly.",
  "Create a highly realistic luxury interior rendering.",
].join(" ");

/** Variant B — strong luxury kitchen redesign. */
const PROMPT_VARIANT_B = [
  "Redesign this room into a high-end luxury modern kitchen.",
  "Preserve: room dimensions, walls, windows, ceiling, camera angle.",
  "Replace: cabinetry, countertops, backsplash, flooring, lighting, appliances, hardware, finishes.",
  "The result should look like a professionally renovated kitchen worth $100,000+.",
  "Do NOT generate outdoor scenes, streets, bridges, cities, landscapes, or fantasy environments.",
  "Create a highly realistic luxury interior rendering.",
].join(" ");

/** Variant C — aggressive renovation, structure-only preservation. */
const PROMPT_VARIANT_C = [
  "Transform this room into a completely renovated luxury modern kitchen while preserving only the architectural structure.",
  "All visible finishes, cabinetry, lighting, colors, and materials should appear newly renovated.",
  "Keep room dimensions, walls, windows, ceiling height, and camera angle unchanged.",
  "Do NOT generate outdoor scenes, streets, bridges, cities, landscapes, or fantasy environments.",
  "Create a highly realistic luxury interior rendering.",
].join(" ");

const VARIANTS = [
  {
    id: "variant-a",
    label: "Variant A — Current production prompt",
    shortLabel: "A · Production",
    prompt: PROMPT_VARIANT_A,
  },
  {
    id: "variant-b",
    label: "Variant B — Strong redesign",
    shortLabel: "B · Strong",
    prompt: PROMPT_VARIANT_B,
  },
  {
    id: "variant-c",
    label: "Variant C — Aggressive redesign",
    shortLabel: "C · Aggressive",
    prompt: PROMPT_VARIANT_C,
  },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function pollResult(modelId, requestId, timeoutMs = 180000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const status = await fal.queue.status(modelId, { requestId, logs: false });
    if (status.status === "COMPLETED") {
      const result = await fal.queue.result(modelId, { requestId });
      const image = result.data?.images?.[0];
      if (!image?.url) throw new Error("No image URL in result");
      return {
        url: image.url,
        width: image.width,
        height: image.height,
        seed: result.data?.seed,
        requestId: result.requestId || requestId,
      };
    }
    if (status.status === "FAILED") throw new Error("Fal FAILED");
    await sleep(2000);
  }
  throw new Error("Timeout");
}

async function downloadImage(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destPath, buffer);
  return buffer.length;
}

async function runVariant(variant, imageUrl, inputMeta) {
  const started = Date.now();
  console.info(`\n=== ${variant.label} ===`);

  const submission = await fal.queue.submit(MODEL_ID, {
    input: {
      image_url: imageUrl,
      prompt: variant.prompt,
      guidance_scale: GUIDANCE,
      num_images: 1,
      output_format: "jpeg",
      enhance_prompt: false,
    },
  });

  const result = await pollResult(MODEL_ID, submission.request_id);
  const elapsedMs = Date.now() - started;
  const localFile = `${variant.id}.jpg`;
  const localPath = path.join(outDir, localFile);
  const sizeBytes = await downloadImage(result.url, localPath);

  const report = {
    variantId: variant.id,
    label: variant.label,
    shortLabel: variant.shortLabel,
    modelId: MODEL_ID,
    guidanceScale: GUIDANCE,
    prompt: variant.prompt,
    requestId: submission.request_id,
    falRequestId: result.requestId,
    elapsedMs,
    inputSizeBytes: inputMeta.sizeBytes,
    outputUrl: result.url,
    outputWidth: result.width,
    outputHeight: result.height,
    outputLocalFile: localFile,
    outputSizeBytes: sizeBytes,
    seed: result.seed,
  };

  await writeFile(path.join(outDir, `${variant.id}.json`), JSON.stringify(report, null, 2));
  console.info(JSON.stringify({ ...report, prompt: `[${report.prompt.length} chars]` }, null, 2));
  return report;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildCompareHtml({ inputFile, inputMeta, reports, generatedAt }) {
  const cards = [
    {
      title: "Before (input)",
      file: inputFile,
      meta: `${inputMeta.width}×${inputMeta.height} · ${(inputMeta.sizeBytes / 1024).toFixed(0)} KB`,
      prompt: "Original kitchen photo (construction in progress).",
    },
    ...reports.map((r) => ({
      title: r.shortLabel,
      file: r.outputLocalFile,
      meta: `${r.outputWidth ?? "?"}×${r.outputHeight ?? "?"} · seed ${r.seed ?? "—"} · ${(r.elapsedMs / 1000).toFixed(1)}s`,
      prompt: r.prompt,
    })),
  ];

  const grid = cards
    .map(
      (card) => `
    <figure class="card">
      <img src="${escapeHtml(card.file)}" alt="${escapeHtml(card.title)}" loading="lazy" />
      <figcaption>
        <strong>${escapeHtml(card.title)}</strong>
        <span class="meta">${escapeHtml(card.meta)}</span>
        <p class="prompt">${escapeHtml(card.prompt)}</p>
      </figcaption>
    </figure>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kitchen Prompt Experiment — A / B / C</title>
  <style>
    :root { color-scheme: dark; font-family: system-ui, sans-serif; background: #0f1115; color: #e8e6e3; }
    body { margin: 0; padding: 24px; }
    h1 { font-size: 1.5rem; margin: 0 0 8px; }
    .sub { color: #9ca3af; margin: 0 0 24px; font-size: 0.95rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .card { margin: 0; background: #1a1d24; border: 1px solid #2d3340; border-radius: 12px; overflow: hidden; }
    .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; background: #000; }
    figcaption { padding: 12px 14px 16px; }
    figcaption strong { display: block; margin-bottom: 4px; }
    .meta { font-size: 0.8rem; color: #b8954a; }
    .prompt { font-size: 0.78rem; color: #9ca3af; line-height: 1.45; margin: 10px 0 0; max-height: 120px; overflow-y: auto; }
  </style>
</head>
<body>
  <h1>Kitchen prompt experiment</h1>
  <p class="sub">Model: ${escapeHtml(MODEL_ID)} · guidance ${GUIDANCE} · ${escapeHtml(generatedAt)}</p>
  <div class="grid">${grid}</div>
</body>
</html>`;
}

async function main() {
  const falKey = process.env.FAL_KEY || process.env.FAL_AI_API_KEY;
  if (!falKey) {
    console.error("FAL_KEY missing — set in .env.local");
    process.exit(1);
  }

  fal.config({ credentials: falKey.trim() });
  await mkdir(outDir, { recursive: true });

  const buffer = await readFile(imagePath);
  const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";
  const inputMeta = {
    sizeBytes: buffer.length,
    sourcePath: imagePath,
    width: null,
    height: null,
  };

  console.info("Input:", imagePath, `${inputMeta.sizeBytes} bytes`);

  const blob = new Blob([buffer], { type: mimeType });
  const file = new File([blob], path.basename(imagePath), { type: mimeType });
  const imageUrl = await fal.storage.upload(file);
  console.info("Hosted:", imageUrl);

  const inputCopyName = "input-before.jpg";
  await writeFile(path.join(outDir, inputCopyName), buffer);
  inputMeta.inputFile = inputCopyName;

  const reports = [];
  for (const variant of VARIANTS) {
    try {
      reports.push(await runVariant(variant, imageUrl, inputMeta));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed ${variant.id}:`, message);
      reports.push({
        variantId: variant.id,
        label: variant.label,
        shortLabel: variant.shortLabel,
        prompt: variant.prompt,
        error: message,
      });
    }
  }

  const generatedAt = new Date().toISOString();
  const summary = {
    generatedAt,
    modelId: MODEL_ID,
    guidanceScale: GUIDANCE,
    inputPath: imagePath,
    inputHostedUrl: imageUrl,
    variants: reports,
  };

  await writeFile(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));

  const html = buildCompareHtml({
    inputFile: inputCopyName,
    inputMeta: { ...inputMeta, width: "—", height: "—" },
    reports: reports.filter((r) => r.outputLocalFile),
    generatedAt,
  });
  const comparePath = path.join(outDir, "compare.html");
  await writeFile(comparePath, html);

  console.info("\nWrote:", path.join(outDir, "summary.json"));
  console.info("Open:", comparePath);
}

main();
