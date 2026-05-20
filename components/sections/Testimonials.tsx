import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <SectionShell id="testimonials" variant="surface">
      <FadeIn>
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by homeowners & pros"
          description="Join thousands who've transformed how they plan, pitch, and perfect their spaces with RenoVision AI."
        />
      </FadeIn>

      <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
        {testimonials.map((t, i) => (
          <FadeIn key={t.author} delay={i * 100}>
            <li className="card-glow feature-card flex h-full list-none flex-col">
              <div className="flex gap-1 text-gold" aria-label={`${t.rating} stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-border/80 pt-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-gold/5 text-sm font-semibold text-gold">
                  {t.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className="font-medium text-foreground">{t.author}</p>
                  <p className="text-xs text-muted">
                    {t.role} · {t.location}
                  </p>
                </div>
              </footer>
            </li>
          </FadeIn>
        ))}
      </ul>
    </SectionShell>
  );
}
