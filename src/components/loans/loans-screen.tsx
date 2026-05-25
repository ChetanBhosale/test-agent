"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, useMemo, type ReactNode } from "react";
import { BankChip, type BankId } from "@/components/brand/bank-logos";
import { TabBar } from "@/components/home/tab-bar";
import { DetailSheet } from "@/components/sheets/detail-sheet";
import {
  RefinanceWorkspace,
  RefinanceFooter,
} from "@/components/sheets/refinance-workspace";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Loans — Riverline's borrowing intelligence center.
 *
 * Optimizes for *responsible* borrowing, not conversion. The narrative arc:
 *   capacity → recommendations → affordability → commitments → AI
 *   strategist → refinance → safety
 *
 * Visual rhythm intentionally different from Home (analytics-first) and
 * Credit (timeline-first). Loans feels like a quiet financial advisor.
 */
export function LoansScreen() {
  const [refiOpen, setRefiOpen] = useState(false);

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

        <Stagger delay={0.06}>
          <CapacityHero />
        </Stagger>

        <SectionTitle eyebrow="01" title="Curated for you" hint="3 fits" />
        <Stagger delay={0.16}>
          <Recommendations />
        </Stagger>

        <SectionTitle eyebrow="02" title="Affordability intelligence" />
        <Stagger delay={0.22}>
          <AffordabilitySimulator />
        </Stagger>

        <SectionTitle eyebrow="03" title="Active commitments" />
        <Stagger delay={0.28}>
          <ActiveLoans />
        </Stagger>

        <SectionTitle eyebrow="04" title="AI borrowing advisor" />
        <Stagger delay={0.34}>
          <AdvisorPanel />
        </Stagger>

        <SectionTitle eyebrow="05" title="Refinance opportunity" hint="Save ₹38,400" />
        <Stagger delay={0.4}>
          <RefinancePanel onExplore={() => setRefiOpen(true)} />
        </Stagger>

        <SectionTitle eyebrow="06" title="Financial protection" />
        <Stagger delay={0.46}>
          <ProtectionPanel />
        </Stagger>

        <Footer />
      </div>

      <TabBar />

      {/* Refinance workspace sheet */}
      <DetailSheet
        open={refiOpen}
        onClose={() => setRefiOpen(false)}
        eyebrow="Refinance"
        title="Optimize your HDFC loan"
        height="88%"
        footer={<RefinanceFooter />}
      >
        <RefinanceWorkspace />
      </DetailSheet>
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
        Loans
      </h1>
      <button
        type="button"
        aria-label="History"
        className="flex h-10 w-10 items-center justify-center rounded-full text-riverline-ink-2 hover:bg-riverline-card"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 4.5 V8 L10.5 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Section 01 — Borrowing capacity hero ──────────────────────────────────
//
// A horizontal capacity arc shows three zones (safe / careful / strain)
// with a needle at the user's *current* monthly EMI commitment.
// The headline frames borrowing as a position, not a target.

function CapacityHero() {
  const reduce = useReducedMotion();

  // Dummy financial state
  const monthlyIncome = 95000;
  const currentEMIs = 12840;
  const safeMaxEMI = 28500; // 30% DTI threshold
  const recommendedHeadroom = safeMaxEMI - currentEMIs;
  const dtiPct = currentEMIs / monthlyIncome; // ~13.5%

  return (
    <div
      className="mt-2 overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      <div className="px-5 pt-5">
        {/* Editorial framing */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-riverline-flow-soft px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] text-riverline-flow">
            <span className="block h-[5px] w-[5px] rounded-full bg-riverline-flow" />
            Healthy position
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
            Borrowing power
          </span>
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.15 }}
          className="mt-3 max-w-[300px] font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink"
        >
          You can safely manage up to{" "}
          <span className="tabular-nums">₹28,500</span> a month in EMIs.
        </motion.p>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.25 }}
          className="mt-2 text-[12.5px] leading-[1.55] text-riverline-mute"
        >
          That leaves{" "}
          <span className="font-semibold tabular-nums text-riverline-ink">
            ₹{recommendedHeadroom.toLocaleString("en-IN")}
          </span>{" "}
          of comfortable room. We&rsquo;ll only show you opportunities within
          this range.
        </motion.p>
      </div>

      {/* Capacity arc */}
      <div className="px-5 pt-6">
        <CapacityArc current={currentEMIs} safe={safeMaxEMI} />

        {/* Zone labels */}
        <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2">
          <span>₹0</span>
          <span>Safe</span>
          <span>Careful</span>
          <span>Strain</span>
        </div>
      </div>

      {/* Stat row */}
      <div className="mx-5 mt-5 mb-5 grid grid-cols-3 rounded-[12px] bg-riverline-card/60 px-2 py-3">
        <CapacityStat label="Monthly income" value="₹95,000" />
        <Divider />
        <CapacityStat label="Current EMIs" value="₹12,840" tone="ink" />
        <Divider />
        <CapacityStat
          label="DTI ratio"
          value={`${(dtiPct * 100).toFixed(1)}%`}
          tone="ok"
        />
      </div>
    </div>
  );
}

function CapacityArc({ current, safe }: { current: number; safe: number }) {
  const reduce = useReducedMotion();

  // Track maps from 0 to ~2.5x safe (so strain zone is visible)
  const W = 280;
  const H = 80;
  const maxValue = safe * 2.2;
  const cx = W / 2;
  const cy = H + 6;
  const r = 88;

  // Three zones expressed as arc fractions
  const safeEnd = safe / maxValue; // ~0.45
  const carefulEnd = (safe * 1.35) / maxValue; // ~0.61
  // strain runs to 1.0

  // Needle position (current commitment)
  const needlePct = Math.min(current / maxValue, 1);

  // Convert pct (0..1) → angle along bottom semicircle (180° → 360°, i.e. -180 → 0)
  const angleAt = (pct: number) => Math.PI + pct * Math.PI;
  const pointAt = (pct: number, radius = r) => {
    const a = angleAt(pct);
    return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius };
  };

  // Build arc path between two pcts
  const arcPath = (from: number, to: number, radius = r) => {
    const p0 = pointAt(from, radius);
    const p1 = pointAt(to, radius);
    return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 0 1 ${p1.x} ${p1.y}`;
  };

  const needle = pointAt(needlePct);

  return (
    <svg
      width="100%"
      height={H + 18}
      viewBox={`0 0 ${W} ${H + 18}`}
      preserveAspectRatio="xMidYMid meet"
      className="overflow-visible"
    >
      {/* Background track — single subtle line */}
      <path
        d={arcPath(0, 1)}
        stroke="rgba(12,14,20,0.06)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Safe zone — emerald */}
      <motion.path
        d={arcPath(0, safeEnd)}
        stroke="rgb(31,138,118)"
        strokeOpacity="0.85"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: SOFT_EASE, delay: 0.2 }}
      />
      {/* Careful zone — amber */}
      <motion.path
        d={arcPath(safeEnd + 0.01, carefulEnd)}
        stroke="rgb(217,119,6)"
        strokeOpacity="0.7"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.6 }}
      />
      {/* Strain zone — danger */}
      <motion.path
        d={arcPath(carefulEnd + 0.01, 1)}
        stroke="rgb(196,73,58)"
        strokeOpacity="0.55"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.8 }}
      />

      {/* Tick at safe boundary */}
      {(() => {
        const p = pointAt(safeEnd);
        const o = pointAt(safeEnd, r + 8);
        return (
          <line
            x1={p.x}
            y1={p.y}
            x2={o.x}
            y2={o.y}
            stroke="rgba(12,14,20,0.4)"
            strokeWidth="1"
          />
        );
      })()}

      {/* Needle */}
      <motion.g
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: SOFT_EASE, delay: 1.1 }}
      >
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="rgb(74,51,184)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="3.5" fill="rgb(74,51,184)" />
        <motion.circle
          cx={needle.x}
          cy={needle.y}
          r="6"
          fill="rgb(74,51,184)"
          fillOpacity="0.10"
          animate={{ r: [6, 11, 6], opacity: [0.32, 0, 0.32] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut" }}
        />
        <circle cx={needle.x} cy={needle.y} r="3" fill="rgb(74,51,184)" />
        <circle cx={needle.x} cy={needle.y} r="1.1" fill="white" />
      </motion.g>
    </svg>
  );
}

function CapacityStat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "ok";
}) {
  return (
    <div className="flex flex-col items-center justify-center px-2 text-center">
      <div className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute-2">
        {label}
      </div>
      <div
        className={
          "mt-1 text-[12.5px] font-semibold tabular-nums tracking-[-0.005em] " +
          (tone === "ok" ? "text-riverline-flow" : "text-riverline-ink")
        }
      >
        {value}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative h-full">
      <div
        aria-hidden
        className="absolute inset-y-2 left-1/2 w-px"
        style={{ background: "rgba(12,14,20,0.08)" }}
      />
    </div>
  );
}

// ─── Section 02 — Curated recommendations ──────────────────────────────────

type Reco = {
  bank: BankId;
  lender: string;
  amount: string;
  rate: string;
  emi: string;
  approval: number; // 0..1
  comfort: "Comfortable" | "Stretch" | "Strain";
  why: string;
  tone: "best" | "good" | "neutral";
};

const RECOS: Reco[] = [
  {
    bank: "hdfc",
    lender: "HDFC Bank",
    amount: "₹3,00,000",
    rate: "9.10",
    emi: "₹6,225",
    approval: 0.92,
    comfort: "Comfortable",
    why: "Matches your repayment behavior. Stays well within your safe range.",
    tone: "best",
  },
  {
    bank: "sbi",
    lender: "State Bank of India",
    amount: "₹5,00,000",
    rate: "9.45",
    emi: "₹10,420",
    approval: 0.84,
    comfort: "Comfortable",
    why: "Larger amount with one of the lowest rates available to your tier.",
    tone: "good",
  },
  {
    bank: "axis",
    lender: "Axis Bank",
    amount: "₹2,40,000",
    rate: "10.40",
    emi: "₹5,140",
    approval: 0.71,
    comfort: "Comfortable",
    why: "Useful as a smaller, shorter-tenure consolidation option.",
    tone: "neutral",
  },
];

function Recommendations() {
  return (
    <div className="space-y-3">
      {RECOS.map((r, i) => (
        <motion.div
          key={r.lender}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.06 + i * 0.07 }}
          whileTap={{ scale: 0.995 }}
          className="overflow-hidden rounded-[18px] bg-white"
          style={{ boxShadow: softShadow("card") }}
        >
          {/* Top row: bank, badge, rate */}
          <div className="flex items-start gap-3 px-4 pt-4">
            <BankChip bank={r.bank} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
                  {r.lender}
                </span>
                {r.tone === "best" && <BadgeChip tone="brand">Best fit</BadgeChip>}
                {r.tone === "good" && (
                  <BadgeChip tone="ok">High approval</BadgeChip>
                )}
              </div>
              <div className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute">
                Personal loan · 36 mo
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-0.5">
                <span className="font-serif text-[22px] leading-none tracking-[-0.02em] text-riverline-ink tabular-nums">
                  {r.rate}
                </span>
                <span className="text-[10px] font-medium text-riverline-mute-2">
                  %
                </span>
              </div>
              <div className="text-[10px] font-medium text-riverline-mute-2 tabular-nums">
                p.a.
              </div>
            </div>
          </div>

          {/* "Why this fits" — editorial line */}
          <p className="mt-3 px-4 text-[12.5px] leading-[1.5] text-riverline-mute">
            <span className="font-medium text-riverline-ink-2">
              Why this fits ·
            </span>{" "}
            {r.why}
          </p>

          {/* Stats footer */}
          <div className="mt-3 grid grid-cols-3 border-t border-riverline-line/60">
            <FooterStat label="Up to" value={r.amount} />
            <FooterStat label="EMI" value={`${r.emi}/mo`} />
            <ApprovalStat value={r.approval} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col px-4 py-3 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-riverline-line/60">
      <span className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2">
        {label}
      </span>
      <span className="mt-0.5 text-[12px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
        {value}
      </span>
    </div>
  );
}

function ApprovalStat({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex flex-col border-l border-riverline-line/60 px-4 py-3">
      <span className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2">
        Approval
      </span>
      <div className="mt-1 flex items-center gap-1.5">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-riverline-ink/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: SOFT_EASE, delay: 0.4 }}
            className="h-full rounded-full bg-riverline-flow"
          />
        </div>
        <span className="text-[10.5px] font-semibold tabular-nums text-riverline-ink-2">
          {pct}%
        </span>
      </div>
    </div>
  );
}

function BadgeChip({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "brand" | "ok";
}) {
  return (
    <span
      className={
        "rounded-md px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.08em] " +
        (tone === "brand"
          ? "text-white"
          : "bg-riverline-flow-soft text-riverline-flow")
      }
      style={tone === "brand" ? { background: "rgb(74,51,184)" } : undefined}
    >
      {children}
    </span>
  );
}

// ─── Section 03 — Affordability simulator ──────────────────────────────────
//
// Interactive: drag the thumb to choose a loan amount; the system shows
// EMI, DTI impact, comfort verdict, and a sentence in plain English.

function AffordabilitySimulator() {
  const [amount, setAmount] = useState(400000);
  const min = 100000;
  const max = 1000000;

  // Simple EMI math at 9.5% / 36 months
  const r = 0.095 / 12;
  const n = 36;
  const emi = useMemo(() => {
    const e = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(e);
  }, [amount, r, n]);

  const monthlyIncome = 95000;
  const currentEMIs = 12840;
  const totalEMIs = currentEMIs + emi;
  const dti = totalEMIs / monthlyIncome;
  const safeDTI = 0.3;

  const verdict =
    dti <= safeDTI
      ? { label: "Healthy", tone: "ok" as const, body: "keeps your finances comfortable." }
      : dti <= 0.4
        ? { label: "Stretch", tone: "warn" as const, body: "may tighten your monthly spending." }
        : { label: "Strain", tone: "danger" as const, body: "could increase repayment pressure." };

  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white px-5 pt-5 pb-4"
      style={{ boxShadow: softShadow("card") }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
          If you borrow
        </span>
        <span
          className={
            "inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] " +
            (verdict.tone === "ok"
              ? "bg-riverline-flow-soft text-riverline-flow"
              : verdict.tone === "warn"
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-riverline-danger")
          }
        >
          {verdict.label}
        </span>
      </div>

      {/* Editorial readout */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-[36px] leading-none tracking-[-0.03em] text-riverline-ink tabular-nums">
          ₹{(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L
        </span>
        <span className="text-[12px] font-medium text-riverline-mute-2">
          over 36 months
        </span>
      </div>

      <p className="mt-3 max-w-[320px] text-[13px] leading-[1.55] text-riverline-mute">
        A loan of this size adds{" "}
        <span className="font-semibold tabular-nums text-riverline-ink">
          ₹{emi.toLocaleString("en-IN")}
        </span>{" "}
        to your monthly EMI and {verdict.body}
      </p>

      {/* Slider */}
      <div className="mt-5">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={50000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="riv-range w-full"
            aria-label="Loan amount"
            style={{
              // CSS custom prop drives the fill width
              ["--pct" as string]: `${((amount - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-medium tabular-nums text-riverline-mute-2">
          <span>₹1L</span>
          <span>₹5L</span>
          <span>₹10L</span>
        </div>
      </div>

      {/* DTI impact */}
      <div className="mt-5 border-t border-riverline-line/60 pt-4">
        <div className="flex items-baseline justify-between text-[10.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute">
          <span>Debt-to-income</span>
          <span className="tabular-nums">
            <span className="text-riverline-mute-2">
              {((currentEMIs / monthlyIncome) * 100).toFixed(1)}%
            </span>
            <span className="mx-1">→</span>
            <span
              className={
                "font-semibold " +
                (verdict.tone === "ok"
                  ? "text-riverline-flow"
                  : verdict.tone === "warn"
                    ? "text-amber-700"
                    : "text-riverline-danger")
              }
            >
              {(dti * 100).toFixed(1)}%
            </span>
          </span>
        </div>

        {/* DTI bar with safe-line marker */}
        <div className="relative mt-2 h-[7px] overflow-hidden rounded-full bg-riverline-ink/[0.06]">
          <motion.div
            animate={{ width: `${Math.min(dti * 100 * (100 / 50), 100)}%` }}
            transition={{ duration: 0.5, ease: SOFT_EASE }}
            className={
              "h-full rounded-full " +
              (verdict.tone === "ok"
                ? "bg-riverline-flow"
                : verdict.tone === "warn"
                  ? "bg-amber-600"
                  : "bg-riverline-danger")
            }
          />
          {/* Safe line at 30% (which is 60% of the 50% scale) */}
          <div
            className="absolute top-[-3px] bottom-[-3px] w-px bg-riverline-ink/45"
            style={{ left: `${(safeDTI / 0.5) * 100}%` }}
            aria-label="Safe DTI threshold"
          />
        </div>
        <div
          className="mt-1 flex justify-end text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2"
        >
          <span>Safe limit · 30%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Section 04 — Active commitments timeline ──────────────────────────────

type Commitment = {
  bank: BankId;
  product: string;
  outstanding: string;
  emi: string;
  due: string;
  paid: number;
  total: number;
  daysLeft: number;
  closes: string;
};

const COMMITMENTS: Commitment[] = [
  {
    bank: "hdfc",
    product: "Personal Loan",
    outstanding: "₹98,400",
    emi: "₹12,840",
    due: "Jun 04",
    paid: 16,
    total: 24,
    daysLeft: 4,
    closes: "Feb 2027",
  },
  {
    bank: "axis",
    product: "Card EMI",
    outstanding: "₹25,680",
    emi: "₹3,210",
    due: "Jun 12",
    paid: 4,
    total: 12,
    daysLeft: 12,
    closes: "Jan 2027",
  },
];

function ActiveLoans() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {COMMITMENTS.map((c, i) => (
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
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <BankChip bank={c.bank} size={36} />
              <div>
                <div className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
                  {c.product}
                </div>
                <div className="mt-0.5 text-[11px] text-riverline-mute">
                  Outstanding{" "}
                  <span className="font-semibold tabular-nums text-riverline-ink-2">
                    {c.outstanding}
                  </span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-riverline-card px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] tabular-nums text-riverline-ink-2">
              {c.daysLeft}d to next EMI
            </span>
          </div>

          {/* Tenure beads */}
          <div className="mt-3.5">
            <div className="flex items-center gap-[2.5px]">
              {Array.from({ length: c.total }).map((_, j) => (
                <motion.span
                  key={j}
                  initial={{ scaleY: 0.4, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: SOFT_EASE,
                    delay: 0.3 + j * 0.012,
                  }}
                  className="h-[6px] flex-1 rounded-[2px]"
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
            <div className="mt-2 flex items-center justify-between text-[10.5px]">
              <span className="text-riverline-mute">
                EMI{" "}
                <span className="font-semibold tabular-nums text-riverline-ink">
                  {c.emi}
                </span>{" "}
                · Due {c.due}
              </span>
              <span className="font-medium text-riverline-mute-2">
                Closes {c.closes}
              </span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Footer summary */}
      <div className="border-t border-riverline-line/60 bg-riverline-card/40 px-4 py-3 text-[11.5px]">
        <div className="flex items-center justify-between">
          <span className="text-riverline-mute">Total monthly outflow</span>
          <span className="font-semibold tabular-nums text-riverline-ink">
            ₹16,050{" "}
            <span className="text-riverline-mute-2 font-normal">
              · 17% of income
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Section 05 — AI borrowing advisor ─────────────────────────────────────

function AdvisorPanel() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-riverline-ink text-white"
      style={{
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.06)",
          "0 1px 2px rgba(12,14,20,0.5)",
          "0 8px 22px -8px rgba(12,14,20,0.45)",
        ].join(", "),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(107,92,212,0.18) 0%, transparent 60%)",
        }}
      />
      <div className="relative px-5 pt-5 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/6"
            style={{
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.08)",
                "inset 0 -1px 0 rgba(0,0,0,0.18)",
              ].join(", "),
            }}
          >
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              {[
                { x: 4, base: 7, amp: 4 },
                { x: 7.5, base: 5, amp: 6 },
                { x: 11, base: 3, amp: 8 },
                { x: 14.5, base: 5, amp: 6 },
                { x: 18, base: 7, amp: 4 },
              ].map((bar, i) => (
                <motion.rect
                  key={i}
                  x={bar.x}
                  width="2"
                  rx="1"
                  fill="white"
                  animate={{
                    y: [bar.base, bar.base - bar.amp / 2, bar.base],
                    height: [
                      22 - bar.base * 2,
                      22 - bar.base * 2 + bar.amp,
                      22 - bar.base * 2,
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    delay: i * 0.14,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-semibold tracking-[-0.005em] text-white">
              Strategist
            </div>
            <div className="text-[10px] text-white/55">
              3 proactive observations
            </div>
          </div>
        </div>
      </div>

      <div className="relative space-y-3 px-5 pt-3 pb-5">
        {[
          {
            tone: "ok" as const,
            head: "You may save ₹38,400 by refinancing HDFC.",
            body: "Switching to a 9.10% offer cuts EMI by ₹680/month and shortens tenure by 4 months.",
          },
          {
            tone: "warn" as const,
            head: "Your EMI load is slightly above the comfortable range.",
            body: "Holding off on new EMIs for 60 days will keep DTI under 17%.",
          },
          {
            tone: "ok" as const,
            head: "Paying ₹2,000 extra monthly closes the loan 7 months earlier.",
            body: "You'd save approximately ₹14,200 in total interest.",
          },
        ].map((m, i) => (
          <motion.div
            key={m.head}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.3 + i * 0.08 }}
            className="flex items-start gap-3"
          >
            <div className="mt-[6px] flex h-2 w-2 shrink-0 items-center justify-center">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut",
                }}
                className={
                  "block h-2 w-2 rounded-full " +
                  (m.tone === "ok" ? "bg-[#5fd4b8]" : "bg-amber-300")
                }
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold leading-[1.35] tracking-[-0.005em] text-white">
                {m.head}
              </div>
              <p className="mt-1 text-[12px] leading-[1.5] text-white/65">
                {m.body}
              </p>
            </div>
            <button
              type="button"
              aria-label="See more"
              className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/8 hover:text-white"
            >
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
          </motion.div>
        ))}
      </div>

      <div
        className="flex items-stretch border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <ActionCell label="Talk to advisor" />
        <div className="w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <ActionCell label="Open chat" />
      </div>
    </div>
  );
}

function ActionCell({ label }: { label: string }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985, backgroundColor: "rgba(255,255,255,0.04)" }}
      className="flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-[12px] font-medium text-white/85"
    >
      {label}
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path
          d="M3 5.5h5M6 3l2.5 2.5L6 8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

// ─── Section 06 — Refinance & savings ──────────────────────────────────────

function RefinancePanel({ onExplore }: { onExplore: () => void }) {
  const reduce = useReducedMotion();
  const [savings, setSavings] = useState(reduce ? 38400 : 0);

  // Animate the savings counter on mount — the headline number is
  // primary, so it deserves the visual weight.
  useEffect(() => {
    if (reduce) return;
    let cur = 0;
    const target = 38400;
    const id = setInterval(() => {
      cur = Math.min(cur + Math.floor(target / 60), target);
      setSavings(cur);
      if (cur >= target) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {/* Hero — savings is the primary focus */}
      <div className="px-5 pt-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
          On your HDFC Personal Loan
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-[40px] leading-[0.95] tracking-[-0.032em] text-riverline-ink tabular-nums">
            ₹{savings.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-riverline-flow">
            saved
          </span>
        </div>
        <p className="mt-3 max-w-[300px] text-pretty text-[12.5px] leading-[1.55] text-riverline-mute">
          Switch to a{" "}
          <span className="font-semibold tabular-nums text-riverline-ink">
            9.10%
          </span>{" "}
          rate. EMI drops by{" "}
          <span className="font-semibold tabular-nums text-riverline-ink">
            ₹680/mo
          </span>{" "}
          and tenure shortens by{" "}
          <span className="font-semibold tabular-nums text-riverline-ink">
            4 months
          </span>
          .
        </p>
      </div>

      {/* Comparison */}
      <div className="mx-5 mt-6 grid grid-cols-2 gap-3">
        <CompareCard
          label="Current"
          rate="11.40"
          emi="₹12,840"
          tenure="24 mo"
          tone="muted"
        />
        <CompareCard
          label="With refinance"
          rate="9.10"
          emi="₹12,160"
          tenure="20 mo"
          tone="active"
          delta="−₹680/mo"
        />
      </div>

      {/* Savings split bar */}
      <div className="mx-5 mt-6">
        <div className="flex items-baseline justify-between text-[10.5px] font-medium text-riverline-mute">
          <span>What you keep vs interest paid</span>
        </div>
        <div className="mt-2 flex h-[7px] overflow-hidden rounded-full bg-riverline-ink/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "62%" }}
            transition={{ duration: 1.2, ease: SOFT_EASE, delay: 0.4 }}
            className="h-full bg-riverline-flow"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "38%" }}
            transition={{ duration: 1.2, ease: SOFT_EASE, delay: 0.5 }}
            className="h-full bg-riverline-ink/30"
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] tabular-nums">
          <span className="font-semibold text-riverline-flow">
            ₹38,400 saved
          </span>
          <span className="font-medium text-riverline-mute">
            ₹23,400 interest
          </span>
        </div>
      </div>

      {/* CTA — clean, less bulky */}
      <div className="px-5 py-5">
        <button
          type="button"
          onClick={onExplore}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[12px] px-4 text-[13px] font-semibold tracking-[-0.005em] text-white transition-opacity"
          style={{
            background: "rgb(74,51,184)",
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.16)",
              "0 1px 2px rgba(42,27,124,0.45)",
              "0 6px 14px -4px rgba(74,51,184,0.32)",
            ].join(", "),
          }}
        >
          Explore refinance offers
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
  );
}

function CompareCard({
  label,
  rate,
  emi,
  tenure,
  tone,
  delta,
}: {
  label: string;
  rate: string;
  emi: string;
  tenure: string;
  tone: "muted" | "active";
  delta?: string;
}) {
  return (
    <div
      className={
        "rounded-[14px] p-3 " +
        (tone === "active"
          ? "border border-riverline-flow/20 bg-riverline-flow-soft/40"
          : "bg-riverline-card/60")
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
          {label}
        </span>
        {delta && (
          <span className="rounded-md bg-white/60 px-1.5 py-[1px] text-[9.5px] font-semibold tabular-nums text-riverline-flow">
            {delta}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex items-baseline gap-0.5">
        <span className="font-serif text-[22px] leading-none tracking-[-0.02em] text-riverline-ink tabular-nums">
          {rate}
        </span>
        <span className="text-[10px] font-medium text-riverline-mute-2">%</span>
      </div>
      <div className="mt-2 text-[11px] tabular-nums text-riverline-mute">
        EMI{" "}
        <span className="font-semibold text-riverline-ink">{emi}</span>
        <span className="ml-1 text-riverline-mute-2">· {tenure}</span>
      </div>
    </div>
  );
}

// ─── Section 07 — Financial protection layer ──────────────────────────────

function ProtectionPanel() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {/* Calm header */}
      <div className="flex items-center gap-3 px-5 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-riverline-card text-riverline-ink-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1.5 L15 4.5 V9 C15 12.5 12.5 15 9 16 C 5.5 15 3 12.5 3 9 V4.5 Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 9 L8.2 10.7 L11.5 7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
            You&rsquo;re financially protected
          </div>
          <div className="text-[11px] text-riverline-mute">
            Riverline checks 6 risk signals every day.
          </div>
        </div>
      </div>

      {/* Signals list */}
      <div className="mt-3 space-y-px">
        {[
          {
            label: "Overborrowing",
            value: "Within safe range",
            tone: "ok" as const,
          },
          {
            label: "Repayment risk",
            value: "Low",
            tone: "ok" as const,
          },
          {
            label: "Emergency fund",
            value: "2.4 months covered",
            tone: "ok" as const,
          },
          {
            label: "Stress prediction",
            value: "Stable through Sep",
            tone: "ok" as const,
          },
          {
            label: "Missed EMI risk",
            value: "0 in last 12 mo",
            tone: "ok" as const,
          },
          {
            label: "Spending pressure",
            value: "Slightly elevated",
            tone: "warn" as const,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: SOFT_EASE, delay: 0.05 + i * 0.04 }}
            className={
              "flex items-center gap-3 px-5 py-2.5 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <span
              className={
                "block h-[6px] w-[6px] rounded-full " +
                (s.tone === "ok" ? "bg-riverline-flow" : "bg-amber-500")
              }
              style={{
                boxShadow:
                  s.tone === "ok"
                    ? "0 0 0 4px rgba(31,138,118,0.1)"
                    : "0 0 0 4px rgba(217,119,6,0.1)",
              }}
            />
            <span className="flex-1 text-[12.5px] font-medium tracking-[-0.005em] text-riverline-ink">
              {s.label}
            </span>
            <span
              className={
                "text-[11.5px] tabular-nums " +
                (s.tone === "ok"
                  ? "font-medium text-riverline-mute"
                  : "font-semibold text-amber-700")
              }
            >
              {s.value}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mx-5 mb-5 mt-4 rounded-[12px] bg-riverline-card/60 px-3.5 py-2.5">
        <p className="text-[11.5px] leading-[1.5] text-riverline-mute">
          <span className="font-medium text-riverline-ink-2">
            Spending pressure ·{" "}
          </span>
          Three high-spend weeks in a row. We&rsquo;ll watch this and hold off
          on EMI suggestions until it normalizes.
        </p>
      </div>
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <div className="mt-10 px-5 pb-2 text-center">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-riverline-mute-2">
        RBI-regulated lending partners · NBFC tie-ups
      </div>
      <div className="mt-1 text-[10px] text-riverline-mute-2">
        Riverline does not lend directly. We help you borrow responsibly.
      </div>
    </div>
  );
}
