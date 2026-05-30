import { NextResponse } from "next/server";
import { isRenderProviderError } from "@/lib/generation/errors";

export function renderApiError(error: unknown, fallbackStatus = 500) {
  if (isRenderProviderError(error)) {
    const status =
      error.code === "NOT_CONFIGURED"
        ? 503
        : error.code === "UPLOAD_MISSING"
          ? 400
          : error.code === "INVALID_RESPONSE"
            ? 502
            : error.code === "TIMEOUT"
              ? 504
              : fallbackStatus;

    return NextResponse.json(
      { error: error.message, code: error.code },
      { status },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: fallbackStatus });
  }

  return NextResponse.json({ error: "Render request failed." }, { status: fallbackStatus });
}
