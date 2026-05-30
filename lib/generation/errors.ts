export type RenderErrorCode =
  | "TIMEOUT"
  | "PROVIDER_FAILURE"
  | "INVALID_RESPONSE"
  | "NOT_CONFIGURED"
  | "UPLOAD_MISSING";

export class RenderProviderError extends Error {
  readonly code: RenderErrorCode;

  constructor(code: RenderErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "RenderProviderError";
    this.code = code;
  }
}

export function isRenderProviderError(error: unknown): error is RenderProviderError {
  return error instanceof RenderProviderError;
}

export function toRenderErrorMessage(error: unknown): string {
  if (isRenderProviderError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return "Generation failed.";
}
