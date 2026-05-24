"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";
import { OnboardingFrame, PrimaryButton, ScreenHeading } from "./shared";

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

  // Auto-submit when fully entered
  useEffect(() => {
    if (filled) {
      const t = setTimeout(() => navigate("pan"), 360);
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
        <PrimaryButton disabled={!filled} onClick={() => navigate("pan")}>
          Verify
        </PrimaryButton>
      }
    >
      <div className="flex h-full flex-col">
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
              <span className="font-semibold text-riverline-ink-2">
                {formattedPhone}
              </span>
            </>
          }
        />

        <div className="mt-10 flex items-center justify-between gap-2">
          {digits.map((d, i) => (
            <motion.div
              key={i}
              animate={d ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="tel"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                onPaste={handlePaste}
                className={
                  "h-14 w-12 rounded-[14px] border bg-white text-center text-[22px] font-bold tabular-nums text-riverline-ink outline-none transition focus:border-riverline-primary focus:ring-4 focus:ring-riverline-primary/12 " +
                  (d ? "border-riverline-primary/40" : "border-riverline-line")
                }
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-7 text-center text-[13px] text-riverline-mute">
          {seconds > 0 ? (
            <>
              Resend code in{" "}
              <span className="font-semibold text-riverline-ink-2 tabular-nums">
                {seconds}s
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSeconds(30)}
              className="font-semibold text-riverline-primary"
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </OnboardingFrame>
  );
}
