"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { BankChip, type BankId } from "@/components/brand/bank-logos";
import { TabBar } from "@/components/home/tab-bar";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Credit — Riverline's financial intelligence center.
 *
 * Editorial in feel, not dashboard-heavy. Five connected sections that
 * tell one story: where you are → how you got here → what AI sees →
 * what you can do → who's offering you better terms.
 */
export function CreditScreen() {
  return (
    <div className="relative h-full w-full bg-riverline-bg text-riverline-ink">
      {/* Ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% -10%, rgba(42,27,124,0.04) 0%, transparent 60%), radial-gradient(ellipse 70% 30% at 100% 100%, rgba(31,138,118,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="no-scroll relative z-10 h-full overflow-y-auto pb-[110px]">
        <Header />

        {/* Section 01 — Snapshot (editorial, not card-heavy) */}
        <Stagger delay={0.05}>
          <Snapshot />
        </Stagger>

        {/* Section 02 — Timeline with annotations */}
        <SectionTitle
          eyebrow="01"
          title="Credit timeline"
          hint="Last 6 months"
        />
        <Stagger delay={0.18}>
          <Timeline />
        </Stagger>

        {/* Section 03 — AI insights feed */}
        <SectionTitle
          eyebrow="02"
          title="What AI sees"
          hint="Updated 2h ago"
        />
        <Stagger delay={0.24}>
          <InsightFeed />
        </Stagger>

        {/* Section 04 — Behavior breakdown */}
        <SectionTitle eyebrow="03" title="Credit behavior" />
        <Stagger delay={0.3}>
          <BehaviorPanel />
        </Stagger>

        {/* Section 05 — Active commitments */}
        <SectionTitle
          eyebrow="04"
          title="Active commitments"
          hint="₹1.2L outstanding"
        />
        <Stagger delay={0.36}>
          <Commitments />
        </Stagger>

        {/* Section 06 — Improvement roadmap */}
        <SectionTitle
          eyebrow="05"
          title="Improvement plan"
          hint="+23 pts achievable"
        />
        <Stagger delay={0.42}>
          <ImprovementRoadmap />
        </Stagger>

        {/* Section 07 — Personalized offers */}
        <SectionTitle eyebrow="06" title="Better terms for you" />
        <Stagger delay={0.48} noPad>
          <PersonalizedOffers />
        </Stagger>

        <div className="h-6" />
      </div>

      <TabBar />
    </div>
  );
}

// ─── Layout primitives ─────────────────────────────────────────────────────

function Stagger({
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

function SectionTitle({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mt-9 mb-3 flex items-baseline justify-between px-5">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-riverline-mute-2">
          {eyebrow}
        </span>
        <h2 className="text-[15px] font-semibold tracking-[-0.012em] text-riverline-ink">
          {title}
        </h2>
      </div>
      {hint && (
        <span className="text-[11px] font-medium text-riverline-mute-2">
          {hint}
        </span>
      )}
    </div>
  );
}

function softShadow(strength: "card" | "tile" = "card") {
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

function Header() {
  return (
    <div className="flex items-center justify-between px-5 pt-[64px] pb-2">
      <h1 className="font-serif text-[24px] leading-none tracking-[-0.02em] text-riverline-ink">
        Credit
      </h1>
      <button
        type="button"
        aria-label="Refresh"
        className="flex h-10 w-10 items-center justify-center rounded-full text-riverline-ink-2 hover:bg-riverline-card"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M14 8 a6 6 0 1 1-1.5-4 M14 3 v3 h-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Section 01 — Editorial snapshot ───────────────────────────────────────

function Snapshot() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-2">
      {/* Tier eyebrow */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.1 }}
        className="flex items-center gap-2"
      >
        <span className="inline-flex items-center gap-1.5 rounded-md bg-riverline-flow-soft px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] text-riverline-flow">
          <span className="block h-[5px] w-[5px] rounded-full bg-riverline-flow" />
          Excellent
        </span>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
          CIBIL · TransUnion
        </span>
      </motion.div>

      {/* Editorial score line */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.18 }}
        className="mt-3 flex items-baseline gap-2"
      >
        <div className="font-serif text-[64px] leading-[0.9] tracking-[-0.04em] text-riverline-ink tabular-nums">
          742
        </div>
        <div className="flex flex-col text-[11px] tabular-nums">
          <span className="font-medium text-riverline-mute-2">/ 900</span>
          <span className="mt-1 inline-flex items-center gap-1 font-semibold text-riverline-flow">
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
        </div>
      </motion.div>

      {/* AI sentence */}
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.28 }}
        className="mt-4 max-w-[300px] font-serif text-[18px] leading-[1.3] tracking-[-0.012em] text-riverline-ink-2"
      >
        Your credit health is{" "}
        <em className="not-italic text-riverline-ink">improving steadily</em>.
        Maintaining this trend may push you above{" "}
        <span className="font-semibold tabular-nums text-riverline-ink">
          760
        </span>{" "}
        by July.
      </motion.p>

      {/* Quick stat strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.38 }}
        className="mt-5 flex items-stretch gap-3"
      >
        <SnapStat label="Top in India" value="8%" />
        <SnapDivider />
        <SnapStat label="Repayment" value="100%" />
        <SnapDivider />
        <SnapStat label="On-time streak" value="4 mo" />
      </motion.div>
    </div>
  );
}

function SnapStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <span className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute-2">
        {label}
      </span>
      <span className="mt-1 text-[14px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
        {value}
      </span>
    </div>
  );
}

function SnapDivider() {
  return (
    <div
      aria-hidden
      className="w-px self-stretch"
      style={{ background: "rgba(12,14,20,0.07)" }}
    />
  );
}

// ─── Section 02 — Annotated timeline ───────────────────────────────────────

const TIMELINE_POINTS: Array<{
  month: string;
  value: number;
  event?: { label: string; tone: "ok" | "warn" };
}> = [
  { month: "Dec", value: 708 },
  { month: "Jan", value: 712, event: { label: "EMI paid", tone: "ok" } },
  { month: "Feb", value: 718 },
  { month: "Mar", value: 716, event: { label: "Hard inquiry", tone: "warn" } },
  { month: "Apr", value: 728, event: { label: "Utilization ↓", tone: "ok" } },
  { month: "May", value: 742, event: { label: "+18 pts", tone: "ok" } },
];

function Timeline() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(5);

  const W = 280;
  const H = 110;
  const min = Math.min(...TIMELINE_POINTS.map((p) => p.value)) - 8;
  const max = Math.max(...TIMELINE_POINTS.map((p) => p.value)) + 8;
  const stepX = W / (TIMELINE_POINTS.length - 1);

  const points = TIMELINE_POINTS.map((p, i) => ({
    ...p,
    x: i * stepX,
    y: H - ((p.value - min) / (max - min)) * H,
  }));

  // Catmull-Rom → cubic bezier
  const pathD = (() => {
    const tension = 0.32;
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

  const fillD = `${pathD} L ${W} ${H} L 0 ${H} Z`;
  const active = hovered !== null ? points[hovered] : points[points.length - 1];

  return (
    <div
      className="rounded-[20px] bg-white px-5 pt-5 pb-4"
      style={{ boxShadow: softShadow("card") }}
    >
      {/* Floating value readout */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
            {active.month} 2026
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="font-serif text-[28px] leading-none tracking-[-0.025em] text-riverline-ink tabular-nums">
              {active.value}
            </span>
            <span className="text-[11px] text-riverline-mute-2 tabular-nums">
              / 900
            </span>
          </div>
        </div>
        {active.event && (
          <span
            className={
              "inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] " +
              (active.event.tone === "ok"
                ? "bg-riverline-flow-soft text-riverline-flow"
                : "bg-amber-50 text-amber-700")
            }
          >
            {active.event.label}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="mt-4 select-none">
        <svg
          width="100%"
          height={H + 18}
          viewBox={`0 -9 ${W} ${H + 18}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="creditTimelineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(12,14,20,0.06)" />
              <stop offset="100%" stopColor="rgba(12,14,20,0)" />
            </linearGradient>
          </defs>

          {/* Average guide */}
          <line
            x1="0"
            x2={W}
            y1={H / 2}
            y2={H / 2}
            stroke="rgba(12,14,20,0.05)"
            strokeWidth="1"
            strokeDasharray="1 4"
          />

          {/* Filled area — soft, subtle, no green */}
          <motion.path
            d={fillD}
            fill="url(#creditTimelineFill)"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: SOFT_EASE, delay: 0.9 }}
          />

          {/* Stroke */}
          <motion.path
            d={pathD}
            stroke="rgb(74,51,184)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: SOFT_EASE, delay: 0.3 }}
          />

          {/* Annotations — vertical hairline + dot at events */}
          {points.map((p, i) =>
            p.event ? (
              <motion.g
                key={i}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: hovered === i ? 1 : 0.55 }}
                transition={{ duration: 0.5, ease: SOFT_EASE, delay: 1 + i * 0.06 }}
              >
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={p.y + 4}
                  y2={H + 6}
                  stroke="rgba(12,14,20,0.18)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </motion.g>
            ) : null,
          )}

          {/* Inline data points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 3 : 1.5}
              fill={hovered === i ? "rgb(74,51,184)" : "white"}
              stroke="rgba(74,51,184,0.7)"
              strokeWidth="1.1"
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                ease: SOFT_EASE,
                delay: 0.9 + i * 0.08,
              }}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className="cursor-pointer"
            />
          ))}

          {/* Active end halo (on default) */}
          {hovered === null && (
            <motion.g style={{ transformOrigin: `${points[5].x}px ${points[5].y}px` }}>
              <motion.circle
                cx={points[5].x}
                cy={points[5].y}
                r="4"
                fill="rgb(74,51,184)"
                fillOpacity="0.10"
                animate={{ r: [4, 9, 4], opacity: [0.30, 0, 0.30] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut" }}
              />
              <circle cx={points[5].x} cy={points[5].y} r="3" fill="rgb(74,51,184)" />
              <circle cx={points[5].x} cy={points[5].y} r="1.1" fill="white" />
            </motion.g>
          )}
        </svg>

        {/* X-axis */}
        <div className="mt-2 flex justify-between text-[9.5px] font-medium text-riverline-mute-2">
          {TIMELINE_POINTS.map((p, i) => (
            <button
              key={p.month}
              type="button"
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className={
                hovered === i
                  ? "font-semibold text-riverline-ink"
                  : i === 5
                    ? "font-semibold text-riverline-ink-2"
                    : ""
              }
            >
              {p.month}
            </button>
          ))}
        </div>
      </div>

      {/* Legend annotations row */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-riverline-line/60 pt-3">
        {TIMELINE_POINTS.filter((p) => p.event).map((p) => (
          <span
            key={p.month}
            className={
              "inline-flex items-center gap-1 rounded-md px-1.5 py-[2px] text-[10px] font-medium tracking-[-0.005em] " +
              (p.event!.tone === "ok"
                ? "bg-riverline-flow-soft/70 text-riverline-flow"
                : "bg-amber-50/80 text-amber-700")
            }
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.08em]">
              {p.month}
            </span>
            {p.event!.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section 03 — AI insight feed ──────────────────────────────────────────

const INSIGHTS = [
  {
    tone: "ok" as const,
    title: "You're eligible for lower interest rates.",
    body: "Your repayment behavior places you in the top 8% of borrowers. HDFC and SBI may now offer rates 1–2% below your current loan.",
  },
  {
    tone: "warn" as const,
    title: "Avoid applying for new credit this month.",
    body: "Your last hard inquiry was 38 days ago. One more before mid-June could pause your upward trend by 2–4 weeks.",
  },
  {
    tone: "ok" as const,
    title: "Maintaining this trend may push you above 760.",
    body: "Continued on-time EMIs and utilization under 30% project a score of 760 by July — unlocking premium credit categories.",
  },
];

function InsightFeed() {
  return (
    <div className="space-y-2">
      {INSIGHTS.map((ins, i) => (
        <motion.div
          key={ins.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.06 + i * 0.06 }}
          className="rounded-[16px] bg-white p-4"
          style={{ boxShadow: softShadow("tile") }}
        >
          <div className="flex items-start gap-3">
            <InsightDot tone={ins.tone} />
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[15px] leading-[1.25] tracking-[-0.012em] text-riverline-ink">
                {ins.title}
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-[1.5] text-riverline-mute">
                {ins.body}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function InsightDot({ tone }: { tone: "ok" | "warn" }) {
  return (
    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className={
          "block h-[10px] w-[10px] rounded-full " +
          (tone === "ok" ? "bg-riverline-flow" : "bg-amber-500")
        }
        style={{
          boxShadow:
            tone === "ok"
              ? "0 0 0 4px rgba(31,138,118,0.12)"
              : "0 0 0 4px rgba(217,119,6,0.12)",
        }}
      />
    </div>
  );
}

// ─── Section 04 — Behavior breakdown ───────────────────────────────────────

const BEHAVIOR = [
  {
    label: "Repayment history",
    value: "Excellent",
    pct: 1.0,
    weight: "35%",
    tone: "ok" as const,
    detail: "100% on-time over 24 months",
  },
  {
    label: "Utilization ratio",
    value: "22%",
    pct: 0.78,
    weight: "30%",
    tone: "ok" as const,
    detail: "Healthy — keep below 30%",
  },
  {
    label: "Account age",
    value: "4.2 yr",
    pct: 0.62,
    weight: "15%",
    tone: "neutral" as const,
    detail: "Older accounts boost stability",
  },
  {
    label: "Hard inquiries",
    value: "1",
    pct: 0.85,
    weight: "10%",
    tone: "ok" as const,
    detail: "Last 12 months",
  },
  {
    label: "Credit mix",
    value: "Good",
    pct: 0.7,
    weight: "10%",
    tone: "ok" as const,
    detail: "1 loan · 2 cards",
  },
];

function BehaviorPanel() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {BEHAVIOR.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.05 + i * 0.05 }}
          className={
            "px-4 py-3.5 " +
            (i > 0 ? "border-t border-riverline-line/60" : "")
          }
        >
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                {b.label}
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-riverline-mute-2">
                {b.weight}
              </span>
            </div>
            <span className="text-[12.5px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
              {b.value}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <SegmentedBar pct={b.pct} tone={b.tone} delay={0.2 + i * 0.05} />
            <span className="shrink-0 text-[11px] text-riverline-mute">
              {b.detail}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SegmentedBar({
  pct,
  tone,
  delay = 0,
}: {
  pct: number;
  tone: "ok" | "warn" | "neutral";
  delay?: number;
}) {
  const segments = 12;
  const filled = Math.round(pct * segments);

  const filledColor =
    tone === "ok"
      ? "rgb(31,138,118)"
      : tone === "warn"
        ? "rgb(217,119,6)"
        : "rgb(74,51,184)";

  return (
    <div className="flex flex-1 items-center gap-[3px]">
      {Array.from({ length: segments }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: SOFT_EASE,
            delay: delay + i * 0.025,
          }}
          className="h-[6px] flex-1 rounded-[2px]"
          style={{
            background: i < filled ? filledColor : "rgba(12,14,20,0.07)",
            transformOrigin: "left",
          }}
        />
      ))}
    </div>
  );
}

// ─── Section 05 — Active commitments timeline ──────────────────────────────

type Commitment = {
  bank: BankId;
  product: string;
  emi: string;
  due: string;
  paid: number;
  total: number;
  daysLeft: number;
  tone: "warn" | "ok";
};

const COMMITMENTS: Commitment[] = [
  {
    bank: "hdfc",
    product: "Personal Loan",
    emi: "₹12,840",
    due: "Jun 04",
    paid: 16,
    total: 24,
    daysLeft: 4,
    tone: "warn",
  },
  {
    bank: "axis",
    product: "Card EMI",
    emi: "₹3,210",
    due: "Jun 12",
    paid: 4,
    total: 12,
    daysLeft: 12,
    tone: "ok",
  },
];

function Commitments() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {COMMITMENTS.map((c, i) => {
        const pct = c.paid / c.total;
        return (
          <motion.div
            key={c.product}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.05 + i * 0.06 }}
            className={
              "px-4 py-4 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <BankChip bank={c.bank} size={36} />
                <div>
                  <div className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
                    {c.product}
                  </div>
                  <div className="mt-0.5 text-[11px] text-riverline-mute">
                    EMI {c.emi} · Due {c.due}
                  </div>
                </div>
              </div>
              <span
                className={
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] tabular-nums " +
                  (c.tone === "warn"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-riverline-flow-soft text-riverline-flow")
                }
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.1" />
                  <path d="M4.5 2.5 V4.5 L6 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
                {c.daysLeft}d left
              </span>
            </div>

            {/* Tenure progress */}
            <div className="mt-3.5">
              <div className="flex items-baseline justify-between text-[10.5px] font-medium text-riverline-mute">
                <span>Tenure</span>
                <span className="font-semibold tabular-nums text-riverline-ink-2">
                  {c.paid} <span className="text-riverline-mute-2">of {c.total}</span> paid
                </span>
              </div>
              {/* Segmented tenure indicator */}
              <div className="mt-1.5 flex items-center gap-[2px]">
                {Array.from({ length: c.total }).map((_, j) => (
                  <motion.span
                    key={j}
                    initial={{ scaleY: 0.4, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: SOFT_EASE,
                      delay: 0.3 + j * 0.015,
                    }}
                    className="h-[5px] flex-1 rounded-[1.5px]"
                    style={{
                      background:
                        j < c.paid
                          ? "rgb(74,51,184)"
                          : j === c.paid
                            ? "rgba(74,51,184,0.4)"
                            : "rgba(12,14,20,0.08)",
                    }}
                  />
                ))}
              </div>

              {/* Footer: autopay + percent */}
              <div className="mt-2.5 flex items-center justify-between text-[10.5px]">
                <span className="inline-flex items-center gap-1 text-riverline-mute">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M2.5 5.5l2 2 4-4"
                      stroke="rgb(31,138,118)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Auto-pay active
                </span>
                <span className="font-semibold tabular-nums text-riverline-ink">
                  {Math.round(pct * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Section 06 — Improvement roadmap ──────────────────────────────────────

const ROADMAP = [
  {
    title: "Reduce utilization below 30%",
    body: "Bring card balance under ₹18,000 before statement.",
    gain: 12,
    weeks: 4,
    state: "active" as const,
  },
  {
    title: "Avoid new loan checks for 45 days",
    body: "Delay any new applications until mid-July.",
    gain: 6,
    weeks: 6,
    state: "next" as const,
  },
  {
    title: "Settle Bajaj EMI in full",
    body: "Closing this account will cleanly improve your mix.",
    gain: 5,
    weeks: 12,
    state: "later" as const,
  },
];

function ImprovementRoadmap() {
  const totalGain = ROADMAP.reduce((s, r) => s + r.gain, 0);
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {/* Summary header */}
      <div className="flex items-baseline justify-between px-5 pt-4 pb-3">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
            Your roadmap
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-[24px] leading-none tracking-[-0.025em] text-riverline-ink tabular-nums">
              742 → 765
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-riverline-flow-soft px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] text-riverline-flow tabular-nums">
          +{totalGain} pts
        </span>
      </div>

      {/* Steps */}
      <div className="relative pl-5 pr-5 pb-5">
        {/* Spine */}
        <div
          aria-hidden
          className="absolute left-[28px] top-1 bottom-2 w-px"
          style={{ background: "rgba(12,14,20,0.07)" }}
        />
        {ROADMAP.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: SOFT_EASE,
              delay: 0.1 + i * 0.08,
            }}
            className="relative flex gap-3 pt-3 first:pt-0"
          >
            {/* Node */}
            <div className="relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
              <div
                className={
                  "h-[18px] w-[18px] rounded-full border " +
                  (r.state === "active"
                    ? "bg-white"
                    : r.state === "next"
                      ? "border-riverline-line bg-white"
                      : "border-riverline-line bg-riverline-card")
                }
                style={
                  r.state === "active"
                    ? { borderColor: "rgb(74,51,184)" }
                    : undefined
                }
              />
              {r.state === "active" && (
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "easeOut",
                  }}
                  className="absolute h-[18px] w-[18px] rounded-full"
                  style={{ background: "rgba(74,51,184,0.18)" }}
                />
              )}
            </div>

            {/* Body */}
            <div className="min-w-0 flex-1 pb-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                  {r.title}
                </h3>
                <span
                  className={
                    "shrink-0 rounded-md px-1.5 py-[2px] text-[10px] font-semibold tabular-nums " +
                    (r.state === "active"
                      ? "bg-riverline-flow-soft text-riverline-flow"
                      : "bg-riverline-card text-riverline-ink-2")
                  }
                >
                  +{r.gain} pts
                </span>
              </div>
              <p className="mt-0.5 text-[12px] leading-[1.5] text-riverline-mute">
                {r.body}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2">
                <span>~{r.weeks} weeks</span>
                {r.state === "active" && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-riverline-ink-2">
                      In progress
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 07 — Personalized offers ──────────────────────────────────────
//
// Same precision pattern as Home: fixed 272px width, snap scroll,
// equal heights, full-width 52px CTA, trust pills.

type Offer = {
  bank: BankId;
  lender: string;
  rate: string;
  amount: string;
  emi: string;
  reason: string;
  badge?: { label: string; tone: "brand" | "ok" };
  trust: string[];
};

const OFFERS: Offer[] = [
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
    trust: ["Pre-approved"],
  },
];

const OFFER_CARD_WIDTH = 272;
const OFFER_CARD_HEIGHT = 384;

function PersonalizedOffers() {
  return (
    <div
      className="no-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
      style={{
        scrollPaddingLeft: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginLeft: -20,
        marginRight: -20,
      }}
    >
      {OFFERS.map((o, i) => (
        <motion.div
          key={o.lender}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.05 + i * 0.06 }}
          whileTap={{ scale: 0.985 }}
          whileHover={{ y: -2 }}
          className="relative flex shrink-0 snap-start flex-col overflow-hidden rounded-[20px] bg-white text-left"
          style={{
            width: OFFER_CARD_WIDTH,
            height: OFFER_CARD_HEIGHT,
            boxShadow: softShadow("card"),
          }}
        >
          {/* TOP — Bank + AI match badge.
              Title block has a fixed min-h so single-line and clipped lender
              names occupy the same vertical space. Subtitle is nowrap +
              truncate so "Personal loan · 36 mo" never wraps to two lines. */}
          <div className="flex items-start justify-between gap-2 px-4 pt-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <BankChip bank={o.bank} size={36} />
              <div className="min-w-0 flex-1" style={{ minHeight: 36 }}>
                <div className="truncate text-[12.5px] font-semibold leading-[1.25] tracking-[-0.005em] text-riverline-ink">
                  {o.lender}
                </div>
                <div className="mt-0.5 truncate whitespace-nowrap text-[10.5px] text-riverline-mute">
                  Personal loan · 36 mo
                </div>
              </div>
            </div>
            {o.badge && (
              <span
                className={
                  "shrink-0 whitespace-nowrap rounded-md px-1.5 py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.08em] " +
                  (o.badge.tone === "brand"
                    ? "text-white"
                    : "bg-riverline-flow-soft text-riverline-flow")
                }
                style={
                  o.badge.tone === "brand"
                    ? { background: "rgb(74,51,184)" }
                    : undefined
                }
              >
                {o.badge.label}
              </span>
            )}
          </div>

          {/* Rate */}
          <div className="px-4 pt-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
              Interest rate
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-serif text-[34px] leading-none tracking-[-0.03em] text-riverline-ink tabular-nums">
                {o.rate}
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
              {o.reason}
            </p>
          </div>

          {/* Trust pills — single row, never wrap */}
          <div className="flex gap-1.5 overflow-hidden px-4 pt-3">
            {o.trust.slice(0, 2).map((t) => (
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
            {/* Amount + EMI */}
            <div className="grid grid-cols-2 gap-3 border-t border-riverline-line/60 px-4 py-3">
              <div>
                <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
                  Up to
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
                  {o.amount}
                </div>
              </div>
              <div>
                <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
                  EMI
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
                  {o.emi}
                  <span className="text-[10.5px] font-normal text-riverline-mute-2">
                    /mo
                  </span>
                </div>
              </div>
            </div>

            {/* CTA — fixed 52px height, pinned to the bottom */}
            <div className="px-4 pb-4">
              <button
                type="button"
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
              </button>
            </div>
          </div>
        </motion.div>
      ))}
      <div className="w-3 shrink-0" aria-hidden />
    </div>
  );
}
