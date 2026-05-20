"use client";

import { FormEvent, useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <SectionShell id="contact" variant="gradient" className="pb-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <FadeIn>
          <SectionHeader
            align="left"
            eyebrow="Contact"
            title="Request a demo"
            description="See RenoVision AI in action. Tell us about your project and we'll schedule a personalized walkthrough within one business day."
          />
          <ul className="mt-8 space-y-4">
            {[
              "Live product walkthrough",
              "Custom style recommendations",
              "Team & enterprise pricing",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={120}>
          <form
            onSubmit={onSubmit}
            className="premium-frame grid gap-5 rounded-2xl bg-surface-elevated/80 p-6 sm:gap-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted">First name</span>
                <input
                  required
                  name="firstName"
                  type="text"
                  className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="Alex"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted">Last name</span>
                <input
                  required
                  name="lastName"
                  type="text"
                  className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="Morgan"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted">Work email</span>
              <input
                required
                name="email"
                type="email"
                className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                placeholder="you@company.com"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted">I&apos;m a</span>
              <select
                name="role"
                className="rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
              >
                <option>Homeowner</option>
                <option>Contractor / Builder</option>
                <option>Interior Designer</option>
                <option>Real Estate Agent</option>
                <option>Enterprise</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted">Message</span>
              <textarea
                required
                name="message"
                rows={4}
                className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                placeholder="Tell us about your project or team..."
              />
            </label>
            <button type="submit" className="btn-primary w-full py-4">
              {submitted ? "Request Sent ✓" : "Request Demo"}
            </button>
            {submitted && (
              <p className="text-center text-sm text-gold-light">
                Thank you! The RenoVision AI team will be in touch shortly.
              </p>
            )}
          </form>
        </FadeIn>
      </div>
    </SectionShell>
  );
}
