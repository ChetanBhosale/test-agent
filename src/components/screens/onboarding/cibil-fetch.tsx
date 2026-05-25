"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";
import { SOFT_EASE } from "./shared";

const STAGES = [
  { label: "Connecting to credit bureau" },
  { label: "Pulling your credit profile" },
  { label: "Analyzing repayment history" },
  { label: "Personalizing your offers" },
];

export function CibilFetchScreen() {
  const { navigate, setUser } = useApp();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage < STAGES.length - 1) {
      const t = setTimeout(() => setStage((s) => s + 1), 850);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setUser({ name: "Shubham", initials: "S" });
      navigate("security");
    }, 1100);
    return () => clearTimeout(t);
  }, [stage, navigate, setUser]);

  const progress = ((stage + 1) / STAGES.length) * 100;

  return (
    <div className="relative flex h-full w-full flex-col bg-riverline-bg">
      {/* Soft ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(12,14,20,0.025) 0%, transparent 70%)",
        }}
      />

      <div className="h-[54px]" />

      {/* Vertically centered */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        {/* Premium ripple loader */}
        <div className="relative mb-9 flex h-[88px] w-[88px] items-center justify-center">
          {[0, 0.7, 1.4].map((delay, i) => (
            <motion.div
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-full border border-riverline-ink/15"
              animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.1,
                ease: "easeOut",
                delay,
              }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: SOFT_EASE }}
            className="relative flex h-14 w-14 items-center justify-center rounded-[16px] bg-riverline-ink"
            style={{
              boxShadow: [
                "0 1px 2px rgba(12,14,20,0.4)",
                "0 8px 20px -6px rgba(12,14,20,0.4)",
                // Subtle brand-accent ambient glow — only visible against
                // the warm ivory background, keeps the AI-fintech identity
                "0 18px 40px -14px rgba(74,51,184,0.32)",
                "inset 0 1px 0 rgba(255,255,255,0.08)",
              ].join(", "),
            }}
          >
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "linear",
              }}
            >
              <circle
                cx="11"
                cy="11"
                r="7.5"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.6"
                fill="none"
              />
              <path
                d="M11 3.5 A7.5 7.5 0 0 1 18.5 11"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </motion.svg>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.15 }}
          className="text-balance font-serif text-[28px] leading-[1.1] tracking-[-0.022em] text-riverline-ink"
          style={{ textWrap: "balance" }}
        >
          Fetching your <em>credit profile</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.25 }}
          className="mt-3.5 max-w-[280px] text-pretty text-[14.5px] leading-[1.55] tracking-[-0.005em] text-riverline-mute"
          style={{ textWrap: "pretty" }}
        >
          This usually takes a few seconds. We&rsquo;re pulling your data from
          the credit bureau securely.
        </motion.p>

        {/* Progress bar */}
        {/* Progress bar — Riverline accent fill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-7 h-[3px] w-full max-w-[270px] overflow-hidden rounded-full"
          style={{ background: "rgba(74,51,184,0.10)" }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: SOFT_EASE }}
            className="h-full rounded-full"
            style={{ background: "rgb(74,51,184)" }}
          />
        </motion.div>

        {/* Stage list */}
        <div className="mt-7 flex w-full max-w-[290px] flex-col gap-2">
          {STAGES.map(({ label }, i) => {
            const isDone = i < stage;
            const isActive = i === stage;
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: i <= stage ? 1 : 0.45,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: SOFT_EASE,
                  delay: i * 0.06,
                }}
                className={
                  "flex items-center gap-3 rounded-[12px] border px-3.5 py-2.5 transition-all duration-300 " +
                  (i <= stage
                    ? "border-riverline-line bg-white"
                    : "border-riverline-line/60 bg-riverline-card/40")
                }
              >
                {/* Status indicator */}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.4,
                        ease: SOFT_EASE,
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: "rgb(74,51,184)" }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden
                      >
                        <motion.path
                          d="M2 5 l2 2 4-4"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.35, ease: SOFT_EASE }}
                        />
                      </svg>
                    </motion.div>
                  ) : isActive ? (
                    <div className="relative flex h-5 w-5 items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                          ease: "linear",
                        }}
                        className="absolute inset-0"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle
                            cx="10"
                            cy="10"
                            r="7.5"
                            stroke="rgba(12,14,20,0.12)"
                            strokeWidth="1.6"
                            fill="none"
                          />
                          <path
                            d="M10 2.5 A7.5 7.5 0 0 1 17.5 10"
                            stroke="rgb(74,51,184)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-riverline-line-2" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={
                    "flex-1 text-left text-[12.5px] font-medium transition-colors duration-300 " +
                    (i <= stage ? "text-riverline-ink" : "text-riverline-mute")
                  }
                >
                  {label}
                </span>

                {/* Right-side state */}
                {isDone && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-semibold uppercase tracking-[0.08em] text-riverline-flow"
                  >
                    Done
                  </motion.span>
                )}
                {isActive && (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.4,
                      ease: "easeInOut",
                    }}
                    className="text-[10px] font-semibold uppercase tracking-[0.08em] text-riverline-ink-2"
                  >
                    Working
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
