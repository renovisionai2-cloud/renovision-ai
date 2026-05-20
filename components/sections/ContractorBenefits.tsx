import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { contractorBenefits } from "@/lib/data";

export function ContractorBenefits() {
  return (
    <SectionShell id="contractors" variant="surface">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <FadeIn>
          <SectionHeader
            align="left"
            eyebrow="Contractor Benefits"
            title="Win more projects with visual proof"
            description="RenoVision AI helps contractors and renovation firms close faster, reduce change orders, and deliver a premium client experience."
          />
          <a href="#contact" className="btn-primary mt-8 inline-flex">
            Request Contractor Demo
          </a>
        </FadeIn>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {contractorBenefits.map((benefit, i) => (
            <FadeIn key={benefit.title} delay={i * 80}>
              <li className="card-glow feature-card flex h-full list-none flex-col sm:flex-row sm:items-start sm:gap-5 lg:flex-col lg:gap-0">
                <div className="shrink-0">
                  <p className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold gradient-text">
                    {benefit.stat}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                    {benefit.statLabel}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 lg:mt-4">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold sm:text-xl">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {benefit.description}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
