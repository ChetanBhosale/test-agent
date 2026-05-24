"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigation } from "@/context/app-context";
import { OnboardingFrame, PrimaryButton } from "./shared";

const EASE = [0.22, 1, 0.36, 1] as const;

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
    body: "Personalized offers from RBI-regulated lending partners. No paperwork ping-pong, no hidden fees.",
    art: <SlideLoanArt />,
  },
  {
    eyebrow: "Credit",
    title: (
      <>
        Your CIBIL, <em>always</em> in view.
      </>
    ),
    body: "Track your score, understand what moves it, and get AI tips that nudge it the right way.",
    art: <SlideCibilArt />,
  },
  {
    eyebrow: "AI counsellor",
    title: (
      <>
        A counsellor that <em>listens</em>.
      </>
    ),
    body: "Patient, multilingual support to plan repayments and navigate any financial bump — call or chat, 24/7.",
    art: <SlideAiArt />,
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
        !isLast ? (
          <motion.button
            type="button"
            onClick={() => replace("phone")}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-riverline-mute hover:text-riverline-ink"
          >
            Skip
          </motion.button>
        ) : null
      }
      footer={
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2">
            {SLIDES.map((_, i) => (
              <motion.button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                animate={{
                  width: i === index ? 28 : 8,
                  backgroundColor:
                    i === index ? "rgb(91,47,224)" : "rgb(231,233,242)",
                }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                className="h-1.5 rounded-full"
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
              transition={{ duration: 0.25, ease: EASE }}
            >
              {isLast ? "Get started" : "Next"}
            </motion.span>
          </PrimaryButton>
        </div>
      }
    >
      <div className="relative flex h-full flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 24 * d, y: 4 }),
              center: { opacity: 1, x: 0, y: 0 },
              exit: (d: number) => ({ opacity: 0, x: -24 * d, y: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: EASE }}
            className="flex flex-1 flex-col items-center text-center"
          >
            <div className="my-2 flex h-[210px] w-full items-center justify-center">
              {slide.art}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
              className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-riverline-primary"
            >
              {slide.eyebrow}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
              className="mt-3 max-w-[320px] font-serif text-[32px] leading-[1.08] tracking-[-0.015em] text-riverline-ink"
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.24 }}
              className="mt-3 max-w-[300px] text-[14.5px] leading-[1.55] text-riverline-mute"
            >
              {slide.body}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </OnboardingFrame>
  );
}

// ── Illustrations ──────────────────────────────────────────────────────────
function SlideLoanArt() {
  return (
    <motion.svg
      width="220"
      height="180"
      viewBox="0 0 220 180"
      fill="none"
      aria-hidden
    >
      <motion.rect
        x="20"
        y="40"
        width="180"
        height="100"
        rx="20"
        fill="#F4EFFF"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      <motion.rect
        x="36"
        y="60"
        width="92"
        height="10"
        rx="5"
        fill="#5B2FE0"
        initial={{ width: 0 }}
        animate={{ width: 92 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
      />
      <motion.rect
        x="36"
        y="80"
        width="148"
        height="6"
        rx="3"
        fill="#D9CCF8"
        initial={{ width: 0 }}
        animate={{ width: 148 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
      />
      <motion.rect
        x="36"
        y="94"
        width="100"
        height="6"
        rx="3"
        fill="#E5DCF9"
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.34 }}
      />
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
      >
        <rect x="36" y="112" width="60" height="14" rx="7" fill="#FFFFFF" stroke="#D9CCF8" />
        <text x="66" y="122" textAnchor="middle" fontSize="9" fontWeight="700" fill="#5B2FE0" fontFamily="Inter">
          ₹2,00,000
        </text>
        <rect x="146" y="108" width="44" height="22" rx="11" fill="#5B2FE0" />
        <text x="168" y="122" textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="Inter">
          APPLY
        </text>
      </motion.g>
    </motion.svg>
  );
}

function SlideCibilArt() {
  return (
    <motion.svg
      width="220"
      height="180"
      viewBox="0 0 220 180"
      fill="none"
      aria-hidden
    >
      <circle cx="110" cy="90" r="62" stroke="#E7E9F2" strokeWidth="10" fill="none" />
      <motion.circle
        cx="110"
        cy="90"
        r="62"
        stroke="url(#scoreGradWelcome)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="389"
        transform="rotate(-90 110 90)"
        fill="none"
        initial={{ strokeDashoffset: 389 }}
        animate={{ strokeDashoffset: 100 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
      />
      <motion.text
        x="110"
        y="86"
        textAnchor="middle"
        fontSize="32"
        fontWeight="800"
        fill="#0B1020"
        fontFamily="Inter"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
      >
        742
      </motion.text>
      <motion.text
        x="110"
        y="106"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#2FA890"
        fontFamily="Inter"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.78 }}
      >
        Excellent
      </motion.text>
      <defs>
        <linearGradient id="scoreGradWelcome" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5B2FE0" />
          <stop offset="100%" stopColor="#1B6FE6" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

function SlideAiArt() {
  return (
    <motion.svg
      width="220"
      height="180"
      viewBox="0 0 220 180"
      fill="none"
      aria-hidden
    >
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
      >
        <rect x="22" y="32" width="130" height="50" rx="16" fill="#F2EDFF" />
        <rect x="36" y="48" width="80" height="6" rx="3" fill="#5B2FE0" />
        <rect x="36" y="62" width="60" height="6" rx="3" fill="#D4C8F7" />
      </motion.g>

      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.32 }}
      >
        <rect x="62" y="100" width="130" height="50" rx="16" fill="#E6F0FF" />
        <rect x="76" y="116" width="60" height="6" rx="3" fill="#1B6FE6" />
        <rect x="76" y="130" width="98" height="6" rx="3" fill="#C5DBFA" />
      </motion.g>

      <motion.circle
        cx="186"
        cy="48"
        r="14"
        fill="#5B2FE0"
        animate={{ r: [14, 17, 14], opacity: [1, 0.65, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      />
      <path
        d="M180 48 L186 54 L194 44"
        stroke="white"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
