import { sanitizeAuthRedirect, getSiteOrigin } from "@/lib/auth/urls";
import { NextResponse, type NextRequest } from "next/server";
import {
  createRouteHandlerClient,
  isEmailOtpType,
} from "@/lib/supabase/route-handler";

function redirectToSignIn(
  origin: string,
  errorCode: string,
  description?: string | null,
): NextResponse {
  const url = new URL("/sign-in", origin);
  url.searchParams.set("error", errorCode);
  if (description) {
    url.searchParams.set("error_description", description.slice(0, 200));
  }
  return NextResponse.redirect(url);
}

function redirectToDashboard(origin: string, redirectPath: string): NextResponse {
  const response = NextResponse.redirect(new URL(redirectPath, origin));
  return response;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getSiteOrigin(request);

  const redirectParam =
    requestUrl.searchParams.get("redirect") ??
    requestUrl.searchParams.get("next");
  const redirectPath = sanitizeAuthRedirect(redirectParam);

  const oauthError = requestUrl.searchParams.get("error");
  const oauthErrorDescription = requestUrl.searchParams.get("error_description");
  if (oauthError) {
    return redirectToSignIn(
      origin,
      oauthError === "access_denied" ? "oauth_denied" : "auth_callback_failed",
      oauthErrorDescription,
    );
  }

  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const otpType = requestUrl.searchParams.get("type");

  if (!code && !(tokenHash && otpType)) {
    return redirectToSignIn(origin, "missing_auth_params");
  }

  const successResponse = redirectToDashboard(origin, redirectPath);
  const supabase = createRouteHandlerClient(request, successResponse);

  if (tokenHash && otpType) {
    if (!isEmailOtpType(otpType)) {
      return redirectToSignIn(origin, "confirmation_failed", "Invalid confirmation type.");
    }

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });

    if (error) {
      console.error("[auth/callback] verifyOtp failed:", error.message);
      return redirectToSignIn(origin, "confirmation_failed", error.message);
    }

    return successResponse;
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
      return redirectToSignIn(origin, "session_exchange_failed", error.message);
    }

    return successResponse;
  }

  return redirectToSignIn(origin, "missing_auth_params");
}
