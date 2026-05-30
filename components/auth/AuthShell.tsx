import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-gold/[0.05] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-20 h-64 w-64 rounded-full bg-gold/[0.04] blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 px-5 py-6 sm:px-8">
        <Link href="/" className="inline-block transition opacity-90 hover:opacity-100">
          <BrandLogo size="md" />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="premium-frame rounded-3xl bg-surface/80 p-8 sm:p-10">
            <div className="mb-8 text-center sm:text-left">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                Customer Portal
              </p>
              <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
            </div>

            {children}

            <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
              {footer}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            <Link href="/" className="transition hover:text-gold-light">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
