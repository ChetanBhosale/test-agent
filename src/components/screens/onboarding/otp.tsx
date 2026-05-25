"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";
import {
  OnboardingFrame,
  PrimaryButton,
  ScreenHeading,
  SOFT_EASE,
} from "./shared";
import { FieldCell, FieldLabel } from "@/components/shared/field";

const LENGTH = 6;

export function OtpScreen() {
  const { navigate, getParams } = useApp();
  const phone = (getParams<{ phone: string }>("otp")?.phone ?? "") as string;
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const value = digits.join("");
  const filled = value.length === LENGTH;

  useEffect(() => {
    if (filled) {
      const t = setTimeout(() => navigate("trust"), 380);
      return () => clearTimeout(t);
    }
  }, [filled, navigate]);

  const handleChange = (i: number, v: string) => {
    const cleaned = v.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const next = [...d];
      next[i] = cleaned;
      return next;
    });
    if (cleaned && i < LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const arr = pasted.split("");
    setDigits((d) => d.map((existing, i) => arr[i] ?? existing));
    const focusIdx = Math.min(pasted.length, LENGTH - 1);
    inputs.current[focusIdx]?.focus();
  };

  const formattedPhone = phone
    ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
    : "your number";

  return (
    <OnboardingFrame
      footer={
        <PrimaryButton disabled={!filled} onClick={() => navigate("trust")}>
          Verify
          {filled && (
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: SOFT_EASE }}
            >
              <path
                d="M3 7l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </PrimaryButton>
      }
    >
      <div className="flex h-full flex-col justify-center">
        <ScreenHeading
          eyebrow="Verification"
          title={
            <>
              Enter the <em>code</em>.
            </>
          }
          body={
            <>
              Sent to{" "}
              <span className="font-medium text-riverline-ink">
                {formattedPhone}
              </span>
            </>
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.2 }}
          className="mt-8"
        >
          <FieldLabel>One-time code</FieldLabel>
          <div className="flex items-center justify-between gap-2">
            {digits.map((d, i) => (
              <motion.div
                key={i}
                animate={d ? { y: [0, -2, 0] } : { y: 0 }}
                transition={{ duration: 0.3, ease: SOFT_EASE }}
                className="relative flex-1"
              >
                <FieldCell
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  value={d}
                  filled={!!d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  onPaste={handlePaste}
                />
                {!d && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[5px] w-[5px] rounded-full bg-riverline-line-2" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress bar — Riverline accent fill, indicates code completeness */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 h-[3px] overflow-hidden rounded-full"
          style={{ background: "rgba(74,51,184,0.10)" }}
        >
          <motion.div
            animate={{ width: `${(value.length / LENGTH) * 100}%` }}
            transition={{ duration: 0.4, ease: SOFT_EASE }}
            className="h-full rounded-full"
            style={{ background: "rgb(74,51,184)" }}
          />
        </motion.div>

        {/* Resend */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.45 }}
          className="mt-7 text-center text-[12.5px] text-riverline-mute"
        >
          {seconds > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M6 3.5v3l2 1.2"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              Resend in{" "}
              <span className="font-semibold text-riverline-ink-2 tabular-nums">
                {seconds}s
              </span>
            </span>
          ) : (
            <motion.button
              type="button"
              onClick={() => setSeconds(30)}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 rounded-md border border-riverline-line bg-white px-3 py-1.5 text-[12px] font-semibold text-riverline-ink transition-colors hover:bg-riverline-card"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1.5 6a4.5 4.5 0 1 1 1 2.8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M1.5 9V6h2.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Resend code
            </motion.button>
          )}
        </motion.div>
      </div>
    </OnboardingFrame>
  );
}
