import { NextResponse } from "next/server";
import { renderApiError } from "@/lib/generation/api-utils";
import { getRenderServerConfig } from "@/lib/generation/config";
import { RenderProviderError } from "@/lib/generation/errors";
import { renderLog } from "@/lib/generation/logger";
import { resolveBeforeImageDataUrl } from "@/lib/generation/providers/server/resolve-before-image";
import { upsertRenderSession } from "@/lib/generation/providers/server/render-sessions";
import { getServerRenderProvider } from "@/lib/generation/providers/server/registry";
import {
  NEXTJS_DEFAULT_PROXY_CLIENT_MAX_BODY_BYTES,
  VERCEL_SERVERLESS_MAX_REQUEST_BYTES,
} from "@/lib/generation/request-limits";
import type { UploadStyleId } from "@/lib/upload-styles";
import { uploadStyleOptions } from "@/lib/upload-styles";
import { createClient } from "@/lib/supabase/server";

type SubmitBody = {
  jobId?: string;
  styleId?: UploadStyleId;
  uploadId?: string;
  /** @deprecated Large base64 payloads are rejected by the platform; use server cache via uploadId. */
  beforeImageDataUrl?: string;
};

function isValidStyleId(value: string): value is UploadStyleId {
  return uploadStyleOptions.some((option) => option.id === value);
}

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

    console.info("[renovision:render] POST /api/render/submit payload", {
      contentLengthBytes: contentLength,
      contentType,
      encoding: contentType.includes("multipart")
        ? "multipart/form-data"
        : contentType.includes("application/json")
          ? "application/json"
          : contentType || "unknown",
      vercelMaxRequestBytes: VERCEL_SERVERLESS_MAX_REQUEST_BYTES,
      nextProxyMaxBodyBytes: NEXTJS_DEFAULT_PROXY_CLIENT_MAX_BODY_BYTES,
    });

    if (contentLength !== null && contentLength > VERCEL_SERVERLESS_MAX_REQUEST_BYTES) {
      console.warn("[renovision:render] 413 — request body exceeds Vercel limit", {
        contentLengthBytes: contentLength,
        vercelMaxRequestBytes: VERCEL_SERVERLESS_MAX_REQUEST_BYTES,
        source:
          "Vercel platform (FUNCTION_PAYLOAD_TOO_LARGE) — rejected before route handler processes body",
      });
      return NextResponse.json(
        {
          error: `Request body exceeds the ${VERCEL_SERVERLESS_MAX_REQUEST_BYTES} byte platform limit. Re-upload your photo and try again.`,
          code: "UPLOAD_MISSING",
        },
        { status: 413 },
      );
    }

    const body = (await request.json()) as SubmitBody;
    const { jobId, styleId, uploadId, beforeImageDataUrl } = body;

    const jsonPayloadBytes = JSON.stringify(body).length;
    console.info("[renovision:render] Parsed submit JSON", {
      jsonPayloadBytes,
      hasEmbeddedBeforeImage: Boolean(beforeImageDataUrl),
      beforeImageDataUrlLength: beforeImageDataUrl?.length ?? 0,
      uploadId,
      jobId,
      styleId,
    });

    if (!jobId || !styleId || !uploadId) {
      throw new RenderProviderError(
        "UPLOAD_MISSING",
        "Missing render submission fields.",
      );
    }

    if (!isValidStyleId(styleId)) {
      throw new RenderProviderError("INVALID_RESPONSE", "Invalid design style.");
    }

    if (beforeImageDataUrl) {
      renderLog(
        "Ignoring deprecated beforeImageDataUrl in submit body; resolving from server cache",
        { uploadId, embeddedLength: beforeImageDataUrl.length },
      );
    }

    const config = getRenderServerConfig();
    if (config.provider !== "fal" || !config.falKey) {
      throw new RenderProviderError(
        "NOT_CONFIGURED",
        "Fal.ai is not configured on the server. Set FAL_KEY and RENDER_PROVIDER=fal.",
      );
    }

    const origin = new URL(request.url).origin;
    const resolvedBeforeImageDataUrl = await resolveBeforeImageDataUrl(uploadId, origin);

    const provider = getServerRenderProvider("fal");
    const submission = await provider.submit({
      jobId,
      styleId,
      uploadId,
      beforeImageDataUrl: resolvedBeforeImageDataUrl,
    });

    upsertRenderSession({
      requestId: submission.requestId,
      jobId,
      styleId,
      uploadId,
      modelId: submission.modelId,
      provider: "fal",
      status: "queued",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    renderLog("Render submitted", { jobId, requestId: submission.requestId });

    return NextResponse.json({
      requestId: submission.requestId,
      provider: submission.provider,
      modelId: submission.modelId,
    });
  } catch (error) {
    return renderApiError(error);
  }
}
