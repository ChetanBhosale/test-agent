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
  FieldPrefix,
  FieldInput,
  FieldStatusBadge,
} from "@/components/shared/field";

export function AadhaarScreen() {
  const { navigate, setParams } = useApp();
  const [last4, setLast4] = useState("");
  const valid = /^\d{4}$/.test(last4);

  const submit = () => {
    if (!valid) return;
    setParams("aadhaar", { last4 });
    navigate("cibil-fetch");
  };

  return (
    <OnboardingFrame
      topRight={<StepIndicator current={2} total={3} />}
      footer={
        <PrimaryButton disabled={!valid} onClick={submit}>
          Send Aadhaar OTP
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
          eyebrow="KYC · Step 2 of 3"
          title={
            <>
              Link your <em>Aadhaar</em>.
            </>
          }
          body="We'll send an OTP on the phone linked to your Aadhaar to verify your identity."
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.2 }}
          className="mt-8"
        >
          <Field label="Last 4 digits of Aadhaar">
            <FieldRow status={valid ? "ok" : "default"}>
              <FieldPrefix variant="filled">
                <span className="tracking-[0.2em] text-riverline-mute-2">
                  ••••&nbsp;••••
                </span>
              </FieldPrefix>
              <FieldInput
                type="tel"
                inputMode="numeric"
                autoFocus
                autoComplete="off"
                aria-label="Last 4 digits of Aadhaar"
                placeholder="1234"
                value={last4}
                maxLength={4}
                variant="tracked"
                onChange={(e) =>
                  setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
              <FieldStatusBadge
                value={last4}
                ok={valid}
                remaining={4 - last4.length}
              />
            </FieldRow>
          </Field>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.35 }}
          className="mt-5 space-y-2.5"
        >
          <HelperText
            tone="success"
            icon={
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2.5 6.5 L5.5 9.5 L10.5 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="UIDAI-compliant"
            body="We never store your full Aadhaar — only a tokenized reference, encrypted at rest."
            delay={0.45}
          />
          <HelperText
            tone="info"
            icon={
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 1 L11 3 V6.5 C11 9 9 11.5 6.5 12 C4 11.5 2 9 2 6.5 V3 Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            }
            title="You're in control"
            body="Revoke this consent and delete your data anytime from Settings."
            delay={0.6}
          />
        </motion.div>
      </form>
    </OnboardingFrame>
  );
}
