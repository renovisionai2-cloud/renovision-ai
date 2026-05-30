export const DEMO_USER_STORAGE_KEY = "renovision-demo-user";

export type DemoUser = {
  firstName: string;
  email: string;
};

export function firstNameFromFullName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] ?? "";
}

export function saveDemoUser(user: DemoUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
}

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoUser;
    if (!parsed?.email) return null;
    return {
      firstName: typeof parsed.firstName === "string" ? parsed.firstName.trim() : "",
      email: parsed.email.trim(),
    };
  } catch {
    return null;
  }
}

export function clearDemoUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_USER_STORAGE_KEY);
}

/** Name shown in “Hello, …” — first name only; empty if none saved */
export function getWelcomeName(user: DemoUser | null): string | null {
  if (!user?.firstName) return null;
  return user.firstName;
}
