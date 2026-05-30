import type { GenerationPhase } from "@/lib/generation/types";

export const GENERATION_PHASE_ORDER: GenerationPhase[] = [
  "uploading_image",
  "preparing_render",
  "generating_ai_visualization",
  "finalizing",
  "complete",
];

export const GENERATION_PHASE_LABELS: Record<GenerationPhase, string> = {
  uploading_image: "Uploading image",
  preparing_render: "Preparing render",
  generating_ai_visualization: "Generating AI visualization",
  finalizing: "Finalizing",
  complete: "Complete",
};

export function phaseProgress(phase: GenerationPhase): number {
  const index = GENERATION_PHASE_ORDER.indexOf(phase);
  if (index < 0) return 0;
  return Math.round((index / (GENERATION_PHASE_ORDER.length - 1)) * 100);
}
