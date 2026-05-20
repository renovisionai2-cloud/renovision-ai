import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { pricingPlans } from "@/lib/data";

export function Pricing() {
  return (
    <SectionShell id="pricing" variant="gradient">
      <FadeIn>
        <SectionHeader
          eyebrow="Pricing Plans"
          title="Invest in clarity, not costly mistakes"
          description="Flexible plans for homeowners, design lovers, and industry professionals. All plans include a 14-day free trial."
        />
      </FadeIn>

      <ul className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
        {pricingPlans.map((plan, i) => (
          <FadeIn key={plan.name} delay={i * 100}>
            <li
              className={`card-glow relative flex h-full list-none flex-col rounded-2xl border p-7 transition duration-500 sm:p-8 ${
                plan.highlighted
                  ? "border-gold/40 bg-gradient-to-b from-gold/12 via-surface-elevated to-surface-elevated shadow-xl shadow-gold/10 lg:scale-[1.03]"
                  : "border-border bg-surface-elevated/50"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-gold-dim via-gold to-gold-light px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
                  Most Popular
                </span>
              )}
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-1 border-b border-border/80 pb-6">
                <span className="font-[family-name:var(--font-cormorant)] text-5xl font-semibold text-gold-light">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted">/{plan.period}</span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 block rounded-full py-3.5 text-center text-sm font-semibold transition ${
                  plan.highlighted ? "btn-primary w-full" : "btn-secondary w-full"
                }`}
              >
                {plan.cta}
              </a>
            </li>
          </FadeIn>
        ))}
      </ul>
    </SectionShell>
  );
}
