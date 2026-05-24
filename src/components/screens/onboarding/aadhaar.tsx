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
import { ProgressDots } from "./pan";

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
      topRight={<ProgressDots step={2} total={3} />}
      footer={
        <PrimaryButton disabled={!valid} onClick={submit}>
          Send Aadhaar OTP
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
          eyebrow="KYC · 2 of 3"
          title={
            <>
              Link your <em>Aadhaar</em>.
            </>
          }
          body="We'll send an OTP on the phone linked to your Aadhaar to verify your identity."
        />

        <div className="mt-9">
          <FieldLabel>Last 4 digits of Aadhaar</FieldLabel>
          <div className="flex items-stretch gap-2 rounded-[18px] border border-riverline-line bg-white p-2 transition focus-within:border-riverline-primary focus-within:ring-4 focus-within:ring-riverline-primary/12">
            <div className="flex items-center rounded-[12px] bg-riverline-card px-3 text-[15px] font-semibold tracking-[0.3em] text-riverline-mute">
              XXXX&nbsp;XXXX
            </div>
            <input
              type="tel"
              inputMode="numeric"
              autoFocus
              autoComplete="off"
              aria-label="Last 4 digits of Aadhaar"
              placeholder="1234"
              value={last4}
              maxLength={4}
              onChange={(e) =>
                setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              className="w-24 bg-transparent text-[20px] font-bold tracking-[0.28em] tabular-nums text-riverline-ink outline-none placeholder:font-normal placeholder:tracking-[0.28em] placeholder:text-riverline-mute/60"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <HelperText
            tone="success"
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7 L6 10.5 L11.5 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="UIDAI-compliant"
            body="We never store your full Aadhaar — only a tokenized reference, encrypted at rest."
          />
          <HelperText
            tone="info"
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1 L12 3.5 V7 C12 10 9.5 12.5 7 13 C4.5 12.5 2 10 2 7 V3.5 Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            }
            title="You're in control"
            body="You can revoke this consent and delete your data anytime from Settings."
          />
        </div>
      </form>
    </OnboardingFrame>
  );
}
