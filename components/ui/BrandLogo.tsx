type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { icon: "h-8 w-8 text-xs", text: "text-lg" },
  md: { icon: "h-9 w-9 text-sm", text: "text-xl" },
  lg: { icon: "h-11 w-11 text-sm", text: "text-2xl" },
};

export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/20 to-gold/5 font-bold text-gold ${s.icon}`}
      >
        RV
      </span>
      <span
        className={`font-[family-name:var(--font-cormorant)] font-semibold tracking-wide text-foreground ${s.text}`}
      >
        Reno<span className="text-gold">Vision</span>{" "}
        <span className="text-[0.65em] font-medium tracking-[0.12em] text-muted uppercase">
          AI
        </span>
      </span>
    </span>
  );
}
