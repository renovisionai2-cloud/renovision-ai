"use client";

import { getClientPollConfig } from "@/lib/generation/client-config";
import { RenderProviderError, toRenderErrorMessage } from "@/lib/generation/errors";
import { getRenderProvider } from "@/lib/generation/providers";
import type {
  GenerationPhase,
  RenderProvider,
  RenderRequest,
  RenderResult,
  RenderSubmission,
} from "@/lib/generation/types";
import {
  getPersistedBeforeImageUrl,
  getRoomUploadMeta,
} from "@/lib/room-upload-store";
import type { UploadStyleId } from "@/lib/upload-styles";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildRenderRequest(jobId: string, styleId: UploadStyleId): Promise<RenderRequest> {
  const uploadMeta = getRoomUploadMeta();
  if (!uploadMeta) {
    throw new RenderProviderError(
      "UPLOAD_MISSING",
      "No uploaded room photo found.",
    );
  }

  const beforeImageUrl = await getPersistedBeforeImageUrl();
  if (!beforeImageUrl) {
    throw new RenderProviderError(
      "UPLOAD_MISSING",
      "No uploaded room photo found.",
    );
  }

  return {
    jobId,
    styleId,
    uploadId: uploadMeta.id,
    beforeStorageKey: uploadMeta.storageKey,
    beforeImageUrl,
  };
}

async function pollUntilComplete(
  provider: RenderProvider,
  submission: RenderSubmission,
  onPhase: (phase: GenerationPhase) => void,
): Promise<string> {
  const { timeoutMs, intervalMs } = getClientPollConfig();
  const deadline = Date.now() + timeoutMs;

  onPhase("generating_ai_visualization");

  while (Date.now() < deadline) {
    const status = await provider.pollRenderStatus(submission.externalJobId);

    onPhase(status.phase);

    if (status.status === "failed") {
      throw new RenderProviderError(
        "PROVIDER_FAILURE",
        status.error ?? "The AI provider failed to generate your design.",
      );
    }

    if (status.status === "completed" && status.afterImageUrl) {
      return status.afterImageUrl;
    }

    if (status.status === "completed") {
      return "";
    }

    await sleep(intervalMs);
  }

  throw new RenderProviderError(
    "TIMEOUT",
    "Generation timed out. Please try again.",
  );
}

/** Provider-agnostic client execution pipeline (upload → submit → poll → finalize). */
export async function runGenerationPipeline(
  jobId: string,
  styleId: UploadStyleId,
  providerId: Parameters<typeof getRenderProvider>[0],
  onPhase: (phase: GenerationPhase) => void,
  onSubmission?: (submission: RenderSubmission) => void,
): Promise<RenderResult> {
  const provider = getRenderProvider(providerId);
  const request = await buildRenderRequest(jobId, styleId);

  onPhase("uploading_image");
  await sleep(300);

  onPhase("preparing_render");
  const submission = await provider.submitRender(request);
  onSubmission?.(submission);

  const afterFromPoll = await pollUntilComplete(provider, submission, onPhase);

  onPhase("finalizing");

  if (afterFromPoll) {
    const { persistGeneratedDesign } = await import("@/lib/generation/persist-result");
    const result = await persistGeneratedDesign(request, afterFromPoll);
    onPhase("complete");
    return result;
  }

  const result = await provider.fetchCompletedResult(submission.externalJobId, request);
  onPhase("complete");
  return result;
}

export { toRenderErrorMessage };
