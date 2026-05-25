"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/app-context";
import {
  HelperText,
  OnboardingFrame,
  PrimaryButton,
  ScreenHeading,
  SOFT_EASE,
} from "./shared";
import {
  Field,
  FieldRow,
  FieldPrefix,
  FieldInput,
  FieldStatusBadge,
} from "@/components/shared/field";

export function PhoneScreen() {
  const { navigate, setParams } = useApp();
  const [phone, setPhone] = useState("");
  const valid = /^[6-9]\d{9}$/.test(phone);

  const submit = () => {
    if (!valid) return;
    setParams("otp", { phone });
    navigate("otp");
  };

  return (
    <OnboardingFrame
      footer={
        <div className="flex flex-col gap-3.5">
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
          <p className="text-center text-[11px] leading-[1.5] text-riverline-mute">
            By continuing, you agree to our{" "}
            <a className="font-medium text-riverline-ink underline-offset-2 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a className="font-medium text-riverline-ink underline-offset-2 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
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
          eyebrow="Sign in"
          title={
            <>
              What&rsquo;s your <em>number</em>?
            </>
          }
          body="We'll text a one-time code to verify it. Standard rates may apply."
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SOFT_EASE, delay: 0.2 }}
          className="mt-8"
        >
          <Field label="Mobile number">
            <FieldRow status={phone.length > 0 && valid ? "ok" : "default"}>
              <FieldPrefix>
                <span className="text-base leading-none" aria-hidden>
                  🇮🇳
                </span>
                +91
              </FieldPrefix>
              <FieldInput
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                autoFocus
                placeholder="98765 43210"
                aria-label="Mobile number"
                value={phone}
                maxLength={10}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
              />
              <FieldStatusBadge
                value={phone}
                ok={valid}
                remaining={10 - phone.length}
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
                <path
                  d="M3 5.5 V4 A3.5 3.5 0 0 1 10 4 V5.5 M2.5 5.5 H10.5 V11 H2.5 Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Bank-grade encryption"
            body="Your number is encrypted in transit and never sold to third parties."
            delay={0.45}
          />
        </motion.div>
      </form>
    </OnboardingFrame>
  );
}
