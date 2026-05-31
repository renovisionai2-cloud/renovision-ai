const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed:
    "We could not complete sign-in from your email link. Please try signing in again.",
  confirmation_failed:
    "Email confirmation failed or the link has expired. Request a new confirmation email by signing up again, or sign in if you already confirmed.",
  session_exchange_failed:
    "Your sign-in link is invalid or has expired. Please sign in with your email and password.",
  missing_auth_params:
    "This confirmation link is incomplete. Open the latest email from RenoVision AI or sign in manually.",
  oauth_denied: "Sign-in was cancelled. You can try again when ready.",
};

export function getAuthErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  return AUTH_ERROR_MESSAGES[code] ?? "Authentication failed. Please try again.";
}
