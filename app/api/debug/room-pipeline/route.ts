import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getRenderServerConfig } from "@/lib/generation/config";
import { getServerRenderProvider } from "@/lib/generation/providers/server/registry";
import { resolveBeforeImageDataUrl } from "@/lib/generation/providers/server/resolve-before-image";
import { setCachedRoomUpload } from "@/lib/generation/providers/server/room-upload-cache";

/**
 * Temporary local diagnostic — hits upload cache → resolve → Fal submit.
 * GET /api/debug/room-pipeline (development only)
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const uploadId = `diag-${Date.now()}`;
  const storageKey = `room-upload-${uploadId}`;
  const imagePath = path.join(process.cwd(), "public", "demo", "before.jpg");
  const buffer = await readFile(imagePath);
  const mimeType = "image/jpeg";

  setCachedRoomUpload({
    uploadId,
    storageKey,
    mimeType,
    sizeBytes: buffer.length,
    buffer,
    cachedAt: Date.now(),
  });

  console.info("[renovision:diag:upload] after upload cached", {
    uploadId,
    mimeType,
    sizeBytes: buffer.length,
    storageKey,
  });

  const origin = new URL(request.url).origin;
  const beforeImageDataUrl = await resolveBeforeImageDataUrl(uploadId, origin);

  const config = getRenderServerConfig();
  if (!config.falKey) {
    return NextResponse.json({
      ok: false,
      error: "FAL_KEY not set",
      uploadId,
      beforeImageDataUrlPrefix: beforeImageDataUrl.slice(0, 100),
      beforeImageDataUrlLength: beforeImageDataUrl.length,
    });
  }

  const provider = getServerRenderProvider("fal");
  const submission = await provider.submit({
    jobId: crypto.randomUUID(),
    styleId: "modern",
    uploadId,
    beforeImageDataUrl,
  });

  return NextResponse.json({
    ok: true,
    uploadId,
    mimeType,
    sizeBytes: buffer.length,
    beforeImageDataUrlLength: beforeImageDataUrl.length,
    beforeImageDataUrlPrefix: beforeImageDataUrl.slice(0, 100),
    falRequestId: submission.requestId,
    modelId: submission.modelId,
    note: "See dev server terminal for [renovision:diag:*] logs",
  });
}
