"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

// Shared shadow tokens
function cardShadow() {
  return {
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,0.92)",
      "0 1px 1px rgba(12,14,20,0.035)",
      "0 6px 16px -10px rgba(12,14,20,0.08)",
    ].join(", "),
  };
}

function tileShadow() {
  return {
    boxShadow: [
      "inset 0 1px 0 rgba(255,255,255,0.9)",
      "0 1px 1px rgba(12,14,20,0.025)",
    ].join(", "),
  };
}

// ─── Verified hero (shared) ───────────────────────────────────────────────
//
// Animated checkmark badge used at the top of identity-verification screens.
// Subtle pulse halo + path-drawn check + 3-layer shadow stack.

function VerifiedHero({
  size = 72,
  tone = "ok",
}: {
  size?: number;
  tone?: "ok" | "ink";
}) {
  const reduce = useReducedMotion();
  const isOk = tone === "ok";

  return (
    <div className="flex justify-center">
      <motion.div
        initial={reduce ? false : { scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: SOFT_EASE }}
        className="relative flex items-center justify-center"
        style={{ width: size + 16, height: size + 16 }}
      >
        {/* Halo */}
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isOk
                ? [
                    "0 0 0 0 rgba(31,138,118,0.25)",
                    "0 0 0 18px rgba(31,138,118,0)",
                  ]
                : [
                    "0 0 0 0 rgba(12,14,20,0.2)",
                    "0 0 0 18px rgba(12,14,20,0)",
                  ],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.6,
              ease: "easeOut",
            }}
          />
        )}
        <div
          className={
            "flex items-center justify-center rounded-full " +
            (isOk ? "bg-riverline-flow" : "bg-riverline-ink")
          }
          style={{
            width: size,
            height: size,
            boxShadow: isOk
              ? [
                  "inset 0 1px 0 rgba(255,255,255,0.18)",
                  "inset 0 -1px 0 rgba(0,0,0,0.18)",
                  "0 1px 2px rgba(31,138,118,0.4)",
                  "0 8px 22px -6px rgba(31,138,118,0.32)",
                ].join(", ")
              : [
                  "inset 0 1px 0 rgba(255,255,255,0.1)",
                  "inset 0 -1px 0 rgba(0,0,0,0.4)",
                  "0 1px 2px rgba(12,14,20,0.4)",
                  "0 8px 22px -6px rgba(12,14,20,0.32)",
                ].join(", "),
          }}
        >
          <svg
            width={size * 0.45}
            height={size * 0.45}
            viewBox="0 0 24 24"
            fill="none"
          >
            <motion.path
              d="M5 12 l4 4 10-10"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.25 }}
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Security score (top of trust section) ───────────────────────────────

export function SecurityScoreCard() {
  const reduce = useReducedMotion();
  const score = 96;
  const max = 100;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="flex items-center gap-4 rounded-[16px] bg-white px-4 py-3.5"
      style={cardShadow()}
    >
      {/* Ring */}
      <div className="relative h-[64px] w-[64px] shrink-0">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="-rotate-90"
        >
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="rgba(12,14,20,0.07)"
            strokeWidth="3"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            stroke="rgb(31,138,118)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={reduce ? false : { strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - score / max) }}
            transition={{ duration: 1.4, ease: SOFT_EASE, delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[18px] leading-none tracking-[-0.018em] text-riverline-ink tabular-nums">
            {score}
          </span>
          <span className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-riverline-flow">
            Excellent
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
          Security score
        </div>
        <div className="mt-0.5 text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
          Your account is well protected
        </div>
        <div className="mt-1 text-[11px] text-riverline-mute">
          4 of 4 protections active · Updated just now
        </div>
      </div>
    </div>
  );
}

// ─── PAN detail ───────────────────────────────────────────────────────────

export function PanDetail() {
  return (
    <div className="px-5 pb-6">
      <VerifiedHero />
      <h3 className="mt-5 text-balance text-center font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
        PAN successfully verified
      </h3>
      <p className="mt-2 text-pretty text-center text-[12.5px] leading-[1.55] text-riverline-mute">
        Used securely to access credit reports and personalize lender
        eligibility.
      </p>

      <Subhead num="01" title="Verification details" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        <Row label="PAN" value="ABCDE1234F" verified />
        <Divider />
        <Row label="Linked legal name" value="Shubham Singh" />
        <Divider />
        <Row label="Verified on" value="Apr 18, 2026" />
        <Divider />
        <Row label="Source" value="NSDL · Government of India" />
        <Divider />
        <Row label="Status" value="Active" tone="ok" />
      </div>

      <Subhead num="02" title="Why this matters" mt />
      <p className="text-pretty text-[12.5px] leading-[1.55] text-riverline-mute">
        A verified PAN lets RBI-regulated lenders give you accurate offers
        without re-uploading documents each time. Riverline shares only a{" "}
        <span className="font-semibold text-riverline-ink">tokenized reference</span>
        , never the full PAN.
      </p>

      <Subhead num="03" title="Security" mt />
      <SecurityRow text="Encrypted storage" />
      <SecurityRow text="Consent-controlled access" />
      <SecurityRow text="Revocable anytime" />

      <Subhead num="04" title="Actions" mt />
      <ActionList
        actions={[
          { label: "View consent history", icon: <IconHistory /> },
          { label: "Revoke lender access", icon: <IconRevoke /> },
          { label: "Download verification proof", icon: <IconDownload /> },
        ]}
      />
    </div>
  );
}

// ─── Aadhaar detail ───────────────────────────────────────────────────────

export function AadhaarDetail() {
  return (
    <div className="px-5 pb-6">
      <VerifiedHero />
      <h3 className="mt-5 text-balance text-center font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
        Aadhaar linked securely
      </h3>
      <p className="mt-2 text-pretty text-center text-[12.5px] leading-[1.55] text-riverline-mute">
        UIDAI-compliant. We never store your full Aadhaar — only a tokenized
        reference encrypted at rest.
      </p>

      <Subhead num="01" title="Verification details" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        <Row label="Aadhaar" value="•••• •••• 1234" verified />
        <Divider />
        <Row label="Linked phone" value="+91 98765 43210" verified />
        <Divider />
        <Row label="Last verified" value="May 12, 2026" />
        <Divider />
        <Row label="Compliance" value="UIDAI" tone="ok" />
      </div>

      <Subhead num="02" title="How your data flows" mt />
      <DataFlow />

      <Subhead num="03" title="What we never do" mt />
      <SecurityRow text="Store the full Aadhaar number" />
      <SecurityRow text="Share with unauthorized parties" />
      <SecurityRow text="Use for marketing" />

      <Subhead num="04" title="Actions" mt />
      <ActionList
        actions={[
          { label: "Reverify Aadhaar", icon: <IconRefresh /> },
          { label: "Manage consent", icon: <IconShield /> },
          { label: "Remove linked identity", icon: <IconRevoke />, tone: "danger" },
          { label: "View access logs", icon: <IconHistory /> },
        ]}
      />
    </div>
  );
}

// ─── Biometric detail ─────────────────────────────────────────────────────

export function BiometricDetail() {
  const [faceId, setFaceId] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);
  const [confirmActions, setConfirmActions] = useState(true);
  const [autoLock, setAutoLock] = useState<"30s" | "1m" | "5m" | "off">("1m");

  return (
    <div className="px-5 pb-6">
      {/* Face ID glyph */}
      <div className="flex justify-center">
        <BiometricGlyph active={faceId || fingerprint} />
      </div>
      <h3 className="mt-5 text-balance text-center font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
        Biometric protection enabled
      </h3>
      <p className="mt-2 text-pretty text-center text-[12.5px] leading-[1.55] text-riverline-mute">
        Your financial actions require biometric confirmation. Face ID or
        fingerprint stays on your device — Riverline never sees them.
      </p>

      <Subhead num="01" title="Methods" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        <ToggleRow
          label="Face ID"
          sub="Required to open Riverline"
          on={faceId}
          onChange={() => setFaceId((v) => !v)}
        />
        <Divider />
        <ToggleRow
          label="Fingerprint"
          sub="Backup unlock method"
          on={fingerprint}
          onChange={() => setFingerprint((v) => !v)}
        />
      </div>

      <Subhead num="02" title="Sensitive actions" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        <ToggleRow
          label="Confirm sensitive actions"
          sub="Loan applications, refinance, EMI changes"
          on={confirmActions}
          onChange={() => setConfirmActions((v) => !v)}
        />
      </div>

      <Subhead num="03" title="Auto-lock timing" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        {(
          [
            { id: "30s", label: "After 30 seconds" },
            { id: "1m", label: "After 1 minute" },
            { id: "5m", label: "After 5 minutes" },
            { id: "off", label: "Never" },
          ] as const
        ).map((opt, i) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setAutoLock(opt.id)}
            className={
              "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-riverline-card/40 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <span className="text-[12.5px] font-medium tracking-[-0.005em] text-riverline-ink">
              {opt.label}
            </span>
            {autoLock === opt.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="flex h-5 w-5 items-center justify-center rounded-full text-white"
                style={{ background: "rgb(74,51,184)" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </button>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-[1.55] text-riverline-mute-2">
        Biometric data is processed by your device&rsquo;s secure enclave and
        never leaves it.
      </p>
    </div>
  );
}

function BiometricGlyph({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: SOFT_EASE }}
      className="relative flex h-[88px] w-[88px] items-center justify-center"
    >
      {!reduce && active && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-[22px]"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(74,51,184,0.20)",
              "0 0 0 14px rgba(74,51,184,0)",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.6,
            ease: "easeOut",
          }}
        />
      )}
      <div
        className={
          "flex h-[68px] w-[68px] items-center justify-center rounded-[20px] " +
          (active ? "text-white" : "bg-white text-riverline-ink")
        }
        style={{
          background: active ? "rgb(74,51,184)" : undefined,
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
                "0 12px 24px -10px rgba(12,14,20,0.12)",
              ].join(", "),
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M5 11 V8 a3 3 0 0 1 3-3 H11 M21 5 H24 a3 3 0 0 1 3 3 V11 M5 21 V24 a3 3 0 0 0 3 3 H11 M21 27 H24 a3 3 0 0 0 3-3 V21"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="14" r="1" fill="currentColor" />
          <circle cx="20" cy="14" r="1" fill="currentColor" />
          <path
            d="M16 14 V18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 21 a4 4 0 0 0 8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </motion.div>
  );
}

// ─── RBI compliant detail ─────────────────────────────────────────────────

export function RbiDetail() {
  return (
    <div className="px-5 pb-6">
      <VerifiedHero tone="ink" />
      <h3 className="mt-5 text-balance text-center font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
        Built with RBI-regulated partners
      </h3>
      <p className="mt-2 text-pretty text-center text-[12.5px] leading-[1.55] text-riverline-mute">
        Riverline doesn&rsquo;t lend directly. Every offer comes from a
        licensed bank or NBFC operating under RBI guidelines.
      </p>

      <Subhead num="01" title="How lending works" mt />
      <LendingFlow />

      <Subhead num="02" title="Our partners" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        {[
          {
            name: "HDFC Bank Ltd",
            type: "Scheduled Commercial Bank",
            license: "RBI License No. 27",
          },
          {
            name: "State Bank of India",
            type: "Scheduled Commercial Bank",
            license: "Statutory · Govt. of India",
          },
          {
            name: "Axis Bank Ltd",
            type: "Scheduled Commercial Bank",
            license: "RBI License No. 35",
          },
          {
            name: "Riverline NBFC Pvt Ltd",
            type: "Tech facilitator under DLG",
            license: "Default Loss Guarantee partner",
          },
        ].map((p, i) => (
          <div
            key={p.name}
            className={
              "px-4 py-3 " + (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <div className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
              {p.name}
            </div>
            <div className="mt-0.5 flex items-baseline justify-between gap-2 text-[10.5px]">
              <span className="text-riverline-mute">{p.type}</span>
              <span className="font-mono tracking-[0.04em] text-riverline-mute-2">
                {p.license}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Subhead num="03" title="What this means for you" mt />
      <SecurityRow text="Loan terms follow RBI Fair Practices Code" />
      <SecurityRow text="Interest rate transparency · no hidden charges" />
      <SecurityRow text="Right to escalate disputes to RBI Ombudsman" />
      <SecurityRow text="Standardized recovery & grievance procedures" />

      <Subhead num="04" title="Actions" mt />
      <ActionList
        actions={[
          { label: "View all lending partners", icon: <IconList /> },
          { label: "Read full disclosures", icon: <IconDoc /> },
          { label: "How lending decisions work", icon: <IconHelp /> },
        ]}
      />
    </div>
  );
}

// ─── End-to-end encrypted detail ──────────────────────────────────────────

export function EncryptionDetail() {
  return (
    <div className="px-5 pb-6">
      <EncryptionFlow />
      <h3 className="mt-5 text-balance text-center font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
        Your financial data stays encrypted
      </h3>
      <p className="mt-2 text-pretty text-center text-[12.5px] leading-[1.55] text-riverline-mute">
        From your device to our partners, every byte is encrypted in transit
        and at rest. Only you decide who sees what.
      </p>

      <Subhead num="01" title="What we protect" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        {[
          { label: "PAN, Aadhaar, KYC documents", method: "AES-256 at rest" },
          { label: "Bank & card credentials", method: "Tokenized · never stored" },
          { label: "Credit report data", method: "Encrypted vault" },
          { label: "AI conversations", method: "Per-user encryption" },
        ].map((row, i) => (
          <div
            key={row.label}
            className={
              "flex items-baseline justify-between gap-3 px-4 py-3 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <span className="text-[12.5px] text-riverline-ink-2">{row.label}</span>
            <span className="text-right text-[10.5px] font-medium tabular-nums text-riverline-mute">
              {row.method}
            </span>
          </div>
        ))}
      </div>

      <Subhead num="02" title="What we never do" mt />
      <SecurityRow text="Sell your data to third parties" />
      <SecurityRow text="Use your data for unrelated marketing" />
      <SecurityRow text="Store unencrypted credentials" />

      <Subhead num="03" title="Active sessions" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        {[
          {
            device: "iPhone 15 Pro",
            location: "Bengaluru, IN",
            current: true,
            last: "Now",
          },
          {
            device: "MacBook Pro · Safari",
            location: "Bengaluru, IN",
            current: false,
            last: "2h ago",
          },
        ].map((s, i) => (
          <div
            key={s.device}
            className={
              "flex items-center justify-between gap-3 px-4 py-3 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
                  {s.device}
                </span>
                {s.current && (
                  <span className="rounded-md bg-riverline-flow-soft px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-riverline-flow">
                    This device
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-[11px] text-riverline-mute">
                {s.location} · {s.last}
              </div>
            </div>
            {!s.current && (
              <button
                type="button"
                className="rounded-md bg-riverline-card px-2 py-1 text-[11px] font-semibold text-riverline-ink-2 transition-colors hover:bg-riverline-line"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      <Subhead num="04" title="Your data, your control" mt />
      <ActionList
        actions={[
          { label: "Sign out of all other devices", icon: <IconLogout /> },
          { label: "Export my data", icon: <IconDownload /> },
          { label: "Delete my account", icon: <IconRevoke />, tone: "danger" },
        ]}
      />
    </div>
  );
}

// ─── Visual flows ─────────────────────────────────────────────────────────

function DataFlow() {
  return (
    <div
      className="rounded-[16px] bg-white px-4 py-4"
      style={cardShadow()}
    >
      <div className="flex items-center justify-between gap-2">
        {[
          { icon: <IconDevice />, label: "Device" },
          { icon: <IconLockSm />, label: "Encrypted" },
          { icon: <IconVault />, label: "Vault" },
          { icon: <IconBank />, label: "Lender" },
        ].map((node, i) => (
          <div key={node.label} className="flex flex-1 items-center">
            <FlowNode {...node} delay={i * 0.15} />
            {i < 3 && <FlowLine delay={i * 0.15 + 0.1} />}
          </div>
        ))}
      </div>
      <p className="mt-3.5 text-[11.5px] leading-[1.55] text-riverline-mute">
        Your data is encrypted on your device, stored in a secure vault, and
        only the minimum required information is shared with the lender —
        always with your consent.
      </p>
    </div>
  );
}

function LendingFlow() {
  return (
    <div
      className="rounded-[16px] bg-white px-4 py-4"
      style={cardShadow()}
    >
      <div className="flex items-center justify-between gap-2">
        {[
          { icon: <IconPerson />, label: "You" },
          { icon: <IconRiverline />, label: "Riverline" },
          { icon: <IconBank />, label: "Bank · NBFC" },
          { icon: <IconShield />, label: "RBI" },
        ].map((node, i) => (
          <div key={node.label} className="flex flex-1 items-center">
            <FlowNode {...node} delay={i * 0.15} />
            {i < 3 && <FlowLine delay={i * 0.15 + 0.1} />}
          </div>
        ))}
      </div>
      <p className="mt-3.5 text-[11.5px] leading-[1.55] text-riverline-mute">
        Riverline matches you with RBI-licensed lenders. The bank or NBFC
        approves and disburses. Every step follows RBI Fair Practices.
      </p>
    </div>
  );
}

function EncryptionFlow() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-[120px] items-center justify-center">
      {/* Three concentric ripples */}
      {!reduce &&
        [0, 0.7, 1.4].map((delay, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="absolute h-[80px] w-[80px] rounded-full border border-riverline-ink/15"
            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeOut",
              delay,
            }}
          />
        ))}
      <motion.div
        initial={reduce ? false : { scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: SOFT_EASE }}
        className="relative flex h-[64px] w-[64px] items-center justify-center rounded-[18px] bg-riverline-ink text-white"
        style={{
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.1)",
            "inset 0 -1px 0 rgba(0,0,0,0.4)",
            "0 1px 2px rgba(12,14,20,0.5)",
            "0 12px 28px -8px rgba(12,14,20,0.4)",
          ].join(", "),
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect
            x="6"
            y="12"
            width="16"
            height="12"
            rx="2"
            stroke="white"
            strokeWidth="1.6"
          />
          <path
            d="M9 12 V8 a5 5 0 0 1 10 0 V12"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="14" cy="18" r="1.4" fill="white" />
          <path
            d="M14 19.4 V21"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}

function FlowNode({
  icon,
  label,
  delay = 0,
}: {
  icon: ReactNode;
  label: string;
  delay?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: SOFT_EASE, delay }}
        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-riverline-card text-riverline-ink-2"
      >
        {icon}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: SOFT_EASE, delay: delay + 0.1 }}
        className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-riverline-mute"
      >
        {label}
      </motion.span>
    </div>
  );
}

function FlowLine({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative mx-1 -mt-3 h-[2px] flex-1 self-center overflow-hidden rounded-full bg-riverline-line-2">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut",
          delay,
        }}
        className="absolute inset-y-0 w-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(12,14,20,0.6), transparent)",
        }}
      />
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────

function Subhead({
  num,
  title,
  mt,
}: {
  num: string;
  title: string;
  mt?: boolean;
}) {
  return (
    <div className={"mb-3 flex items-baseline gap-2.5 " + (mt ? "mt-6" : "")}>
      <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-riverline-mute-2">
        {num}
      </span>
      <h3 className="text-[14px] font-semibold tracking-[-0.012em] text-riverline-ink">
        {title}
      </h3>
    </div>
  );
}

function Row({
  label,
  value,
  verified,
  tone,
}: {
  label: string;
  value: string;
  verified?: boolean;
  tone?: "ok";
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <span className="text-[12px] text-riverline-mute">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={
            "text-[12.5px] font-semibold tabular-nums tracking-[-0.005em] " +
            (tone === "ok" ? "text-riverline-flow" : "text-riverline-ink")
          }
        >
          {value}
        </span>
        {verified && (
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-riverline-flow-soft">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path
                d="M2 4.5l1.8 1.8 3.5-3.5"
                stroke="rgb(31,138,118)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-riverline-line/60" />;
}

function SecurityRow({ text }: { text: string }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-[10px] bg-white px-3 py-2.5 mt-1.5 first:mt-0"
      style={tileShadow()}
    >
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-riverline-flow-soft">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path
            d="M2 4.5l1.8 1.8 3.5-3.5"
            stroke="rgb(31,138,118)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-[12px] text-riverline-ink-2">{text}</span>
    </div>
  );
}

function ActionList({
  actions,
}: {
  actions: Array<{
    label: string;
    icon: ReactNode;
    tone?: "danger";
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
      {actions.map((a, i) => (
        <button
          key={a.label}
          type="button"
          className={
            "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-riverline-card/40 " +
            (i > 0 ? "border-t border-riverline-line/60" : "")
          }
        >
          <div
            className={
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] " +
              (a.tone === "danger"
                ? "bg-red-50 text-riverline-danger"
                : "bg-riverline-card text-riverline-ink-2")
            }
          >
            {a.icon}
          </div>
          <span
            className={
              "flex-1 text-[12.5px] font-semibold tracking-[-0.005em] " +
              (a.tone === "danger"
                ? "text-riverline-danger"
                : "text-riverline-ink")
            }
          >
            {a.label}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 13 13"
            fill="none"
            className="text-riverline-mute-2"
          >
            <path
              d="M3 6.5h5.5M6 4l2.5 2.5L6 9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  sub,
  on,
  onChange,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
          {label}
        </div>
        <div className="mt-0.5 text-[11.5px] text-riverline-mute">{sub}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onChange}
        className="relative h-[24px] w-[40px] shrink-0 rounded-full transition-colors"
        style={{
          backgroundColor: on ? "rgb(12,14,20)" : "rgba(12,14,20,0.15)",
        }}
      >
        <motion.span
          animate={{ x: on ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-1/2 block h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.18)" }}
        />
      </button>
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

const stroke = { stroke: "currentColor", strokeWidth: 1.4 } as const;

function IconHistory() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1.5 7a5.5 5.5 0 1 1 1.5 3.8" {...stroke} strokeLinecap="round" />
      <path d="M1.5 10.5V7h3" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4 V7 L9 8" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconRevoke() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" {...stroke} />
      <path d="M3.5 3.5 L10.5 10.5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2 V9 M3.5 6 L7 9.5 L10.5 6" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11 H12" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12 7 a5 5 0 1 1-1.4-3.5"
        {...stroke}
        strokeLinecap="round"
      />
      <path
        d="M12 1.5 V4 H9.5"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5 L12 3.5 V7 C12 10 9.5 12 7 13 C 4.5 12 2 10 2 7 V3.5 Z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path
        d="M5 7 L6.5 8.5 L9 5.5"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconList() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 4 H12 M2 7 H12 M2 10 H8" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 1.5 H8.5 L11 4 V12.5 H3 Z M8.5 1.5 V4 H11"
        {...stroke}
        strokeLinejoin="round"
      />
      <path d="M5 7 H9 M5 9 H9 M5 11 H7.5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" {...stroke} />
      <path
        d="M5.5 5.5 a1.5 1.5 0 0 1 3 0 c0 1-1.5 1.5-1.5 2.5"
        {...stroke}
        strokeLinecap="round"
      />
      <circle cx="7" cy="10" r="0.6" fill="currentColor" />
    </svg>
  );
}
function IconDevice() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="4" y="2" width="6" height="10" rx="1.4" {...stroke} />
      <path d="M6.5 10.5 H7.5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconLockSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="6" width="8" height="6.5" rx="1.4" {...stroke} />
      <path d="M4.5 6 V4 a2.5 2.5 0 0 1 5 0 V6" {...stroke} />
    </svg>
  );
}
function IconVault() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="3" width="10" height="8" rx="1.4" {...stroke} />
      <circle cx="9" cy="7" r="1.5" {...stroke} />
      <path d="M9 5.5 V4 M9 8.5 V10 M10.5 7 H12 M7.5 7 H6" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconBank() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2 L12 4.5 H2 Z" {...stroke} strokeLinejoin="round" />
      <path
        d="M3 5.5 V10 M5.5 5.5 V10 M8.5 5.5 V10 M11 5.5 V10 M2 11 H12"
        {...stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconPerson() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="5" r="2.5" {...stroke} />
      <path
        d="M2 12 C 2.8 9.5 4.8 8.5 7 8.5 C 9.2 8.5 11.2 9.5 12 12"
        {...stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconRiverline() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="10" rx="2" {...stroke} />
      <path d="M5 9 V5 H7.5 a1.5 1.5 0 0 1 0 3 H5 L9 9" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M8 2 H3.5 a1 1 0 0 0-1 1 V11 a1 1 0 0 0 1 1 H8"
        {...stroke}
        strokeLinecap="round"
      />
      <path d="M10 4 L12.5 7 L10 10 M5 7 H12.5" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
