import type { UploadStyleId } from "@/lib/upload-styles";

/** Pipeline phases shown in the generation progress UI. */
export type GenerationPhase =
  | "uploading_image"
  | "preparing_render"
  | "generating_ai_visualization"
  | "finalizing"
  | "complete";

export type RenderJobStatus = "queued" | "running" | "completed" | "failed";

/** Provider ids reserved for future integrations (OpenAI, Replicate, Stability, Fal). */
export type RenderProviderId = "mock" | "openai" | "replicate" | "stability" | "fal";

export type RenderJob = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: RenderJobStatus;
  phase: GenerationPhase;
  progress: number;
  styleId: UploadStyleId;
  uploadId: string;
  provider: RenderProviderId;
  /** External provider job id for webhook / polling integrations. */
  externalJobId?: string;
  /** Provider model endpoint id (e.g. Fal model path). */
  providerModelId?: string;
  resultDesignId?: string;
  error?: string;
};

export type RenderRequest = {
  jobId: string;
  styleId: UploadStyleId;
  uploadId: string;
  beforeStorageKey?: string;
  beforeImageUrl: string;
};

export type RenderSubmission = {
  externalJobId: string;
  provider: RenderProviderId;
  modelId?: string;
};

export type RenderStatusResponse = {
  phase: GenerationPhase;
  progress: number;
  status: RenderJobStatus;
  error?: string;
  afterImageUrl?: string;
};

export type RenderResult = {
  afterImageUrl: string;
  designId: string;
};

export type RenderJobListener = (job: RenderJob) => void;

export interface RenderProvider {
  readonly id: RenderProviderId;
  submitRender(request: RenderRequest): Promise<RenderSubmission>;
  pollRenderStatus(externalJobId: string): Promise<RenderStatusResponse>;
  fetchCompletedResult(externalJobId: string, request: RenderRequest): Promise<RenderResult>;
}
