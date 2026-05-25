"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/context/app-context";
import {
  GhostButton,
  OnboardingFrame,
  PrimaryButton,
  ScreenHeading,
  SOFT_EASE,
} from "./shared";

/**
 * Security Setup — calm Face ID intro.
 *
 * Lightweight: one toggle, reassuring microcopy, two CTAs. The user can
 * skip and set it up later from Settings.
 */
export function SecurityScreen() {
  const { navigate } = useApp();
  const [enabled, setEnabled] = useState(false);

  return (
    <OnboardingFrame
      footer={
        <div className="flex flex-col gap-2.5">
          <PrimaryButton
            onClick={() => navigate("workspace")}
          >
            {enabled ? "Continue with Face ID" : "Enable Face ID"}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7h8M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PrimaryButton>
          <GhostButton onClick={() => navigate("workspace")}>
            Maybe later
          </GhostButton>
        </div>
      }
    >
      <div className="flex h-full flex-col justify-center">
        <div className="flex flex-col items-center text-center">
          <FaceIdGlyph active={enabled} onToggle={() => setEnabled((v) => !v)} />

          <div className="mt-8">
            <ScreenHeading
              title={
                <>
                  Secure your <em>workspace</em>.
                </>
              }
              body="Use Face ID to keep your financial data safe. Quick to unlock, easy to disable."
            />
          </div>
        </div>

        <motion.button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.4 }}
          className="mt-8 flex w-full items-center justify-between rounded-[14px] bg-white px-4 py-3.5"
          style={{
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.9)",
              "0 1px 1px rgba(12,14,20,0.03)",
              "0 4px 10px -6px rgba(12,14,20,0.05)",
            ].join(", "),
          }}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-riverline-card text-riverline-ink-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2.5 5 V3.5 a1 1 0 0 1 1-1 H5 M11 2.5 H12.5 a1 1 0 0 1 1 1 V5 M2.5 11 V12.5 a1 1 0 0 0 1 1 H5 M11 13.5 H12.5 a1 1 0 0 0 1-1 V11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle cx="6" cy="7" r="0.7" fill="currentColor" />
                <circle cx="10" cy="7" r="0.7" fill="currentColor" />
                <path
                  d="M6.5 10 a2 2 0 0 0 3 0"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                Face ID lock
              </div>
              <div className="text-[11.5px] text-riverline-mute">
                Required to open Riverline
              </div>
            </div>
          </div>
          <Toggle on={enabled} />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.6 }}
          className="mt-3 text-center text-[11px] leading-[1.55] text-riverline-mute"
        >
          You can change this anytime from Settings.
        </motion.p>
      </div>
    </OnboardingFrame>
  );
}

function FaceIdGlyph({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={active ? "Disable Face ID" : "Enable Face ID"}
      whileTap={{ scale: 0.95 }}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: SOFT_EASE }}
      className="relative flex h-[112px] w-[112px] items-center justify-center"
    >
      {/* Calm halo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        animate={
          reduce
            ? undefined
            : { scale: active ? [1, 1.06, 1] : [1, 1.03, 1], opacity: active ? 0.4 : 0.18 }
        }
        transition={
          reduce
            ? undefined
            : {
                repeat: Infinity,
                duration: 2.6,
                ease: "easeInOut",
              }
        }
        style={{
          background:
            "radial-gradient(circle, rgba(12,14,20,0.12) 0%, transparent 60%)",
        }}
      />

      <motion.div
        animate={{
          backgroundColor: active ? "rgb(74,51,184)" : "rgb(255,255,255)",
          color: active ? "rgb(255,255,255)" : "rgb(12,14,20)",
        }}
        transition={{ duration: 0.3, ease: SOFT_EASE }}
        className="relative flex h-20 w-20 items-center justify-center rounded-[20px]"
        style={{
          boxShadow: active
            ? [
                "inset 0 1px 0 rgba(255,255,255,0.16)",
                "inset 0 -1px 0 rgba(0,0,0,0.32)",
                "0 1px 2px rgba(42,27,124,0.45)",
                "0 12px 28px -8px rgba(74,51,184,0.4)",
              ].join(", ")
            : [
                "inset 0 1px 0 rgba(255,255,255,0.95)",
                "0 0 0 1px rgba(12,14,20,0.06)",
                "0 1px 2px rgba(12,14,20,0.05)",
                "0 12px 24px -10px rgba(12,14,20,0.12)",
              ].join(", "),
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          {/* Frame corners */}
          <path
            d="M5 11 V8 a3 3 0 0 1 3-3 H11 M25 5 H28 a3 3 0 0 1 3 3 V11 M5 25 V28 a3 3 0 0 0 3 3 H11 M25 31 H28 a3 3 0 0 0 3-3 V25"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Eyes */}
          <circle cx="13" cy="15" r="1.1" fill="currentColor" />
          <circle cx="23" cy="15" r="1.1" fill="currentColor" />
          {/* Nose */}
          <path
            d="M18 14 V19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Mouth */}
          <path
            d="M14 23 a4.5 4.5 0 0 0 8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <motion.div
      animate={{
        backgroundColor: on ? "rgb(74,51,184)" : "rgba(12,14,20,0.15)",
      }}
      transition={{ duration: 0.2, ease: SOFT_EASE }}
      className="relative h-[24px] w-[40px] shrink-0 rounded-full"
    >
      <motion.span
        animate={{ x: on ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-1/2 block h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.18)" }}
      />
    </motion.div>
  );
}
