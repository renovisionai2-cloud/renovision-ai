export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-gold/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gold/[0.03] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12 xl:gap-16">
          <article className="flex flex-col gap-6 lg:gap-7">
            <p
              className="animate-fade-in-up inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold sm:text-xs"
              style={{ animationDelay: "0.1s", opacity: 0 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              RenoVision AI · Premium Visualization
            </p>

            <h1
              className="animate-fade-in-up font-[family-name:var(--font-cormorant)] text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem] xl:text-6xl"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              See your space{" "}
              <span className="gradient-text">reimagined</span> before you
              renovate
            </h1>

            <p
              className="animate-fade-in-up max-w-md text-base leading-relaxed text-muted sm:text-lg"
              style={{ animationDelay: "0.35s", opacity: 0 }}
            >
              Upload a room photo and watch RenoVision AI deliver photorealistic
              interior designs — luxury finishes, perfect lighting, zero
              guesswork.
            </p>

            <div
              className="animate-fade-in-up flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "0.5s", opacity: 0 }}
            >
              <a href="#contact" className="btn-primary">
                Request a Demo
              </a>
              <a href="#how-it-works" className="btn-secondary gap-2">
                See How It Works
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            <ul
              className="animate-fade-in-up grid grid-cols-3 gap-4 border-t border-border/80 pt-6 sm:gap-6 sm:pt-8"
              style={{ animationDelay: "0.65s", opacity: 0 }}
            >
              {[
                { value: "50K+", label: "Rooms visualized" },
                { value: "4.9★", label: "Avg. rating" },
                { value: "<30s", label: "Render time" },
              ].map((stat) => (
                <li key={stat.label}>
                  <p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-gold-light sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted sm:text-xs">{stat.label}</p>
                </li>
              ))}
            </ul>
          </article>

          <div
            className="animate-fade-in-up premium-frame flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated/60 p-8 text-center"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base">
              Upload your room photo in the dashboard to generate a real before-and-after
              AI visualization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
