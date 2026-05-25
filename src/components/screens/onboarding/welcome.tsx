"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigation } from "@/context/app-context";
import {
  OnboardingFrame,
  PrimaryButton,
  SkipButton,
  SOFT_EASE,
} from "./shared";

const SLIDES: Array<{
  eyebrow: string;
  title: ReactNode;
  body: string;
  art: ReactNode;
}> = [
  {
    eyebrow: "Loans",
    title: (
      <>
        Loans that <em>flow</em>, not crawl.
      </>
    ),
    body: "Personalized offers from RBI-regulated lenders. No paperwork, no hidden fees.",
    art: <LoanCard />,
  },
  {
    eyebrow: "Credit",
    title: (
      <>
        Your CIBIL, <em>always</em> in view.
      </>
    ),
    body: "Track your score, understand what moves it, and get intelligent suggestions.",
    art: <CibilCard />,
  },
  {
    eyebrow: "AI Counsellor",
    title: (
      <>
        A counsellor that <em>listens</em>.
      </>
    ),
    body: "Patient, multilingual support to plan repayments — call or chat, 24/7.",
    art: <AiCard />,
  },
];

export function WelcomeScreen() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const { replace } = useNavigation();
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const goTo = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  return (
    <OnboardingFrame
      showBack={false}
      topRight={
        !isLast ? <SkipButton onClick={() => replace("phone")} /> : null
      }
      footer={
        <div className="flex flex-col gap-5">
          {/* Refined dot indicators */}
          <div className="flex items-center justify-center gap-1.5">
            {SLIDES.map((_, i) => (
              <motion.button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                animate={{
                  width: i === index ? 22 : 5,
                  backgroundColor:
                    i === index ? "rgb(74,51,184)" : "rgba(12,14,20,0.14)",
                }}
                transition={{ duration: 0.4, ease: SOFT_EASE }}
                className="h-[4px] rounded-[2px]"
              />
            ))}
          </div>
          <PrimaryButton
            onClick={() => {
              if (isLast) replace("phone");
              else goTo(index + 1);
            }}
          >
            <motion.span
              key={isLast ? "go" : "next"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: SOFT_EASE }}
              className="flex items-center gap-2"
            >
              {isLast ? "Get started" : "Continue"}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </PrimaryButton>
        </div>
      }
    >
      {/* Vertically centered composition */}
      <div className="flex h-full flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 18 * d }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: -14 * d }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: SOFT_EASE }}
            className="flex flex-col"
          >
            {/* Hero card — soft floating motion */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              {slide.art}
            </motion.div>

            {/* Editorial text block */}
            <div className="mt-9">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.12 }}
                className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-riverline-mute"
              >
                {slide.eyebrow}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.2 }}
                className="mt-3.5 text-balance font-serif text-[32px] leading-[1.05] tracking-[-0.022em] text-riverline-ink"
                style={{ textWrap: "balance" }}
              >
                {slide.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.28 }}
                className="mt-3.5 max-w-[300px] text-pretty text-[14.5px] leading-[1.55] tracking-[-0.005em] text-riverline-mute"
                style={{ textWrap: "pretty" }}
              >
                {slide.body}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </OnboardingFrame>
  );
}

// ─── Hero surface — matte, layered, tactile ────────────────────────────────
function HeroSurface({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: SOFT_EASE }}
      whileHover={{ y: -3, transition: { duration: 0.4, ease: SOFT_EASE } }}
      className="relative w-full max-w-[290px] rounded-[20px] border border-riverline-line bg-white p-5"
      style={{
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.9)",
          "0 1px 2px rgba(12,14,20,0.04)",
          "0 6px 16px -8px rgba(12,14,20,0.08)",
          "0 24px 48px -20px rgba(12,14,20,0.12)",
          "0 48px 80px -32px rgba(12,14,20,0.08)",
        ].join(", "),
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Loan card — pre-approved offer with refined chart ─────────────────────
function LoanCard() {
  return (
    <HeroSurface>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-riverline-ink/[0.04]">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="3.5" width="10" height="7" rx="1.4" stroke="#0c0e14" strokeWidth="1.2" />
              <path d="M2 6h10" stroke="#0c0e14" strokeWidth="1.2" />
              <circle cx="9.5" cy="8.2" r="0.9" fill="#0c0e14" />
            </svg>
          </div>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
            Pre-approved
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-riverline-flow-soft px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-riverline-flow">
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="block h-[5px] w-[5px] rounded-full bg-riverline-flow"
          />
          Live
        </span>
      </div>

      {/* Amount */}
      <div className="mt-4">
        <div className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute">
          Approved limit
        </div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.3 }}
          className="mt-1 font-serif text-[28px] leading-none tracking-[-0.02em] text-riverline-ink tabular-nums"
        >
          ₹2,00,000
        </motion.div>
      </div>

      {/* Mini area chart */}
      <div className="mt-4">
        <svg
          width="100%"
          height="46"
          viewBox="0 0 250 46"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="loanFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(12,14,20,0.08)" />
              <stop offset="100%" stopColor="rgba(12,14,20,0)" />
            </linearGradient>
          </defs>
          {/* Filled area */}
          <motion.path
            d="M0 36 C30 32, 50 28, 80 24 S130 14, 160 18 S210 8, 250 6 L250 46 L0 46 Z"
            fill="url(#loanFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: SOFT_EASE, delay: 0.5 }}
          />
          {/* Stroke */}
          <motion.path
            d="M0 36 C30 32, 50 28, 80 24 S130 14, 160 18 S210 8, 250 6"
            stroke="#0c0e14"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: SOFT_EASE, delay: 0.4 }}
          />
          {/* Active dot with halo */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.7 }}
            style={{ transformOrigin: "250px 6px" }}
          >
            <motion.circle
              cx="250"
              cy="6"
              r="6"
              fill="#0c0e14"
              fillOpacity="0.1"
              animate={{ r: [6, 10, 6], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            />
            <circle cx="250" cy="6" r="3" fill="#0c0e14" />
            <circle cx="250" cy="6" r="1.2" fill="white" />
          </motion.g>
        </svg>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-riverline-line pt-3.5">
        <div>
          <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute">
            Rate
          </div>
          <div className="mt-0.5 text-[13px] font-semibold text-riverline-ink tabular-nums">
            10.49%{" "}
            <span className="text-[10px] font-normal text-riverline-mute">
              p.a.
            </span>
          </div>
        </div>
        <div>
          <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute">
            EMI
          </div>
          <div className="mt-0.5 text-[13px] font-semibold text-riverline-ink tabular-nums">
            ₹4,290
            <span className="text-[10px] font-normal text-riverline-mute">
              /mo
            </span>
          </div>
        </div>
      </div>
    </HeroSurface>
  );
}

// ─── Cibil card — refined ring + sparkline ─────────────────────────────────
function CibilCard() {
  return (
    <HeroSurface>
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
          Credit health
        </span>
        <span className="rounded-md border border-riverline-line bg-riverline-card px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-riverline-ink">
          CIBIL
        </span>
      </div>

      <div className="mt-4 flex items-center gap-5">
        {/* Score arc */}
        <div className="relative h-[96px] w-[96px] shrink-0">
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            className="-rotate-90"
          >
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="rgba(12,14,20,0.06)"
              strokeWidth="5"
              fill="none"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="#0c0e14"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="251.3"
              initial={{ strokeDashoffset: 251.3 }}
              animate={{ strokeDashoffset: 251.3 * (1 - 742 / 900) }}
              transition={{ duration: 1.6, ease: SOFT_EASE, delay: 0.3 }}
            />
            {/* Animated active tick */}
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="#1f8a76"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="4 251"
              initial={{ strokeDashoffset: 251.3 }}
              animate={{ strokeDashoffset: 251.3 * (1 - 742 / 900) - 1 }}
              transition={{ duration: 1.6, ease: SOFT_EASE, delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.7 }}
              className="font-serif text-[26px] leading-none tracking-[-0.02em] text-riverline-ink tabular-nums"
            >
              742
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-riverline-flow"
            >
              Excellent
            </motion.div>
          </div>
        </div>

        {/* Trend list */}
        <div className="flex-1 space-y-3">
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.5 }}
          >
            <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute">
              This month
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M4.5 1.5 L4.5 7.5 M2 4 L4.5 1.5 L7 4"
                  stroke="#1f8a76"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[14px] font-semibold text-riverline-flow tabular-nums">
                18
              </span>
              <span className="text-[10px] text-riverline-mute">pts</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.62 }}
          >
            <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute">
              Range
            </div>
            <div className="mt-1 text-[12px] font-medium text-riverline-ink-2">
              Top 8% in India
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sparkline with active point */}
      <div className="mt-4 border-t border-riverline-line pt-3.5">
        <div className="mb-1.5 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.08em] text-riverline-mute">
          <span>6 months</span>
          <span className="tabular-nums">724 → 742</span>
        </div>
        <svg
          width="100%"
          height="32"
          viewBox="0 0 250 32"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <motion.path
            d="M0 22 C30 21, 50 19, 75 18 S125 14, 150 12 S200 8, 250 5"
            stroke="#0c0e14"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: SOFT_EASE, delay: 0.6 }}
          />
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.8 }}
            style={{ transformOrigin: "250px 5px" }}
          >
            <motion.circle
              cx="250"
              cy="5"
              r="6"
              fill="#0c0e14"
              fillOpacity="0.1"
              animate={{ r: [6, 10, 6], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            />
            <circle cx="250" cy="5" r="3" fill="#0c0e14" />
            <circle cx="250" cy="5" r="1.2" fill="white" />
          </motion.g>
        </svg>
      </div>
    </HeroSurface>
  );
}

// ─── AI card — conversation with intelligence indicators ───────────────────
function AiCard() {
  return (
    <HeroSurface>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="relative flex h-8 w-8 items-center justify-center rounded-[10px]"
            style={{ background: "rgb(74,51,184)" }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M6.5 1.2 L7.8 4.7 L11.3 6 L7.8 7.3 L6.5 10.8 L5.2 7.3 L1.7 6 L5.2 4.7 Z"
                fill="white"
              />
            </svg>
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[10px]"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(74,51,184,0.32)",
                  "0 0 0 10px rgba(74,51,184,0)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: "easeOut",
              }}
            />
          </div>
          <div>
            <div className="text-[12.5px] font-semibold text-riverline-ink">
              Riverline AI
            </div>
            <div className="flex items-center gap-1 text-[10px] text-riverline-mute">
              <span className="block h-[5px] w-[5px] rounded-full bg-riverline-flow" />
              Online · Multilingual
            </div>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="mt-4 space-y-2.5">
        <motion.div
          initial={{ opacity: 0, x: 8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.3 }}
          className="ml-auto max-w-[80%] rounded-[14px] rounded-tr-[4px] bg-riverline-ink px-3 py-2 text-[12px] leading-[1.45] text-white"
        >
          Can I prepay 30k this month?
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.55 }}
          className="max-w-[85%] rounded-[14px] rounded-tl-[4px] bg-riverline-card px-3 py-2 text-[12px] leading-[1.5] text-riverline-ink-2"
        >
          Yes — and you&rsquo;ll save{" "}
          <span className="font-semibold text-riverline-ink">₹2,840</span> in
          interest. Want me to set it up?
        </motion.div>

        {/* Typing indicator */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, ease: SOFT_EASE }}
          className="flex items-center gap-1.5 rounded-[14px] rounded-tl-[4px] bg-riverline-card px-3 py-2 w-fit"
        >
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -1.5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay,
                ease: "easeInOut",
              }}
              className="block h-[5px] w-[5px] rounded-full bg-riverline-mute"
            />
          ))}
        </motion.div>
      </div>
    </HeroSurface>
  );
}
