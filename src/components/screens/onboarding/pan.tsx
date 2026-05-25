"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";
import {
  HelperText,
  OnboardingFrame,
  PrimaryButton,
  ScreenHeading,
  StepIndicator,
  SOFT_EASE,
} from "./shared";
import {
  Field,
  FieldRow,
  FieldInput,
  FieldStatusBadge,
} from "@/components/shared/field";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function PanScreen() {
  const { navigate, setParams } = useApp();
  const [pan, setPan] = useState("");
  const valid = PAN_REGEX.test(pan);
  const showError = pan.length === 10 && !valid;

  const submit = () => {
    if (!valid) return;
    setParams("pan", { pan });
    navigate("aadhaar");
  };

  return (
    <OnboardingFrame
      topRight={<StepIndicator current={1} total={3} />}
      footer={
        <PrimaryButton disabled={!valid} onClick={submit}>
          Continue
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
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex h-full flex-col justify-center"
      >
        <ScreenHeading
          eyebrow="KYC · Step 1 of 3"
          title={
            <>
              Verify your <em>PAN</em>.
            </>
          }
          body="Needed to fetch your CIBIL score and tailor loan offers to you."
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.2 }}
          className="mt-8"
        >
          <Field
            label="PAN number"
            error={
              showError
                ? "Format: 5 letters, 4 digits, 1 letter — e.g. ABCDE1234F."
                : undefined
            }
            helper={
              pan.length === 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="rounded border border-riverline-line bg-riverline-card px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-riverline-ink-2">
                    AAAAA0000A
                  </span>
                  <span>format</span>
                </span>
              ) : undefined
            }
            status={valid ? "ok" : showError ? "error" : "default"}
          >
            <FieldRow status={valid ? "ok" : showError ? "error" : "default"}>
              <FieldInput
                type="text"
                placeholder="ABCDE1234F"
                autoComplete="off"
                autoFocus
                aria-label="PAN number"
                aria-invalid={showError || undefined}
                value={pan}
                maxLength={10}
                variant="tracked"
                onChange={(e) =>
                  setPan(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 10),
                  )
                }
              />
              <FieldStatusBadge
                value={pan}
                ok={valid}
                error={showError}
                remaining={10 - pan.length}
              />
            </FieldRow>
          </Field>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.35 }}
          className="mt-5"
        >
          <HelperText
            tone="info"
            icon={
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M6.5 5.5 V9.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle cx="6.5" cy="3.8" r="0.8" fill="currentColor" />
              </svg>
            }
            title="Soft check, no impact"
            body="Looking up your PAN doesn't affect your CIBIL score in any way."
            delay={0.45}
          />
        </motion.div>
      </form>
    </OnboardingFrame>
  );
}

/** @deprecated Use StepIndicator from shared.tsx */
export function ProgressDots({ step, total }: { step: number; total: number }) {
  return <StepIndicator current={step} total={total} />;
}
