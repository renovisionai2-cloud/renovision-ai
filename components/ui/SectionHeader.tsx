type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignClass =
    align === "center"
      ? "mx-auto text-center items-center"
      : "text-left items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
        {eyebrow}
      </span>
      <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
