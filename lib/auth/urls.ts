/** Allowed post-auth redirect paths (prevent open redirects). */
export function sanitizeAuthRedirect(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }
  return path;
}

/** Canonical app origin for auth redirects (production: https://www.renovisionapp.com). */
export function getSiteOrigin(request?: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`;
    }
    return new URL(request.url).origin;
  }

  return "http://localhost:3000";
}

/** Full callback URL for Supabase emailRedirectTo / OAuth redirectTo. */
export function getAuthCallbackUrl(redirect = "/dashboard"): string {
  const origin = getSiteOrigin();
  const safeRedirect = sanitizeAuthRedirect(redirect);
  return `${origin}/auth/callback?redirect=${encodeURIComponent(safeRedirect)}`;
}
