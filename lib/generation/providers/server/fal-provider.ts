import "server-only";

import { fal } from "@fal-ai/client";
import { getRenderServerConfig } from "@/lib/generation/config";
import { RenderProviderError } from "@/lib/generation/errors";
import { renderError, renderLog } from "@/lib/generation/logger";
import { buildStyleRenderPrompt } from "@/lib/generation/style-prompts";
import { ensureFalHostedImageUrl } from "@/lib/generation/providers/server/fal-hosted-image";
import {
  buildFalQueueInput,
  getFalModelFamily,
} from "@/lib/generation/providers/server/fal-model-input";
import type {
  ServerRenderProvider,
  ServerRenderResult,
  ServerRenderStatus,
  ServerRenderSubmission,
  ServerRenderSubmitInput,
} from "@/lib/generation/providers/server/types";
import { phaseProgress } from "@/lib/generation/phases";
import type { GenerationPhase, RenderJobStatus } from "@/lib/generation/types";

type FalQueueStatus = {
  status: string;
  logs?: Array<{ message?: string }>;
};

type FalImageOutput = {
  images?: Array<{ url?: string }>;
  seed?: number;
};

function mapFalStatusToRender(status: string): {
  jobStatus: RenderJobStatus;
  phase: GenerationPhase;
  progress: number;
} {
  switch (status) {
    case "IN_QUEUE":
      return { jobStatus: "queued", phase: "preparing_render", progress: 15 };
    case "IN_PROGRESS":
      return {
        jobStatus: "running",
        phase: "generating_ai_visualization",
        progress: 55,
      };
    case "COMPLETED":
      return { jobStatus: "completed", phase: "complete", progress: 100 };
    case "FAILED":
      return { jobStatus: "failed", phase: "generating_ai_visualization", progress: 0 };
    default:
      return { jobStatus: "running", phase: "generating_ai_visualization", progress: 40 };
  }
}

function extractAfterImageUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const output = data as FalImageOutput;
  const url = output.images?.[0]?.url;
  return typeof url === "string" && url.length > 0 ? url : null;
}

function ensureFalConfigured(): void {
  const config = getRenderServerConfig();
  if (!config.falKey) {
    throw new RenderProviderError(
      "NOT_CONFIGURED",
      "Fal.ai is not configured. Set FAL_KEY in your environment.",
    );
  }
}

export const falServerProvider: ServerRenderProvider = {
  id: "fal",

  async submit(input: ServerRenderSubmitInput): Promise<ServerRenderSubmission> {
    ensureFalConfigured();
    const config = getRenderServerConfig();

    fal.config({ credentials: config.falKey! });

    const prompt = buildStyleRenderPrompt(input.styleId);
    const hostedImageUrl = await ensureFalHostedImageUrl(input.beforeImageDataUrl);
    const falInput = buildFalQueueInput(config, prompt, hostedImageUrl);

    console.info("[renovision:diag:fal-provider] before fal.queue.submit", {
      modelId: config.falModelId,
      modelFamily: getFalModelFamily(config.falModelId),
      prompt,
      image_url_length: hostedImageUrl.length,
      image_url_starts_with_data_image: hostedImageUrl.startsWith("data:image/"),
      image_url_is_hosted: hostedImageUrl.startsWith("https://"),
      uploadId: input.uploadId,
      jobId: input.jobId,
      styleId: input.styleId,
      falInputKeys: Object.keys(falInput),
    });

    renderLog("Fal submit", {
      jobId: input.jobId,
      modelId: config.falModelId,
      modelFamily: getFalModelFamily(config.falModelId),
      styleId: input.styleId,
    });

    try {
      const submission = await fal.queue.submit(config.falModelId, {
        input: falInput,
        webhookUrl: config.webhookUrl ?? undefined,
      });

      if (!submission.request_id) {
        throw new RenderProviderError(
          "INVALID_RESPONSE",
          "Fal.ai did not return a request id.",
        );
      }

      return {
        requestId: submission.request_id,
        provider: "fal",
        modelId: config.falModelId,
      };
    } catch (error) {
      renderError("Fal submit failed", { jobId: input.jobId, error });
      if (error instanceof RenderProviderError) throw error;
      throw new RenderProviderError(
        "PROVIDER_FAILURE",
        "Failed to submit the render request to Fal.ai.",
        { cause: error },
      );
    }
  },

  async pollStatus(requestId: string, modelId: string): Promise<ServerRenderStatus> {
    ensureFalConfigured();
    const config = getRenderServerConfig();
    fal.config({ credentials: config.falKey! });

    try {
      const status = (await fal.queue.status(modelId, {
        requestId,
        logs: true,
      })) as FalQueueStatus;

      const mapped = mapFalStatusToRender(status.status);
      renderLog("Fal status", { requestId, status: status.status, mapped });

      if (status.status === "FAILED") {
        return {
          status: "failed",
          phase: mapped.phase,
          progress: phaseProgress(mapped.phase),
          error: "Fal.ai reported a failed generation.",
        };
      }

      if (status.status === "COMPLETED") {
        const result = await this.fetchResult(requestId, modelId);
        return {
          status: "completed",
          phase: "complete",
          progress: 100,
          afterImageUrl: result.afterImageUrl,
        };
      }

      return {
        status: mapped.jobStatus,
        phase: mapped.phase,
        progress: mapped.progress,
      };
    } catch (error) {
      renderError("Fal poll failed", { requestId, error });
      if (error instanceof RenderProviderError) throw error;
      throw new RenderProviderError(
        "PROVIDER_FAILURE",
        "Failed to check generation status with Fal.ai.",
        { cause: error },
      );
    }
  },

  async fetchResult(requestId: string, modelId: string): Promise<ServerRenderResult> {
    ensureFalConfigured();
    const config = getRenderServerConfig();
    fal.config({ credentials: config.falKey! });

    try {
      const result = await fal.queue.result(modelId, { requestId });
      const afterImageUrl = extractAfterImageUrl(result.data);

      if (!afterImageUrl) {
        throw new RenderProviderError(
          "INVALID_RESPONSE",
          "Fal.ai returned a response without an image URL.",
        );
      }

      renderLog("Fal result ready", { requestId, afterImageUrl });

      const data = result.data as FalImageOutput;
      return {
        afterImageUrl,
        seed: data.seed,
      };
    } catch (error) {
      renderError("Fal result failed", { requestId, error });
      if (error instanceof RenderProviderError) throw error;
      throw new RenderProviderError(
        "PROVIDER_FAILURE",
        "Failed to fetch the generated image from Fal.ai.",
        { cause: error },
      );
    }
  },
};
