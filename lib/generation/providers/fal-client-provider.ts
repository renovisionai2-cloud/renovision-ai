"use client";

import { RenderProviderError } from "@/lib/generation/errors";
import { renderLog } from "@/lib/generation/logger";
import { persistGeneratedDesign } from "@/lib/generation/persist-result";
import { ensureRoomUploadOnServer } from "@/lib/room-upload-server-sync";
import type {
  RenderProvider,
  RenderRequest,
  RenderResult,
  RenderStatusResponse,
  RenderSubmission,
} from "@/lib/generation/types";

type SubmitApiResponse = {
  requestId: string;
  provider: "fal";
  modelId: string;
};

type StatusApiResponse = {
  requestId: string;
  modelId: string;
  status: RenderStatusResponse["status"];
  phase: RenderStatusResponse["phase"];
  progress: number;
  error?: string;
  afterImageUrl?: string;
};

type ResultApiResponse = {
  afterImageUrl: string;
};

async function parseApiError(response: Response): Promise<never> {
  let message = "Render request failed.";
  let code: RenderProviderError["code"] = "PROVIDER_FAILURE";

  try {
    const body = (await response.json()) as { error?: string; code?: RenderProviderError["code"] };
    if (body.error) message = body.error;
    if (body.code) code = body.code;
  } catch {
    // ignore JSON parse errors
  }

  throw new RenderProviderError(code, message);
}

/** Client proxy — calls server API routes; never exposes Fal credentials. */
export const falClientRenderProvider: RenderProvider = {
  id: "fal",

  async submitRender(request: RenderRequest): Promise<RenderSubmission> {
    const uploadMeta = await ensureRoomUploadOnServer();

    const payload = {
      jobId: request.jobId,
      styleId: request.styleId,
      uploadId: uploadMeta.id,
    };

    renderLog("Submitting render to API", {
      jobId: request.jobId,
      styleId: request.styleId,
      uploadId: uploadMeta.id,
      jsonPayloadBytes: JSON.stringify(payload).length,
    });

    const response = await fetch("/api/render/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      await parseApiError(response);
    }

    const data = (await response.json()) as SubmitApiResponse;

    return {
      externalJobId: data.requestId,
      provider: "fal",
      modelId: data.modelId,
    };
  },

  async pollRenderStatus(externalJobId: string): Promise<RenderStatusResponse> {
    const response = await fetch(`/api/render/status/${encodeURIComponent(externalJobId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      await parseApiError(response);
    }

    const data = (await response.json()) as StatusApiResponse;

    return {
      status: data.status,
      phase: data.phase,
      progress: data.progress,
      error: data.error,
      afterImageUrl: data.afterImageUrl,
    };
  },

  async fetchCompletedResult(
    externalJobId: string,
    request: RenderRequest,
  ): Promise<RenderResult> {
    const status = await this.pollRenderStatus(externalJobId);
    let afterImageUrl = status.afterImageUrl;

    if (!afterImageUrl) {
      const response = await fetch(
        `/api/render/result/${encodeURIComponent(externalJobId)}`,
        { method: "GET", cache: "no-store" },
      );

      if (!response.ok) {
        await parseApiError(response);
      }

      const data = (await response.json()) as ResultApiResponse;
      afterImageUrl = data.afterImageUrl;
    }

    if (!afterImageUrl) {
      throw new RenderProviderError(
        "INVALID_RESPONSE",
        "No generated image was returned from the provider.",
      );
    }

    const resultSource = status.afterImageUrl ? "status-poll" : "result-api";
    console.info("[renovision:diag:persist] about to persist provider image url", {
      requestId: externalJobId,
      jobId: request.jobId,
      styleId: request.styleId,
      resultSource,
      afterImageUrl,
      beforeImageUrlFromRequest: request.beforeImageUrl?.slice(0, 120) ?? null,
    });

    renderLog("Persisting generated design", {
      jobId: request.jobId,
      afterImageUrl,
    });

    return persistGeneratedDesign(request, afterImageUrl);
  },
};
