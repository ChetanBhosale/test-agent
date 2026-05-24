"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
import { useApp } from "@/context/app-context";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Riverline mark ────────────────────────────────────────────────────────
export function RiverlineMark({ size = 56 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex items-center justify-center rounded-2xl bg-riverline-primary shadow-[0_8px_24px_-8px_rgba(91,47,224,0.5)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 36 36"
        fill="none"
      >
        <motion.path
          d="M3 14 Q11 6 18 14 T33 14"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
        />
        <motion.path
          d="M3 22 Q11 14 18 22 T33 22"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.18 }}
        />
        <motion.path
          d="M3 30 Q11 22 18 30 T33 30"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.32 }}
        />
      </svg>
    </motion.div>
  );
}

// ─── Top-bar back button ───────────────────────────────────────────────────
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
      whileHover={{ backgroundColor: "rgba(15,18,38,0.05)" }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-riverline-ink-2"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M12 4 L6 10 L12 16"
          stroke="currentColor"
          strokeWidth="2"
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
}: {
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
  topRight?: ReactNode;
}) {
  return (
    <div className="relative flex h-full w-full flex-col bg-white text-riverline-ink">
      {/* Top bar — sits below the device status bar */}
      <div className="flex h-12 items-center justify-between px-3 pt-[54px]">
        <div className="flex items-center">{showBack && <BackButton />}</div>
        <div>{topRight}</div>
      </div>

      <div className="no-scroll flex-1 overflow-y-auto px-6 pb-4 pt-2">
        {children}
      </div>

      {footer && <div className="px-6 pb-9 pt-3">{footer}</div>}
    </div>
  );
}

// ─── Buttons ────────────────────────────────────────────────────────────────
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
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -1 }}
      transition={{ type: "spring", stiffness: 480, damping: 26 }}
      className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-riverline-primary px-6 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_8px_24px_-8px_rgba(91,47,224,0.55)] transition-colors duration-150 hover:bg-riverline-primary-soft disabled:opacity-35 disabled:shadow-none"
    >
      {children}
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
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 480, damping: 26 }}
      className="inline-flex h-[52px] w-full items-center justify-center rounded-full border border-riverline-line bg-white px-6 text-[14px] font-semibold text-riverline-ink-2 hover:bg-riverline-card"
    >
      {children}
    </motion.button>
  );
}

// ─── Headline ───────────────────────────────────────────────────────────────
/**
 * Staggered eyebrow / title / body intro. Honors prefers-reduced-motion.
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
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: EASE },
      };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {eyebrow && (
        <motion.div
          {...item}
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-riverline-mute"
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h1
        {...item}
        className="font-serif text-[34px] italic leading-[1.05] tracking-[-0.015em] text-riverline-ink"
      >
        {title}
      </motion.h1>
      {body && (
        <motion.p
          {...item}
          className="mt-3 max-w-[340px] text-[15px] leading-[1.55] text-riverline-mute"
        >
          {body}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── Form helpers ───────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-riverline-mute">
      {children}
    </label>
  );
}

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
      ? "bg-emerald-50 text-emerald-700"
      : "bg-riverline-river-soft text-riverline-river";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      className="rounded-2xl border border-riverline-line bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${palette}`}
          aria-hidden
        >
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-riverline-ink">
            {title}
          </div>
          <div className="mt-1 text-[12.5px] leading-relaxed text-riverline-mute">
            {body}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
