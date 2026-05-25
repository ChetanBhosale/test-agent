"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import { Avatar } from "@/components/brand/avatar";
import { TabBar } from "@/components/home/tab-bar";
import {
  ScreenSurface,
  ScreenHeader,
  SectionTitle,
  Stagger,
  TonalDivider,
  ScreenFooter,
  softShadow,
  SOFT_EASE,
} from "@/components/shared/screen-kit";
import { DetailSheet } from "@/components/sheets/detail-sheet";
import {
  AccountDetail,
  AccountFooter,
  NotificationsDetail,
  SupportDetail,
  LegalDetail,
  SignOutConfirm,
} from "@/components/sheets/profile-detail";
import {
  SecurityScoreCard,
  PanDetail,
  AadhaarDetail,
  BiometricDetail,
  RbiDetail,
  EncryptionDetail,
} from "@/components/sheets/trust-detail";

type ProfileSheet =
  | "account"
  | "notifications"
  | "support"
  | "legal"
  | "signout"
  | "trust-pan"
  | "trust-aadhaar"
  | "trust-biometric"
  | "trust-rbi"
  | "trust-encryption"
  | null;

/**
 * Profile — financial identity & trust center.
 * Six calm sections, all interactive. Built on the shared screen kit.
 */
export function ProfileScreen() {
  const { user, reset } = useApp();
  const name = user?.name ?? "Shubham";
  const [sheet, setSheet] = useState<ProfileSheet>(null);

  const close = () => setSheet(null);

  const fireCopilot = (prompt: string) => {
    window.dispatchEvent(
      new CustomEvent("riverline:open-copilot", { detail: { prompt } }),
    );
  };

  return (
    <>
      <ScreenSurface>
        <ScreenHeader
          title="Profile"
          action={
            <button
              type="button"
              aria-label="Edit"
              onClick={() => setSheet("account")}
              className="rounded-md px-2 py-1 text-[12px] font-medium text-riverline-mute transition-colors hover:bg-riverline-card hover:text-riverline-ink"
            >
              Edit
            </button>
          }
        />

        <Stagger delay={0.06}>
          <IdentityHero name={name} />
        </Stagger>

        <SectionTitle eyebrow="01" title="Reputation" />
        <Stagger delay={0.16}>
          <ReputationPanel />
        </Stagger>

        <SectionTitle eyebrow="02" title="What we noticed" />
        <Stagger delay={0.22}>
          <InsightsFeed />
        </Stagger>

        <SectionTitle eyebrow="03" title="Trust & protection" />
        <Stagger delay={0.28}>
          <TrustPanel onOpen={(s) => setSheet(s)} />
        </Stagger>

        <SectionTitle eyebrow="04" title="AI assistant" />
        <Stagger delay={0.34}>
          <AssistantStrip onTalk={fireCopilot} onChat={fireCopilot} />
        </Stagger>

        <SectionTitle eyebrow="05" title="Settings" />
        <Stagger delay={0.4}>
          <SettingsList
            onAccount={() => setSheet("account")}
            onNotifications={() => setSheet("notifications")}
            onSupport={() => setSheet("support")}
            onLegal={() => setSheet("legal")}
            onSignOut={() => setSheet("signout")}
          />
        </Stagger>

        <ScreenFooter />
      </ScreenSurface>

      <TabBar />

      {/* Detail sheets */}
      <DetailSheet
        open={sheet === "account"}
        onClose={close}
        eyebrow="Account"
        title="Your financial identity"
        height="86%"
        footer={<AccountFooter />}
      >
        <AccountDetail name={name} />
      </DetailSheet>

      <DetailSheet
        open={sheet === "notifications"}
        onClose={close}
        eyebrow="Preferences"
        title="What you hear about, and when"
        height="84%"
      >
        <NotificationsDetail />
      </DetailSheet>

      <DetailSheet
        open={sheet === "support"}
        onClose={close}
        eyebrow="Support"
        title="We're here to help"
        height="84%"
      >
        <SupportDetail />
      </DetailSheet>

      <DetailSheet
        open={sheet === "legal"}
        onClose={close}
        eyebrow="Legal"
        title="Documents & disclosures"
        height="80%"
      >
        <LegalDetail />
      </DetailSheet>

      <DetailSheet
        open={sheet === "signout"}
        onClose={close}
        eyebrow="Confirm"
        title=" "
        height="auto"
      >
        <SignOutConfirm
          onConfirm={() => {
            close();
            // Brief delay so the sheet animates out before reset
            setTimeout(() => reset("splash"), 320);
          }}
          onCancel={close}
        />
      </DetailSheet>

      {/* ── Trust & protection sheets ───────────────────────── */}

      <DetailSheet
        open={sheet === "trust-pan"}
        onClose={close}
        eyebrow="Identity"
        title="PAN verification"
        height="86%"
      >
        <PanDetail />
      </DetailSheet>

      <DetailSheet
        open={sheet === "trust-aadhaar"}
        onClose={close}
        eyebrow="Identity"
        title="Aadhaar"
        height="88%"
      >
        <AadhaarDetail />
      </DetailSheet>

      <DetailSheet
        open={sheet === "trust-biometric"}
        onClose={close}
        eyebrow="Device security"
        title="Biometric lock"
        height="86%"
      >
        <BiometricDetail />
      </DetailSheet>

      <DetailSheet
        open={sheet === "trust-rbi"}
        onClose={close}
        eyebrow="Compliance"
        title="RBI partnerships"
        height="88%"
      >
        <RbiDetail />
      </DetailSheet>

      <DetailSheet
        open={sheet === "trust-encryption"}
        onClose={close}
        eyebrow="Data protection"
        title="End-to-end encryption"
        height="88%"
      >
        <EncryptionDetail />
      </DetailSheet>
    </>
  );
}

// ─── 01 — Identity hero ────────────────────────────────────────────────────

function IdentityHero({ name }: { name: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-3 flex flex-col items-center text-center">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: SOFT_EASE }}
        className="relative"
      >
        <Avatar name={name} size={88} zoom={0.22} focal="50% 30%" />
        <div
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white"
          style={{
            boxShadow: [
              "0 0 0 1px rgba(12,14,20,0.06)",
              "0 4px 12px -4px rgba(12,14,20,0.18)",
            ].join(", "),
          }}
          aria-label="Verified"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-riverline-flow">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5 l2 2 4-4"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.18 }}
        className="mt-5 font-serif text-[26px] leading-none tracking-[-0.025em] text-riverline-ink"
      >
        {name}
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: SOFT_EASE, delay: 0.28 }}
        className="mt-2 text-[12.5px] text-riverline-mute"
      >
        Verified identity · Financial wellness improving
      </motion.div>
    </div>
  );
}

// ─── 02 — Reputation centerpiece ───────────────────────────────────────────

function ReputationPanel() {
  return (
    <div
      className="overflow-hidden rounded-[20px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      <div className="flex items-start justify-between gap-5 px-5 pt-5">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
            Borrower tier
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-serif text-[32px] leading-none tracking-[-0.025em] text-riverline-ink">
              Gold
            </span>
            <span className="text-[11px] font-medium text-riverline-mute-2">
              · Top 8% in India
            </span>
          </div>
          <p className="mt-2 max-w-[180px] text-[12px] leading-[1.5] text-riverline-mute">
            Strong repayment history. Two tiers from Platinum.
          </p>
        </div>
        <ReputationSpark />
      </div>

      <TonalDivider className="mx-5 mt-5" />

      <div className="px-5 pt-4 pb-5">
        <div className="flex items-baseline justify-between text-[10.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute">
          <span>To Platinum</span>
          <span className="font-semibold tabular-nums tracking-[0.05em] text-riverline-ink-2">
            68%
          </span>
        </div>
        <div
          className="mt-2 h-[3px] overflow-hidden rounded-full"
          style={{ background: "rgba(74,51,184,0.10)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "68%" }}
            transition={{ duration: 1.2, ease: SOFT_EASE, delay: 0.4 }}
            className="h-full rounded-full"
            style={{ background: "rgb(74,51,184)" }}
          />
        </div>

        <div className="mt-4 flex items-stretch gap-3">
          <RepStat label="On-time streak" value="4 mo" />
          <RepDivider />
          <RepStat label="Repayment" value="100%" />
          <RepDivider />
          <RepStat label="Score growth" value="+34" />
        </div>
      </div>
    </div>
  );
}

function ReputationSpark() {
  const reduce = useReducedMotion();
  return (
    <svg
      width="96"
      height="60"
      viewBox="0 -4 96 68"
      fill="none"
      className="overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id="repFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(12,14,20,0.08)" />
          <stop offset="100%" stopColor="rgba(12,14,20,0)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 50 C 18 46, 28 40, 42 32 S 70 16, 96 6 L 96 60 L 0 60 Z"
        fill="url(#repFill)"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: SOFT_EASE, delay: 0.7 }}
      />
      <motion.path
        d="M0 50 C 18 46, 28 40, 42 32 S 70 16, 96 6"
        stroke="rgb(74,51,184)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: SOFT_EASE, delay: 0.3 }}
      />
      <motion.g
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: SOFT_EASE, delay: 1.5 }}
        style={{ transformOrigin: "96px 6px" }}
      >
        <motion.circle
          cx="96"
          cy="6"
          r="4"
          fill="rgb(74,51,184)"
          fillOpacity="0.10"
          animate={{ r: [4, 9, 4], opacity: [0.30, 0, 0.30] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut" }}
        />
        <circle cx="96" cy="6" r="3" fill="rgb(74,51,184)" />
        <circle cx="96" cy="6" r="1.1" fill="white" />
      </motion.g>
    </svg>
  );
}

function RepStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <span className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-riverline-mute-2">
        {label}
      </span>
      <span className="mt-1 text-[13px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
        {value}
      </span>
    </div>
  );
}

function RepDivider() {
  return (
    <div
      aria-hidden
      className="w-px self-stretch"
      style={{ background: "rgba(12,14,20,0.07)" }}
    />
  );
}

// ─── 03 — Insights feed ────────────────────────────────────────────────────

const INSIGHTS = [
  "You've maintained healthy utilization for 4 months.",
  "You may qualify for lower interest rates soon.",
  "Your financial health is improving steadily.",
];

function InsightsFeed() {
  return (
    <div
      className="overflow-hidden rounded-[18px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {INSIGHTS.map((text, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: SOFT_EASE, delay: 0.05 + i * 0.06 }}
          className={
            "flex items-start gap-3 px-5 py-3.5 " +
            (i > 0 ? "border-t border-riverline-line/60" : "")
          }
        >
          <div className="mt-[6px] flex h-2 w-2 shrink-0 items-center justify-center">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 2.6,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
              className="block h-[7px] w-[7px] rounded-full bg-riverline-flow"
              style={{ boxShadow: "0 0 0 4px rgba(31,138,118,0.1)" }}
            />
          </div>
          <p className="font-serif text-[15px] leading-[1.4] tracking-[-0.012em] text-riverline-ink-2">
            {text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── 04 — Trust & protection ───────────────────────────────────────────────

function TrustPanel({
  onOpen,
}: {
  onOpen: (sheet: ProfileSheet) => void;
}) {
  const rows: Array<{
    label: string;
    sub: string;
    icon: ReactNode;
    sheet: ProfileSheet;
  }> = [
    {
      label: "PAN verified",
      sub: "ABCDE1234F",
      icon: <IconPan />,
      sheet: "trust-pan",
    },
    {
      label: "Aadhaar verified",
      sub: "Last 4: ••••",
      icon: <IconAadhaar />,
      sheet: "trust-aadhaar",
    },
    {
      label: "Biometric lock",
      sub: "Face ID enabled",
      icon: <IconLock />,
      sheet: "trust-biometric",
    },
    {
      label: "RBI compliant",
      sub: "DLG · NBFC partnership",
      icon: <IconShield />,
      sheet: "trust-rbi",
    },
    {
      label: "End-to-end encrypted",
      sub: "Revoke access anytime",
      icon: <IconKey />,
      sheet: "trust-encryption",
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* Security score card */}
      <SecurityScoreCard />

      {/* Verified items */}
      <div
        className="overflow-hidden rounded-[18px] bg-white"
        style={{ boxShadow: softShadow("card") }}
      >
        {rows.map((row, i) => (
          <motion.button
            key={row.label}
            type="button"
            onClick={() => onOpen(row.sheet)}
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.45,
              ease: SOFT_EASE,
              delay: 0.04 + i * 0.04,
            }}
            whileTap={{
              scale: 0.998,
              backgroundColor: "rgba(12,14,20,0.02)",
            }}
            className={
              "flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-riverline-card/40 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-riverline-card text-riverline-ink-2">
              {row.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                {row.label}
              </div>
              <div className="mt-0.5 text-[11.5px] text-riverline-mute">
                {row.sub}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-riverline-flow-soft">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5 l2 2 4-4"
                    stroke="rgb(31,138,118)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <svg
                width="13"
                height="13"
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
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── 05 — AI assistant strip ───────────────────────────────────────────────

function AssistantStrip({
  onTalk,
  onChat,
}: {
  onTalk: (prompt: string) => void;
  onChat: (prompt: string) => void;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[18px] bg-riverline-ink text-white"
      style={{
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.06)",
          "0 1px 2px rgba(12,14,20,0.45)",
          "0 8px 22px -10px rgba(12,14,20,0.4)",
        ].join(", "),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 0%, rgba(107,92,212,0.18) 0%, transparent 60%)",
        }}
      />
      <div className="relative flex items-center gap-3.5 px-4 py-4">
        <div
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-white/6"
          style={{
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.08)",
              "inset 0 -1px 0 rgba(0,0,0,0.18)",
            ].join(", "),
          }}
        >
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            {[
              { x: 4, base: 7, amp: 4 },
              { x: 7.5, base: 5, amp: 6 },
              { x: 11, base: 3, amp: 8 },
              { x: 14.5, base: 5, amp: 6 },
              { x: 18, base: 7, amp: 4 },
            ].map((bar, i) => (
              <motion.rect
                key={i}
                x={bar.x}
                width="2"
                rx="1"
                fill="white"
                animate={{
                  y: [bar.base, bar.base - bar.amp / 2, bar.base],
                  height: [
                    22 - bar.base * 2,
                    22 - bar.base * 2 + bar.amp,
                    22 - bar.base * 2,
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: i * 0.14,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold tracking-[-0.005em]">
              Riverline AI
            </span>
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="block h-[5px] w-[5px] rounded-full bg-[#5fd4b8]"
            />
          </div>
          <p className="mt-0.5 text-[11.5px] leading-[1.45] text-white/65">
            Refinancing your HDFC loan could save{" "}
            <span className="font-semibold text-white">₹38,400</span>.
          </p>
        </div>
      </div>

      <div
        className="relative flex items-stretch border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <AssistantAction
          label="Talk"
          onClick={() => onTalk("Should I refinance my HDFC loan?")}
        />
        <div className="w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <AssistantAction
          label="Chat"
          onClick={() => onChat("Show refinance options")}
        />
      </div>
    </div>
  );
}

function AssistantAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98, backgroundColor: "rgba(255,255,255,0.04)" }}
      className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] font-medium text-white/80"
    >
      {label}
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path
          d="M3 5.5h5M6 3l2.5 2.5L6 8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

// ─── 06 — Settings ─────────────────────────────────────────────────────────

function SettingsList({
  onAccount,
  onNotifications,
  onSupport,
  onLegal,
  onSignOut,
}: {
  onAccount: () => void;
  onNotifications: () => void;
  onSupport: () => void;
  onLegal: () => void;
  onSignOut: () => void;
}) {
  const rows = [
    {
      label: "Account",
      sub: "Phone, email, KYC",
      icon: <IconAccount />,
      onClick: onAccount,
    },
    {
      label: "Notifications",
      sub: "EMI alerts, AI nudges",
      icon: <IconBell />,
      onClick: onNotifications,
    },
    {
      label: "Support",
      sub: "Chat with a real person",
      icon: <IconSupport />,
      onClick: onSupport,
    },
    {
      label: "Legal",
      sub: "Terms · Privacy · RBI disclosures",
      icon: <IconLegal />,
      onClick: onLegal,
    },
    {
      label: "Sign out",
      sub: "End session on this device",
      icon: <IconLogout />,
      onClick: onSignOut,
      tone: "danger" as const,
    },
  ];

  return (
    <div
      className="overflow-hidden rounded-[18px] bg-white"
      style={{ boxShadow: softShadow("card") }}
    >
      {rows.map((row, i) => (
        <motion.button
          key={row.label}
          type="button"
          onClick={row.onClick}
          whileTap={{ scale: 0.998, backgroundColor: "rgba(12,14,20,0.02)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: SOFT_EASE, delay: 0.04 + i * 0.04 }}
          className={
            "flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-riverline-card/40 " +
            (i > 0 ? "border-t border-riverline-line/60" : "")
          }
        >
          <div
            className={
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] " +
              (row.tone === "danger"
                ? "bg-red-50 text-riverline-danger"
                : "bg-riverline-card text-riverline-ink-2")
            }
          >
            {row.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={
                "text-[13px] font-semibold tracking-[-0.005em] " +
                (row.tone === "danger"
                  ? "text-riverline-danger"
                  : "text-riverline-ink")
              }
            >
              {row.label}
            </div>
            <div className="mt-0.5 text-[11.5px] text-riverline-mute">
              {row.sub}
            </div>
          </div>
          <svg
            width="13"
            height="13"
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
        </motion.button>
      ))}
    </div>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

const stroke = { stroke: "currentColor", strokeWidth: 1.4 } as const;

function IconPan() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3.5" width="12" height="9" rx="1.4" {...stroke} />
      <circle cx="6" cy="7.5" r="1.5" {...stroke} />
      <path d="M9.5 7 H12 M9.5 9.5 H11.5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconAadhaar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3.5" width="12" height="9" rx="1.4" {...stroke} />
      <path d="M5 6.5 H8 M5 8.5 H10 M5 10.5 H7" {...stroke} strokeLinecap="round" />
      <circle cx="11.5" cy="7.5" r="1.5" {...stroke} />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3.5" y="7" width="9" height="7" rx="1.4" {...stroke} />
      <path d="M5.5 7 V5 a2.5 2.5 0 0 1 5 0 V7" {...stroke} />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5 L13.5 4 V8 C13.5 11 11 13.5 8 14.5 C 5 13.5 2.5 11 2.5 8 V4 Z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8 L7.5 10 L10.5 6.5"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconKey() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="11" r="3" {...stroke} />
      <path d="M7 9 L13.5 2.5 M11 5 L13 7" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconAccount() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="3" {...stroke} />
      <path
        d="M2 14 C 3 11 5.5 9.5 8 9.5 C 10.5 9.5 13 11 14 14"
        {...stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 10 V7 a4 4 0 0 1 8 0 V10 L13.5 12 H2.5 Z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path d="M6.5 13 a1.5 1.5 0 0 0 3 0" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconSupport() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 11 V6 a2 2 0 0 1 2-2 H11 a2 2 0 0 1 2 2 V11 a2 2 0 0 1-2 2 H6 L3 14.5 Z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path d="M6 7.5 H10 M6 9.5 H8.5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconLegal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 2.5 H10.5 L12.5 4.5 V13.5 H3.5 Z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path
        d="M5.5 6.5 H10.5 M5.5 8.5 H10.5 M5.5 10.5 H8.5"
        {...stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M9 2.5 H4 a1.5 1.5 0 0 0-1.5 1.5 V12 a1.5 1.5 0 0 0 1.5 1.5 H9"
        {...stroke}
        strokeLinecap="round"
      />
      <path
        d="M11 5 L14 8 L11 11 M6 8 H14"
        {...stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
