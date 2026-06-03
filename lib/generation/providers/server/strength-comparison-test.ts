import "server-only";

import { fal } from "@fal-ai/client";
import { getRenderServerConfig } from "@/lib/generation/config";
import { RenderProviderError } from "@/lib/generation/errors";
import { buildStyleRenderPrompt } from "@/lib/generation/style-prompts";
import type { UploadStyleId } from "@/lib/upload-styles";

/** Temporary A/B presets — same prompt & image, strength is the variable. */
export const STRENGTH_TEST_LOW = {
  label: "preserve-structure",
  strength: 0.35,
  guidance_scale: 3.5,
  num_inference_steps: 30,
} as const;

export const STRENGTH_TEST_HIGH = {
  label: "production-default-strength",
  strength: 0.95,
  guidance_scale: 3.5,
  num_inference_steps: 30,
} as const;

export type StrengthTestPreset = typeof STRENGTH_TEST_LOW | typeof STRENGTH_TEST_HIGH;

export type StrengthComparisonRun = {
  label: string;
  strength: number;
  guidance_scale: number;
  num_inference_steps: number;
  requestId: string;
  afterImageUrl: string;
  elapsedMs: number;
};

type FalImageOutput = {
  images?: Array<{ url?: string }>;
};

function extractAfterImageUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const output = data as FalImageOutput;
  const url = output.images?.[0]?.url;
  return typeof url === "string" && url.length > 0 ? url : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollFalResult(
  modelId: string,
  requestId: string,
  timeoutMs: number,
  intervalMs: number,
): Promise<string> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const status = (await fal.queue.status(modelId, { requestId, logs: false })) as {
      status: string;
    };

    if (status.status === "COMPLETED") {
      const result = await fal.queue.result(modelId, { requestId });
      const url = extractAfterImageUrl(result.data);
      if (!url) {
        throw new RenderProviderError(
          "INVALID_RESPONSE",
          "Fal completed without an image URL.",
        );
      }
      return url;
    }

    if (status.status === "FAILED") {
      throw new RenderProviderError("PROVIDER_FAILURE", "Fal reported FAILED status.");
    }

    await sleep(intervalMs);
  }

  throw new RenderProviderError("TIMEOUT", "Timed out waiting for Fal strength test result.");
}

async function runPreset(
  modelId: string,
  preset: StrengthTestPreset,
  imageUrl: string,
  prompt: string,
  outputFormat: "jpeg" | "png",
  timeoutMs: number,
  intervalMs: number,
): Promise<StrengthComparisonRun> {
  const started = Date.now();

  console.info("[renovision:strength-test] submit", {
    label: preset.label,
    strength: preset.strength,
    guidance_scale: preset.guidance_scale,
    num_inference_steps: preset.num_inference_steps,
    image_url_length: imageUrl.length,
    prompt_length: prompt.length,
  });

  const submission = await fal.queue.submit(modelId, {
    input: {
      image_url: imageUrl,
      prompt,
      strength: preset.strength,
      guidance_scale: preset.guidance_scale,
      num_inference_steps: preset.num_inference_steps,
      output_format: outputFormat,
      num_images: 1,
    },
  });

  if (!submission.request_id) {
    throw new RenderProviderError("INVALID_RESPONSE", "Fal did not return request_id.");
  }

  const afterImageUrl = await pollFalResult(
    modelId,
    submission.request_id,
    timeoutMs,
    intervalMs,
  );

  return {
    label: preset.label,
    strength: preset.strength,
    guidance_scale: preset.guidance_scale,
    num_inference_steps: preset.num_inference_steps,
    requestId: submission.request_id,
    afterImageUrl,
    elapsedMs: Date.now() - started,
  };
}

/** Runs low (0.35) vs high (0.95) strength with identical image + prompt. */
export async function runStrengthComparison(params: {
  imageUrl: string;
  styleId: UploadStyleId;
}): Promise<{
  modelId: string;
  prompt: string;
  imageUrlLength: number;
  productionDefaults: {
    strength: number;
    guidance_scale: number;
    num_inference_steps: number;
  };
  low: StrengthComparisonRun;
  high: StrengthComparisonRun;
}> {
  const config = getRenderServerConfig();
  if (!config.falKey) {
    throw new RenderProviderError(
      "NOT_CONFIGURED",
      "FAL_KEY is not set.",
    );
  }

  fal.config({ credentials: config.falKey });
  const prompt = buildStyleRenderPrompt(params.styleId);

  console.info("[renovision:strength-test] starting A/B", {
    modelId: config.falModelId,
    prompt,
    imageUrlLength: params.imageUrl.length,
    low: STRENGTH_TEST_LOW,
    high: STRENGTH_TEST_HIGH,
  });

  const [low, high] = await Promise.all([
    runPreset(
      config.falModelId,
      STRENGTH_TEST_LOW,
      params.imageUrl,
      prompt,
      config.falOutputFormat,
      config.requestTimeoutMs,
      config.pollIntervalMs,
    ),
    runPreset(
      config.falModelId,
      STRENGTH_TEST_HIGH,
      params.imageUrl,
      prompt,
      config.falOutputFormat,
      config.requestTimeoutMs,
      config.pollIntervalMs,
    ),
  ]);

  return {
    modelId: config.falModelId,
    prompt,
    imageUrlLength: params.imageUrl.length,
    productionDefaults: {
      strength: config.falStrength,
      guidance_scale: config.falGuidanceScale,
      num_inference_steps: config.falNumInferenceSteps,
    },
    low,
    high,
  };
}
