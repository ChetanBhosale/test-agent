"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

/**
 * Riverline screen kit — the single source of truth for layout primitives
 * shared across Home, Credit, Loans, Profile, and any future surface.
 *
 * Owning this here (instead of redefining in each screen) is what unifies
 * the spacing rhythm, motion timing, surface depth, and section hierarchy
 * across the entire app. Change a value here → every screen updates in step.
 */

// ─── Motion tokens ─────────────────────────────────────────────────────────
//
// SOFT_EASE is the calm, non-bouncy curve used everywhere. Anything else
// would feel inconsistent with the app's emotional register.

export const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

// ─── Surface elevation ─────────────────────────────────────────────────────
//
// Three card depths only. Hero = the centerpiece of a screen,
// card = standard grouping, tile = small-scale grids.
//
// Each depth uses an inner top highlight (gives it a "lit from above" feel)
// + a sharp 1px shadow + a soft long-throw shadow. No solid borders anywhere.

export function softShadow(strength: "card" | "hero" | "tile" = "card") {
  if (strength === "hero") {
    return [
      "inset 0 1px 0 rgba(255,255,255,0.95)",
      "0 1px 1px rgba(12,14,20,0.04)",
      "0 4px 10px -4px rgba(12,14,20,0.06)",
      "0 24px 56px -28px rgba(12,14,20,0.18)",
    ].join(", ");
  }
  if (strength === "tile") {
    return [
      "inset 0 1px 0 rgba(255,255,255,0.9)",
      "0 1px 1px rgba(12,14,20,0.03)",
      "0 4px 10px -6px rgba(12,14,20,0.05)",
    ].join(", ");
  }
  return [
    "inset 0 1px 0 rgba(255,255,255,0.92)",
    "0 1px 1px rgba(12,14,20,0.035)",
    "0 6px 16px -10px rgba(12,14,20,0.08)",
  ].join(", ");
}

// ─── Page wrapper ──────────────────────────────────────────────────────────
//
// Calm matte canvas. One ambient warm radial — no colored accents.
// Honors the device frame's white surface inside the iPhone shell.

export function ScreenSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "relative h-full w-full bg-riverline-bg text-riverline-ink " +
        className
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% -10%, rgba(12,14,20,0.025) 0%, transparent 60%)",
        }}
      />
      <div className="no-scroll relative z-10 h-full overflow-y-auto pb-[120px]">
        {children}
      </div>
    </div>
  );
}

// ─── Screen header ─────────────────────────────────────────────────────────
//
// Editorial title in serif at 24px, optional small action on the right.
// Sits below the iPhone status bar with consistent vertical rhythm.

export function ScreenHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-[64px] pb-2">
      <h1 className="font-serif text-[24px] leading-none tracking-[-0.02em] text-riverline-ink">
        {title}
      </h1>
      {action}
    </div>
  );
}

// ─── Section title ─────────────────────────────────────────────────────────
//
// Numbered eyebrow (mono) + title (sans) + optional hint or CTA.
// Consistent 40px top space, 12px bottom space — the universal cadence.

export function SectionTitle({
  eyebrow,
  title,
  hint,
  cta,
  onCta,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <div className="mt-10 mb-3 flex items-baseline justify-between px-5">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-riverline-mute-2">
          {eyebrow}
        </span>
        <h2 className="text-[15px] font-semibold tracking-[-0.012em] text-riverline-ink">
          {title}
        </h2>
        {hint && (
          <span className="ml-1 text-[11px] font-medium text-riverline-mute-2">
            {hint}
          </span>
        )}
      </div>
      {cta && (
        <button
          type="button"
          onClick={onCta}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[12px] font-medium text-riverline-mute transition-colors hover:text-riverline-ink"
        >
          {cta}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M3 5.5h5M6 3l2.5 2.5L6 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Stagger ───────────────────────────────────────────────────────────────
//
// Calm fade + lift entrance. Honors prefers-reduced-motion. The single
// motion primitive used to bring sections in across every screen.

export function Stagger({
  children,
  delay = 0,
  noPad = false,
}: {
  children: ReactNode;
  delay?: number;
  noPad?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: SOFT_EASE, delay }}
      className={noPad ? "" : "px-5"}
    >
      {children}
    </motion.div>
  );
}

// ─── Tonal divider ─────────────────────────────────────────────────────────
//
// A hairline that fades at both ends — replaces hard card borders so cards
// feel like they're separated by light, not by lines.

export function TonalDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={"h-px " + className}
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(12,14,20,0.07) 20%, rgba(12,14,20,0.07) 80%, transparent)",
      }}
    />
  );
}

// ─── Trust footer ──────────────────────────────────────────────────────────
//
// Institutional reassurance line. Used at the bottom of long screens to
// quietly remind users this is a regulated, made-with-care product.

export function ScreenFooter({
  primary = "Riverline · v1.0",
  secondary = "RBI-regulated lending partners · Made in India",
}: {
  primary?: string;
  secondary?: string;
}) {
  return (
    <div className="mt-12 px-5 pb-2 text-center">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-riverline-mute-2">
        {primary}
      </div>
      <div className="mt-1 text-[10px] text-riverline-mute-2">{secondary}</div>
    </div>
  );
}
