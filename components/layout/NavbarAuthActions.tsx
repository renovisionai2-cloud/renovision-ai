"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function NavbarAuthActions({ onNavigate }: { onNavigate?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(Boolean(session));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="hidden items-center gap-3 lg:flex">
        <span className="text-sm text-muted">…</span>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/dashboard" className="btn-secondary !px-5 !py-2.5 text-sm">
            Dashboard
          </Link>
          <Link href="/dashboard/upload" className="btn-primary !px-5 !py-2.5 text-sm">
            New Visualization
          </Link>
        </div>
        <div className="flex flex-col gap-3 lg:hidden">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="btn-secondary mt-4 w-full py-4 text-center"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/upload"
            onClick={onNavigate}
            className="btn-primary w-full py-4 text-center"
          >
            New Visualization
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden items-center gap-3 lg:flex">
        <Link href="/sign-in" className="btn-secondary !px-5 !py-2.5 text-sm">
          Sign In
        </Link>
        <Link href="/sign-up" className="btn-primary !px-5 !py-2.5 text-sm">
          Get Started
        </Link>
      </div>
      <div className="flex flex-col gap-3 lg:hidden">
        <Link
          href="/sign-in"
          onClick={onNavigate}
          className="btn-secondary mt-4 w-full py-4 text-center"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          onClick={onNavigate}
          className="btn-primary w-full py-4 text-center"
        >
          Get Started
        </Link>
      </div>
    </>
  );
}
