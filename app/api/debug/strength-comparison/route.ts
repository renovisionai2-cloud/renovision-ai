import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderApiError } from "@/lib/generation/api-utils";
import { resolveBeforeImageDataUrl } from "@/lib/generation/providers/server/resolve-before-image";
import { setCachedRoomUpload } from "@/lib/generation/providers/server/room-upload-cache";
import { runStrengthComparison } from "@/lib/generation/providers/server/strength-comparison-test";
import type { UploadStyleId } from "@/lib/upload-styles";
import { uploadStyleOptions } from "@/lib/upload-styles";

function isValidStyleId(value: string): value is UploadStyleId {
  return uploadStyleOptions.some((option) => option.id === value);
}

/**
 * Temporary Flux strength A/B test (development only).
 *
 * GET /api/debug/strength-comparison
 * GET /api/debug/strength-comparison?uploadId=<id>&styleId=modern
 *
 * Uses the same image_url + prompt for both runs:
 * - low:  strength 0.35, guidance 3.5, steps 30
 * - high: strength 0.95, guidance 3.5, steps 30
 *
 * Pass uploadId after POST /api/upload/room-image to use your exact uploaded room.
 * Without uploadId, seeds public/demo/before.jpg into the server cache.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const styleParam = searchParams.get("styleId") ?? "modern";
    const styleId = isValidStyleId(styleParam) ? styleParam : "modern";
    const origin = new URL(request.url).origin;

    let uploadId = searchParams.get("uploadId")?.trim() || "";
    let sizeBytes: number | null = null;
    let mimeType: string | null = null;

    if (!uploadId) {
      uploadId = `strength-test-${Date.now()}`;
      const imagePath = path.join(process.cwd(), "public", "demo", "before.jpg");
      const buffer = await readFile(imagePath);
      mimeType = "image/jpeg";
      sizeBytes = buffer.length;

      setCachedRoomUpload({
        uploadId,
        storageKey: `room-upload-${uploadId}`,
        mimeType,
        sizeBytes,
        buffer,
        cachedAt: Date.now(),
      });

      console.info("[renovision:strength-test] seeded demo room", {
        uploadId,
        mimeType,
        sizeBytes,
      });
    }

    const beforeImageDataUrl = await resolveBeforeImageDataUrl(uploadId, origin);

    const result = await runStrengthComparison({
      imageUrl: beforeImageDataUrl,
      styleId,
    });

    return NextResponse.json({
      ok: true,
      hypothesis:
        "If low-strength (0.35) preserves room layout but high-strength (0.95) does not, Flux is over-stylizing relative to the input photo.",
      uploadId,
      mimeType,
      sizeBytes,
      ...result,
      compare: {
        lowStrength: result.low.strength,
        highStrength: result.high.strength,
        samePrompt: true,
        sameImage: true,
      },
    });
  } catch (error) {
    return renderApiError(error);
  }
}
