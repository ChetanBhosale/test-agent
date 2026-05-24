"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigation } from "@/context/app-context";
import { RiverlineMark } from "./shared";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SplashScreen() {
  const { replace } = useNavigation();

  useEffect(() => {
    const t = setTimeout(() => replace("welcome"), 1750);
    return () => clearTimeout(t);
  }, [replace]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white">
      {/* River waves drawing in */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0"
        width="100%"
        height="240"
        viewBox="0 0 390 240"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.path
          d="M0 130 Q98 92 195 130 T390 130 V240 H0 Z"
          fill="#F2EDFF"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M0 130 Q98 92 195 130 T390 130 V240 H0 Z;
              M0 142 Q98 112 195 124 T390 142 V240 H0 Z;
              M0 130 Q98 92 195 130 T390 130 V240 H0 Z
            "
          />
        </motion.path>
        <motion.path
          d="M0 168 Q98 138 195 168 T390 168 V240 H0 Z"
          fill="#E6F0FF"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
        >
          <animate
            attributeName="d"
            dur="7s"
            repeatCount="indefinite"
            values="
              M0 168 Q98 138 195 168 T390 168 V240 H0 Z;
              M0 162 Q98 184 195 152 T390 162 V240 H0 Z;
              M0 168 Q98 138 195 168 T390 168 V240 H0 Z
            "
          />
        </motion.path>
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <RiverlineMark size={68} />

        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
            className="font-serif text-[36px] italic leading-none tracking-[-0.02em] text-riverline-ink"
          >
            Riverline
          </motion.div>
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.42 }}
            className="text-[13px] font-medium text-riverline-mute"
          >
            Credit that flows.
          </motion.div>
        </div>
      </div>

      {/* Bottom progress hairline */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.65, ease: "linear" }}
        style={{ transformOrigin: "left" }}
        className="absolute inset-x-12 bottom-12 h-[2px] rounded-full bg-riverline-primary/20"
      />
    </div>
  );
}
