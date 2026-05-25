"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";
import {
  OnboardingFrame,
  PrimaryButton,
  ScreenHeading,
  SOFT_EASE,
} from "./shared";

/**
 * Trust & Consent — sits between OTP and PAN.
 *
 * Reduces the anxiety of "why do you need my PAN/credit data?" before
 * KYC begins. Three small trust cards + one consent toggle + one CTA.
 * Editorial, calm, no walls of legal text.
 */
export function TrustScreen() {
  const { navigate } = useApp();
  const [consent, setConsent] = useState(false);

  return (
    <OnboardingFrame
      footer={
        <div className="flex flex-col gap-3.5">
          <PrimaryButton
            disabled={!consent}
            onClick={() => navigate("pan")}
          >
            I&rsquo;m ready to continue
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
          <p className="text-center text-[11px] leading-[1.55] text-riverline-mute">
            You can revoke consent and delete your data anytime.
          </p>
        </div>
      }
    >
      <div className="flex h-full flex-col justify-center">
        <ScreenHeading
          eyebrow="Before we continue"
          title={
            <>
              Your data, <em>safely</em> handled.
            </>
          }
          body="Riverline is regulated, encrypted, and built around your privacy. Here's what you should know."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.2 }}
          className="mt-8 space-y-2.5"
        >
          {TRUST_POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                ease: SOFT_EASE,
                delay: 0.3 + i * 0.07,
              }}
              className="flex items-start gap-3 rounded-[14px] bg-white p-3.5"
              style={{
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.9)",
                  "0 1px 1px rgba(12,14,20,0.03)",
                  "0 4px 10px -6px rgba(12,14,20,0.05)",
                ].join(", "),
              }}
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-riverline-card text-riverline-ink-2">
                {p.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                  {p.title}
                </div>
                <p className="mt-0.5 text-[12px] leading-[1.5] text-riverline-mute">
                  {p.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Consent row */}
        <motion.button
          type="button"
          onClick={() => setConsent((v) => !v)}
          aria-pressed={consent}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.6 }}
          whileTap={{ scale: 0.99 }}
          className="mt-4 flex w-full items-start gap-3 rounded-[14px] bg-white px-3.5 py-3.5 text-left"
          style={{
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.9)",
              "0 0 0 1px " +
                (consent
                  ? "rgba(74,51,184,0.45)"
                  : "rgba(236,232,222,1)"),
              "0 4px 10px -6px rgba(12,14,20,0.05)",
            ].join(", "),
          }}
        >
          <ConsentBox checked={consent} />
          <span className="text-[12.5px] leading-[1.55] text-riverline-ink-2">
            I authorize Riverline to access my{" "}
            <span className="font-semibold text-riverline-ink">
              CIBIL credit profile
            </span>{" "}
            and use it to personalize my financial guidance.
          </span>
        </motion.button>
      </div>
    </OnboardingFrame>
  );
}

function ConsentBox({ checked }: { checked: boolean }) {
  return (
    <motion.div
      animate={{
        // Riverline accent confirms consent — emotionally distinct from
        // a black state, signals "this is your trust acknowledgement"
        backgroundColor: checked ? "rgb(74,51,184)" : "rgb(255,255,255)",
        borderColor: checked ? "rgb(74,51,184)" : "rgb(196,194,184)",
      }}
      transition={{ duration: 0.2, ease: SOFT_EASE }}
      className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border"
    >
      {checked && (
        <motion.svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: SOFT_EASE }}
        >
          <motion.path
            d="M2 5.5l2.5 2.5L9 3.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: SOFT_EASE }}
            fill="none"
          />
        </motion.svg>
      )}
    </motion.div>
  );
}

const TRUST_POINTS: Array<{
  title: string;
  body: string;
  icon: React.ReactNode;
}> = [
  {
    title: "Bank-grade encryption",
    body: "Your data is encrypted in transit and at rest. We never share it with third parties.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect
          x="3.5"
          y="6.5"
          width="8"
          height="6.5"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M5 6.5 V4.5 a2.5 2.5 0 0 1 5 0 V6.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    title: "RBI-regulated lenders only",
    body: "Every loan offer comes from licensed banks and NBFCs operating under RBI guidelines.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M7.5 1.5 L13 4 V8 C13 11 10.5 13 7.5 13.5 C 4.5 13 2 11 2 8 V4 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M5 7.5 L7 9.5 L10 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Soft credit check, no impact",
    body: "Looking up your CIBIL score won't affect it in any way. Stays your data, stays yours.",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M7.5 4.5 V8 L10 9.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];
