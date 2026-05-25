/**
 * Riverline motion system — the single source of truth for animation
 * physics across the entire app.
 *
 * Why this exists: previously each surface defined its own ease, spring, and
 * duration. The result felt close-but-not-quite consistent. Centralizing
 * tokens here means every transition speaks one motion language.
 *
 * Usage:
 *   import { ease, spring, duration } from "@/components/shared/motion-system";
 *   <motion.div transition={{ ...ease.soft, duration: duration.card }} />
 */

// ─── Eases ────────────────────────────────────────────────────────────────
//
// Two cubic-bezier curves cover almost everything in the app:
//   • soft  — calm, decelerating, used for entrances, fades, page transitions
//   • sweep — slightly more dramatic acceleration, used for sweeps & shimmers

export const ease = {
  /** Calm decelerating ease — entrances, fades, content reveals */
  soft: [0.4, 0, 0.2, 1] as const,
  /** Slightly more dramatic — light sweeps, shimmer passes */
  sweep: [0.65, 0, 0.35, 1] as const,
} as const;

// ─── Springs ──────────────────────────────────────────────────────────────
//
// Used for tactile interactions where a tween would feel mechanical:
// toggles, layout transitions, drag-back-to-rest, tab cradles.

export const spring = {
  /** Soft press feedback — buttons, taps, ripples */
  press: { type: "spring", stiffness: 500, damping: 32, mass: 0.7 } as const,
  /** Magnetic snap — toggles, segmented controls, layoutId glides */
  snap: { type: "spring", stiffness: 480, damping: 36 } as const,
  /** Sheet open/close — heavier, more controlled */
  sheet: { type: "spring", stiffness: 380, damping: 42, mass: 0.85 } as const,
  /** Drag-to-rest — used on swipe navigators */
  rest: { type: "spring", stiffness: 380, damping: 32, mass: 0.7 } as const,
} as const;

// ─── Durations ────────────────────────────────────────────────────────────
//
// Reference values for tween-based animations. Keeps timing relationships
// consistent (a card transition should never feel slower than a sheet).

export const duration = {
  micro: 0.18, // taps, presses, hover
  card: 0.32, // card transitions, hover lifts
  page: 0.42, // screen transitions, large reveals
  reveal: 0.6, // section staggers, content entrance
  draw: 1.5, // chart line drawing, ring fills
  breath: 4.4, // ambient pulses on the Copilot button, score halos
} as const;

// ─── Tap responses ────────────────────────────────────────────────────────
//
// Standard tap-feedback shapes for consistent tactile feel across cards,
// rows, and buttons. Apply as `whileTap={tap.row}` etc.

export const tap = {
  /** Row-level press — barely-there scale + bg fade */
  row: {
    scale: 0.998,
    backgroundColor: "rgba(12,14,20,0.02)",
    transition: { duration: duration.micro, ease: ease.soft },
  } as const,
  /** Card-level press — slightly more noticeable */
  card: {
    scale: 0.985,
    transition: { duration: duration.micro, ease: ease.soft },
  } as const,
  /** Button press — most pronounced */
  button: {
    scale: 0.97,
    transition: { duration: duration.micro, ease: ease.soft },
  } as const,
  /** Toggle press — for toggle handles, chips */
  chip: {
    scale: 0.94,
    transition: { duration: duration.micro, ease: ease.soft },
  } as const,
} as const;

// ─── Hover responses ──────────────────────────────────────────────────────
//
// Used on devices that support hover (desktop preview). Honored only by
// `whileHover` — touch devices ignore them.

export const hover = {
  /** Card lift — 2px upward */
  cardLift: { y: -2, transition: { duration: duration.micro, ease: ease.soft } } as const,
  /** Button lift — 1px upward */
  buttonLift: { y: -1, transition: { duration: duration.micro, ease: ease.soft } } as const,
  /** Magnetic snap on tab pills */
  magnetic: { y: -1 } as const,
} as const;

// ─── Section entrance ─────────────────────────────────────────────────────
//
// Standard fade-up used everywhere a section enters the viewport.

export const enter = {
  /** Default section reveal — 10px lift, 0.6s soft ease */
  section: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.reveal, ease: ease.soft },
  } as const,
  /** Smaller items — list rows, sub-cards */
  item: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: ease.soft },
  } as const,
  /** Subtle slide-in from the side — used for chat bubbles, notifications */
  slideIn: (from: "left" | "right" = "left") => ({
    initial: { opacity: 0, x: from === "left" ? -4 : 4 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, ease: ease.soft },
  }),
} as const;

// ─── Page transitions ─────────────────────────────────────────────────────
//
// The router uses these for screen-to-screen navigation. Calm vertical
// stack instead of harsh horizontal slides — feels like layered depth.

export const pageTransition = {
  /** Spring used by AppRouter for screen entrance/exit */
  type: "tween" as const,
  ease: ease.soft,
  duration: 0.45,
};
