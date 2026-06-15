import { FeatureIcon } from "@/components/icons/FeatureIcons";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { aiFeatures } from "@/lib/data";

export function AIFeatures() {
  return (
    <SectionShell id="features" variant="gradient">
      <FadeIn>
        <SectionHeader
          eyebrow="AI Visualization Features"
          title="Everything you need to sell the vision"
          description="Powerful tools built for homeowners, contractors, and design professionals — all in one luxury platform."
        />
      </FadeIn>

      <FadeIn delay={100} className="mt-12 lg:mt-16">
        <div className="premium-frame flex min-h-[240px] items-center justify-center overflow-hidden rounded-3xl bg-surface-elevated/30 p-8 text-center sm:min-h-[320px]">
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Generate photorealistic room designs from your own photos — no stock placeholders.
          </p>
        </div>
      </FadeIn>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
        {aiFeatures.map((feature, i) => (
          <FadeIn key={feature.title} delay={120 + i * 60}>
            <li className="card-glow feature-card group flex h-full list-none flex-col">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold transition group-hover:border-gold/40">
                  <FeatureIcon name={feature.icon} />
                </span>
                <span className="rounded-full border border-gold/20 bg-gold/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                  {feature.tag}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </li>
          </FadeIn>
        ))}
      </ul>
    </SectionShell>
  );
}
