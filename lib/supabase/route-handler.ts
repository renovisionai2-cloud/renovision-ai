import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type RouteHandlerSupabase = ReturnType<typeof createServerClient>;

/**
 * Supabase client for Route Handlers — session cookies must be written onto the
 * redirect response, not only the request cookie jar.
 */
export function createRouteHandlerClient(
  request: NextRequest,
  response: NextResponse,
): RouteHandlerSupabase {
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

export function isEmailOtpType(value: string): value is EmailOtpType {
  return [
    "signup",
    "invite",
    "magiclink",
    "recovery",
    "email_change",
    "email",
  ].includes(value);
}
