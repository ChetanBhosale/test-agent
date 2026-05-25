"use client";

import { type ReactNode } from "react";

/**
 * Riverline typography system — one source of truth for headlines,
 * subheadings, eyebrows, and body text. Used by every screen so the
 * editorial rhythm stays consistent.
 *
 * Why a component (not just classes)? Because it locks down the spacing
 * tokens, max-widths, line-heights, and tracking — callers can't drift.
 * To change typography across the entire product, change it once, here.
 *
 * Modern CSS used:
 *   • text-wrap: balance  → headlines auto-balance lines, no manual <br />
 *   • text-wrap: pretty   → body paragraphs avoid orphan words
 *
 * Spacing rhythm (single source of truth):
 *   eyebrow → heading      14px (mb-3.5)
 *   heading → subheading   14px (mt-3.5)
 *   subheading → first input/section  32px (mt-8)
 *   between paragraphs     12px (mt-3)
 *   between sections       40px (mt-10)
 */

// ─── Display heading ───────────────────────────────────────────────────────

type HeadingSize = "compact" | "default" | "hero";

const HEADING_CLS: Record<HeadingSize, string> = {
  // 24px — for screen titles inside narrow surfaces (e.g. compact cards,
  // empty states, the splash wordmark area)
  compact: "text-[24px] leading-[1.1] tracking-[-0.02em]",
  // 32px — the canonical editorial display size used across onboarding,
  // welcome, and primary content sections
  default: "text-[32px] leading-[1.05] tracking-[-0.022em]",
  // 40px — for screens where the headline IS the screen (e.g. error,
  // onboarding completion, milestone moments)
  hero: "text-[40px] leading-[1.0] tracking-[-0.028em]",
};

export function DisplayHeading({
  children,
  size = "default",
  align = "left",
  className = "",
}: {
  children: ReactNode;
  size?: HeadingSize;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <h1
      className={
        "text-balance font-serif text-riverline-ink " +
        HEADING_CLS[size] +
        (align === "center" ? " text-center" : "") +
        " " +
        className
      }
      style={{ textWrap: "balance" }}
    >
      {children}
    </h1>
  );
}

// ─── Display subheading (paragraph beneath the heading) ────────────────────
//
// Width is locked at 320px because that's the optimal reading measure for
// 14.5px Inter inside a 342px-wide content area (390 device − 48 padding).
// Wider would hurt readability; narrower would feel cramped.

export function DisplaySubheading({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <p
      className={
        "max-w-[320px] text-pretty text-[14.5px] leading-[1.55] tracking-[-0.005em] text-riverline-mute " +
        (align === "center" ? "mx-auto text-center" : "") +
        " " +
        className
      }
      style={{ textWrap: "pretty" }}
    >
      {children}
    </p>
  );
}

// ─── Eyebrow (micro-label above headlines) ────────────────────────────────
//
// Plain tracked uppercase text — no chip, no dot, no border. The editorial
// approach used by Apple, Linear, Stripe. Reads as a section indicator
// without competing visually with the headline below it.

export function Eyebrow({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={
        "text-[10.5px] font-semibold uppercase tracking-[0.14em] text-riverline-mute " +
        (align === "center" ? "text-center" : "") +
        " " +
        className
      }
    >
      {children}
    </div>
  );
}

// ─── Body text — used inside cards, descriptions, captions ────────────────

export function BodyText({
  children,
  size = "default",
  className = "",
}: {
  children: ReactNode;
  size?: "default" | "small";
  className?: string;
}) {
  const cls =
    size === "small"
      ? "text-[12px] leading-[1.55]"
      : "text-[13.5px] leading-[1.55]";
  return (
    <p
      className={
        "text-pretty tracking-[-0.005em] text-riverline-mute " + cls + " " + className
      }
      style={{ textWrap: "pretty" }}
    >
      {children}
    </p>
  );
}

// ─── Stat numeral — large display number ──────────────────────────────────
//
// Tabular nums + serif for a confident "Bloomberg Terminal" feel.

export function StatNumeral({
  children,
  size = "default",
  className = "",
}: {
  children: ReactNode;
  size?: "small" | "default" | "large";
  className?: string;
}) {
  const cls =
    size === "large"
      ? "text-[60px] leading-[0.9] tracking-[-0.04em]"
      : size === "small"
        ? "text-[22px] leading-none tracking-[-0.022em]"
        : "text-[32px] leading-none tracking-[-0.025em]";
  return (
    <span
      className={
        "font-serif tabular-nums text-riverline-ink " + cls + " " + className
      }
    >
      {children}
    </span>
  );
}
