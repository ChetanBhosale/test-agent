"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useNavigation } from "@/context/app-context";
import {
  RiverlineLogo,
  RiverlineWordmark,
} from "@/components/brand/riverline-logo";
import { useDevLongPress } from "@/components/dev/dev-panel";

/**
 * Riverline splash — the first emotional moment of the product.
 *
 * Cinematic, calm, premium. Choreographed in seven phases:
 *
 *   0.00s   Ambient ivory wash + brand halo + edge vignette begin to bloom
 *   0.25s   Logo enters: opacity + scale (0.9 → 1) + subtle settle drop
 *   0.60s   Loading hairline track fades in
 *   0.80s   Soft brand pulse begins traveling across the indicator
 *   0.90s   Wordmark fades up tightly beneath the logo
 *   1.25s   Diagonal light sweep crosses the logo tile
 *   1.70s   Logo settles into a near-imperceptible breathing rhythm
 *   2.30s   Navigate to welcome — router crossfades into the next surface
 *
 * Honors prefers-reduced-motion: animations collapse to instant fades.
 */
const SOFT_EASE = [0.4, 0, 0.2, 1] as const;
const SWEEP_EASE = [0.65, 0, 0.35, 1] as const;
const TOTAL_MS = 2300;

export function SplashScreen() {
  const { replace } = useNavigation();
  const reduce = useReducedMotion();
  const longPress = useDevLongPress();

  useEffect(() => {
    const t = setTimeout(() => replace("welcome"), TOTAL_MS);
    return () => clearTimeout(t);
  }, [replace]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-riverline-bg">
      {/* ── Phase 1 · Atmosphere ─────────────────────────────────── */}

      {/* Warm ivory bloom — soft center light */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: SOFT_EASE }}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(255,251,240,0.78) 0%, transparent 68%)",
        }}
      />

      {/* Brand halo — barely-there indigo wash behind the logo */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.7, ease: SOFT_EASE, delay: 0.15 }}
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          top: "50%",
          width: 360,
          height: 360,
          translate: "-50% -54%",
          background:
            "radial-gradient(circle, rgba(42,27,124,0.11) 0%, rgba(42,27,124,0.04) 38%, transparent 68%)",
          filter: "blur(28px)",
        }}
      />

      {/* Edge vignette — focuses attention without darkening corners harshly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 50%, transparent 58%, rgba(20,16,8,0.08) 100%)",
        }}
      />

      {/* Ultra-subtle film grain — adds matte texture, invisible up close */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.05 0 0 0 0 0.05 0 0 0 0 0.06 0 0 0 0.6 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      {/* ── Phase 2-5 · Identity ─────────────────────────────────── */}

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo wrapper — outer layer carries the multi-layer drop shadow */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.0,
            ease: SOFT_EASE,
            delay: 0.25,
          }}
          className="relative"
          style={{
            // Three-layer indigo drop shadow gives the logo real depth
            // without ever feeling like a glow
            filter: [
              "drop-shadow(0 1px 1px rgba(42,27,124,0.16))",
              "drop-shadow(0 6px 16px rgba(42,27,124,0.18))",
              "drop-shadow(0 22px 44px rgba(42,27,124,0.10))",
            ].join(" "),
          }}
          {...longPress}
        >
          {/* Inner clip layer — contains the breathing + light sweep */}
          <motion.div
            animate={reduce ? undefined : { scale: [1, 1.006, 1] }}
            transition={
              reduce
                ? undefined
                : {
                    delay: 1.7,
                    repeat: Infinity,
                    duration: 5.6,
                    ease: "easeInOut",
                  }
            }
            className="relative overflow-hidden rounded-[15px]"
          >
            <RiverlineLogo size={84} tone="brand" />

            {/* Phase 5 · Diagonal light sweep — single cinematic pass */}
            {!reduce && (
              <motion.div
                aria-hidden
                initial={{ x: "-130%", opacity: 0 }}
                animate={{
                  x: "130%",
                  opacity: [0, 0.42, 0.42, 0],
                }}
                transition={{
                  duration: 1.8,
                  ease: SWEEP_EASE,
                  delay: 1.25,
                  times: [0, 0.2, 0.8, 1],
                }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 36%, rgba(255,255,255,0.55) 50%, transparent 64%)",
                  mixBlendMode: "overlay",
                }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Wordmark — anchored tightly to the logo for unified identity */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: SOFT_EASE, delay: 0.9 }}
          className="mt-[18px]"
        >
          <RiverlineWordmark className="text-[22px]" tone="ink" />
        </motion.div>
      </div>

      {/* ── Phase 6 · Loading indicator — flowing brand pulse ────── */}

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.6 }}
        className="pointer-events-none absolute inset-x-24 bottom-[58px]"
      >
        <div className="relative h-[2px] overflow-visible">
          {/* Track — hairline that fades at both edges */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(12,14,20,0.12) 22%, rgba(12,14,20,0.12) 78%, transparent)",
            }}
          />
          {/* Traveling pulse — soft brand-tinted comet */}
          {!reduce && (
            <motion.div
              initial={{ x: "-30%" }}
              animate={{ x: "130%" }}
              transition={{
                duration: 1.4,
                ease: "linear",
                delay: 0.8,
              }}
              className="absolute top-1/2 h-[2px] w-[64px] -translate-y-1/2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(42,27,124,0.65) 50%, transparent)",
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
