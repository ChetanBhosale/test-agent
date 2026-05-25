"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Credit detail body — opens from the home pulse card "Details" link.
 * Tabbed: Overview · Utilization · Repayment · AI insights.
 */
export function CreditDetail() {
  const [tab, setTab] = useState<"overview" | "util" | "repay" | "ai">(
    "overview",
  );

  return (
    <div className="px-5 pb-6">
      {/* Tabs */}
      <div className="sticky top-0 z-10 -mx-5 mb-5 bg-riverline-bg px-5 pt-2 pb-2.5">
        <div
          className="flex items-center gap-1 rounded-full bg-riverline-card p-1"
          role="tablist"
        >
          {(
            [
              { id: "overview", label: "Overview" },
              { id: "util", label: "Utilization" },
              { id: "repay", label: "Repayment" },
              { id: "ai", label: "AI Insights" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className="relative flex-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-[-0.005em] transition-colors"
            >
              {tab === t.id && (
                <motion.span
                  layoutId="creditDetailTab"
                  className="absolute inset-0 rounded-full bg-white"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(12,14,20,0.06)",
                  }}
                  transition={{ type: "spring", stiffness: 480, damping: 38 }}
                />
              )}
              <span
                className={
                  "relative z-10 " +
                  (tab === t.id
                    ? "text-riverline-ink"
                    : "text-riverline-mute")
                }
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "overview" && <Overview key="overview" />}
        {tab === "util" && <Utilization key="util" />}
        {tab === "repay" && <Repayment key="repay" />}
        {tab === "ai" && <AiInsights key="ai" />}
      </AnimatePresence>
    </div>
  );
}

function Pane({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: SOFT_EASE }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  );
}

function Overview() {
  return (
    <Pane>
      {/* Score history chart */}
      <Card>
        <div className="px-4 pt-4">
          <Eyebrow>12-month history</Eyebrow>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-[32px] leading-none tracking-[-0.025em] text-riverline-ink tabular-nums">
              742
            </span>
            <span className="text-[11px] font-medium tabular-nums text-riverline-flow">
              +34 / 12mo
            </span>
          </div>
        </div>
        <div className="px-4 pb-4 pt-3">
          <BigChart />
          <div className="mt-2 flex justify-between text-[9.5px] font-medium text-riverline-mute-2">
            {["Jun", "Aug", "Oct", "Dec", "Feb", "Apr", "May"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Tier" value="Gold" sub="Top 8%" />
        <StatTile label="Streak" value="4 mo" sub="On time" tone="ok" />
        <StatTile label="Utilization" value="22%" sub="Healthy" tone="ok" />
        <StatTile label="Hard inquiries" value="1" sub="Last 12 mo" />
      </div>

      {/* Milestone */}
      <Card>
        <div className="px-4 py-4">
          <Eyebrow>Next milestone</Eyebrow>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-serif text-[20px] leading-none tracking-[-0.018em] text-riverline-ink">
              760 by July
            </span>
          </div>
          <div
            className="mt-3 h-[3px] overflow-hidden rounded-full"
            style={{ background: "rgba(74,51,184,0.10)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1, ease: SOFT_EASE, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: "rgb(74,51,184)" }}
            />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between text-[10.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute">
            <span>742</span>
            <span>760</span>
          </div>
        </div>
      </Card>
    </Pane>
  );
}

function Utilization() {
  return (
    <Pane>
      <Card>
        <div className="px-4 py-4">
          <Eyebrow>Current utilization</Eyebrow>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-serif text-[36px] leading-none tracking-[-0.028em] text-riverline-ink tabular-nums">
              22%
            </span>
            <span className="text-[11px] font-medium text-riverline-flow">
              Healthy
            </span>
          </div>
          <p className="mt-3 text-[12.5px] leading-[1.5] text-riverline-mute">
            You&rsquo;re using ₹13,200 of ₹60,000 available credit. Staying
            below 30% is what keeps your score climbing.
          </p>

          {/* Threshold bar */}
          <div className="mt-4 relative h-[8px] rounded-full bg-riverline-ink/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "22%" }}
              transition={{ duration: 1, ease: SOFT_EASE, delay: 0.3 }}
              className="h-full rounded-full bg-riverline-flow"
            />
            {/* Safe line at 30% */}
            <div
              className="absolute -top-1 -bottom-1 w-px bg-riverline-ink/40"
              style={{ left: "30%" }}
            />
          </div>
          <div className="mt-1.5 flex justify-end text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2">
            Safe limit · 30%
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-4 py-4">
          <Eyebrow>Per-card breakdown</Eyebrow>
          <div className="mt-3 space-y-3">
            {[
              { name: "HDFC Card", used: 13200, total: 40000, pct: 33 },
              { name: "Axis Card", used: 0, total: 20000, pct: 0 },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex items-baseline justify-between text-[12px]">
                  <span className="font-medium text-riverline-ink">
                    {c.name}
                  </span>
                  <span className="font-semibold tabular-nums text-riverline-ink">
                    {c.pct}%
                  </span>
                </div>
                <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-riverline-ink/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ duration: 0.9, ease: SOFT_EASE, delay: 0.4 }}
                    className={
                      "h-full rounded-full " +
                      (c.pct > 30 ? "bg-amber-600" : "bg-riverline-flow")
                    }
                  />
                </div>
                <div className="mt-1 text-[10.5px] tabular-nums text-riverline-mute">
                  ₹{c.used.toLocaleString("en-IN")} of ₹
                  {c.total.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Pane>
  );
}

function Repayment() {
  return (
    <Pane>
      <Card>
        <div className="px-4 py-4">
          <Eyebrow>Repayment streak</Eyebrow>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-serif text-[36px] leading-none tracking-[-0.028em] text-riverline-ink tabular-nums">
              4
            </span>
            <span className="text-[12px] font-medium text-riverline-mute-2">
              months on time
            </span>
          </div>

          {/* 24-month grid */}
          <div className="mt-4 grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }).map((_, i) => {
              const paid = i >= 24 - 24; // all marked paid for demo
              const onTime = i !== 8; // one slightly late
              return (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0.4, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: SOFT_EASE,
                    delay: 0.2 + i * 0.015,
                  }}
                  className="h-[18px] rounded-[3px]"
                  style={{
                    background: !paid
                      ? "rgba(12,14,20,0.07)"
                      : onTime
                        ? "rgb(31,138,118)"
                        : "rgb(217,119,6)",
                  }}
                  aria-label={`Month ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] text-riverline-mute">
            <span className="inline-flex items-center gap-1">
              <span className="h-[6px] w-[6px] rounded-sm bg-riverline-flow" />
              On time
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-[6px] w-[6px] rounded-sm bg-amber-600" />
              Late
            </span>
            <span className="font-medium tabular-nums">23 / 24</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-4 py-4">
          <Eyebrow>Behavior breakdown</Eyebrow>
          <div className="mt-3 space-y-2.5">
            {[
              { label: "Repayment history", weight: "35%", value: "Excellent" },
              { label: "Credit mix", weight: "10%", value: "Good" },
              { label: "Account age", weight: "15%", value: "4.2 yr" },
              { label: "Hard inquiries", weight: "10%", value: "1" },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-baseline justify-between"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-[12.5px] font-medium text-riverline-ink-2">
                    {b.label}
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-riverline-mute-2">
                    {b.weight}
                  </span>
                </div>
                <span className="text-[12px] font-semibold tabular-nums text-riverline-ink">
                  {b.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Pane>
  );
}

function AiInsights() {
  const insights = [
    {
      tone: "ok" as const,
      title: "You're 2 low-utilization months from 760.",
      body: "Keeping utilization under 30% projects a 760 score by July.",
    },
    {
      tone: "warn" as const,
      title: "One missed EMI could reduce score by ~18.",
      body: "Holding off on new EMIs for 60 days will keep DTI under 17%.",
    },
    {
      tone: "ok" as const,
      title: "Refinancing HDFC saves ₹38,400.",
      body: "9.10% offer cuts EMI by ₹680/mo and shortens tenure by 4 months.",
    },
  ];
  return (
    <Pane>
      {insights.map((ins, i) => (
        <motion.div
          key={ins.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: SOFT_EASE, delay: 0.05 + i * 0.06 }}
        >
          <Card>
            <div className="flex items-start gap-3 px-4 py-3.5">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
                className={
                  "mt-1.5 block h-[7px] w-[7px] shrink-0 rounded-full " +
                  (ins.tone === "ok" ? "bg-riverline-flow" : "bg-amber-500")
                }
                style={{
                  boxShadow:
                    ins.tone === "ok"
                      ? "0 0 0 4px rgba(31,138,118,0.1)"
                      : "0 0 0 4px rgba(217,119,6,0.1)",
                }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-[14.5px] leading-[1.3] tracking-[-0.012em] text-riverline-ink">
                  {ins.title}
                </h3>
                <p className="mt-1 text-[12px] leading-[1.5] text-riverline-mute">
                  {ins.body}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </Pane>
  );
}

// ─── Primitives ────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-[16px] bg-white"
      style={{
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.92)",
          "0 1px 1px rgba(12,14,20,0.035)",
          "0 6px 16px -10px rgba(12,14,20,0.08)",
        ].join(", "),
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
      {children}
    </div>
  );
}

function StatTile({
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
      <div className="mt-1 font-serif text-[22px] leading-none tracking-[-0.022em] text-riverline-ink tabular-nums">
        {value}
      </div>
      {sub && (
        <div
          className={
            "mt-1 text-[11px] " +
            (tone === "ok" ? "text-riverline-flow" : "text-riverline-mute")
          }
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function BigChart() {
  // 13 monthly points, 7 axis labels
  const W = 320;
  const H = 100;
  const data = [708, 712, 716, 718, 715, 720, 724, 728, 732, 731, 738, 741, 742];
  const min = Math.min(...data) - 4;
  const max = Math.max(...data) + 4;
  const stepX = W / (data.length - 1);
  const points = data.map((v, i) => ({
    x: i * stepX,
    y: H - ((v - min) / (max - min)) * H,
  }));

  const path = (() => {
    const t = 0.32;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const c1x = p1.x + (p2.x - p0.x) * t * 0.5;
      const c1y = p1.y + (p2.y - p0.y) * t * 0.5;
      const c2x = p2.x - (p3.x - p1.x) * t * 0.5;
      const c2y = p2.y - (p3.y - p1.y) * t * 0.5;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  })();

  const last = points[points.length - 1];

  return (
    <svg
      width="100%"
      height={H + 14}
      viewBox={`0 -7 ${W} ${H + 14}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      {[25, 50, 75].map((p) => (
        <line
          key={p}
          x1="0"
          x2={W}
          y1={(H * p) / 100}
          y2={(H * p) / 100}
          stroke="rgba(12,14,20,0.04)"
          strokeWidth="1"
          strokeDasharray="1 4"
        />
      ))}
      <motion.path
        d={path}
        stroke="rgb(74,51,184)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: SOFT_EASE, delay: 0.2 }}
      />
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.7 }}
        style={{ transformOrigin: `${last.x}px ${last.y}px` }}
      >
        <motion.circle
          cx={last.x}
          cy={last.y}
          r="5"
          fill="rgb(74,51,184)"
          fillOpacity="0.10"
          animate={{ r: [5, 11, 5], opacity: [0.30, 0, 0.30] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeOut" }}
        />
        <circle cx={last.x} cy={last.y} r="3" fill="rgb(74,51,184)" />
        <circle cx={last.x} cy={last.y} r="1.1" fill="white" />
      </motion.g>
    </svg>
  );
}
