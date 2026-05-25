"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import { RiverlineLogo } from "@/components/brand/riverline-logo";

const EASE = [0.22, 1, 0.36, 1] as const;
const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

// ─── Riverline brand mark ──────────────────────────────────────────────────
/**
 * Premium "R" mark — uses the official Riverline logo.
 */
export function RiverlineMark({ size = 64 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: SOFT_EASE }}
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        filter:
          "drop-shadow(0 1px 2px rgba(42,27,124,0.18)) drop-shadow(0 8px 24px rgba(42,27,124,0.18))",
      }}
      aria-hidden
    >
      <RiverlineLogo size={size} tone="brand" />
    </motion.div>
  );
}

// ─── Back button ───────────────────────────────────────────────────────────
export function BackButton({
  label = "Back",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  const { goBack, canGoBack } = useApp();
  if (!canGoBack) return null;
  return (
    <motion.button
      type="button"
      onClick={onClick ?? goBack}
      aria-label={label}
      whileHover={{ backgroundColor: "rgba(12,14,20,0.04)" }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="-ml-1.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-riverline-ink"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M11 4 L5.5 9 L11 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

// ─── Skip button — premium with arrow ──────────────────────────────────────
export function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="group inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-riverline-mute transition-colors hover:text-riverline-ink"
    >
      Skip
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        <path
          d="M2 5.5h7M6.5 2.5l3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

// ─── Onboarding screen frame ───────────────────────────────────────────────
export function OnboardingFrame({
  children,
  footer,
  showBack = true,
  topRight,
  centerContent = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
  topRight?: ReactNode;
  /** If true, vertically centers the main content area for hero-style screens. */
  centerContent?: boolean;
}) {
  return (
    <div className="relative flex h-full w-full flex-col bg-riverline-bg text-riverline-ink">
      {/* Top bar — sits below the device status bar */}
      <div className="relative z-10 flex h-12 items-center justify-between px-4 pt-[54px]">
        <div className="flex items-center">{showBack && <BackButton />}</div>
        <div>{topRight}</div>
      </div>

      <div
        className={
          "no-scroll relative z-10 flex-1 overflow-y-auto px-6 pt-3 pb-4 " +
          (centerContent ? "flex flex-col justify-center" : "")
        }
      >
        {children}
      </div>

      {footer && (
        <div className="relative z-10 px-6 pt-3 pb-9">{footer}</div>
      )}
    </div>
  );
}

// ─── Primary CTA — matte ink-black, premium fintech ────────────────────────
// ─── Primary CTA — Riverline brand purple, premium fintech ────────────────
export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={
        disabled ? undefined : { scale: 0.985, transition: { duration: 0.12 } }
      }
      className="relative inline-flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] px-6 text-[14.5px] font-semibold tracking-[-0.005em] text-white transition-all duration-150 disabled:cursor-not-allowed disabled:shadow-none"
      style={{
        // Riverline primary brand color — the only button fill in the app
        background: disabled
          ? "rgba(74,51,184,0.32)"
          : "rgb(74,51,184)",
        boxShadow: disabled
          ? "none"
          : [
              "0 1px 2px rgba(42,27,124,0.45)",
              "0 4px 12px -2px rgba(74,51,184,0.30)",
              "0 12px 32px -8px rgba(74,51,184,0.40)",
              "inset 0 1px 0 rgba(255,255,255,0.16)",
              "inset 0 -1px 0 rgba(0,0,0,0.22)",
            ].join(", "),
      }}
    >
      {/* Subtle top highlight */}
      {!disabled && (
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          }}
          aria-hidden
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export function GhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className="inline-flex h-[52px] w-full items-center justify-center rounded-[14px] border border-riverline-line bg-white px-6 text-[14px] font-semibold text-riverline-ink transition-colors hover:bg-riverline-card"
    >
      {children}
    </motion.button>
  );
}

// ─── Headline ───────────────────────────────────────────────────────────────
/**
 * Staggered eyebrow / title / body intro.
 *
 * Built on the unified typography rhythm:
 *   • Eyebrow uses plain tracked uppercase (no chip) — editorial signal
 *   • Title: 32px serif, leading-[1.05], tracking-[-0.022em], text-balance
 *   • Body:  14.5px, leading-[1.55], max-w-[320px], text-pretty
 *
 * Spacing tokens: eyebrow→title 14px, title→body 14px.
 *
 * Honors prefers-reduced-motion.
 */
export function ScreenHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const item = reduce
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: SOFT_EASE },
      };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {eyebrow && (
        <motion.div
          {...item}
          className="mb-3.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-riverline-mute"
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h1
        {...item}
        className="text-balance font-serif text-[32px] leading-[1.05] tracking-[-0.022em] text-riverline-ink"
        style={{ textWrap: "balance" }}
      >
        {title}
      </motion.h1>
      {body && (
        <motion.p
          {...item}
          className="mt-3.5 max-w-[320px] text-pretty text-[14.5px] leading-[1.55] tracking-[-0.005em] text-riverline-mute"
          style={{ textWrap: "pretty" }}
        >
          {body}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Premium pill / chip ───────────────────────────────────────────────────
/**
 * Matte fintech-style chip. Small radius, refined typography, subtle dot.
 */
export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "ink" | "success";
}) {
  const palette =
    tone === "ink"
      ? "bg-riverline-ink text-white border-riverline-ink"
      : tone === "success"
        ? "bg-riverline-flow-soft text-riverline-flow border-transparent"
        : "bg-riverline-card text-riverline-ink-2 border-riverline-line-2/60";

  const dotColor =
    tone === "ink"
      ? "bg-white/80"
      : tone === "success"
        ? "bg-riverline-flow"
        : "bg-riverline-ink/70";

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.1em] " +
        palette
      }
    >
      <span
        className={"inline-block h-[5px] w-[5px] rounded-full " + dotColor}
        aria-hidden
      />
      {children}
    </span>
  );
}

// ─── Form helpers ───────────────────────────────────────────────────────────
// Note: FieldLabel was moved to src/components/shared/field.tsx — import it
// from there for any new code. This export was removed to keep the input
// system unified.

export function HelperText({
  tone = "info",
  icon,
  title,
  body,
  delay = 0.2,
}: {
  tone?: "info" | "success";
  icon: ReactNode;
  title: string;
  body: string;
  delay?: number;
}) {
  const palette =
    tone === "success"
      ? "bg-riverline-flow-soft text-riverline-flow"
      : "bg-riverline-ink/[0.05] text-riverline-ink";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: SOFT_EASE, delay }}
      className="rounded-[14px] border border-riverline-line bg-white p-3.5"
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${palette}`}
          aria-hidden
        >
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-riverline-ink">
            {title}
          </div>
          <div className="mt-0.5 text-[12px] leading-[1.55] text-riverline-mute">
            {body}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step indicator — refined, native iOS quality ──────────────────────────
export function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div
      className="flex items-center gap-1"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i < current ? 18 : 6,
            // Riverline brand accent for completed steps — subtle but
            // emotionally distinct from the calm neutral track.
            backgroundColor:
              i < current ? "rgb(74,51,184)" : "rgba(74,51,184,0.14)",
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className="h-[4px] rounded-[2px]"
        />
      ))}
    </div>
  );
}

export { EASE, SOFT_EASE };
