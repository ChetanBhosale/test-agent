"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, type ReactNode } from "react";
import { tap, hover } from "./motion-system";

/**
 * Tactile — the universal pressable primitive.
 *
 * Every clickable surface in the app should use this instead of a raw
 * `motion.button`. It applies the centralized tap/hover physics so we
 * never drift into one-off scale/spring values.
 *
 * Variants map to common interaction surfaces:
 *   • row    — list rows, settings rows, chat suggestions
 *   • card   — full-card targets like loan offers, smart actions
 *   • button — explicit CTAs
 *   • chip   — toggles, small interactive labels
 *
 * Consumers can still pass any motion prop (whileHover, animate, etc.)
 * which will merge with the variant's defaults.
 */

export type TactileVariant = "row" | "card" | "button" | "chip";

type TactileProps = Omit<HTMLMotionProps<"button">, "type"> & {
  variant?: TactileVariant;
  /** When true, applies a 2px hover lift (cards & buttons only) */
  liftOnHover?: boolean;
  type?: "button" | "submit";
  children: ReactNode;
};

const Tactile = forwardRef<HTMLButtonElement, TactileProps>(function Tactile(
  {
    variant = "row",
    liftOnHover = false,
    type = "button",
    whileTap,
    whileHover,
    children,
    ...rest
  },
  ref,
) {
  const tapPreset =
    variant === "card"
      ? tap.card
      : variant === "button"
        ? tap.button
        : variant === "chip"
          ? tap.chip
          : tap.row;

  const hoverPreset =
    liftOnHover && (variant === "card")
      ? hover.cardLift
      : liftOnHover && variant === "button"
        ? hover.buttonLift
        : undefined;

  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={whileTap ?? tapPreset}
      whileHover={whileHover ?? hoverPreset}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

export { Tactile };
