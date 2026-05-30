"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDashboardUser } from "@/components/dashboard/DashboardShell";
import {
  demoSecurity,
  demoWorkspace,
  notificationPreferences,
} from "@/lib/account";
import { createClient } from "@/lib/supabase/client";

const cardBase =
  "premium-frame flex h-full min-w-0 flex-col rounded-3xl bg-surface-elevated/50 p-6 sm:p-8";
const dangerCard =
  "premium-frame flex w-full min-w-0 flex-col overflow-visible rounded-3xl border border-red-500/25 bg-surface-elevated/50 p-6 sm:p-8";
const btnPrimary = "btn-primary w-full sm:w-auto";
const btnSecondary = "btn-secondary w-full sm:w-auto";
const btnDanger =
  "inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-full border border-red-500/30 bg-red-950/30 px-8 py-3.5 text-sm font-medium text-red-300/90 transition hover:border-red-400/40 hover:bg-red-950/50 sm:w-auto";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/60 py-3 last:border-0 last:pb-0 first:pt-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground sm:text-base">{value}</p>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 border-b border-border/60 py-4 first:pt-0 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted sm:text-sm">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${label} notifications`}
        onClick={onToggle}
        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition ${
          enabled
            ? "border-gold/50 bg-gold/25"
            : "border-border bg-surface"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-foreground shadow transition ${
            enabled ? "translate-x-5 bg-gold-light" : "translate-x-0"
          }`}
        />
      </button>
    </li>
  );
}

export function AccountContent() {
  const router = useRouter();
  const { welcomeName, userEmail } = useDashboardUser();
  const [notifications, setNotifications] = useState(() =>
    Object.fromEntries(
      notificationPreferences.map((pref) => [pref.id, pref.defaultOn]),
    ) as Record<string, boolean>,
  );

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-w-0 space-y-6 pb-2 lg:space-y-8">
      {/* Row 1: Profile + Security — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Profile
          </h2>
          <p className="mt-1 text-sm text-muted">Your personal and company information.</p>
          <div className="mt-6 flex-1">
            <DetailRow label="Name" value={welcomeName === "there" ? "—" : welcomeName} />
            <DetailRow label="Email" value={userEmail || "—"} />
            <DetailRow label="Company" value={demoWorkspace.name} />
          </div>
          <div className="mt-auto pt-6">
            <button type="button" className={btnPrimary}>
              Edit Profile
            </button>
          </div>
        </section>

        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Password & Security
          </h2>
          <p className="mt-1 text-sm text-muted">Keep your account secure.</p>
          <div className="mt-6 flex-1 space-y-4">
            <DetailRow label="Password" value={demoSecurity.passwordHint} />
            <DetailRow
              label="Two-factor authentication"
              value={demoSecurity.twoFactorEnabled ? "On" : "Off"}
            />
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:flex-wrap">
            <button type="button" className={btnSecondary}>
              Change Password
            </button>
            <button type="button" className={btnPrimary}>
              Enable 2FA
            </button>
          </div>
        </section>
      </div>

      {/* Row 2: Notifications + Workspace — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-muted">Choose what we send to your inbox.</p>
          <ul className="mt-6 flex-1">
            {notificationPreferences.map((pref) => (
              <NotificationToggle
                key={pref.id}
                label={pref.label}
                description={pref.description}
                enabled={notifications[pref.id] ?? pref.defaultOn}
                onToggle={() => toggleNotification(pref.id)}
              />
            ))}
          </ul>
        </section>

        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Workspace
          </h2>
          <p className="mt-1 text-sm text-muted">Your team workspace and plan.</p>
          <div className="mt-6 flex-1">
            <DetailRow label="Workspace name" value={demoWorkspace.name} />
            <DetailRow label="Role" value={demoWorkspace.role} />
            <DetailRow label="Plan" value={demoWorkspace.plan} />
          </div>
          <div className="mt-auto pt-6">
            <button type="button" className={btnSecondary}>
              Manage Workspace
            </button>
          </div>
        </section>
      </div>

      {/* Danger Zone — full width, stacks on mobile */}
      <section className={dangerCard}>
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-red-300/90 sm:text-3xl">
          Danger Zone
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Sign out of this device or permanently remove your account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <button type="button" onClick={() => void signOut()} className={btnSecondary}>
            Sign Out
          </button>
          <button type="button" className={btnDanger}>
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
