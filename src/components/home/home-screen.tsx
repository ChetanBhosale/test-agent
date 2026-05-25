"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import { RiverlineLogo } from "@/components/brand/riverline-logo";
import { BankChip, type BankId } from "@/components/brand/bank-logos";
import { Avatar } from "@/components/brand/avatar";
import { TabBar } from "./tab-bar";
import { DetailSheet } from "@/components/sheets/detail-sheet";
import { CreditDetail } from "@/components/sheets/credit-detail";
import {
  PLANS,
  PlanDetail,
  PlanFooter,
  LOAN_DETAILS,
  LoanDetail,
  LoanFooter,
  EMI_DETAILS,
  EmiDetail,
  EmiFooter,
} from "@/components/sheets/action-detail";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Riverline Home — AI-first financial operating system.
 *
 * Reorganized around a single question: "What should I do next?"
 *
 * Section flow:
 *   Pulse card        — where you are, where you're heading
 *   Smart actions     — the 3 highest-impact moves you can make today
 *   Copilot strip     — quiet entry to the AI advisor
 *   Upcoming EMIs     — calm timeline of what's due
 *   Pre-approved      — curated loan offers with "why this fits"
 *   Journey           — visual tier progression toward Platinum
 *   Daily insights    — three short observations
 *
 * Interaction system:
 *   Every primary CTA opens a contextual DetailSheet — never a route change.
 *   Visual continuity is preserved (the home stays mounted, the sheet
 *   slides up over a dimmed backdrop, drag-down dismisses).
 */

type Sheet =
  | { kind: "credit" }
  | { kind: "plan"; planId: keyof typeof PLANS }
  | { kind: "loan"; loanId: keyof typeof LOAN_DETAILS }
  | { kind: "emi"; emiId: keyof typeof EMI_DETAILS }
  | null;

export function HomeScreen() {
  const { user } = useApp();
  const name = user?.name ?? "Shubham";
  const [sheet, setSheet] = useState<Sheet>(null);
  const [planActivated, setPlanActivated] = useState<Record<string, boolean>>(
    {},
  );

  const close = () => setSheet(null);

  return (
    <div className="relative h-full w-full bg-riverline-bg text-riverline-ink">
      {/* Calm warm-ivory ambient — single radial, no colored accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% -10%, rgba(12,14,20,0.025) 0%, transparent 60%)",
        }}
      />

      <div className="no-scroll relative z-10 h-full overflow-y-auto pb-[120px]">
        <Header name={name} />

        <Section delay={0.05}>
          <PulseCard onDetails={() => setSheet({ kind: "credit" })} />
        </Section>

        <SectionHeader
          eyebrow="01"
          title="Smart actions"
          hint="3 recommendations"
        />
        <Section delay={0.14} noPad>
          <SmartActions
            onPlan={(id) => setSheet({ kind: "plan", planId: id })}
          />
        </Section>

        <SectionHeader eyebrow="02" title="Ask Copilot" />
        <Section delay={0.2}>
          <CopilotStrip />
        </Section>

        <SectionHeader eyebrow="03" title="Upcoming" hint="2 EMIs" />
        <Section delay={0.26}>
          <EmiTimeline
            onOpen={(id) => setSheet({ kind: "emi", emiId: id })}
          />
        </Section>

        <SectionHeader
          eyebrow="04"
          title="Better terms for you"
          cta="See all"
        />
        <Section delay={0.32} noPad>
          <LoanCarousel
            onOpen={(id) => setSheet({ kind: "loan", loanId: id })}
          />
        </Section>

        <SectionHeader eyebrow="05" title="Your journey" hint="Gold · 68%" />
        <Section delay={0.38}>
          <HealthJourney />
        </Section>

        <SectionHeader eyebrow="06" title="Daily intelligence" />
        <Section delay={0.44}>
          <DailyInsights />
        </Section>

        <Footer />
      </div>

      <TabBar />

      {/* ── Detail sheets ─────────────────────────────────────── */}

      <DetailSheet
        open={sheet?.kind === "credit"}
        onClose={close}
        eyebrow="Credit health"
        title="Your full credit picture"
        height="86%"
      >
        <CreditDetail />
      </DetailSheet>

      {sheet?.kind === "plan" && (
        <DetailSheet
          open
          onClose={close}
          eyebrow="Smart action"
          title={PLANS[sheet.planId].title}
          height="84%"
          footer={
            <PlanFooter
              activated={!!planActivated[sheet.planId]}
              onActivate={() =>
                setPlanActivated((p) => ({
                  ...p,
                  [String(sheet.planId)]: true,
                }))
              }
            />
          }
        >
          <PlanDetail plan={PLANS[sheet.planId]} />
        </DetailSheet>
      )}

      {sheet?.kind === "loan" && (
        <DetailSheet
          open
          onClose={close}
          eyebrow="Pre-approved offer"
          title={`${LOAN_DETAILS[sheet.loanId].rate}% ${LOAN_DETAILS[sheet.loanId].lender}`}
          height="86%"
          footer={<LoanFooter />}
        >
          <LoanDetail loan={LOAN_DETAILS[sheet.loanId]} />
        </DetailSheet>
      )}

      {sheet?.kind === "emi" && (
        <DetailSheet
          open
          onClose={close}
          eyebrow="EMI"
          title={EMI_DETAILS[sheet.emiId].product}
          height="80%"
          footer={<EmiFooter />}
        >
          <EmiDetail emi={EMI_DETAILS[sheet.emiId]} />
        </DetailSheet>
      )}
    </div>
  );
}

// ─── Layout primitives ─────────────────────────────────────────────────────

function Section({
  children,
  delay = 0,
  noPad = false,
}: {
  children: ReactNode;
  delay?: number;
  noPad?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: SOFT_EASE, delay }}
      className={noPad ? "" : "px-5"}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  hint,
  cta,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
  cta?: string;
}) {
  return (
    <div className="mt-10 mb-3 flex items-baseline justify-between gap-3 px-5">
      <div className="flex min-w-0 items-baseline gap-2.5">
        <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-riverline-mute-2">
          {eyebrow}
        </span>
        <h2 className="truncate text-[15px] font-semibold tracking-[-0.012em] text-riverline-ink">
          {title}
        </h2>
        {hint && (
          <span className="shrink-0 text-[11px] font-medium text-riverline-mute-2">
            {hint}
          </span>
        )}
      </div>
      {cta && (
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[12px] font-medium text-riverline-mute transition-colors hover:bg-riverline-card hover:text-riverline-ink"
        >
          {cta}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M3 5.5h5M6 3l2.5 2.5L6 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function softShadow(strength: "card" | "hero" | "tile" = "card") {
  if (strength === "hero") {
    return [
      "inset 0 1px 0 rgba(255,255,255,0.95)",
      "0 1px 1px rgba(12,14,20,0.04)",
      "0 4px 10px -4px rgba(12,14,20,0.06)",
      "0 24px 56px -28px rgba(12,14,20,0.18)",
    ].join(", ");
  }
  if (strength === "tile") {
    return [
      "inset 0 1px 0 rgba(255,255,255,0.9)",
      "0 1px 1px rgba(12,14,20,0.03)",
      "0 4px 10px -6px rgba(12,14,20,0.05)",
    ].join(", ");
  }
  return [
    "inset 0 1px 0 rgba(255,255,255,0.92)",
    "0 1px 1px rgba(12,14,20,0.035)",
    "0 6px 16px -10px rgba(12,14,20,0.08)",
  ].join(", ");
}

// ─── Header ────────────────────────────────────────────────────────────────

function Header({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex items-center justify-between px-5 pt-[64px] pb-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white"
          aria-label="Riverline"
          style={{ boxShadow: softShadow("card") }}
        >
          <RiverlineLogo size={26} tone="brand" />
        </div>
        <div>
          <div className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute">
            {greeting}
          </div>
          <div className="text-[15.5px] font-semibold tracking-[-0.012em] text-riverline-ink">
            {name}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-riverline-ink hover:bg-riverline-card"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4.5 11 V7.5 A4.5 4.5 0 0 1 13.5 7.5 V11 L15 13 H3 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 14.5 a1.5 1.5 0 0 0 3 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-riverline-flow ring-2 ring-riverline-bg" />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          aria-label="Profile"
          className="ml-1"
        >
          <Avatar name={name} size={36} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Pulse Card ────────────────────────────────────────────────────────────
// Score + chart + AI prediction. The hero of the screen.

/**
 * Animates an integer from a near baseline up to the final value over ~1.4s.
 * Used by the score on the pulse card so the user sees the number "build".
 */
function useAnimatedScore(target: number, animate: boolean) {
  const [n, setN] = useState(animate ? Math.max(target - 60, 680) : target);
  useEffect(() => {
    if (!animate) {
      // Defer to next tick to avoid sync setState inside effect
      const id = setTimeout(() => setN(target), 0);
      return () => clearTimeout(id);
    }
    let cur = Math.max(target - 60, 680);
    const id = setInterval(() => {
      cur += 1;
      if (cur >= target) {
        setN(target);
        clearInterval(id);
      } else {
        setN(cur);
      }
    }, 22);
    return () => clearInterval(id);
  }, [target, animate]);
  return n;
}

function PulseCard({ onDetails }: { onDetails: () => void }) {
  const reduce = useReducedMotion();
  const score = useAnimatedScore(742, !reduce);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: SOFT_EASE }}
      whileTap={{ scale: 0.997 }}
      className="relative overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("hero") }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
            Credit health
          </span>
          <span className="rounded-md bg-riverline-card px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-riverline-ink-2">
            CIBIL · TransUnion
          </span>
        </div>
        <button
          type="button"
          onClick={onDetails}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-riverline-mute transition-colors hover:bg-riverline-card hover:text-riverline-ink"
        >
          Details
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M3 5.5h5M6 3l2.5 2.5L6 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Score block */}
      <div className="mt-6 flex items-center justify-between gap-5 px-5">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: SOFT_EASE, delay: 0.18 }}
              className="font-serif text-[60px] leading-[0.9] tracking-[-0.04em] text-riverline-ink tabular-nums"
            >
              {score}
            </motion.div>
            <span className="self-end pb-1 text-[12px] font-medium text-riverline-mute-2 tabular-nums">
              / 900
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-riverline-flow-soft px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] text-riverline-flow tabular-nums">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M4.5 1.5 L4.5 7.5 M2 4 L4.5 1.5 L7 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              +18
            </span>
            <span className="text-[11px] text-riverline-mute">
              this month · trending up
            </span>
          </div>
        </div>

        <ScoreRing value={742} max={900} />
      </div>

      {/* Forecast row */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.5 }}
        className="mx-5 mt-5 flex items-center gap-2 rounded-[10px] bg-riverline-card/60 px-3 py-2"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M2 8 C 4 6, 6 5, 7.5 4 S 10 2, 11 1.5"
            stroke="rgb(12,14,20)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="1.5" r="1.2" fill="rgb(12,14,20)" />
        </svg>
        <span className="whitespace-nowrap text-[11.5px] leading-[1.4] text-riverline-ink-2">
          On track to{" "}
          <span className="font-semibold tabular-nums">760 by Jul</span> ·{" "}
          <span className="font-semibold text-riverline-flow">+18 pts</span>{" "}
          in reach
        </span>
      </motion.div>

      {/* Tonal divider */}
      <div
        aria-hidden
        className="mx-5 mt-5 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(12,14,20,0.07) 20%, rgba(12,14,20,0.07) 80%, transparent)",
        }}
      />

      {/* Chart */}
      <div className="px-5 pt-4 pb-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
            6 months
          </span>
          <div className="flex items-center gap-1.5 text-[10.5px] tabular-nums">
            <span className="text-riverline-mute-2">724</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M3 5h4M5.5 3l1.5 2-1.5 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-riverline-mute-2"
              />
            </svg>
            <span className="font-semibold text-riverline-ink">742</span>
          </div>
        </div>

        <div className="mt-3">
          <CreditChart />
        </div>

        <div className="mt-2 flex justify-between text-[9.5px] font-medium text-riverline-mute-2">
          {["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => (
            <span
              key={m}
              className={i === 5 ? "font-semibold text-riverline-ink-2" : ""}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ScoreRing({ value, max }: { value: number; max: number }) {
  const reduce = useReducedMotion();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const pct = value / max;

  return (
    <div className="relative h-[88px] w-[88px] shrink-0">
      <svg
        width="88"
        height="88"
        viewBox="0 0 88 88"
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx="44"
          cy="44"
          r={radius}
          stroke="rgba(12,14,20,0.07)"
          strokeWidth="3.5"
          fill="none"
        />
        <motion.circle
          cx="44"
          cy="44"
          r={radius}
          stroke="rgb(74,51,184)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1.5, ease: SOFT_EASE, delay: 0.35 }}
        />
        <motion.circle
          cx="44"
          cy="44"
          r={radius}
          stroke="#1f8a76"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`2 ${circumference - 2}`}
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) - 0.5 }}
          transition={{ duration: 1.5, ease: SOFT_EASE, delay: 0.35 }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.1 }}
          className="text-[9px] font-semibold uppercase tracking-[0.1em] text-riverline-flow"
        >
          Excellent
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.2 }}
          className="mt-0.5 text-[14px] font-semibold tabular-nums tracking-[-0.01em] text-riverline-ink"
        >
          82<span className="text-riverline-mute-2">%</span>
        </motion.div>
      </div>
    </div>
  );
}

function CreditChart() {
  const reduce = useReducedMotion();
  const W = 280;
  const H = 60;
  const data = [724, 728, 732, 731, 738, 742];
  const min = Math.min(...data) - 4;
  const max = Math.max(...data) + 4;
  const stepX = W / (data.length - 1);
  const points = data.map((v, i) => ({
    x: i * stepX,
    y: H - ((v - min) / (max - min)) * H,
  }));

  // Catmull-Rom → cubic bezier (Apple Stocks style)
  const pathD = (() => {
    const tension = 0.35;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) * tension * 0.5;
      const c1y = p1.y + (p2.y - p0.y) * tension * 0.5;
      const c2x = p2.x - (p3.x - p1.x) * tension * 0.5;
      const c2y = p2.y - (p3.y - p1.y) * tension * 0.5;
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d;
  })();

  // Forecast continuation — dashed extension to the right
  const last = points[points.length - 1];
  const forecastEnd = { x: W + 24, y: last.y - 18 };
  const forecastD = `M ${last.x} ${last.y} Q ${last.x + 18} ${last.y - 4} ${forecastEnd.x} ${forecastEnd.y}`;

  return (
    <svg
      width="100%"
      height={H + 14}
      viewBox={`0 -7 ${W + 30} ${H + 14}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="creditStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(74,51,184,0.55)" />
          <stop offset="100%" stopColor="rgb(74,51,184)" />
        </linearGradient>
      </defs>

      <line
        x1="0"
        x2={W}
        y1={H / 2}
        y2={H / 2}
        stroke="rgba(12,14,20,0.05)"
        strokeWidth="1"
        strokeDasharray="1 4"
      />

      <motion.path
        d={pathD}
        stroke="url(#creditStroke)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: SOFT_EASE, delay: 0.4 }}
      />

      {/* Forecast extension — dashed, lighter */}
      <motion.path
        d={forecastD}
        stroke="rgba(12,14,20,0.32)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="3 3"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: SOFT_EASE, delay: 1.7 }}
      />

      {/* Inline points */}
      {points.slice(0, -1).map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="1.4"
          fill="white"
          stroke="rgba(12,14,20,0.7)"
          strokeWidth="1"
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: SOFT_EASE,
            delay: 0.5 + i * 0.18,
          }}
        />
      ))}

      {/* Active end point — Riverline brand accent for "today" */}
      <motion.g
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.7 }}
        style={{ transformOrigin: `${last.x}px ${last.y}px` }}
      >
        <motion.circle
          cx={last.x}
          cy={last.y}
          r="4.5"
          fill="rgb(74,51,184)"
          fillOpacity="0.10"
          animate={{ r: [4.5, 10, 4.5], opacity: [0.30, 0, 0.30] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeOut" }}
        />
        <circle cx={last.x} cy={last.y} r="3" fill="rgb(74,51,184)" />
        <circle cx={last.x} cy={last.y} r="1.1" fill="white" />
      </motion.g>

      {/* Forecast endpoint — small ghost dot */}
      <motion.circle
        cx={forecastEnd.x}
        cy={forecastEnd.y}
        r="2.2"
        fill="white"
        stroke="rgba(12,14,20,0.4)"
        strokeWidth="1"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: SOFT_EASE, delay: 2.5 }}
      />
    </svg>
  );
}

// ─── Smart Actions ─────────────────────────────────────────────────────────
// Three high-impact recommendations — the heart of the AI-first home.

type SmartAction = {
  id: string;
  title: string;
  body: string;
  impact: string;
  impactTone: "ok" | "info";
  effort: string;
  level: "High" | "Medium";
  icon: ReactNode;
  cta: string;
};

const ACTIONS: SmartAction[] = [
  {
    id: "util",
    title: "Reduce utilization",
    body: "Bring your card balance below ₹18,000 before statement.",
    impact: "+12 pts",
    impactTone: "ok",
    effort: "~5 min",
    level: "High",
    icon: <IconTrend />,
    cta: "Plan it",
  },
  {
    id: "ref",
    title: "Refinance HDFC loan",
    body: "Switch to a 9.10% offer to lighten your monthly burden.",
    impact: "Save ₹38,400",
    impactTone: "ok",
    effort: "~3 min",
    level: "High",
    icon: <IconSwap />,
    cta: "Compare",
  },
  {
    id: "auto",
    title: "Enable auto-pay",
    body: "Never miss a due date. Locks in your repayment streak.",
    impact: "0 missed",
    impactTone: "info",
    effort: "~30 sec",
    level: "Medium",
    icon: <IconAutoPay />,
    cta: "Turn on",
  },
];

function SmartActions({ onPlan }: { onPlan: (id: keyof typeof PLANS) => void }) {
  return (
    <div className="no-scroll flex gap-3 overflow-x-auto px-5">
      {ACTIONS.map((a, i) => (
        <motion.button
          key={a.id}
          type="button"
          onClick={() => onPlan(a.id as keyof typeof PLANS)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: SOFT_EASE,
            delay: 0.05 + i * 0.06,
          }}
          whileTap={{ scale: 0.985 }}
          whileHover={{ y: -2 }}
          className="relative flex w-[238px] shrink-0 flex-col rounded-[18px] bg-white p-4 text-left"
          style={{ boxShadow: softShadow("card") }}
        >
          {/* Icon + impact */}
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-riverline-card text-riverline-ink-2">
              {a.icon}
            </div>
            <div
              className={
                "rounded-md px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.06em] tabular-nums " +
                (a.impactTone === "ok"
                  ? "bg-riverline-flow-soft text-riverline-flow"
                  : "bg-riverline-card text-riverline-ink-2")
              }
            >
              {a.impact}
            </div>
          </div>

          {/* Title + body */}
          <div className="mt-3.5">
            <div className="text-[13.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
              {a.title}
            </div>
            <p className="mt-1 text-[11.5px] leading-[1.5] text-riverline-mute">
              {a.body}
            </p>
          </div>

          {/* Footer meta */}
          <div className="mt-auto flex items-center justify-between border-t border-riverline-line/60 pt-3 text-[10.5px]">
            <div className="flex items-center gap-2 text-riverline-mute-2">
              <span className="inline-flex items-center gap-1">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <circle
                    cx="4.5"
                    cy="4.5"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M4.5 2.5 V4.5 L6 5.5"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
                {a.effort}
              </span>
              <span aria-hidden>·</span>
              <span>{a.level}</span>
            </div>
            <span className="inline-flex items-center gap-1 font-semibold tracking-[-0.005em] text-riverline-ink transition-transform">
              {a.cta}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M3 5h4M5.5 3l1.5 2-1.5 2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </motion.button>
      ))}

      {/* Spacer for visual breathing at the end of the carousel */}
      <div className="w-1 shrink-0" aria-hidden />
    </div>
  );
}

// ─── Copilot strip ─────────────────────────────────────────────────────────

/**
 * Copilot strip on home — taps fire a global "open-copilot" event with a
 * seeded prompt. The TabBar listens and opens the Copilot sheet which
 * auto-sends the prompt, so the user lands in a live conversation.
 */
function CopilotStrip() {
  const reduce = useReducedMotion();
  const prompt = "How do I improve my score in 30 days?";

  return (
    <motion.button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("riverline:open-copilot", { detail: { prompt } }),
        )
      }
      whileTap={{ scale: 0.99 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 480, damping: 32 }}
      className="relative flex w-full items-center gap-3 overflow-hidden rounded-[16px] bg-riverline-ink p-3.5 text-left text-white"
      style={{
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.06)",
          "0 1px 2px rgba(12,14,20,0.4)",
          "0 6px 14px -4px rgba(12,14,20,0.3)",
        ].join(", "),
      }}
      aria-label="Ask Copilot — How do I improve my score in 30 days?"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 0%, rgba(107,92,212,0.16) 0%, transparent 60%)",
        }}
      />

      <div
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, #2a2d3c 0%, #14161e 55%, #0a0b11 100%)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.14)",
            "inset 0 -1px 0 rgba(0,0,0,0.5)",
            "0 0 0 1px rgba(12,14,20,0.4)",
          ].join(", "),
        }}
      >
        <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
          <motion.path
            d="M11 2 L11 8 M11 14 L11 20 M2 11 L8 11 M14 11 L20 11"
            stroke="white"
            strokeOpacity="0.95"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={
              reduce
                ? undefined
                : { opacity: [0.85, 1, 0.85] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
          <circle cx="11" cy="11" r="1.6" fill="white" />
        </svg>
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="text-[11px] font-medium text-white/55">
          Ask Riverline anything
        </div>
        <div className="mt-0.5 truncate text-[12.5px] tracking-[-0.005em] text-white/85">
          &ldquo;{prompt}&rdquo;
        </div>
      </div>

      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path
            d="M3 5.5h5M6 3l2.5 2.5L6 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.button>
  );
}

// ─── EMI Timeline ──────────────────────────────────────────────────────────

type Emi = {
  bank: BankId;
  product: string;
  amount: string;
  due: string;
  daysLeft: number;
  paid: number;
  total: number;
  status: "Safe" | "Soon" | "Attention";
};

const EMIS: Emi[] = [
  {
    bank: "hdfc",
    product: "HDFC Personal Loan",
    amount: "₹12,840",
    due: "Jun 04",
    daysLeft: 4,
    paid: 16,
    total: 24,
    status: "Soon",
  },
  {
    bank: "axis",
    product: "Axis Card EMI",
    amount: "₹3,210",
    due: "Jun 12",
    daysLeft: 12,
    paid: 4,
    total: 12,
    status: "Safe",
  },
];

function EmiTimeline({
  onOpen,
}: {
  onOpen: (id: keyof typeof EMI_DETAILS) => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-[18px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {EMIS.map((emi, i) => {
        const tone =
          emi.status === "Safe"
            ? "ok"
            : emi.status === "Soon"
              ? "warn"
              : "danger";
        return (
          <motion.button
            type="button"
            onClick={() => onOpen(emi.bank as keyof typeof EMI_DETAILS)}
            key={emi.product}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.05 + i * 0.06 }}
            whileTap={{ scale: 0.997, backgroundColor: "rgba(12,14,20,0.02)" }}
            className={
              "block w-full px-4 py-3.5 text-left " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <div className="flex items-start gap-3.5">
              <BankChip bank={emi.bank} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="truncate text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
                    {emi.product}
                  </div>
                  <div className="text-[13px] font-semibold tabular-nums text-riverline-ink">
                    {emi.amount}
                  </div>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[10.5px] text-riverline-mute">
                  <span>
                    Due {emi.due} ·{" "}
                    <span className="tabular-nums">{emi.daysLeft}d</span>
                  </span>
                  <StatusPill status={emi.status} tone={tone} />
                </div>

                {/* Tenure beads */}
                <div className="mt-2 flex items-center gap-[2px]">
                  {Array.from({ length: emi.total }).map((_, j) => (
                    <motion.span
                      key={j}
                      initial={{ scaleY: 0.4, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        ease: SOFT_EASE,
                        delay: 0.3 + j * 0.014,
                      }}
                      className="h-[4px] flex-1 rounded-[1.5px]"
                      style={{
                        background:
                          j < emi.paid
                            ? "rgb(74,51,184)"
                            : j === emi.paid
                              ? "rgba(74,51,184,0.4)"
                              : "rgba(12,14,20,0.07)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function StatusPill({
  status,
  tone,
}: {
  status: string;
  tone: "ok" | "warn" | "danger";
}) {
  const cls =
    tone === "ok"
      ? "bg-riverline-flow-soft text-riverline-flow"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-riverline-danger";
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] " +
        cls
      }
    >
      <span
        className={
          "block h-[5px] w-[5px] rounded-full " +
          (tone === "ok"
            ? "bg-riverline-flow"
            : tone === "warn"
              ? "bg-amber-600"
              : "bg-riverline-danger")
        }
      />
      {status}
    </span>
  );
}

// ─── Loan marketplace ──────────────────────────────────────────────────────
//
// Precision-built carousel:
//   • Fixed card width (272px) — never depends on viewport math, so widths
//     stay identical and the CTA never clips
//   • Fixed card height via flex-col + space utilities — every card matches
//   • Scroll-snap with 24px outer padding (matches the screen rhythm)
//   • Trailing 32px end-pad gives the last card air; 24px between cards
//   • Each card is a single tappable button — no nested interactive elements

const OFFERS: Array<{
  bank: BankId;
  lender: string;
  rate: string;
  amount: string;
  emi: string;
  reason: string;
  badge: { label: string; tone: "brand" | "ok" };
  trust: string[];
}> = [
  {
    bank: "hdfc",
    lender: "HDFC Bank",
    rate: "9.10",
    amount: "₹3,00,000",
    emi: "₹6,225",
    reason: "Lowest EMI for your repayment behavior.",
    badge: { label: "Best fit", tone: "brand" },
    trust: ["Pre-approved", "High eligibility"],
  },
  {
    bank: "sbi",
    lender: "State Bank of India",
    rate: "9.45",
    amount: "₹5,00,000",
    emi: "₹10,420",
    reason: "Largest amount available to your tier.",
    badge: { label: "High approval", tone: "ok" },
    trust: ["Pre-approved", "Fast approval"],
  },
  {
    bank: "axis",
    lender: "Axis Bank",
    rate: "10.40",
    amount: "₹2,40,000",
    emi: "₹5,140",
    reason: "Useful for short-term consolidation.",
    badge: { label: "Could save ₹18k", tone: "ok" },
    trust: ["Pre-approved"],
  },
];

const LOAN_CARD_WIDTH = 272;
const LOAN_CARD_HEIGHT = 384;

function LoanCarousel({
  onOpen,
}: {
  onOpen: (id: keyof typeof LOAN_DETAILS) => void;
}) {
  return (
    <div
      className="no-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
      style={{
        // Carousel sits in <Section noPad> so it owns its own gutters.
        // 20px on both sides matches the rest of the page; scrollPaddingLeft
        // ensures snap targets stop at the gutter, not the viewport edge.
        scrollPaddingLeft: 20,
        scrollPaddingRight: 20,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      {OFFERS.map((offer, i) => (
        <motion.button
          type="button"
          onClick={() => onOpen(offer.bank as keyof typeof LOAN_DETAILS)}
          key={offer.lender}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: SOFT_EASE,
            delay: 0.05 + i * 0.06,
          }}
          whileTap={{ scale: 0.985 }}
          whileHover={{ y: -2 }}
          aria-label={`${offer.lender} · ${offer.rate}% personal loan`}
          className="relative flex shrink-0 snap-start flex-col overflow-hidden rounded-[20px] bg-white text-left"
          style={{
            width: LOAN_CARD_WIDTH,
            height: LOAN_CARD_HEIGHT,
            boxShadow: softShadow("card"),
          }}
        >
          {/* TOP — Bank + AI match badge.
              Title block has a fixed min-h so single-line and clipped lender
              names occupy the same vertical space. Subtitle is nowrap +
              truncate so "Personal loan · 36 mo" never wraps to two lines. */}
          <div className="flex items-start justify-between gap-2 px-4 pt-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <BankChip bank={offer.bank} size={36} />
              <div className="min-w-0 flex-1" style={{ minHeight: 36 }}>
                <div className="truncate text-[12.5px] font-semibold leading-[1.25] tracking-[-0.005em] text-riverline-ink">
                  {offer.lender}
                </div>
                <div className="mt-0.5 truncate whitespace-nowrap text-[10.5px] text-riverline-mute">
                  Personal loan · 36 mo
                </div>
              </div>
            </div>
            <span
              className={
                "shrink-0 whitespace-nowrap rounded-md px-1.5 py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.08em] " +
                (offer.badge.tone === "brand"
                  ? "text-white"
                  : "bg-riverline-flow-soft text-riverline-flow")
              }
              style={
                offer.badge.tone === "brand"
                  ? { background: "rgb(74,51,184)" }
                  : undefined
              }
            >
              {offer.badge.label}
            </span>
          </div>

          {/* MIDDLE — Rate */}
          <div className="px-4 pt-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
              Interest rate
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-serif text-[34px] leading-none tracking-[-0.03em] text-riverline-ink tabular-nums">
                {offer.rate}
              </span>
              <span className="text-[12px] font-medium text-riverline-mute-2 tabular-nums">
                % p.a.
              </span>
            </div>
          </div>

          {/* Why matched — clamped to 2 lines so card height stays fixed */}
          <div className="px-4 pt-3">
            <p className="line-clamp-2 text-[11.5px] leading-[1.5] text-riverline-mute">
              <span className="font-medium text-riverline-ink-2">
                Why this ·{" "}
              </span>
              {offer.reason}
            </p>
          </div>

          {/* Trust pills — single row, never wrap */}
          <div className="flex gap-1.5 overflow-hidden px-4 pt-3">
            {offer.trust.slice(0, 2).map((t) => (
              <span
                key={t}
                className="shrink-0 whitespace-nowrap rounded-md bg-riverline-card px-1.5 py-[3px] text-[10px] font-medium tracking-[-0.005em] text-riverline-ink-2"
              >
                {t}
              </span>
            ))}
          </div>

          {/* mt-auto pushes the price + CTA region to the bottom of every card,
              guaranteeing CTAs align across cards regardless of content above */}
          <div className="mt-auto">
            {/* BOTTOM — Amount + EMI on a hairline */}
            <div className="grid grid-cols-2 gap-3 border-t border-riverline-line/60 px-4 py-3">
              <div>
                <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
                  Up to
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
                  {offer.amount}
                </div>
              </div>
              <div>
                <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
                  EMI
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
                  {offer.emi}
                  <span className="text-[10.5px] font-normal text-riverline-mute-2">
                    /mo
                  </span>
                </div>
              </div>
            </div>

            {/* CTA — fixed 52px height, full-width inside 16px safe padding.
                Pinned to the bottom by the mt-auto wrapper above. */}
            <div className="px-4 pb-4">
              <div
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] px-4 text-[13px] font-semibold tracking-[-0.005em] text-white"
                style={{
                  background: "rgb(74,51,184)",
                  boxShadow: [
                    "inset 0 1px 0 rgba(255,255,255,0.16)",
                    "0 1px 2px rgba(42,27,124,0.45)",
                    "0 6px 14px -4px rgba(74,51,184,0.32)",
                  ].join(", "),
                }}
              >
                View terms
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M3 6.5h5.5M6 4l2.5 2.5L6 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.button>
      ))}

      {/* Tail spacer — gives the last snapped card visual breathing on the right */}
      <div className="w-3 shrink-0" aria-hidden />
    </div>
  );
}

// ─── Health journey ────────────────────────────────────────────────────────
// Tier ladder. Bronze → Silver → Gold (current) → Platinum → Diamond.
// Visual progress between current tier and next.

const TIERS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"] as const;
const CURRENT_TIER_INDEX = 2;
const TIER_PROGRESS = 0.68;

function HealthJourney() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      <div className="flex items-baseline justify-between px-5 pt-5">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
            Borrower journey
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-[24px] leading-none tracking-[-0.025em] text-riverline-ink">
              Gold
            </span>
            <span className="text-[11px] font-medium text-riverline-mute-2">
              · 2 tiers to Platinum
            </span>
          </div>
        </div>
        <span className="rounded-md bg-riverline-card px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.08em] tabular-nums text-riverline-ink-2">
          ~Jul 2026
        </span>
      </div>

      {/* Tier ladder */}
      <div className="relative px-5 pt-6 pb-5">
        {/* Track — runs through the vertical center of every node.
            Math: pt-6 (24px) + half of the h-7 node wrapper (14px) = 38px */}
        <div
          aria-hidden
          className="absolute left-[28px] right-[28px] top-[38px] h-px bg-riverline-line-2"
        />
        {/* Filled progress to current tier (continuous segment up to current node) */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: SOFT_EASE, delay: 0.3 }}
          style={{
            transformOrigin: "left",
            left: 28,
            background: "rgb(74,51,184)",
            // Width spans from first node to current node + partial to next
            width: `calc(${
              ((CURRENT_TIER_INDEX + TIER_PROGRESS) / (TIERS.length - 1)) * 100
            }% - ${
              28 -
              ((CURRENT_TIER_INDEX + TIER_PROGRESS) / (TIERS.length - 1)) * 56
            }px)`,
          }}
          className="absolute top-[38px] h-px"
          // Brand purple fill for journey progress (replaces ink)
          // (style merged below)
        />

        <div className="relative flex items-start justify-between">
          {TIERS.map((tier, i) => {
            const isPast = i < CURRENT_TIER_INDEX;
            const isCurrent = i === CURRENT_TIER_INDEX;
            const isNext = i === CURRENT_TIER_INDEX + 1;
            return (
              <div key={tier} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: SOFT_EASE,
                    delay: 0.1 + i * 0.08,
                  }}
                  className="relative flex h-7 w-7 items-center justify-center"
                >
                  {isCurrent ? (
                    <>
                      {/* Pulsing halo */}
                      <motion.div
                        animate={{
                          scale: [1, 1.6, 1],
                          opacity: [0.4, 0, 0.4],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.4,
                          ease: "easeOut",
                        }}
                        className="absolute h-7 w-7 rounded-full"
                        style={{ background: "rgba(74,51,184,0.18)" }}
                      />
                      <div
                        className="relative flex h-6 w-6 items-center justify-center rounded-full"
                        style={{ background: "rgb(74,51,184)" }}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </>
                  ) : isPast ? (
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: "rgb(74,51,184)" }}
                    >
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 9 9"
                        fill="none"
                      >
                        <path
                          d="M2 4.5l1.8 1.8 3.5-3.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ) : isNext ? (
                    <div className="h-5 w-5 rounded-full border-2 border-dashed border-riverline-ink/35 bg-white" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-riverline-line-2 bg-white" />
                  )}
                </motion.div>
                <div
                  className={
                    "mt-2 text-[9.5px] font-semibold uppercase tracking-[0.08em] " +
                    (isCurrent
                      ? "text-riverline-ink"
                      : isPast
                        ? "text-riverline-ink-2"
                        : "text-riverline-mute-2")
                  }
                >
                  {tier}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress detail */}
        <div className="mt-5 flex items-baseline justify-between text-[10.5px] font-medium text-riverline-mute">
          <span>To Platinum</span>
          <span className="tabular-nums">
            <span className="font-semibold text-riverline-ink-2">
              {Math.round(TIER_PROGRESS * 100)}%
            </span>
          </span>
        </div>
        <div
          className="mt-1.5 h-[3px] overflow-hidden rounded-full"
          style={{ background: "rgba(74,51,184,0.10)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${TIER_PROGRESS * 100}%` }}
            transition={{ duration: 1.2, ease: SOFT_EASE, delay: 0.5 }}
            className="h-full rounded-full"
            style={{ background: "rgb(74,51,184)" }}
          />
        </div>
        <div className="mt-2 text-[11px] leading-[1.45] text-riverline-mute">
          Two more on-time months unlock lower interest tiers.
        </div>
      </div>
    </div>
  );
}

// ─── Daily intelligence ────────────────────────────────────────────────────
// Three short observations. No icons, no chips — just a quiet pulsing dot.

const DAILY = [
  "Your repayment is stronger than 82% of borrowers in India.",
  "Spending stability improved 14% this month.",
  "Score growth places you in the top 12% nationally.",
];

function DailyInsights() {
  return (
    <div
      className="overflow-hidden rounded-[18px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {DAILY.map((text, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.05 + i * 0.06 }}
          className={
            "flex items-start gap-3 px-5 py-3.5 " +
            (i > 0 ? "border-t border-riverline-line/60" : "")
          }
        >
          <div className="mt-[6px] flex h-2 w-2 shrink-0 items-center justify-center">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 2.6,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
              className="block h-[7px] w-[7px] rounded-full bg-riverline-flow"
              style={{ boxShadow: "0 0 0 4px rgba(31,138,118,0.1)" }}
            />
          </div>
          <p className="font-serif text-[14.5px] leading-[1.4] tracking-[-0.012em] text-riverline-ink-2">
            {text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <div className="mt-12 px-5 pb-2 text-center">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-riverline-mute-2">
        Riverline · v1.0
      </div>
      <div className="mt-1 text-[10px] text-riverline-mute-2">
        RBI-regulated lending partners · Made in India
      </div>
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

const stroke = { stroke: "currentColor", strokeWidth: 1.4 } as const;

function IconTrend() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 10 C 4 8, 6 6, 8 6 S 11 8, 13 4"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4 L13 4 L13 7"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSwap() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M3 5 H11 M9 3 L11 5 L9 7"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 9 H3 M5 7 L3 9 L5 11"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAutoPay() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" {...stroke} />
      <path
        d="M5 7.5 L7 9.5 L10 6"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
