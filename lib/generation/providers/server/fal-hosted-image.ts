import "server-only";

import { fal } from "@fal-ai/client";
import { renderLog } from "@/lib/generation/logger";

/** Prefer Fal CDN URL over large data URIs in queue payloads. */
export async function ensureFalHostedImageUrl(imageUrl: string): Promise<string> {
  if (!imageUrl.startsWith("data:image/")) {
    return imageUrl;
  }

  const match = /^data:([^;]+);base64,(.+)$/.exec(imageUrl);
  if (!match) {
    return imageUrl;
  }

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const ext = mimeType.includes("png") ? "png" : "jpg";
  const blob = new Blob([buffer], { type: mimeType });
  const file = new File([blob], `room-upload.${ext}`, { type: mimeType });

  const hostedUrl = await fal.storage.upload(file);
  renderLog("Uploaded before image to Fal storage", {
    mimeType,
    sizeBytes: buffer.length,
    hostedUrl,
  });

  console.info("[renovision:diag:fal-provider] fal.storage.upload", {
    mimeType,
    sizeBytes: buffer.length,
    hostedUrl,
  });

  return hostedUrl;
}
