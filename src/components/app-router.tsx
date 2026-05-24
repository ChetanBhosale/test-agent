"use client";

import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/context/app-context";
import { SCREEN_REGISTRY } from "@/components/screens/registry";

const TRANSITION = {
  type: "tween" as const,
  ease: [0.22, 1, 0.36, 1] as const,
  duration: 0.42,
};

/**
 * Renders the screen at the top of the navigation stack with a directional
 * iOS-style transition. New screens slide in from the right when navigating
 * forward, and out to the right when going back (the previous screen comes
 * back from the left).
 */
export function AppRouter() {
  const { screen, direction } = useApp();
  const Screen = SCREEN_REGISTRY[screen];

  const enterFrom = direction === "forward" ? 60 : -60;
  const exitTo = direction === "forward" ? -40 : 40;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={screen}
        initial={{ opacity: 0, x: enterFrom }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: exitTo }}
        transition={TRANSITION}
        className="absolute inset-0 h-full w-full"
        style={{ willChange: "transform, opacity" }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}
