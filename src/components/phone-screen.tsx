"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * The actual content shown inside the iPhone frame.
 * Pure black background, with a Riverline-style fintech home preview.
 */
export function PhoneScreen() {
  return (
    <div className="relative flex h-full w-full flex-col bg-black text-white">
      {/* Subtle wave decoration inside the screen */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 z-0 opacity-40"
        width="100%"
        height="240"
        viewBox="0 0 390 240"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="screenWave" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(111,91,255,0)" />
            <stop offset="50%" stopColor="rgba(111,91,255,0.6)" />
            <stop offset="100%" stopColor="rgba(47,168,180,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 140 Q98 90 195 140 T390 140 V240 H0 Z"
          fill="url(#screenWave)"
          opacity="0.4"
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M0 140 Q98 90 195 140 T390 140 V240 H0 Z;
              M0 150 Q98 110 195 130 T390 150 V240 H0 Z;
              M0 140 Q98 90 195 140 T390 140 V240 H0 Z
            "
          />
        </path>
      </svg>

      {/* Header */}
      <div className="relative z-10 px-5 pb-4 pt-[62px]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50">Good morning</div>
            <div className="mt-0.5 text-xl font-bold">Shubham</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6F5BFF] to-[#8F7EFF] text-sm font-bold">
            S
          </div>
        </div>
      </div>

      {/* Balance card */}
      <div className="relative z-10 px-4">
        <Card className="relative overflow-hidden border-white/10 bg-white/[0.04] text-white backdrop-blur">
          <CardContent className="space-y-3 p-6">
            <div className="text-xs text-white/60">Total Balance</div>
            <div className="text-4xl font-extrabold tracking-tight tabular-nums">
              ₹4,82,350
            </div>
            <div className="flex items-center gap-2">
              <Badge className="border-emerald-500/20 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">
                ↑ 12.4%
              </Badge>
              <span className="text-xs text-white/40">this month</span>
            </div>
          </CardContent>

          {/* Inline animated wave at the bottom of the card */}
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 opacity-50"
            height="60"
            viewBox="0 0 350 60"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 30 Q88 10 175 30 T350 30 V60 H0 Z"
              fill="rgba(111,91,255,0.35)"
            >
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="
                  M0 30 Q88 10 175 30 T350 30 V60 H0 Z;
                  M0 35 Q88 22 175 24 T350 35 V60 H0 Z;
                  M0 30 Q88 10 175 30 T350 30 V60 H0 Z
                "
              />
            </path>
          </svg>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="relative z-10 grid grid-cols-4 gap-2.5 px-4 py-5">
        {[
          { icon: "↗", label: "Send" },
          { icon: "↙", label: "Receive" },
          { icon: "📊", label: "Invest" },
          { icon: "💳", label: "Cards" },
        ].map((a) => (
          <div
            key={a.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-base">
              {a.icon}
            </div>
            <span className="text-[11px] font-medium text-white/65">
              {a.label}
            </span>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="relative z-10 flex-1 overflow-hidden px-4">
        <div className="mb-2 text-sm font-semibold">Recent</div>
        <div className="space-y-1">
          {[
            { name: "Netflix", amount: "-₹649", icon: "🎬", time: "Today" },
            {
              name: "Salary Credit",
              amount: "+₹85,000",
              icon: "💰",
              time: "Yesterday",
              positive: true,
            },
            { name: "Swiggy", amount: "-₹342", icon: "🍕", time: "Yesterday" },
            {
              name: "Amazon",
              amount: "-₹2,499",
              icon: "📦",
              time: "2 days ago",
            },
          ].map((tx) => (
            <div
              key={tx.name}
              className="flex items-center gap-3 border-b border-white/[0.05] py-3 last:border-b-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-lg">
                {tx.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{tx.name}</div>
                <div className="mt-0.5 text-xs text-white/40">{tx.time}</div>
              </div>
              <div
                className={
                  "text-sm font-semibold tabular-nums " +
                  (tx.positive ? "text-emerald-400" : "text-white/85")
                }
              >
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="relative z-10 flex items-center justify-around border-t border-white/[0.05] bg-black/40 px-4 pb-7 pt-3 backdrop-blur">
        {[
          { id: "home", icon: "🏠", label: "Home", active: true },
          { id: "credit", icon: "📊", label: "Credit" },
          { id: "ai", icon: "✨", label: "AI" },
          { id: "profile", icon: "👤", label: "Profile" },
        ].map((item) => (
          <div
            key={item.id}
            className={
              "flex flex-col items-center gap-1 transition-opacity " +
              (item.active ? "opacity-100" : "opacity-50")
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className={
                "text-[10px] font-semibold " +
                (item.active ? "text-[#8F7EFF]" : "text-white/60")
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
