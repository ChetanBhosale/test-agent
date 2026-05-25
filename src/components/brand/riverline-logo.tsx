"use client";

import { type CSSProperties } from "react";

/**
 * Riverline brand mark — a clean uppercase "R" set on the deep indigo brand
 * square. Recreated as inline SVG so it ships crisp at any size and stays
 * consistent across surfaces (splash, header, dev panel, etc.).
 *
 * Tones:
 *  - "brand": deep indigo square + white R (matches the uploaded asset)
 *  - "ink":   near-black square + white R (compact UI like nav bars)
 *  - "white": white-on-transparent (overlays / dark surfaces)
 *
 * The geometry is intentionally bold and slightly wider than a typical
 * sans-serif R — closer to Inter Black at -0.02em — so it reads as a logo
 * mark rather than just a letter.
 */
export function RiverlineLogo({
  size = 64,
  tone = "brand",
  rounded = true,
  className,
  style,
}: {
  size?: number;
  tone?: "brand" | "ink" | "white";
  /** When false, renders the R glyph alone (no square tile) */
  rounded?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const palette =
    tone === "ink"
      ? { tile: "#0c0e14", glyph: "#ffffff" }
      : tone === "white"
        ? { tile: "transparent", glyph: "#ffffff" }
        : { tile: "#2A1B7C", glyph: "#ffffff" };

  // Tile corner radius — subtle, premium, like the iOS Wallet card icon
  const radius = rounded ? size * 0.18 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Tile */}
      {rounded && (
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx={radius * (100 / size)}
          fill={palette.tile}
        />
      )}

      {/*
        R glyph — recreated in path form so the geometry is locked across
        sizes and platforms. The bowl uses an evenodd cutout (no white square
        showing through) and the leg is angled slightly outward like the
        uploaded mark.
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={palette.glyph}
        d="
          M28 18
          H58
          C72 18 81 26 81 39
          C81 49 75 56 65 58.5
          L84 82
          H68
          L51 60
          H43
          V82
          H28
          Z
          M43 31
          V47
          H56
          C63 47 66.5 44 66.5 39
          C66.5 34 63 31 56 31
          Z
        "
      />
    </svg>
  );
}

/**
 * Wordmark — small text "Riverline" rendered in the brand serif.
 */
export function RiverlineWordmark({
  className = "",
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "brand" | "white";
}) {
  const color =
    tone === "brand"
      ? "text-[#2A1B7C]"
      : tone === "white"
        ? "text-white"
        : "text-riverline-ink";
  return (
    <span
      className={`font-serif tracking-[-0.025em] ${color} ${className}`}
    >
      Riverline
    </span>
  );
}
