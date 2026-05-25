"use client";

import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Riverline unified field system.
 *
 * One height (56px), one radius (14px), one focus treatment, one
 * label/helper rhythm — used by every input across the app.
 *
 * Composition:
 *   <Field label="…" helper="…" error="…" status="ok | error">
 *     <FieldRow>
 *       <FieldPrefix> +91 </FieldPrefix>
 *       <FieldInput placeholder="…" />
 *       <FieldStatusBadge value={…} ok={…} error={…} />
 *     </FieldRow>
 *   </Field>
 *
 * Or for OTP-style segmented inputs, FieldCell composes the same
 * surface tokens at a single-character footprint.
 */

// ─── Tokens ────────────────────────────────────────────────────────────────

export const FIELD_HEIGHT = 56;
export const FIELD_RADIUS = 14;
export const FIELD_INNER_RADIUS = 10;
export const FIELD_PREFIX_HEIGHT = 40;

// Shared base shadow set keeps every field optically identical.
const BASE_SHADOW = [
  "inset 0 1px 0 rgba(255,255,255,0.85)",
  "0 1px 1px rgba(12,14,20,0.025)",
].join(", ");

// Focus state — strategic Riverline brand accent halo (deep matte purple)
// at 10% opacity. Restrained enough to read as "this field is active"
// without ever feeling like a colored fintech app.
const FOCUS_SHADOW = [
  "inset 0 1px 0 rgba(255,255,255,0.85)",
  "0 1px 1px rgba(12,14,20,0.025)",
  "0 0 0 4px rgba(74,51,184,0.10)",
].join(", ");

const ERROR_SHADOW = [
  "inset 0 1px 0 rgba(255,255,255,0.85)",
  "0 1px 1px rgba(12,14,20,0.025)",
  "0 0 0 4px rgba(196,73,58,0.08)",
].join(", ");

const SUCCESS_SHADOW = [
  "inset 0 1px 0 rgba(255,255,255,0.85)",
  "0 1px 1px rgba(12,14,20,0.025)",
  "0 0 0 4px rgba(31,138,118,0.07)",
].join(", ");

// ─── Field shell ───────────────────────────────────────────────────────────

export type FieldStatus = "default" | "ok" | "error";

export function Field({
  label,
  helper,
  error,
  status = "default",
  children,
  className = "",
}: {
  label?: string;
  helper?: ReactNode;
  error?: string;
  status?: FieldStatus;
  children: ReactNode;
  className?: string;
}) {
  const effectiveStatus: FieldStatus = error ? "error" : status;

  return (
    <div className={"w-full " + className}>
      {label && <FieldLabel>{label}</FieldLabel>}

      <div data-field-status={effectiveStatus}>{children}</div>

      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <FieldFooter key="error" tone="error">
            {error}
          </FieldFooter>
        ) : helper ? (
          <FieldFooter key="helper" tone="muted">
            {helper}
          </FieldFooter>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─── Label ─────────────────────────────────────────────────────────────────
// Editorial uppercase micro-label. Consistent 10px bottom margin.

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
      {children}
    </label>
  );
}

// ─── Footer (helper / error) ───────────────────────────────────────────────

function FieldFooter({
  tone,
  children,
}: {
  tone: "muted" | "error";
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -2 }}
      transition={{ duration: 0.25, ease: SOFT_EASE }}
      className={
        "mt-2 flex items-center gap-1.5 text-[11.5px] leading-[1.45] " +
        (tone === "error" ? "text-riverline-danger" : "text-riverline-mute")
      }
    >
      {tone === "error" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M6 3.5v3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
        </svg>
      )}
      <span>{children}</span>
    </motion.div>
  );
}

// ─── Row (the visible 56px input shell) ────────────────────────────────────

export function FieldRow({
  children,
  status = "default",
  className = "",
}: {
  children: ReactNode;
  status?: FieldStatus;
  className?: string;
}) {
  // Status drives border + shadow, NEVER the height/padding.
  const borderColor =
    status === "error"
      ? "rgb(196,73,58)"
      : status === "ok"
        ? "rgb(31,138,118)"
        : "rgb(236,232,222)"; // riverline-line

  return (
    <div
      data-field-row
      className={
        "group relative flex items-stretch gap-2 bg-white transition-all duration-200 focus-within:[--field-shadow:var(--field-shadow-focus)] " +
        className
      }
      style={
        {
          height: FIELD_HEIGHT,
          padding: 8,
          borderRadius: FIELD_RADIUS,
          border: `1px solid ${borderColor}`,
          boxShadow:
            status === "error"
              ? ERROR_SHADOW
              : status === "ok"
                ? SUCCESS_SHADOW
                : "var(--field-shadow, " + BASE_SHADOW + ")",
          // CSS vars so :focus-within can swap shadow without changing the
          // border (which is animated only via color above)
          ["--field-shadow" as string]: BASE_SHADOW,
          ["--field-shadow-focus" as string]:
            status === "default" ? FOCUS_SHADOW : ERROR_SHADOW,
        } as React.CSSProperties
      }
    >
      {/* Focus border accent — added on top of base border without layout shift */}
      <FocusBorder show={status === "default"} />
      {children}
    </div>
  );
}

function FocusBorder({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-200 group-focus-within:opacity-100"
      style={{
        // Riverline brand accent — appears only on focus, never at rest
        boxShadow: "inset 0 0 0 1px rgba(74,51,184,0.45)",
      }}
    />
  );
}

// ─── Prefix slot (country code, masked digits, etc.) ───────────────────────
// 40px tall, 10px radius — sits inside the 56px shell with 8px padding.

export function FieldPrefix({
  children,
  variant = "filled",
}: {
  children: ReactNode;
  variant?: "filled" | "ghost";
}) {
  return (
    <div
      className={
        "flex shrink-0 items-center gap-1.5 px-3 text-[15px] font-semibold tracking-[-0.005em] " +
        (variant === "ghost"
          ? "text-riverline-mute-2"
          : "text-riverline-ink")
      }
      style={{
        height: FIELD_PREFIX_HEIGHT,
        borderRadius: FIELD_INNER_RADIUS,
        background:
          variant === "filled" ? "var(--color-riverline-card)" : "transparent",
      }}
    >
      {children}
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────
// Stripped of all browser chrome. Picks up its color/font from the row.
// Use modifiers via props rather than re-styling here.

export type FieldInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** "tracked" applies wide letter-spacing for things like PAN/Aadhaar */
  variant?: "default" | "tracked";
};

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  function FieldInput({ variant = "default", className = "", ...rest }, ref) {
    return (
      <input
        ref={ref}
        {...rest}
        className={
          "min-w-0 flex-1 bg-transparent px-2 outline-none placeholder:text-riverline-mute-2 " +
          (variant === "tracked"
            ? "text-[18px] font-semibold tracking-[0.16em] tabular-nums text-riverline-ink placeholder:font-normal placeholder:tracking-[0.16em] "
            : "text-[16px] font-semibold tracking-[0.02em] text-riverline-ink placeholder:font-normal placeholder:tracking-[0.02em] ") +
          className
        }
      />
    );
  },
);

// ─── Status badge (right-side hint) ────────────────────────────────────────
// Shows remaining-chars count by default, swaps to a green check on `ok`,
// or a red ✕ on `error`.

export function FieldStatusBadge({
  value,
  ok,
  error,
  remaining,
}: {
  /** Current input length — used to decide whether to show the badge */
  value?: string;
  /** True when the field is fully valid */
  ok?: boolean;
  /** True when the field has an explicit error */
  error?: boolean;
  /** Characters remaining (rendered when neither ok nor error) */
  remaining?: number;
}) {
  if (!value || value.length === 0) return null;

  return (
    <div className="flex shrink-0 items-center pr-1.5">
      {ok ? (
        <motion.div
          key="ok"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: SOFT_EASE }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-riverline-flow-soft"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M2 5.5l2.5 2.5L9 3.5"
              stroke="rgb(31,138,118)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      ) : error ? (
        <motion.div
          key="err"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: SOFT_EASE }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M3.5 3.5l4 4M7.5 3.5l-4 4"
              stroke="rgb(196,73,58)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ) : typeof remaining === "number" ? (
        <motion.div
          key="rem"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: SOFT_EASE }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-riverline-card"
        >
          <span className="text-[10px] font-semibold tabular-nums text-riverline-mute">
            {remaining}
          </span>
        </motion.div>
      ) : null}
    </div>
  );
}

// ─── OTP cell ──────────────────────────────────────────────────────────────
// Single-character input that shares the field surface tokens.
// Used by the OTP screen so its segmented inputs feel exactly like every
// other field — same border treatment, same focus shadow, same height.

export const FieldCell = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { filled?: boolean }
>(function FieldCell({ filled, className = "", ...rest }, ref) {
  return (
    <input
      ref={ref}
      {...rest}
      className={
        "w-full text-center text-[20px] font-semibold tabular-nums text-riverline-ink outline-none transition-all duration-200 focus:[--cell-shadow:var(--cell-shadow-focus)] " +
        className
      }
      style={
        {
          height: FIELD_HEIGHT,
          borderRadius: FIELD_RADIUS,
          // Filled cells use a subtle Riverline accent border so the user
          // can see at a glance how many digits are entered. Empty cells
          // stay neutral.
          border: `1px solid ${filled ? "rgba(74,51,184,0.35)" : "rgb(236,232,222)"}`,
          background: filled ? "rgba(74,51,184,0.04)" : "white",
          boxShadow: "var(--cell-shadow, " + BASE_SHADOW + ")",
          ["--cell-shadow" as string]: BASE_SHADOW,
          ["--cell-shadow-focus" as string]: FOCUS_SHADOW,
          ...rest.style,
        } as React.CSSProperties
      }
    />
  );
});
