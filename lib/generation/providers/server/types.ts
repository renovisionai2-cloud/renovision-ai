import type { GenerationPhase, RenderJobStatus, RenderProviderId } from "@/lib/generation/types";
import type { UploadStyleId } from "@/lib/upload-styles";

export type ServerRenderSubmitInput = {
  jobId: string;
  styleId: UploadStyleId;
  uploadId: string;
  beforeImageDataUrl: string;
};

export type ServerRenderSubmission = {
  requestId: string;
  provider: RenderProviderId;
  modelId: string;
};

export type ServerRenderStatus = {
  status: RenderJobStatus;
  phase: GenerationPhase;
  progress: number;
  error?: string;
  afterImageUrl?: string;
};

export type ServerRenderResult = {
  afterImageUrl: string;
  seed?: number;
};

export interface ServerRenderProvider {
  readonly id: RenderProviderId;
  submit(input: ServerRenderSubmitInput): Promise<ServerRenderSubmission>;
  pollStatus(requestId: string, modelId: string): Promise<ServerRenderStatus>;
  fetchResult(requestId: string, modelId: string): Promise<ServerRenderResult>;
}
