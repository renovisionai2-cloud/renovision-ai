import { FeatureIcon } from "@/components/icons/FeatureIcons";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { howItWorksSteps } from "@/lib/data";

export function HowItWorks() {
  return (
    <SectionShell id="how-it-works" variant="surface">
      <FadeIn>
        <SectionHeader
          eyebrow="How It Works"
          title="From photo to vision in four steps"
          description="RenoVision AI streamlines the entire visualization workflow — no design experience required."
        />
      </FadeIn>

      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
        {howItWorksSteps.map((item, i) => (
          <FadeIn key={item.step} delay={i * 80}>
            <li className="card-glow feature-card group relative flex h-full list-none flex-col">
              <span className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
                <FeatureIcon name={item.icon} className="h-5 w-5" />
              </span>
              <span className="mt-5 text-xs font-semibold tracking-widest text-gold">
                STEP {item.step}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-xl font-semibold sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </li>
          </FadeIn>
        ))}
      </ol>
    </SectionShell>
  );
}
