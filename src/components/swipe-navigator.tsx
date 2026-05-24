"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useApp } from "@/context/app-context";

const EDGE = 32; // px from the edge that counts as a "swipe" start
const TRIGGER = 90; // px past which the swipe commits

/**
 * iOS-style edge-swipe navigator built on Framer Motion.
 *  • Drag right from the LEFT edge  → goBack (with rubber-band & spring-back)
 *  • Drag left  from the RIGHT edge → goForward
 *
 * The contained screen stays static; only this overlay drags, which gives us
 * a buttery horizontal motion without fighting AnimatePresence transitions.
 */
export function SwipeNavigator({ children }: { children: ReactNode }) {
  const { goBack, goForward, canGoBack } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [active, setActive] = useState<"back" | "forward" | null>(null);

  // Hint shadows fade in as the user drags
  const backHintOpacity = useTransform(x, [0, 60], [0, 0.18]);
  const fwdHintOpacity = useTransform(x, [0, -60], [0, 0.18]);

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    if (px <= EDGE && canGoBack) setActive("back");
    else if (px >= rect.width - EDGE) setActive("forward");
    else return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const startX = useRef(0);
  const startY = useRef(0);
  const lockedAxis = useRef<"x" | "y" | null>(null);

  const onPointerDownCapture = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    lockedAxis.current = null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (!lockedAxis.current) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        lockedAxis.current = "x";
      } else if (Math.abs(dy) > 12) {
        lockedAxis.current = "y";
        setActive(null);
        return;
      } else return;
    }

    if (lockedAxis.current !== "x") return;

    let constrained = dx;
    if (active === "back") constrained = Math.max(0, dx);
    else if (active === "forward") constrained = Math.min(0, dx);

    // Rubber-band past 240
    if (Math.abs(constrained) > 240) {
      const over = Math.abs(constrained) - 240;
      const damp = 240 + over * 0.32;
      constrained = constrained < 0 ? -damp : damp;
    }
    x.set(constrained);
  };

  const finish = () => {
    const cur = x.get();
    if (active === "back" && cur > TRIGGER) {
      animate(x, 460, {
        type: "tween",
        ease: [0.22, 1, 0.36, 1],
        duration: 0.22,
        onComplete: () => {
          goBack();
          x.set(0);
        },
      });
    } else if (active === "forward" && cur < -TRIGGER) {
      animate(x, -460, {
        type: "tween",
        ease: [0.22, 1, 0.36, 1],
        duration: 0.22,
        onComplete: () => {
          goForward();
          x.set(0);
        },
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 380, damping: 32, mass: 0.7 });
    }
    setActive(null);
    lockedAxis.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none touch-pan-y"
      onPointerDown={(e) => {
        onPointerDownCapture(e);
        onPointerDown(e);
      }}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
    >
      {/* Static edge affordance */}
      {canGoBack && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-50 w-1.5 bg-gradient-to-r from-black/[0.04] to-transparent"
        />
      )}

      {/* Drag-driven edge shadows */}
      <motion.div
        aria-hidden
        style={{ opacity: backHintOpacity }}
        className="pointer-events-none absolute inset-y-0 left-0 z-50 w-16 bg-gradient-to-r from-black/30 to-transparent"
      />
      <motion.div
        aria-hidden
        style={{ opacity: fwdHintOpacity }}
        className="pointer-events-none absolute inset-y-0 right-0 z-50 w-16 bg-gradient-to-l from-black/30 to-transparent"
      />

      <motion.div className="h-full w-full" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
}
