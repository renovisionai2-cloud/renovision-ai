import "server-only";

import type { RenderServerConfig } from "@/lib/generation/config";

export type FalModelFamily = "flux-dev-i2i" | "flux-kontext-dev" | "flux-kontext-pro";

export function getFalModelFamily(modelId: string): FalModelFamily {
  if (modelId.includes("flux/dev/image-to-image")) {
    return "flux-dev-i2i";
  }
  if (modelId.includes("flux-kontext/dev")) {
    return "flux-kontext-dev";
  }
  if (modelId.includes("kontext")) {
    return "flux-kontext-pro";
  }
  return "flux-dev-i2i";
}

/** Builds model-specific Fal queue input from shared RenoVision settings. */
export function buildFalQueueInput(
  config: RenderServerConfig,
  prompt: string,
  imageUrl: string,
): Record<string, unknown> {
  const family = getFalModelFamily(config.falModelId);
  const base = {
    prompt,
    image_url: imageUrl,
    num_images: 1,
    output_format: config.falOutputFormat,
  };

  switch (family) {
    case "flux-kontext-dev":
      return {
        ...base,
        guidance_scale: config.falGuidanceScale,
        num_inference_steps: config.falNumInferenceSteps,
        resolution_mode: config.falResolutionMode,
        enable_safety_checker: true,
      };
    case "flux-kontext-pro":
      return {
        ...base,
        guidance_scale: config.falGuidanceScale,
        enhance_prompt: false,
      };
    case "flux-dev-i2i":
    default:
      return {
        ...base,
        strength: config.falStrength,
        guidance_scale: config.falGuidanceScale,
        num_inference_steps: config.falNumInferenceSteps,
      };
  }
}
