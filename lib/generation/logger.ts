const PREFIX = "[renovision:render]";

export function isRenderDevLoggingEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export function renderLog(message: string, meta?: Record<string, unknown>): void {
  if (!isRenderDevLoggingEnabled()) return;
  if (meta) {
    console.log(PREFIX, message, meta);
  } else {
    console.log(PREFIX, message);
  }
}

export function renderWarn(message: string, meta?: Record<string, unknown>): void {
  if (!isRenderDevLoggingEnabled()) return;
  if (meta) {
    console.warn(PREFIX, message, meta);
  } else {
    console.warn(PREFIX, message);
  }
}

export function renderError(message: string, meta?: Record<string, unknown>): void {
  if (!isRenderDevLoggingEnabled()) return;
  if (meta) {
    console.error(PREFIX, message, meta);
  } else {
    console.error(PREFIX, message);
  }
}
