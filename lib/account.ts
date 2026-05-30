export const demoProfile = {
  name: "Darshan",
  email: "demo@renovision.ai",
  company: "RenoVision AI Demo",
} as const;

export const demoSecurity = {
  passwordHint: "Last updated recently",
  twoFactorEnabled: false,
} as const;

export const notificationPreferences = [
  { id: "email-updates", label: "Email updates", description: "Product news and feature announcements.", defaultOn: true },
  { id: "project-alerts", label: "Project status alerts", description: "When designs finish generating or projects change.", defaultOn: true },
  { id: "billing-reminders", label: "Billing reminders", description: "Renewal dates, invoices, and payment issues.", defaultOn: true },
  { id: "marketing", label: "Marketing emails", description: "Tips, case studies, and promotional offers.", defaultOn: false },
] as const;

export const demoWorkspace = {
  name: "RenoVision AI Workspace",
  role: "Owner",
  plan: "Pro",
} as const;
