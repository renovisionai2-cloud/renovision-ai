import {
  currentPlan,
  demoInvoices,
  paymentMethod,
  planComparison,
  usageStats,
} from "@/lib/billing";

function usagePercent(value: number, max: number | null): number {
  if (max === null) return Math.min(value * 4, 40);
  return Math.min(Math.round((value / max) * 100), 100);
}

const cardBase =
  "premium-frame flex h-full min-w-0 flex-col rounded-3xl bg-surface-elevated/50 p-6 sm:p-8";
const cardFeatured =
  "premium-frame flex h-full min-w-0 flex-col rounded-3xl bg-gradient-to-br from-gold/[0.08] via-surface-elevated/80 to-surface p-6 sm:p-8";
const btnPrimary = "btn-primary w-full sm:w-auto";
const btnSecondary = "btn-secondary w-full sm:w-auto";
const btnCompact =
  "btn-secondary inline-flex min-h-[2.75rem] min-w-0 flex-1 items-center justify-center !px-5 !py-2.5 text-sm sm:min-w-[6rem] sm:flex-none";

export function BillingContent() {
  return (
    <div className="min-w-0 space-y-6 lg:space-y-8">
      {/* Row 1: Current Plan + Usage — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <section className={cardFeatured}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
              Current Plan
            </h2>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
              {currentPlan.status}
            </span>
          </div>
          <p className="mt-4 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-gold-light">
            {currentPlan.name}
          </p>
          <p className="mt-1 text-lg text-foreground">
            {currentPlan.price}
            <span className="text-muted"> / {currentPlan.period}</span>
          </p>
          <p className="mt-4 text-sm text-muted">
            Renews on <span className="text-foreground">{currentPlan.renewalDate}</span>
          </p>
          <div className="mt-auto pt-6">
            <button type="button" className={btnPrimary}>
              Manage Plan
            </button>
          </div>
        </section>

        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Usage
          </h2>
          <p className="mt-1 text-sm text-muted">Your workspace activity this billing period.</p>
          <ul className="mt-6 flex-1 space-y-5">
            {usageStats.map((stat) => {
              const percent = usagePercent(stat.value, stat.max);
              return (
                <li key={stat.label}>
                  <div className="flex items-end justify-between gap-2 text-sm">
                    <span className="text-muted">{stat.label}</span>
                    <span className="font-medium text-foreground">{stat.displayValue}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-dim via-gold to-gold-light transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted">{stat.hint}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Row 2: Payment + Invoices — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Payment Method
          </h2>
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-background/40 p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 text-xs font-bold uppercase text-gold">
              {paymentMethod.brand}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground">
                {paymentMethod.brand} ending in {paymentMethod.last4}
              </p>
              <p className="text-sm text-muted">Expires {paymentMethod.expiry}</p>
            </div>
          </div>
          <div className="mt-auto pt-6">
            <button type="button" className={btnSecondary}>
              Update Payment Method
            </button>
          </div>
        </section>

        <section className={cardBase}>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Invoices
          </h2>
          <ul className="mt-6 flex-1 divide-y divide-border/80">
            {demoInvoices.map((invoice) => (
              <li
                key={invoice.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{invoice.date}</p>
                  <p className="text-sm text-muted">
                    {invoice.amount} ·{" "}
                    <span className="text-gold-light">{invoice.status}</span>
                  </p>
                </div>
                <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                  <button type="button" className={btnCompact}>
                    View
                  </button>
                  <button type="button" className={btnCompact}>
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Plan Comparison — full width, stacks on mobile */}
      <section className={`${cardBase} w-full overflow-visible`}>
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold sm:text-3xl">
          Plan Comparison
        </h2>
        <p className="mt-1 text-sm text-muted">
          Compare plans and upgrade when you&apos;re ready.
        </p>
        <ul className="mt-8 grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {planComparison.map((plan) => (
            <li
              key={plan.id}
              className={`card-glow flex min-h-[17.5rem] min-w-0 flex-col rounded-2xl border p-6 sm:min-h-[18.5rem] ${
                plan.current
                  ? "border-gold/40 bg-gradient-to-b from-gold/10 to-surface-elevated/60"
                  : "border-border bg-background/30"
              }`}
            >
              <span
                className={`mb-3 block min-h-5 w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  plan.current
                    ? "bg-gold/15 text-gold"
                    : "invisible select-none"
                }`}
                aria-hidden={!plan.current}
              >
                Current plan
              </span>
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold">
                {plan.name}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-gold-light">
                ${plan.price}
                <span className="text-base font-normal text-muted">/mo</span>
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {plan.description}
              </p>
              <div className="mt-auto pt-6">
                <button
                  type="button"
                  className={`w-full ${plan.current ? "btn-secondary" : "btn-primary"}`}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Change Plan"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
