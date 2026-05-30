import "server-only";

import type { UploadStyleId } from "@/lib/upload-styles";
import { getStyleLabel } from "@/lib/generation/style-context";

const STYLE_PROMPT_FRAGMENTS: Record<UploadStyleId, string> = {
  modern:
    "modern interior design with clean lines, neutral palette, contemporary furniture, minimal clutter, and balanced natural lighting",
  luxury:
    "luxury interior design with rich materials, statement lighting, refined finishes, layered textures, and an upscale atmosphere",
  coastal:
    "coastal interior design with airy tones, natural textures, soft whites and blues, relaxed elegance, and abundant natural light",
  japandi:
    "japandi interior design with warm minimalism, organic forms, muted earthy tones, calm balance, and handcrafted simplicity",
  farmhouse:
    "farmhouse interior design with rustic warmth, natural wood, timeless comfort, soft textiles, and inviting lived-in character",
  minimalist:
    "minimalist interior design with uncluttered space, soft contrast, quiet luxury, restrained palette, and intentional simplicity",
};

/** Builds the provider-facing prompt for a selected upload style. */
export function buildStyleRenderPrompt(styleId: UploadStyleId): string {
  const label = getStyleLabel(styleId);
  const fragment = STYLE_PROMPT_FRAGMENTS[styleId];

  return [
    `Redesign this exact room into a realistic ${label} interior design.`,
    fragment,
    "Keep the SAME room structure, walls, windows, floor, ceiling, and camera angle.",
    "Only change furniture, finishes, lighting, decor, cabinetry, colors, and materials.",
    "Do NOT generate outdoor scenes, streets, bridges, cities, landscapes, or fantasy environments.",
    "Preserve the original architecture and room proportions exactly.",
    "Create a highly realistic luxury interior rendering.",
  ].join(" ");
}