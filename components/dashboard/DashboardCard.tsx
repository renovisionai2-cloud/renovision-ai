import Link from "next/link";

type DashboardCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  secondaryActionLabel?: string;
  actionHref?: string;
  secondaryActionHref?: string;
  featured?: boolean;
  badge?: string;
  meta?: React.ReactNode;
};

export function DashboardCard({
  title,
  description,
  icon,
  actionLabel,
  secondaryActionLabel,
  actionHref,
  secondaryActionHref,
  featured = false,
  badge,
  meta,
}: DashboardCardProps) {
  const primaryClass = featured
    ? "btn-primary !px-5 !py-2.5 text-sm"
    : "btn-primary !px-5 !py-2.5 text-sm w-full sm:w-auto";

  const secondaryClass = "btn-secondary !px-5 !py-2.5 text-sm w-full sm:w-auto";

  return (
    <article
      className={`dashboard-card ${featured ? "border-gold/30 bg-gradient-to-br from-gold/[0.06] to-surface-elevated/60" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
            featured
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-border bg-surface text-gold"
          }`}
        >
          {icon}
        </span>
        {badge ? (
          <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
        {meta ? <p className="text-xs font-medium text-gold-light">{meta}</p> : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {actionHref ? (
          <Link href={actionHref} className={primaryClass}>
            {actionLabel}
          </Link>
        ) : (
          <button type="button" className={primaryClass}>
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel ? (
          secondaryActionHref ? (
            <Link href={secondaryActionHref} className={secondaryClass}>
              {secondaryActionLabel}
            </Link>
          ) : (
            <button type="button" className={secondaryClass}>
              {secondaryActionLabel}
            </button>
          )
        ) : null}
      </div>
    </article>
  );
}
