import { BrandLogo } from "@/components/ui/BrandLogo";
import { navLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <a href="#" className="inline-block">
              <BrandLogo size="md" />
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              RenoVision AI — premium interior visualization for homeowners,
              contractors, and design professionals.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition hover:text-gold-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} RenoVision AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <a href="#" className="hover:text-gold-light">
              Privacy
            </a>
            <a href="#" className="hover:text-gold-light">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
