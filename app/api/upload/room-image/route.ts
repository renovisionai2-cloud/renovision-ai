import { NextResponse } from "next/server";
import { renderApiError } from "@/lib/generation/api-utils";
import { RenderProviderError } from "@/lib/generation/errors";
import {
  NEXTJS_DEFAULT_PROXY_CLIENT_MAX_BODY_BYTES,
  SERVER_ROOM_UPLOAD_MAX_BYTES,
  VERCEL_SERVERLESS_MAX_REQUEST_BYTES,
} from "@/lib/generation/request-limits";
import { setCachedRoomUpload } from "@/lib/generation/providers/server/room-upload-cache";
import { createClient } from "@/lib/supabase/server";

function parseContentLength(header: string | null): number | null {
  if (!header) return null;
  const value = Number.parseInt(header, 10);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "NOT_CONFIGURED" }, { status: 401 });
    }

    const contentLength = parseContentLength(request.headers.get("content-length"));
    const contentType = request.headers.get("content-type") ?? "";

    console.info("[renovision:upload] POST /api/upload/room-image", {
      contentLengthBytes: contentLength,
      contentType,
      vercelMaxRequestBytes: VERCEL_SERVERLESS_MAX_REQUEST_BYTES,
      nextProxyMaxBodyBytes: NEXTJS_DEFAULT_PROXY_CLIENT_MAX_BODY_BYTES,
      serverRoomUploadMaxBytes: SERVER_ROOM_UPLOAD_MAX_BYTES,
    });

    if (contentLength !== null && contentLength > VERCEL_SERVERLESS_MAX_REQUEST_BYTES) {
      throw new RenderProviderError(
        "UPLOAD_MISSING",
        `Image upload exceeds the ${VERCEL_SERVERLESS_MAX_REQUEST_BYTES} byte platform limit.`,
      );
    }

    const formData = await request.formData();
    const uploadId = formData.get("uploadId");
    const storageKey = formData.get("storageKey");
    const file = formData.get("file");

    if (typeof uploadId !== "string" || !uploadId) {
      throw new RenderProviderError("UPLOAD_MISSING", "Missing uploadId.");
    }

    if (typeof storageKey !== "string" || !storageKey) {
      throw new RenderProviderError("UPLOAD_MISSING", "Missing storageKey.");
    }

    if (!(file instanceof File) || file.size === 0) {
      throw new RenderProviderError("UPLOAD_MISSING", "Missing room image file.");
    }

    if (file.size > SERVER_ROOM_UPLOAD_MAX_BYTES) {
      throw new RenderProviderError(
        "UPLOAD_MISSING",
        "Room photo must be 4 MB or smaller for cloud rendering.",
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const mimeType = file.type || "image/jpeg";

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

    console.info("[renovision:upload] Room image cached on server", {
      uploadId,
      storageKey,
      sizeBytes: buffer.length,
      mimeType,
    });

    return NextResponse.json({ ok: true, uploadId, storageKey, sizeBytes: buffer.length });
  } catch (error) {
    return renderApiError(error);
  }
}
