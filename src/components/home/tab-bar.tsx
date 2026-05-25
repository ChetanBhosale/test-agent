"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import type { ScreenId } from "@/lib/screens";
import { CopilotSheet } from "@/components/copilot/copilot-sheet";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

type Tab = {
  id: ScreenId;
  label: string;
  icon: (active: boolean) => ReactNode;
};

const TABS: Tab[] = [
  {
    id: "home",
    label: "Home",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3.5 8.5 L10 3 L16.5 8.5 V16 a1 1 0 0 1-1 1 H4.5 a1 1 0 0 1-1-1 Z"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={a ? "currentColor" : "none"}
          fillOpacity={a ? 0.08 : 0}
        />
      </svg>
    ),
  },
  {
    id: "credit",
    label: "Credit",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="3"
          y="5"
          width="14"
          height="10"
          rx="1.6"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          fill={a ? "currentColor" : "none"}
          fillOpacity={a ? 0.08 : 0}
        />
        <path d="M3 8.5 H17" stroke="currentColor" strokeWidth={a ? 1.7 : 1.5} />
        <path
          d="M6 12 H9"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "loans",
    label: "Loans",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 16 L3 9 L7 6 L17 6"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 16 L17 16"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          strokeLinecap="round"
        />
        <path
          d="M14 9 L17 6 L17 9"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={a ? "currentColor" : "none"}
          fillOpacity={a ? 0.15 : 0}
        />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (a) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10"
          cy="7.5"
          r="3"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          fill={a ? "currentColor" : "none"}
          fillOpacity={a ? 0.1 : 0}
        />
        <path
          d="M3.5 16.5 C4.5 13.5 7 12 10 12 C13 12 15.5 13.5 16.5 16.5"
          stroke="currentColor"
          strokeWidth={a ? 1.7 : 1.5}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function TabBar() {
  const { screen, navigate } = useApp();
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [seedPrompt, setSeedPrompt] = useState<string | null>(null);

  // Listen for "open Copilot with prompt" events from anywhere in the app.
  // Lets the Home "Ask Copilot" strip and other surfaces request a focused
  // conversation without lifting Copilot state out of the tab bar.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ prompt?: string }>).detail;
      setSeedPrompt(detail?.prompt ?? null);
      setCopilotOpen(true);
    };
    window.addEventListener("riverline:open-copilot", onOpen as EventListener);
    return () =>
      window.removeEventListener(
        "riverline:open-copilot",
        onOpen as EventListener,
      );
  }, []);

  const closeCopilot = () => {
    setCopilotOpen(false);
    setSeedPrompt(null);
  };

  return (
    <>
      <CopilotSheet
        open={copilotOpen}
        onClose={closeCopilot}
        seedPrompt={seedPrompt}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3.5">
        <div
          className="pointer-events-auto relative flex items-center justify-around rounded-[20px] bg-white/92 px-2 py-2 backdrop-blur-2xl"
          style={{
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.95)",
              "inset 0 0 0 1px rgba(12,14,20,0.04)",
              "0 1px 1px rgba(12,14,20,0.04)",
              "0 8px 22px -10px rgba(12,14,20,0.12)",
              "0 22px 42px -18px rgba(12,14,20,0.14)",
            ].join(", "),
          }}
        >
          <div className="flex flex-1 items-center justify-around">
            {TABS.slice(0, 2).map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                active={screen === tab.id}
                onClick={() => navigate(tab.id)}
              />
            ))}
          </div>

          {/* Copilot — anchored, tactile, alive */}
          <CopilotButton
            active={copilotOpen}
            onClick={() => setCopilotOpen((v) => !v)}
          />

          <div className="flex flex-1 items-center justify-around">
            {TABS.slice(2).map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                active={screen === tab.id}
                onClick={() => navigate(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Copilot button ────────────────────────────────────────────────────────
//
// Matte deep-charcoal disc. Anchored *into* the tab bar surface (sits on the
// dock, not floating above it). Soft inner highlight ring + glass edge gives
// it a tactile shutter-button feel. Custom signal-mark icon — a calm
// concentric "navigation star" rendered in soft white. Breathes once every
// few seconds with a gentle scale + halo pulse. No glow, no neon.

function CopilotButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative -mt-6 flex h-[58px] w-[58px] shrink-0 items-center justify-center">
      {/* Anchor "seat" — soft cream cradle that visually mounts the button into the bar */}
      <div
        aria-hidden
        className="absolute inset-[-3px] rounded-full bg-white/70"
        style={{
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.9)",
            "0 1px 0 rgba(12,14,20,0.05)",
          ].join(", "),
        }}
      />

      <motion.button
        type="button"
        aria-label="Open Riverline Copilot"
        aria-expanded={active}
        onClick={onClick}
        whileTap={{ scale: 0.92 }}
        animate={
          reduce
            ? undefined
            : {
                scale: active ? 0.96 : [1, 1.02, 1],
              }
        }
        transition={
          reduce
            ? undefined
            : active
              ? { duration: 0.2, ease: SOFT_EASE }
              : {
                  scale: {
                    repeat: Infinity,
                    duration: 4.4,
                    ease: "easeInOut",
                  },
                }
        }
        className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full"
        style={{
          /* Layered matte fill — deep charcoal with a barely-there top highlight */
          background:
            "radial-gradient(circle at 50% 30%, #2a2d3c 0%, #14161e 55%, #0a0b11 100%)",
          boxShadow: [
            // Tactile pressed-in feel
            "inset 0 1px 0 rgba(255,255,255,0.14)",
            "inset 0 -1px 0 rgba(0,0,0,0.55)",
            // Glass edge ring
            "0 0 0 1px rgba(12,14,20,0.45)",
            // Calm depth on the dock
            "0 1px 2px rgba(12,14,20,0.5)",
            "0 6px 14px -4px rgba(12,14,20,0.4)",
            "0 14px 28px -10px rgba(12,14,20,0.3)",
          ].join(", "),
        }}
      >
        {/* Calm breathing halo — premium Riverline glow */}
        {!reduce && !active && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(74,51,184,0.32)",
                "0 0 0 10px rgba(74,51,184,0)",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.4,
              ease: "easeOut",
            }}
          />
        )}

        {/* Signature mark */}
        <CopilotMark active={active} />
      </motion.button>
    </div>
  );
}

/**
 * Riverline Copilot signature mark.
 *
 * A four-point navigation star (compass + signal hybrid): a precise
 * vertical/horizontal cross with diagonal points at 45°, plus a small
 * inner dot. Reads as a calm intelligent compass mark, not an AI orb.
 */
function CopilotMark({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="relative z-10"
      aria-hidden
    >
      {/* Cardinal star — long thin spikes */}
      <motion.path
        d="M11 2 L11 8 M11 14 L11 20 M2 11 L8 11 M14 11 L20 11"
        stroke="white"
        strokeOpacity="0.92"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={
          reduce
            ? undefined
            : {
                opacity: active ? 1 : [0.85, 1, 0.85],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 4.4,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />
      {/* Diagonal short ticks */}
      <path
        d="M5.5 5.5 L7.2 7.2 M14.8 14.8 L16.5 16.5 M16.5 5.5 L14.8 7.2 M7.2 14.8 L5.5 16.5"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Center dot — the still point of the compass */}
      <circle cx="11" cy="11" r="1.6" fill="white" />
    </svg>
  );
}

// ─── Tab item ──────────────────────────────────────────────────────────────

function TabItem({
  tab,
  active,
  onClick,
}: {
  tab: Tab;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={tab.label}
      aria-current={active}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="relative flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-xl"
    >
      {/* Soft cradle behind the active tab — Apple-Wallet style */}
      {active && (
        <motion.div
          layoutId="tabActiveCradle"
          aria-hidden
          className="absolute inset-x-1 inset-y-1 rounded-[10px]"
          style={{ background: "rgba(74,51,184,0.08)" }}
          transition={{ type: "spring", stiffness: 480, damping: 36 }}
        />
      )}
      <motion.div
        animate={{
          color: active ? "rgb(74,51,184)" : "rgb(154,160,176)",
          y: active ? -1 : 0,
        }}
        transition={{ duration: 0.3, ease: SOFT_EASE }}
        className="relative z-10"
      >
        {tab.icon(active)}
      </motion.div>
      <motion.span
        animate={{
          color: active ? "rgb(74,51,184)" : "rgb(154,160,176)",
          fontWeight: active ? 600 : 500,
        }}
        transition={{ duration: 0.3, ease: SOFT_EASE }}
        className="relative z-10 text-[10px] tracking-[-0.005em]"
      >
        {tab.label}
      </motion.span>
    </motion.button>
  );
}
