import type { Metadata } from "next";
import Link from "next/link";
import { BillingContent } from "@/components/dashboard/BillingContent";

export const metadata: Metadata = {
  title: "Billing & Plan | RenoVision AI",
  description: "Manage your subscription, usage, invoices, and payment details.",
};

export default function BillingPage() {
  return (
    <>
      <header className="mb-8 sm:mb-10">
        <Link
          href="/dashboard"
          className="text-sm text-muted transition hover:text-gold-light"
        >
          ← Back to Dashboard
        </Link>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          Billing
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Billing & Plan
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Manage your subscription, usage, invoices, and payment details.
        </p>
      </header>

      <BillingContent />
    </>
  );
}
