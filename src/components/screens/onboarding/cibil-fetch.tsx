"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";

const STAGES = [
  "Connecting to credit bureau",
  "Pulling your credit profile",
  "Analyzing repayment history",
  "Personalizing your offers",
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function CibilFetchScreen() {
  const { reset, setUser } = useApp();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage < STAGES.length - 1) {
      const t = setTimeout(() => setStage((s) => s + 1), 850);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setUser({ name: "Shubham", initials: "S" });
      reset("home");
    }, 1100);
    return () => clearTimeout(t);
  }, [stage, reset, setUser]);

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="h-[54px]" />

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        {/* Concentric ripples */}
        <div className="relative mb-9 flex h-[88px] w-[88px] items-center justify-center">
          {[0, 0.6, 1.2].map((delay, i) => (
            <motion.div
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-full bg-riverline-primary/14"
              animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeOut",
                delay,
              }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-riverline-primary text-white shadow-[0_8px_24px_-8px_rgba(91,47,224,0.55)]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 14 Q7 8 11 14 T19 14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M3 9 Q7 3 11 9 T19 9"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          className="font-serif text-[26px] italic leading-[1.1] tracking-[-0.015em] text-riverline-ink"
        >
          Fetching your <em>credit profile</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          className="mt-3 max-w-[280px] text-[14px] leading-[1.55] text-riverline-mute"
        >
          This usually takes a few seconds. We&rsquo;re pulling your data from
          the credit bureau.
        </motion.p>

        <div className="mt-9 flex w-full max-w-[320px] flex-col gap-2.5">
          {STAGES.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: i <= stage ? 1 : 0.5,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: EASE,
                delay: i * 0.08,
              }}
              className={
                "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors duration-300 " +
                (i <= stage
                  ? "border-riverline-primary/15 bg-riverline-primary/[0.04]"
                  : "border-riverline-line bg-white")
              }
            >
              <motion.div
                animate={{
                  backgroundColor:
                    i < stage
                      ? "rgb(91,47,224)"
                      : i === stage
                        ? "rgba(91,47,224,0.15)"
                        : "rgb(231,233,242)",
                  color:
                    i < stage
                      ? "rgb(255,255,255)"
                      : i === stage
                        ? "rgb(91,47,224)"
                        : "rgb(107,113,133)",
                }}
                transition={{ duration: 0.3 }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              >
                {i < stage ? (
                  <motion.svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <motion.path
                      d="M2 7 l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  </motion.svg>
                ) : i === stage ? (
                  <motion.span
                    className="block h-2 w-2 rounded-full bg-current"
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0.55, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.1,
                      ease: "easeInOut",
                    }}
                  />
                ) : (
                  <span className="block h-2 w-2 rounded-full bg-current opacity-60" />
                )}
              </motion.div>
              <span className="text-left text-[13.5px] font-medium text-riverline-ink-2">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
