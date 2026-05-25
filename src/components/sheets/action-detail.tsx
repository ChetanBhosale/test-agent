"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { BankChip, type BankId } from "@/components/brand/bank-logos";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

// ─── Plan-it: Reduce utilization ──────────────────────────────────────────

export type PlanData = {
  id: string;
  title: string;
  body: string;
  impact: string;
  effort: string;
  steps: string[];
  current: number; // current value being acted on
  target: number; // target value
  scoreFrom: number;
  scoreTo: number;
  unit?: string;
};

export const PLANS: Record<string, PlanData> = {
  util: {
    id: "util",
    title: "Reduce utilization",
    body: "Bring your card balance below ₹18,000 before statement day.",
    impact: "+12 pts",
    effort: "~5 min",
    current: 33,
    target: 28,
    unit: "%",
    scoreFrom: 742,
    scoreTo: 754,
    steps: [
      "Move ₹8,000 from savings to your HDFC card before statement.",
      "Keep utilization below 28% for the next 45 days.",
      "Riverline will track and remind you 3 days before statement.",
    ],
  },
  ref: {
    id: "ref",
    title: "Refinance HDFC loan",
    body: "Switch to a 9.10% offer to lighten your monthly burden.",
    impact: "Save ₹38,400",
    effort: "~3 min",
    current: 11.4,
    target: 9.1,
    unit: "%",
    scoreFrom: 742,
    scoreTo: 750,
    steps: [
      "Compare HDFC's 9.10% pre-approved offer against your current loan.",
      "Riverline handles the foreclosure paperwork.",
      "EMI drops to ₹12,160/mo, tenure shortens by 4 months.",
    ],
  },
  auto: {
    id: "auto",
    title: "Enable auto-pay",
    body: "Never miss a due date. Locks in your repayment streak.",
    impact: "0 missed",
    effort: "~30 sec",
    current: 0,
    target: 100,
    unit: "%",
    scoreFrom: 742,
    scoreTo: 748,
    steps: [
      "Link your HDFC account for auto-debit.",
      "Set EMI date 3 days after salary credit.",
      "Riverline pauses auto-pay if your balance drops below ₹3,000.",
    ],
  },
};

export function PlanDetail({ plan }: { plan: PlanData }) {
  const [activated] = useState(false);
  const [scoreNow] = useState(plan.scoreFrom);

  return (
    <div className="px-5 pb-6">
      {/* Why this matters */}
      <Card>
        <div className="px-4 py-4">
          <Eyebrow>Why this matters</Eyebrow>
          <p className="mt-2 text-pretty text-[13.5px] leading-[1.55] text-riverline-ink-2">
            {plan.body}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Impact" value={plan.impact} tone="ok" />
            <Stat label="Effort" value={plan.effort} />
          </div>
        </div>
      </Card>

      {/* Score simulator */}
      <div className="mt-4">
        <Card>
          <div className="px-4 py-4">
            <Eyebrow>Projected score</Eyebrow>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-serif text-[44px] leading-none tracking-[-0.03em] text-riverline-ink tabular-nums">
                {scoreNow}
              </span>
              <div className="flex flex-col text-[10.5px]">
                <span className="font-medium text-riverline-mute-2 tabular-nums">
                  from {plan.scoreFrom}
                </span>
                <span className="font-semibold text-riverline-flow tabular-nums">
                  +{plan.scoreTo - plan.scoreFrom} pts
                </span>
              </div>
            </div>
            <div
              className="mt-3 h-[3px] overflow-hidden rounded-full"
              style={{ background: "rgba(74,51,184,0.10)" }}
            >
              <motion.div
                animate={{
                  width: activated
                    ? `${((plan.scoreTo - 700) / 200) * 100}%`
                    : `${((plan.scoreFrom - 700) / 200) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: SOFT_EASE }}
                className="h-full rounded-full"
                style={{ background: "rgb(74,51,184)" }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2">
              <span>700</span>
              <span>900</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action plan steps */}
      <div className="mt-4">
        <SectionTitle eyebrow="01" title="Action plan" />
        <div
          className="overflow-hidden rounded-[16px] bg-white"
          style={cardShadow()}
        >
          {plan.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.45,
                ease: SOFT_EASE,
                delay: 0.05 + i * 0.06,
              }}
              className={
                "flex items-start gap-3 px-4 py-3.5 " +
                (i > 0 ? "border-t border-riverline-line/60" : "")
              }
            >
              <div
                className={
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold tabular-nums " +
                  (activated
                    ? "text-white"
                    : "bg-riverline-card text-riverline-ink-2")
                }
                style={
                  activated ? { background: "rgb(74,51,184)" } : undefined
                }
              >
                {activated ? (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M2.5 5.5l2 2L9 3"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <p className="text-[12.5px] leading-[1.5] text-riverline-ink-2">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activated state */}
      {activated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE }}
          className="mt-4 flex items-start gap-2.5 rounded-[14px] bg-riverline-flow-soft p-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 24,
              delay: 0.1,
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-riverline-flow"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M3 6.5l2.5 2.5L10 4"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-flow">
              Plan activated
            </div>
            <p className="mt-0.5 text-[11.5px] leading-[1.5] text-riverline-ink-2">
              Riverline will remind you 3 days before each step. Track progress
              from the Smart Actions section.
            </p>
          </div>
        </motion.div>
      )}

      {/* Spacer for footer overlap */}
      <div className="h-2" />
    </div>
  );
}

export function PlanFooter({
  activated,
  onActivate,
}: {
  activated: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      disabled={activated}
      onClick={onActivate}
      className="flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3.5 text-[14px] font-semibold tracking-[-0.005em] text-white transition-opacity disabled:opacity-50"
      style={{
        background: "rgb(74,51,184)",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.16)",
          "0 1px 2px rgba(42,27,124,0.45)",
          "0 8px 18px -6px rgba(74,51,184,0.32)",
        ].join(", "),
      }}
    >
      {activated ? "Plan active" : "Activate plan"}
      {!activated && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7h8M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

// ─── Loan offer detail ────────────────────────────────────────────────────

export type LoanData = {
  bank: BankId;
  lender: string;
  amount: string;
  rate: string;
  emi: string;
  reason: string;
  approval: number;
  total: string;
  tenure: string;
  fees: string;
};

export const LOAN_DETAILS: Record<string, LoanData> = {
  hdfc: {
    bank: "hdfc",
    lender: "HDFC Bank",
    amount: "₹3,00,000",
    rate: "9.10",
    emi: "₹6,225",
    reason:
      "Best for low EMI in your range. Your repayment streak gives you priority pricing.",
    approval: 0.92,
    total: "₹2,24,100",
    tenure: "60 months",
    fees: "₹2,500",
  },
  sbi: {
    bank: "sbi",
    lender: "State Bank of India",
    amount: "₹5,00,000",
    rate: "9.45",
    emi: "₹10,420",
    reason:
      "Highest approval chance for your tier. Government-backed, lowest hidden fees.",
    approval: 0.84,
    total: "₹3,75,200",
    tenure: "60 months",
    fees: "₹0",
  },
  axis: {
    bank: "axis",
    lender: "Axis Bank",
    amount: "₹2,40,000",
    rate: "10.40",
    emi: "₹5,140",
    reason:
      "Useful for short-term consolidation. Faster disbursal than peers.",
    approval: 0.71,
    total: "₹1,90,400",
    tenure: "48 months",
    fees: "₹1,800",
  },
};

export function LoanDetail({ loan }: { loan: LoanData }) {
  const [emi, setEmi] = useState(parseInt(loan.emi.replace(/\D/g, ""), 10));
  const [tenure, setTenure] = useState(60);

  const principal = parseInt(loan.amount.replace(/\D/g, ""), 10);
  const rate = parseFloat(loan.rate) / 100 / 12;

  // Live recalc on tenure change
  const recalc = (months: number) => {
    setTenure(months);
    const e =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);
    setEmi(Math.round(e));
  };

  return (
    <div className="px-5 pb-6">
      {/* Lender badge */}
      <div className="flex items-center gap-3">
        <BankChip bank={loan.bank} size={42} />
        <div>
          <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
            {loan.lender}
          </div>
          <div className="text-[11px] text-riverline-mute">
            Personal loan · RBI-licensed
          </div>
        </div>
      </div>

      {/* Why recommended */}
      <div className="mt-4">
        <Card>
          <div className="flex items-start gap-2.5 px-4 py-3.5">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: "easeInOut",
              }}
              className="mt-1 block h-[7px] w-[7px] shrink-0 rounded-full bg-riverline-flow"
              style={{ boxShadow: "0 0 0 4px rgba(31,138,118,0.1)" }}
            />
            <p className="text-[12.5px] leading-[1.5] text-riverline-ink-2">
              <span className="font-medium text-riverline-ink">
                Why recommended ·{" "}
              </span>
              {loan.reason}
            </p>
          </div>
        </Card>
      </div>

      {/* Live EMI simulator */}
      <div className="mt-4">
        <Card>
          <div className="px-4 py-4">
            <Eyebrow>Live simulator</Eyebrow>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-[36px] leading-none tracking-[-0.028em] text-riverline-ink tabular-nums">
                ₹{emi.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-medium text-riverline-mute-2">
                / mo · {tenure} months
              </span>
            </div>
            <div className="mt-1 text-[11px] text-riverline-mute">
              At {loan.rate}% p.a.
            </div>

            {/* Tenure slider */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-[10.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute">
                <span>Tenure</span>
                <span className="font-semibold tabular-nums text-riverline-ink-2">
                  {tenure} mo
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={84}
                step={12}
                value={tenure}
                onChange={(e) => recalc(Number(e.target.value))}
                className="riv-range mt-2 w-full"
                style={
                  {
                    ["--pct" as string]:
                      `${((tenure - 12) / 72) * 100}%`,
                  } as React.CSSProperties
                }
              />
              <div className="mt-1 flex justify-between text-[9.5px] font-medium tabular-nums text-riverline-mute-2">
                <span>12 mo</span>
                <span>48 mo</span>
                <span>84 mo</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="mt-4">
        <SectionTitle eyebrow="01" title="Repayment breakdown" />
        <Card>
          <div className="space-y-px">
            {[
              { label: "Principal", value: loan.amount },
              { label: "Total interest", value: loan.total, tone: "warn" as const },
              { label: "Processing fee", value: loan.fees },
              { label: "Tenure", value: loan.tenure },
            ].map((row, i) => (
              <div
                key={row.label}
                className={
                  "flex items-baseline justify-between px-4 py-3 " +
                  (i > 0 ? "border-t border-riverline-line/60" : "")
                }
              >
                <span className="text-[12.5px] text-riverline-mute">
                  {row.label}
                </span>
                <span
                  className={
                    "text-[13px] font-semibold tabular-nums " +
                    ("tone" in row && row.tone === "warn"
                      ? "text-amber-700"
                      : "text-riverline-ink")
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Approval confidence */}
      <div className="mt-4">
        <Card>
          <div className="px-4 py-4">
            <Eyebrow>Approval confidence</Eyebrow>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-[24px] leading-none tracking-[-0.022em] text-riverline-ink tabular-nums">
                {Math.round(loan.approval * 100)}%
              </span>
              <span className="text-[11px] font-medium text-riverline-flow">
                {loan.approval > 0.85
                  ? "Very likely"
                  : loan.approval > 0.7
                    ? "Likely"
                    : "Possible"}
              </span>
            </div>
            <div className="mt-3 h-[5px] overflow-hidden rounded-full bg-riverline-ink/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loan.approval * 100}%` }}
                transition={{ duration: 1, ease: SOFT_EASE, delay: 0.2 }}
                className="h-full rounded-full bg-riverline-flow"
              />
            </div>
            <p className="mt-3 text-[11.5px] leading-[1.5] text-riverline-mute">
              Based on your CIBIL score, repayment behavior, and current EMI
              load.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function LoanFooter() {
  return (
    <div className="flex gap-2.5">
      <button
        type="button"
        className="flex-1 rounded-[14px] border border-riverline-line bg-white py-3 text-[12.5px] font-semibold text-riverline-ink-2 transition-colors hover:bg-riverline-card"
      >
        Compare
      </button>
      <button
        type="button"
        className="flex-[1.4] rounded-[14px] py-3 text-[12.5px] font-semibold text-white transition-opacity"
        style={{
          background: "rgb(74,51,184)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.16)",
            "0 1px 2px rgba(42,27,124,0.45)",
            "0 6px 14px -4px rgba(74,51,184,0.32)",
          ].join(", "),
        }}
      >
        Continue with this offer
      </button>
    </div>
  );
}

// ─── EMI detail ───────────────────────────────────────────────────────────

export type EmiData = {
  bank: BankId;
  product: string;
  amount: string;
  due: string;
  daysLeft: number;
  paid: number;
  total: number;
  status: "Safe" | "Soon" | "Attention";
  outstanding: string;
  closes: string;
};

export const EMI_DETAILS: Record<string, EmiData> = {
  hdfc: {
    bank: "hdfc",
    product: "HDFC Personal Loan",
    amount: "₹12,840",
    due: "Jun 04",
    daysLeft: 4,
    paid: 16,
    total: 24,
    status: "Soon",
    outstanding: "₹98,400",
    closes: "Feb 2027",
  },
  axis: {
    bank: "axis",
    product: "Axis Card EMI",
    amount: "₹3,210",
    due: "Jun 12",
    daysLeft: 12,
    paid: 4,
    total: 12,
    status: "Safe",
    outstanding: "₹25,680",
    closes: "Jan 2027",
  },
};

export function EmiDetail({ emi }: { emi: EmiData }) {
  return (
    <div className="px-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BankChip bank={emi.bank} size={42} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
            {emi.product}
          </div>
          <div className="text-[11px] text-riverline-mute">
            Outstanding{" "}
            <span className="font-semibold tabular-nums text-riverline-ink-2">
              {emi.outstanding}
            </span>
          </div>
        </div>
      </div>

      {/* Next EMI */}
      <div className="mt-4">
        <Card>
          <div className="px-4 py-4">
            <Eyebrow>Next EMI</Eyebrow>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-[36px] leading-none tracking-[-0.028em] text-riverline-ink tabular-nums">
                {emi.amount}
              </span>
              <span className="text-[12px] font-medium text-riverline-mute-2 tabular-nums">
                · {emi.daysLeft}d to {emi.due}
              </span>
            </div>

            {/* Auto-pay status */}
            <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-riverline-flow-soft px-3 py-2">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="5"
                  stroke="rgb(31,138,118)"
                  strokeWidth="1.4"
                />
                <path
                  d="M4.5 6.5 l1.8 1.8 3.5-3.5"
                  stroke="rgb(31,138,118)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[11.5px] font-medium text-riverline-flow">
                Auto-pay active · linked to HDFC
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tenure progress */}
      <div className="mt-4">
        <SectionTitle eyebrow="01" title="Tenure progress" />
        <Card>
          <div className="px-4 py-4">
            <div className="flex items-baseline justify-between text-[11px] font-medium text-riverline-mute">
              <span>{emi.paid} of {emi.total} paid</span>
              <span className="font-semibold tabular-nums text-riverline-ink-2">
                {Math.round((emi.paid / emi.total) * 100)}%
              </span>
            </div>

            {/* Per-installment beads */}
            <div className="mt-2 flex items-center gap-[2px]">
              {Array.from({ length: emi.total }).map((_, j) => (
                <motion.span
                  key={j}
                  initial={{ scaleY: 0.4, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{
                    duration: 0.25,
                    ease: SOFT_EASE,
                    delay: 0.1 + j * 0.012,
                  }}
                  className="h-[8px] flex-1 rounded-[2px]"
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

            <div className="mt-3 text-[11px] text-riverline-mute">
              Closes{" "}
              <span className="font-semibold text-riverline-ink-2">
                {emi.closes}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI insights */}
      <div className="mt-4">
        <SectionTitle eyebrow="02" title="AI suggestions" />
        <div className="space-y-2">
          {[
            {
              tone: "ok" as const,
              title: "Pay 3 days early to lift trust tier.",
              body: "Tier moves to Platinum 1 month sooner.",
            },
            {
              tone: "warn" as const,
              title: "This EMI is 13.5% of your income.",
              body: "Healthy. Stay below 17% to keep flexibility.",
            },
          ].map((ins) => (
            <Card key={ins.title}>
              <div className="flex items-start gap-3 px-4 py-3.5">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.4,
                    ease: "easeInOut",
                  }}
                  className={
                    "mt-1 block h-[7px] w-[7px] shrink-0 rounded-full " +
                    (ins.tone === "ok"
                      ? "bg-riverline-flow"
                      : "bg-amber-500")
                  }
                  style={{
                    boxShadow:
                      ins.tone === "ok"
                        ? "0 0 0 4px rgba(31,138,118,0.1)"
                        : "0 0 0 4px rgba(217,119,6,0.1)",
                  }}
                />
                <div>
                  <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                    {ins.title}
                  </div>
                  <p className="mt-0.5 text-[11.5px] leading-[1.5] text-riverline-mute">
                    {ins.body}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmiFooter() {
  return (
    <div className="flex gap-2.5">
      <button
        type="button"
        className="flex-1 rounded-[14px] border border-riverline-line bg-white py-3 text-[12.5px] font-semibold text-riverline-ink-2 transition-colors hover:bg-riverline-card"
      >
        Pay early
      </button>
      <button
        type="button"
        className="flex-1 rounded-[14px] py-3 text-[12.5px] font-semibold text-white"
        style={{
          background: "rgb(74,51,184)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.16)",
            "0 1px 2px rgba(42,27,124,0.45)",
            "0 6px 14px -4px rgba(74,51,184,0.32)",
          ].join(", "),
        }}
      >
        Manage auto-pay
      </button>
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
      {children}
    </div>
  );
}

function cardShadow() {
  return {
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,0.92)",
      "0 1px 1px rgba(12,14,20,0.035)",
      "0 6px 16px -10px rgba(12,14,20,0.08)",
    ].join(", "),
  };
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-2.5 flex items-baseline gap-2.5">
      <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-riverline-mute-2">
        {eyebrow}
      </span>
      <h3 className="text-[14px] font-semibold tracking-[-0.012em] text-riverline-ink">
        {title}
      </h3>
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
    <div className="rounded-[10px] bg-riverline-card/60 px-3 py-2.5">
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute-2">
        {label}
      </div>
      <div
        className={
          "mt-0.5 text-[15px] font-semibold tabular-nums tracking-[-0.005em] " +
          (tone === "ok" ? "text-riverline-flow" : "text-riverline-ink")
        }
      >
        {value}
      </div>
    </div>
  );
}
