import type { RenderJobStatus } from "@/lib/generation/types";
import type { UploadStyleId } from "@/lib/upload-styles";

export type RenderSession = {
  requestId: string;
  jobId: string;
  styleId: UploadStyleId;
  uploadId: string;
  modelId: string;
  provider: "fal";
  status: RenderJobStatus;
  afterImageUrl?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
};

const sessions = new Map<string, RenderSession>();

export function upsertRenderSession(session: RenderSession): void {
  sessions.set(session.requestId, session);
}

export function getRenderSession(requestId: string): RenderSession | undefined {
  return sessions.get(requestId);
}

export function patchRenderSession(
  requestId: string,
  patch: Partial<RenderSession>,
): RenderSession | undefined {
  const existing = sessions.get(requestId);
  if (!existing) return undefined;
  const next = { ...existing, ...patch, updatedAt: Date.now() };
  sessions.set(requestId, next);
  return next;
}

export function findRenderSessionByJobId(jobId: string): RenderSession | undefined {
  for (const session of sessions.values()) {
    if (session.jobId === jobId) return session;
  }
  return undefined;
}
