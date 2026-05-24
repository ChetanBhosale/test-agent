"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";
import {
  FieldLabel,
  HelperText,
  OnboardingFrame,
  PrimaryButton,
  ScreenHeading,
} from "./shared";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function PanScreen() {
  const { navigate, setParams } = useApp();
  const [pan, setPan] = useState("");
  const valid = PAN_REGEX.test(pan);
  const showError = pan.length > 0 && !valid;

  const submit = () => {
    if (!valid) return;
    setParams("pan", { pan });
    navigate("aadhaar");
  };

  return (
    <OnboardingFrame
      topRight={<ProgressDots step={1} total={3} />}
      footer={
        <PrimaryButton disabled={!valid} onClick={submit}>
          Continue
        </PrimaryButton>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex h-full flex-col"
      >
        <ScreenHeading
          eyebrow="KYC · 1 of 3"
          title={
            <>
              Verify your <em>PAN</em>.
            </>
          }
          body="Needed to fetch your CIBIL score and tailor loan offers to you."
        />

        <div className="mt-9">
          <FieldLabel>PAN number</FieldLabel>
          <input
            type="text"
            placeholder="ABCDE1234F"
            autoComplete="off"
            autoFocus
            aria-label="PAN number"
            aria-invalid={showError || undefined}
            value={pan}
            maxLength={10}
            onChange={(e) =>
              setPan(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "")
                  .slice(0, 10),
              )
            }
            className={
              "h-14 w-full rounded-[18px] border bg-white px-5 text-[18px] font-semibold tracking-[0.16em] text-riverline-ink outline-none transition placeholder:font-normal placeholder:tracking-[0.16em] placeholder:text-riverline-mute/60 " +
              (showError
                ? "border-riverline-danger ring-4 ring-riverline-danger/10"
                : "border-riverline-line focus:border-riverline-primary focus:ring-4 focus:ring-riverline-primary/12")
            }
          />
          {showError && (
            <p className="mt-2 text-[12.5px] text-riverline-danger">
              PAN should be 5 letters, 4 digits, then 1 letter — e.g. ABCDE1234F.
            </p>
          )}
        </div>

        <div className="mt-6">
          <HelperText
            tone="info"
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7 6 V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="7" cy="4.2" r="0.9" fill="currentColor" />
              </svg>
            }
            title="Soft check, no impact"
            body="Looking up your PAN doesn't affect your CIBIL score in any way."
          />
        </div>
      </form>
    </OnboardingFrame>
  );
}

export function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i < step ? 24 : 8,
            backgroundColor:
              i < step ? "rgb(91,47,224)" : "rgb(231,233,242)",
          }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}
