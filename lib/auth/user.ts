import type { User } from "@supabase/supabase-js";

export function firstNameFromFullName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] ?? "there";
}

export function getWelcomeName(user: User | null | undefined): string {
  if (!user) return "there";

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    "";

  if (fullName.trim()) {
    return firstNameFromFullName(fullName);
  }

  if (user.email) {
    return user.email.split("@")[0] ?? "there";
  }

  return "there";
}

export function getUserDisplayEmail(user: User | null | undefined): string {
  return user?.email ?? "";
}
