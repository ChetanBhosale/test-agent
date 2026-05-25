"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/context/app-context";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

const STAGES = [
  "Analyzing repayment history",
  "Preparing personalized insights",
  "Connecting financial intelligence",
  "Assembling your dashboard",
];

/**
 * Workspace Creation — the magic moment before the dashboard.
 *
 * Five staged tasks with cascading completion + a faux preview of the
 * widgets that are about to land on Home. Auto-advances to home after
 * the last stage settles.
 */
export function WorkspaceScreen() {
  const { reset } = useApp();
  const [stage, setStage] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (stage < STAGES.length - 1) {
      const t = setTimeout(() => setStage((s) => s + 1), 750);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => reset("home"), 950);
    return () => clearTimeout(t);
  }, [stage, reset]);

  const progress = ((stage + 1) / STAGES.length) * 100;

  return (
    <div className="relative flex h-full w-full flex-col bg-riverline-bg">
      {/* Ambient warm bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 38%, rgba(255,251,240,0.55) 0%, transparent 65%)",
        }}
      />

      <div className="h-[54px]" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Faux dashboard preview — widgets assembling */}
        <WidgetPreview reduce={!!reduce} stage={stage} />

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.2 }}
          className="mt-9 text-balance font-serif text-[26px] leading-[1.1] tracking-[-0.022em] text-riverline-ink"
          style={{ textWrap: "balance" }}
        >
          Building your <em>financial workspace</em>
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.3 }}
          className="mt-3 max-w-[280px] text-pretty text-[13.5px] leading-[1.55] text-riverline-mute"
          style={{ textWrap: "pretty" }}
        >
          A few seconds. We&rsquo;re weaving together your insights,
          recommendations, and AI guidance.
        </motion.p>

        {/* Progress bar — Riverline accent fill */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-7 h-[3px] w-full max-w-[280px] overflow-hidden rounded-full"
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
        <div className="mt-6 flex w-full max-w-[280px] flex-col gap-1.5">
          {STAGES.map((label, i) => {
            const isDone = i < stage;
            const isActive = i === stage;
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: i <= stage ? 1 : 0.4, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: SOFT_EASE,
                  delay: i * 0.06,
                }}
                className="flex items-center gap-3 px-1 py-1"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, ease: SOFT_EASE }}
                      className="flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ background: "rgb(74,51,184)" }}
                    >
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 9 9"
                        fill="none"
                        aria-hidden
                      >
                        <motion.path
                          d="M2 4.5 l1.8 1.8 3.5-3.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3, ease: SOFT_EASE }}
                        />
                      </svg>
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.4,
                        ease: "linear",
                      }}
                      className="h-4 w-4"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          stroke="rgba(12,14,20,0.12)"
                          strokeWidth="1.4"
                        />
                        <path
                          d="M8 2 a6 6 0 0 1 6 6"
                          stroke="rgb(74,51,184)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-riverline-line-2" />
                  )}
                </div>
                <span
                  className={
                    "text-left text-[12px] font-medium transition-colors duration-300 " +
                    (i <= stage ? "text-riverline-ink-2" : "text-riverline-mute")
                  }
                >
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Widget preview ────────────────────────────────────────────────────────
// Three faux dashboard widgets that "assemble" as the stages complete.

function WidgetPreview({ reduce, stage }: { reduce: boolean; stage: number }) {
  return (
    <div className="relative h-[140px] w-[260px]">
      {/* Top card — score widget */}
      <PreviewCard
        delay={0.2}
        x={-90}
        y={0}
        reveal={stage >= 0}
        reduce={reduce}
      >
        <div className="px-3 py-2.5">
          <div className="text-[8px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
            CIBIL
          </div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <ScoreCounter active={stage >= 0} />
            <span className="text-[8px] text-riverline-mute-2 tabular-nums">
              / 900
            </span>
          </div>
          <div
            className="mt-1.5 h-[2px] overflow-hidden rounded-full"
            style={{ background: "rgba(74,51,184,0.10)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: stage >= 0 ? "82%" : 0 }}
              transition={{ duration: 1.2, ease: SOFT_EASE, delay: 0.4 }}
              className="h-full rounded-full"
              style={{ background: "rgb(74,51,184)" }}
            />
          </div>
        </div>
      </PreviewCard>

      {/* Middle card — chart */}
      <PreviewCard
        delay={0.45}
        x={50}
        y={-12}
        reveal={stage >= 1}
        reduce={reduce}
      >
        <div className="px-3 py-2.5">
          <div className="text-[8px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
            6 months
          </div>
          <svg
            width="80"
            height="36"
            viewBox="0 0 80 36"
            fill="none"
            className="mt-1 overflow-visible"
          >
            <motion.path
              d="M0 28 C 14 24, 24 20, 36 16 S 60 8, 80 4"
              stroke="rgb(74,51,184)"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 1.2, ease: SOFT_EASE, delay: 0.6 }}
            />
            <motion.circle
              cx="80"
              cy="4"
              r="2"
              fill="rgb(74,51,184)"
              initial={{ scale: 0 }}
              animate={{ scale: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.3, ease: SOFT_EASE, delay: 1.5 }}
            />
          </svg>
        </div>
      </PreviewCard>

      {/* Bottom card — insight pill */}
      <PreviewCard
        delay={0.7}
        x={-30}
        y={62}
        reveal={stage >= 2}
        reduce={reduce}
        wide
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
            className="block h-[5px] w-[5px] rounded-full bg-riverline-flow"
            style={{ boxShadow: "0 0 0 3px rgba(31,138,118,0.12)" }}
          />
          <span className="text-[9.5px] font-medium tracking-[-0.005em] text-riverline-ink-2">
            +18 pts this month
          </span>
        </div>
      </PreviewCard>
    </div>
  );
}

function PreviewCard({
  children,
  delay,
  x,
  y,
  reveal,
  reduce,
  wide = false,
}: {
  children: React.ReactNode;
  delay: number;
  x: number;
  y: number;
  reveal: boolean;
  reduce: boolean;
  wide?: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: y + 18, scale: 0.92 }}
      animate={{
        opacity: reveal ? 1 : 0,
        y,
        scale: reveal ? 1 : 0.92,
      }}
      transition={{ duration: 0.7, ease: SOFT_EASE, delay }}
      className="absolute left-1/2 top-0 -translate-x-1/2 rounded-[12px] bg-white"
      style={{
        translate: `${x}px ${y}px`,
        width: wide ? 160 : 110,
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.95)",
          "0 1px 1px rgba(12,14,20,0.04)",
          "0 8px 18px -8px rgba(12,14,20,0.12)",
        ].join(", "),
      }}
    >
      {children}
    </motion.div>
  );
}

function ScoreCounter({ active }: { active: boolean }) {
  const [n, setN] = useState(720);
  useEffect(() => {
    if (!active) return;
    let cur = 720;
    const id = setInterval(() => {
      cur += 1;
      if (cur >= 742) {
        setN(742);
        clearInterval(id);
      } else {
        setN(cur);
      }
    }, 30);
    return () => clearInterval(id);
  }, [active]);
  return (
    <span className="font-serif text-[20px] leading-none tracking-[-0.025em] text-riverline-ink tabular-nums">
      {n}
    </span>
  );
}
