"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { BankChip, type BankId } from "@/components/brand/bank-logos";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Refinance workspace — opens from the "Explore refinance offers" CTA on
 * Loans. NOT a generic loan comparison page; this is a focused financial
 * optimization experience.
 *
 * Sections:
 *   1. Savings hero (animated counter + confidence + eligibility)
 *   2. Current vs new loan comparison
 *   3. Payoff trajectory chart (current vs new)
 *   4. AI insights — why this refinance fits the user
 *   5. Optimized offers (HDFC recommended, SBI alternative)
 *   6. Smart actions strip
 *   7. Trust & safety footer
 */
export function RefinanceWorkspace() {
  return (
    <div className="px-5 pb-6">
      <SavingsHero />
      <Comparison />
      <PayoffChart />
      <AiInsights />
      <Offers />
      <SmartActions />
      <Trust />
    </div>
  );
}

export function RefinanceFooter() {
  return (
    <div className="flex gap-2.5">
      <button
        type="button"
        className="flex-1 rounded-[14px] border border-riverline-line bg-white py-3 text-[12.5px] font-semibold text-riverline-ink-2 transition-colors hover:bg-riverline-card"
      >
        Talk to advisor
      </button>
      <button
        type="button"
        className="flex-[1.4] rounded-[14px] py-3 text-[12.5px] font-semibold text-white"
        style={{
          background: "rgb(74,51,184)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.16)",
            "0 1px 2px rgba(42,27,124,0.45)",
            "0 6px 14px -4px rgba(74,51,184,0.32)",
          ].join(", "),
        }}
      >
        Continue with HDFC
      </button>
    </div>
  );
}

// ─── 1. Savings hero ──────────────────────────────────────────────────────

function SavingsHero() {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? 38400 : 0);

  useEffect(() => {
    if (reduce) return;
    let cur = 0;
    const target = 38400;
    const id = setInterval(() => {
      cur = Math.min(cur + Math.floor(target / 60), target);
      setN(cur);
      if (cur >= target) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div>
      <Eyebrow>Total interest saved</Eyebrow>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-serif text-[44px] leading-none tracking-[-0.035em] text-riverline-ink tabular-nums">
          ₹{n.toLocaleString("en-IN")}
        </span>
      </div>
      <p className="mt-3 max-w-[300px] text-[13px] leading-[1.55] text-riverline-mute">
        Switch your HDFC personal loan to{" "}
        <span className="font-semibold tabular-nums text-riverline-ink">
          9.10%
        </span>
        . EMI drops by{" "}
        <span className="font-semibold tabular-nums text-riverline-ink">
          ₹680/mo
        </span>{" "}
        and tenure shortens by{" "}
        <span className="font-semibold tabular-nums text-riverline-ink">
          4 months
        </span>
        .
      </p>

      {/* Confidence + eligibility row */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Tile label="Confidence" value="92%" tone="ok" sub="Very likely" />
        <Tile label="Eligibility" value="Pre-approved" sub="No hard inquiry" />
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "ok";
}) {
  return (
    <div
      className="rounded-[14px] bg-white p-3.5"
      style={{
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.9)",
          "0 1px 1px rgba(12,14,20,0.03)",
          "0 4px 10px -6px rgba(12,14,20,0.05)",
        ].join(", "),
      }}
    >
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
        {label}
      </div>
      <div
        className={
          "mt-1 text-[16px] font-semibold tabular-nums tracking-[-0.005em] " +
          (tone === "ok" ? "text-riverline-flow" : "text-riverline-ink")
        }
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-[11px] text-riverline-mute">{sub}</div>
      )}
    </div>
  );
}

// ─── 2. Comparison cards ──────────────────────────────────────────────────

function Comparison() {
  return (
    <div className="mt-6">
      <Subhead num="01" title="Current vs new" />
      <div className="grid grid-cols-2 gap-3">
        <CompareCard
          tone="muted"
          label="Current"
          rate="11.40"
          emi="₹12,840"
          tenure="24 mo"
          total="₹3,08,160"
        />
        <CompareCard
          tone="active"
          label="With refinance"
          rate="9.10"
          emi="₹12,160"
          tenure="20 mo"
          total="₹2,43,200"
          delta="−₹680/mo"
        />
      </div>

      {/* Per-row comparison */}
      <div
        className="mt-3 overflow-hidden rounded-[14px] bg-white"
        style={{
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.9)",
            "0 1px 1px rgba(12,14,20,0.03)",
            "0 4px 10px -6px rgba(12,14,20,0.05)",
          ].join(", "),
        }}
      >
        {[
          { label: "Interest saved", current: "—", next: "₹38,400", tone: "ok" },
          {
            label: "Payments left",
            current: "24",
            next: "20",
            tone: "ok",
          },
          { label: "Total payable", current: "₹3,08,160", next: "₹2,43,200" },
          { label: "Processing fee", current: "—", next: "₹2,500" },
        ].map((row, i) => (
          <div
            key={row.label}
            className={
              "grid grid-cols-[1.2fr_1fr_1fr] items-baseline px-4 py-2.5 text-[12px] " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <span className="text-riverline-mute">{row.label}</span>
            <span className="text-right tabular-nums text-riverline-mute-2">
              {row.current}
            </span>
            <span
              className={
                "text-right font-semibold tabular-nums " +
                (row.tone === "ok"
                  ? "text-riverline-flow"
                  : "text-riverline-ink")
              }
            >
              {row.next}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareCard({
  tone,
  label,
  rate,
  emi,
  tenure,
  total,
  delta,
}: {
  tone: "muted" | "active";
  label: string;
  rate: string;
  emi: string;
  tenure: string;
  total: string;
  delta?: string;
}) {
  return (
    <div
      className={
        "rounded-[14px] p-3.5 " +
        (tone === "active"
          ? "border border-riverline-flow/25 bg-riverline-flow-soft/40"
          : "bg-riverline-card/60")
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
          {label}
        </span>
        {delta && (
          <span className="rounded-md bg-white/70 px-1.5 py-[1px] text-[9.5px] font-semibold tabular-nums text-riverline-flow">
            {delta}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex items-baseline gap-0.5">
        <span className="font-serif text-[26px] leading-none tracking-[-0.025em] text-riverline-ink tabular-nums">
          {rate}
        </span>
        <span className="text-[10.5px] font-medium text-riverline-mute-2">
          %
        </span>
      </div>
      <div className="mt-2 space-y-0.5 text-[11px] tabular-nums text-riverline-mute">
        <div>
          EMI{" "}
          <span className="font-semibold text-riverline-ink">{emi}</span>
        </div>
        <div className="text-riverline-mute-2">
          {tenure} · {total}
        </div>
      </div>
    </div>
  );
}

// ─── 3. Payoff trajectory chart ───────────────────────────────────────────

function PayoffChart() {
  // 24 monthly points showing principal remaining for each path
  const W = 320;
  const H = 100;
  const months = 24;

  const principal = 308000;
  const rateCur = 0.114 / 12;
  const rateNew = 0.091 / 12;
  const emiCur = 12840;
  const emiNew = 12160;

  // Compute outstanding balance over time
  const trajectory = (rate: number, emi: number, totalMonths: number) => {
    const points: number[] = [];
    let bal = principal;
    for (let m = 0; m <= totalMonths; m++) {
      points.push(Math.max(0, bal));
      bal = bal * (1 + rate) - emi;
    }
    return points;
  };

  const cur = trajectory(rateCur, emiCur, months);
  const next = trajectory(rateNew, emiNew, 20);

  const stepX = W / months;
  const max = principal;

  const toPath = (vals: number[]) => {
    let d = `M 0 ${H - (vals[0] / max) * H}`;
    for (let i = 1; i < vals.length; i++) {
      const x = i * stepX;
      const y = H - (vals[i] / max) * H;
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return d;
  };

  return (
    <div className="mt-6">
      <Subhead num="02" title="Payoff trajectory" />
      <div
        className="rounded-[16px] bg-white px-4 py-4"
        style={{
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.92)",
            "0 1px 1px rgba(12,14,20,0.035)",
            "0 6px 16px -10px rgba(12,14,20,0.08)",
          ].join(", "),
        }}
      >
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
          <div className="flex items-center gap-3">
            <LegendDot color="rgba(12,14,20,0.4)" label="Current" dashed />
            <LegendDot color="rgb(74,51,184)" label="Refinanced" />
          </div>
          <span className="tabular-nums text-riverline-mute-2">24 mo</span>
        </div>

        <svg
          width="100%"
          height={H + 14}
          viewBox={`0 -7 ${W} ${H + 14}`}
          preserveAspectRatio="none"
          className="mt-3 overflow-visible"
        >
          {[25, 50, 75].map((p) => (
            <line
              key={p}
              x1="0"
              x2={W}
              y1={(H * p) / 100}
              y2={(H * p) / 100}
              stroke="rgba(12,14,20,0.05)"
              strokeWidth="1"
              strokeDasharray="1 4"
            />
          ))}

          {/* Current trajectory — dashed muted */}
          <motion.path
            d={toPath(cur)}
            stroke="rgba(12,14,20,0.4)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="3 3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: SOFT_EASE, delay: 0.2 }}
          />

          {/* New trajectory — solid brand */}
          <motion.path
            d={toPath(next)}
            stroke="rgb(74,51,184)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: SOFT_EASE, delay: 0.4 }}
          />

          {/* Endpoint markers */}
          <motion.circle
            cx={(months) * stepX}
            cy={H}
            r="2.5"
            fill="rgba(12,14,20,0.5)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: SOFT_EASE, delay: 1.6 }}
          />
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.9 }}
            style={{ transformOrigin: `${20 * stepX}px ${H}px` }}
          >
            <motion.circle
              cx={20 * stepX}
              cy={H}
              r="5"
              fill="rgb(74,51,184)"
              fillOpacity="0.10"
              animate={{ r: [5, 11, 5], opacity: [0.30, 0, 0.30] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeOut" }}
            />
            <circle cx={20 * stepX} cy={H} r="3" fill="rgb(74,51,184)" />
            <circle cx={20 * stepX} cy={H} r="1.1" fill="white" />
          </motion.g>
        </svg>

        <div className="mt-2 flex justify-between text-[9.5px] font-medium text-riverline-mute-2 tabular-nums">
          <span>Now</span>
          <span>Mo 6</span>
          <span>Mo 12</span>
          <span>Mo 18</span>
          <span>Mo 24</span>
        </div>

        <p className="mt-3 text-[11.5px] leading-[1.5] text-riverline-mute">
          Refinanced loan closes in{" "}
          <span className="font-semibold text-riverline-ink-2 tabular-nums">
            month 20
          </span>{" "}
          — 4 months sooner than your current path.
        </p>
      </div>
    </div>
  );
}

function LegendDot({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium normal-case tracking-[0] text-riverline-ink-2">
      <svg width="14" height="3" viewBox="0 0 14 3" fill="none">
        <line
          x1="0.5"
          x2="13.5"
          y1="1.5"
          y2="1.5"
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray={dashed ? "3 2.5" : undefined}
        />
      </svg>
      {label}
    </span>
  );
}

// ─── 4. AI insights ───────────────────────────────────────────────────────

function AiInsights() {
  const insights = [
    "Your repayment streak qualifies you for HDFC's preferred rate band.",
    "Reducing interest by 2.3% may free ₹680 each month.",
    "You sit in the top 8% of borrowers for this lender.",
  ];
  return (
    <div className="mt-6">
      <Subhead num="03" title="Why this refinance fits" />
      <div className="space-y-2">
        {insights.map((text, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: SOFT_EASE,
              delay: 0.05 + i * 0.06,
            }}
            className="flex items-start gap-2.5 rounded-[14px] bg-white p-3.5"
            style={{
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.9)",
                "0 1px 1px rgba(12,14,20,0.025)",
              ].join(", "),
            }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              className="mt-1 block h-[7px] w-[7px] shrink-0 rounded-full bg-riverline-flow"
              style={{ boxShadow: "0 0 0 4px rgba(31,138,118,0.1)" }}
            />
            <p className="font-serif text-[14px] leading-[1.4] tracking-[-0.012em] text-riverline-ink-2">
              {text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── 5. Offers ────────────────────────────────────────────────────────────

const REFI_OFFERS: Array<{
  bank: BankId;
  lender: string;
  rate: string;
  emiSaved: string;
  approval: string;
  processing: string;
  reason: string;
  badge?: { label: string; tone: "brand" | "ok" };
}> = [
  {
    bank: "hdfc",
    lender: "HDFC Bank",
    rate: "9.10",
    emiSaved: "₹680/mo",
    approval: "92%",
    processing: "Under 24 hr",
    reason: "Lowest rate for your repayment behavior.",
    badge: { label: "AI recommended", tone: "brand" },
  },
  {
    bank: "sbi",
    lender: "State Bank of India",
    rate: "9.45",
    emiSaved: "₹540/mo",
    approval: "84%",
    processing: "2 business days",
    reason: "No processing fee. Govt-backed.",
    badge: { label: "Lowest fees", tone: "ok" },
  },
];

function Offers() {
  return (
    <div className="mt-6">
      <Subhead num="04" title="Optimized offers" />
      <div className="space-y-3">
        {REFI_OFFERS.map((o, i) => (
          <motion.button
            key={o.lender}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: SOFT_EASE,
              delay: 0.05 + i * 0.06,
            }}
            whileTap={{ scale: 0.99 }}
            className="block w-full overflow-hidden rounded-[16px] bg-white text-left"
            style={{
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.92)",
                "0 1px 1px rgba(12,14,20,0.035)",
                "0 6px 16px -10px rgba(12,14,20,0.08)",
              ].join(", "),
            }}
          >
            <div className="flex items-start justify-between gap-3 px-4 pt-4">
              <div className="flex items-center gap-3">
                <BankChip bank={o.bank} size={36} />
                <div>
                  <div className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
                    {o.lender}
                  </div>
                  <div className="text-[10.5px] text-riverline-mute">
                    Personal loan refinance
                  </div>
                </div>
              </div>
              {o.badge && (
                <span
                  className={
                    "shrink-0 rounded-md px-1.5 py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.08em] " +
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

            <div className="grid grid-cols-3 gap-3 border-t border-riverline-line/60 px-4 py-3">
              <Stat label="Rate" value={`${o.rate}%`} />
              <Stat label="EMI saved" value={o.emiSaved} tone="ok" />
              <Stat label="Approval" value={o.approval} />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-riverline-line/60 px-4 py-3">
              <p className="text-[11.5px] leading-[1.45] text-riverline-mute">
                <span className="font-medium text-riverline-ink-2">
                  Why ·{" "}
                </span>
                {o.reason}
              </p>
              <span className="shrink-0 text-[10.5px] tabular-nums text-riverline-mute-2">
                {o.processing}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok";
}) {
  return (
    <div>
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
        {label}
      </div>
      <div
        className={
          "mt-0.5 text-[12px] font-semibold tabular-nums tracking-[-0.005em] " +
          (tone === "ok" ? "text-riverline-flow" : "text-riverline-ink")
        }
      >
        {value}
      </div>
    </div>
  );
}

// ─── 6. Smart actions ─────────────────────────────────────────────────────

function SmartActions() {
  const actions = [
    { id: "emi", label: "Reduce EMI", icon: <IconDown /> },
    { id: "tenure", label: "Shorten tenure", icon: <IconClock /> },
    { id: "compare", label: "Compare lenders", icon: <IconCompare /> },
    { id: "simulate", label: "Simulate payoff", icon: <IconChart /> },
  ];
  return (
    <div className="mt-6">
      <Subhead num="05" title="Smart actions" />
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <motion.button
            key={a.id}
            type="button"
            whileTap={{ scale: 0.985 }}
            className="flex items-center gap-2.5 rounded-[12px] bg-white px-3 py-2.5 text-left"
            style={{
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.9)",
                "0 1px 1px rgba(12,14,20,0.025)",
              ].join(", "),
            }}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-riverline-card text-riverline-ink-2">
              {a.icon}
            </div>
            <span className="flex-1 text-[12px] font-medium tracking-[-0.005em] text-riverline-ink">
              {a.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── 7. Trust footer ──────────────────────────────────────────────────────

function Trust() {
  const items = [
    "RBI-regulated lending partners",
    "No hard inquiry until you give consent",
    "End-to-end encrypted process",
    "Zero hidden charges in our recommendations",
  ];
  return (
    <div className="mt-6">
      <Subhead num="06" title="Trust & safety" />
      <div
        className="overflow-hidden rounded-[14px] bg-white"
        style={{
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.9)",
            "0 1px 1px rgba(12,14,20,0.025)",
          ].join(", "),
        }}
      >
        {items.map((item, i) => (
          <div
            key={item}
            className={
              "flex items-center gap-2.5 px-4 py-2.5 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-riverline-flow-soft">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M2 4.5l1.8 1.8 3.5-3.5"
                  stroke="rgb(31,138,118)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[11.5px] text-riverline-ink-2">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
      {children}
    </div>
  );
}

function Subhead({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-2.5">
      <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-riverline-mute-2">
        {num}
      </span>
      <h3 className="text-[14px] font-semibold tracking-[-0.012em] text-riverline-ink">
        {title}
      </h3>
    </div>
  );
}

const stroke = { stroke: "currentColor", strokeWidth: 1.4 } as const;

function IconDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 4 C 4 6, 6 8, 8 8 S 11 6, 13 10"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 10 L13 10 L13 7" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5" {...stroke} />
      <path d="M7 4 V7 L9 8.5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconCompare() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5 H10 M8 3 L10 5 L8 7" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 9 H4 M6 7 L4 9 L6 11" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 11 L5 8 L7 9.5 L12 4" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4 L12 4 L12 7" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
