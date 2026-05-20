import type { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  children: ReactNode;
  variant?: "default" | "surface" | "gradient";
  className?: string;
};

const variants = {
  default: "",
  surface: "bg-surface",
  gradient:
    "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.08),transparent_55%)]",
};

export function SectionShell({
  id,
  children,
  variant = "default",
  className = "",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`section-padding relative overflow-hidden ${variants[variant]} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(201,169,98,0.02)_50%,transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
