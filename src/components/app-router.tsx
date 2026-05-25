"use client";

import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/context/app-context";
import { SCREEN_REGISTRY } from "@/components/screens/registry";
import { ease, duration } from "@/components/shared/motion-system";

const TRANSITION = {
  type: "tween" as const,
  ease: ease.soft,
  duration: duration.page,
};

/**
 * Renders the screen at the top of the navigation stack.
 *
 * Motion language: layered depth, never harsh sideways slides.
 *  • Forward (push)  — incoming screen rises 18px + scales 0.985→1 + fades
 *  • Back (pop)      — outgoing screen settles 12px + opacity fades
 *
 * Feels like the next surface "arrives" rather than the previous one
 * being shoved aside. Honors `prefers-reduced-motion` via Motion's
 * built-in support (transitions collapse to opacity-only).
 */
export function AppRouter() {
  const { screen, direction } = useApp();
  const Screen = SCREEN_REGISTRY[screen];

  const enter =
    direction === "forward"
      ? { opacity: 0, y: 18, scale: 0.985 }
      : { opacity: 0, y: -8, scale: 1.005 };

  const exit =
    direction === "forward"
      ? { opacity: 0, y: -12, scale: 1.005 }
      : { opacity: 0, y: 12, scale: 0.985 };

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={screen}
        initial={enter}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={exit}
        transition={TRANSITION}
        className="absolute inset-0 h-full w-full"
        style={{ willChange: "transform, opacity" }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}
