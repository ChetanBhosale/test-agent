"use client";

import { useState } from "react";
import { useApp } from "@/context/app-context";
import {
  FieldLabel,
  HelperText,
  OnboardingFrame,
  PrimaryButton,
  ScreenHeading,
} from "./shared";

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
        <div className="flex flex-col gap-3">
          <PrimaryButton disabled={!valid} onClick={submit}>
            Continue
          </PrimaryButton>
          <p className="text-center text-[11.5px] leading-relaxed text-riverline-mute">
            By continuing, you agree to our{" "}
            <a className="font-semibold text-riverline-ink-2 underline-offset-2 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a className="font-semibold text-riverline-ink-2 underline-offset-2 hover:underline">
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
        className="flex h-full flex-col"
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

        <div className="mt-9">
          <FieldLabel>Mobile number</FieldLabel>
          <div className="flex items-stretch gap-2 rounded-[18px] border border-riverline-line bg-white p-2 transition focus-within:border-riverline-primary focus-within:ring-4 focus-within:ring-riverline-primary/12">
            <div className="flex items-center gap-1.5 rounded-[12px] bg-riverline-card px-3 text-[15px] font-semibold text-riverline-ink">
              <span className="text-base leading-none" aria-hidden>
                🇮🇳
              </span>
              +91
            </div>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              autoFocus
              placeholder="98 _ _ _ _ _ _ _ _ _"
              aria-label="Mobile number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="flex-1 bg-transparent px-2 text-[18px] font-semibold tracking-[0.04em] text-riverline-ink outline-none placeholder:font-normal placeholder:text-riverline-mute/60 placeholder:tracking-[0.04em]"
            />
          </div>
        </div>

        <div className="mt-6">
          <HelperText
            tone="info"
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 6 V4.5 A4 4 0 0 1 11 4.5 V6 M2.5 6 H11.5 V12 H2.5 Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Bank-grade encryption"
            body="Your number is encrypted in transit and never sold to third parties."
          />
        </div>
      </form>
    </OnboardingFrame>
  );
}
