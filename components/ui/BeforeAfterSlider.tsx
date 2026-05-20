"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  size?: "default" | "hero";
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  size = "default",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = () => {
    dragging.current = true;
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  };

  const aspect =
    size === "hero"
      ? "aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]"
      : "aspect-[16/10] min-h-[240px]";

  return (
    <div
      ref={containerRef}
      className={`premium-frame group relative w-full cursor-ew-resize select-none overflow-hidden rounded-2xl sm:rounded-3xl ${aspect}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerMove={onPointerMove}
      onClick={(e) => updatePosition(e.clientX)}
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className="object-cover transition duration-700 group-hover:scale-[1.02]"
        sizes={size === "hero" ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 768px) 100vw, 1200px"}
        priority={size === "hero"}
      />

      <figure
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes={size === "hero" ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 768px) 100vw, 1200px"}
          priority={size === "hero"}
        />
      </figure>

      <span
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-gradient-to-b from-transparent via-gold to-transparent shadow-[0_0_24px_rgba(201,169,98,0.5)]"
        style={{ left: `${position}%` }}
      />

      <span
        className={`pointer-events-none absolute top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-background/95 shadow-xl shadow-gold/20 backdrop-blur-md transition group-hover:scale-105 ${
          size === "hero" ? "h-14 w-14" : "h-12 w-12"
        }`}
        style={{ left: `${position}%` }}
        aria-hidden
      >
        <svg
          className={`text-gold ${size === "hero" ? "h-6 w-6" : "h-5 w-5"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            transform="rotate(90 12 12)"
          />
        </svg>
      </span>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-border/80 bg-background/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted backdrop-blur-md sm:left-5 sm:top-5 sm:text-xs">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-gradient-to-r from-gold-dim via-gold to-gold-light px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-background shadow-lg sm:right-5 sm:top-5 sm:text-xs">
        AI After
      </span>

      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}
