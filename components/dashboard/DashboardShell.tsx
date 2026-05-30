"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { createClient } from "@/lib/supabase/client";

type DashboardUserContextValue = {
  welcomeName: string;
  userEmail: string;
};

const DashboardUserContext = createContext<DashboardUserContextValue>({
  welcomeName: "there",
  userEmail: "",
});

export function useDashboardUser() {
  return useContext(DashboardUserContext);
}

type DashboardShellProps = {
  children: React.ReactNode;
  welcomeName?: string;
  userEmail?: string;
};

const navLinkClass = (active: boolean) =>
  active
    ? "text-sm font-medium text-gold-light"
    : "text-sm text-muted transition hover:text-gold-light";

export function DashboardShell({
  children,
  welcomeName = "there",
  userEmail = "",
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDashboardHome = pathname === "/dashboard";
  const isProjects = pathname.startsWith("/dashboard/projects");
  const isDesigns = pathname.startsWith("/dashboard/designs");
  const isAccount = pathname.startsWith("/dashboard/account");

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <DashboardUserContext.Provider value={{ welcomeName, userEmail }}>
      <div className="relative min-h-screen">
        <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-96" aria-hidden />

        <header className="glass sticky top-0 z-50 border-b border-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
            <Link href="/dashboard" className="shrink-0 transition opacity-90 hover:opacity-100">
              <BrandLogo size="sm" className="sm:hidden" />
              <BrandLogo size="md" className="hidden sm:flex" />
            </Link>

            <nav className="hidden items-center gap-6 md:flex" aria-label="Dashboard">
              <Link href="/dashboard" className={navLinkClass(isDashboardHome)}>
                Dashboard
              </Link>
              <Link href="/dashboard/projects" className={navLinkClass(isProjects)}>
                Projects
              </Link>
              <Link href="/dashboard/designs" className={navLinkClass(isDesigns)}>
                Designs
              </Link>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/dashboard/account"
                className={`btn-secondary !px-4 !py-2 text-sm ${isAccount ? "border-gold/40 text-gold-light" : ""}`}
              >
                Account
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="text-sm text-muted transition hover:text-gold-light"
              >
                Sign Out
              </button>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
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
          </div>

          <div
            className={`glass border-t border-border md:hidden ${
              menuOpen
                ? "pointer-events-auto max-h-80 opacity-100"
                : "pointer-events-none max-h-0 overflow-hidden opacity-0"
            } transition-all duration-300`}
          >
            <nav className="flex flex-col gap-1 px-5 py-4" aria-label="Mobile dashboard">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${isDashboardHome ? "font-medium text-gold-light" : "text-muted"}`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/projects"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${isProjects ? "font-medium text-gold-light" : "text-muted"}`}
              >
                Projects
              </Link>
              <Link
                href="/dashboard/designs"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${isDesigns ? "font-medium text-gold-light" : "text-muted"}`}
              >
                Designs
              </Link>
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                <Link
                  href="/dashboard/account"
                  onClick={() => setMenuOpen(false)}
                  className={`btn-secondary w-full py-3 text-center text-sm ${isAccount ? "border-gold/40 text-gold-light" : ""}`}
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="text-sm text-muted transition hover:text-gold-light"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          {children}
        </main>
      </div>
    </DashboardUserContext.Provider>
  );
}
