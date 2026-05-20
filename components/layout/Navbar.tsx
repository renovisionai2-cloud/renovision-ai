"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen ? "glass py-3" : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <a href="#" className="shrink-0 transition opacity-90 hover:opacity-100">
          <BrandLogo size="sm" className="sm:hidden" />
          <BrandLogo size="md" className="hidden sm:flex" />
        </a>

        <ul className="hidden items-center gap-6 xl:flex xl:gap-8">
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

        <div className="hidden items-center gap-3 lg:flex">
          <a href="#contact" className="btn-secondary !px-5 !py-2.5 text-sm">
            Sign In
          </a>
          <a href="#contact" className="btn-primary !px-5 !py-2.5 text-sm">
            Request Demo
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`h-0.5 w-6 bg-foreground transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <div
        className={`glass fixed inset-0 top-[60px] flex flex-col gap-5 overflow-y-auto px-6 pb-10 pt-8 transition lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="font-[family-name:var(--font-cormorant)] text-2xl text-foreground"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="btn-primary mt-4 w-full py-4 text-center"
        >
          Request Demo
        </a>
      </div>
    </header>
  );
}
