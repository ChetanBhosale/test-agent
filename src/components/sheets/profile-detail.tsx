"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

// Shared shadow tokens — match the rest of the profile screen surfaces
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

// ─── Account ──────────────────────────────────────────────────────────────

export function AccountDetail({ name }: { name: string }) {
  return (
    <div className="px-5 pb-6">
      <Subhead num="01" title="Personal" />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        <Row label="Full name" value={name} />
        <Divider />
        <Row label="Phone" value="+91 98765 43210" verified />
        <Divider />
        <Row label="Email" value="shubham@riverline.app" verified />
      </div>

      <Subhead num="02" title="Identity" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        <Row label="PAN" value="ABCDE1234F" verified />
        <Divider />
        <Row label="Aadhaar" value="•••• •••• 1234" verified />
        <Divider />
        <Row label="KYC status" value="Complete" tone="ok" />
      </div>

      <Subhead num="03" title="Linked accounts" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        <Row label="Primary bank" value="HDFC · ••5421" verified />
        <Divider />
        <Row label="Secondary bank" value="Axis · ••9874" />
        <Divider />
        <Row label="Cards on file" value="2 · HDFC, Axis" />
      </div>

      <p className="mt-5 text-[11px] leading-[1.55] text-riverline-mute-2">
        To update PAN or Aadhaar after KYC, contact support. Phone and email
        changes require re-verification.
      </p>
    </div>
  );
}

export function AccountFooter() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-riverline-line bg-white py-3 text-[12.5px] font-semibold text-riverline-ink-2 transition-colors hover:bg-riverline-card"
    >
      Manage profile photo
    </button>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────

const NOTIFICATION_GROUPS: Array<{
  title: string;
  items: Array<{ id: string; label: string; sub: string; defaultOn: boolean }>;
}> = [
  {
    title: "Money & EMIs",
    items: [
      {
        id: "emi-reminders",
        label: "EMI reminders",
        sub: "3 days, 1 day, and same-day alerts",
        defaultOn: true,
      },
      {
        id: "auto-pay",
        label: "Auto-pay confirmations",
        sub: "When debits succeed or fail",
        defaultOn: true,
      },
      {
        id: "refinance",
        label: "Refinance opportunities",
        sub: "When you qualify for better rates",
        defaultOn: true,
      },
    ],
  },
  {
    title: "AI insights",
    items: [
      {
        id: "weekly",
        label: "Weekly summaries",
        sub: "Sundays · 9 AM",
        defaultOn: true,
      },
      {
        id: "score",
        label: "Score updates",
        sub: "When your score moves by 5+ points",
        defaultOn: true,
      },
      {
        id: "nudges",
        label: "Daily nudges",
        sub: "Up to 1 per day, never spammy",
        defaultOn: false,
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        id: "fraud",
        label: "Suspicious activity",
        sub: "Always on for your protection",
        defaultOn: true,
      },
      {
        id: "login",
        label: "New device sign-ins",
        sub: "Email + push notification",
        defaultOn: true,
      },
    ],
  },
];

export function NotificationsDetail() {
  const [state, setState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NOTIFICATION_GROUPS.forEach((g) =>
      g.items.forEach((i) => (init[i.id] = i.defaultOn)),
    );
    return init;
  });

  const toggle = (id: string) => setState((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="px-5 pb-6">
      {NOTIFICATION_GROUPS.map((group, gi) => (
        <div key={group.title} className={gi > 0 ? "mt-6" : ""}>
          <Subhead num={String(gi + 1).padStart(2, "0")} title={group.title} />
          <div
            className="overflow-hidden rounded-[16px] bg-white"
            style={cardShadow()}
          >
            {group.items.map((item, i) => (
              <ToggleRow
                key={item.id}
                label={item.label}
                sub={item.sub}
                on={state[item.id]}
                onChange={() => toggle(item.id)}
                divider={i > 0}
                locked={item.id === "fraud"}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  sub,
  on,
  onChange,
  divider,
  locked,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange: () => void;
  divider?: boolean;
  locked?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center gap-3 px-4 py-3.5 " +
        (divider ? "border-t border-riverline-line/60" : "")
      }
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
            {label}
          </span>
          {locked && (
            <span className="rounded bg-riverline-card px-1 py-[1px] text-[9px] font-semibold uppercase tracking-[0.08em] text-riverline-mute-2">
              Always on
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11.5px] text-riverline-mute">{sub}</div>
      </div>
      <PremiumToggle on={on} onChange={onChange} disabled={locked} />
    </div>
  );
}

function PremiumToggle({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onChange}
      className="relative h-[24px] w-[40px] shrink-0 rounded-full transition-colors disabled:opacity-50"
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
  );
}

// ─── Support ──────────────────────────────────────────────────────────────

const SUPPORT_FAQS = [
  {
    q: "How does Riverline pull my CIBIL score?",
    a: "We use a soft credit check via TransUnion CIBIL. It does not affect your score in any way and stays confidential.",
  },
  {
    q: "Are loan offers from Riverline directly?",
    a: "No. Riverline shows offers from RBI-regulated lending partners. We don't lend directly. We help you choose responsibly.",
  },
  {
    q: "Can I delete my account and data?",
    a: "Yes, anytime. Open Account → bottom of the page. We delete your data within 30 days as required by Indian regulations.",
  },
  {
    q: "How is my Aadhaar stored?",
    a: "We never store the full number — only a tokenized reference, encrypted at rest. Compliant with UIDAI guidelines.",
  },
];

export function SupportDetail() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const channels = [
    {
      id: "chat",
      label: "Live chat",
      sub: "Avg response · under 2 min",
      tone: "ok" as const,
      icon: <IconChat />,
    },
    {
      id: "advisor",
      label: "Talk to a financial advisor",
      sub: "Mon–Sat · 9 AM to 7 PM",
      icon: <IconPhone />,
    },
    {
      id: "callback",
      label: "Request a callback",
      sub: "We'll call within 30 minutes",
      icon: <IconCallback />,
    },
    {
      id: "rbi",
      label: "RBI grievance",
      sub: "Loan disputes & escalations",
      icon: <IconShield />,
    },
  ];

  return (
    <div className="px-5 pb-6">
      {/* Live status */}
      <div
        className="flex items-center gap-2.5 rounded-[14px] bg-riverline-flow-soft p-3.5"
      >
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="block h-[7px] w-[7px] rounded-full bg-riverline-flow"
          style={{ boxShadow: "0 0 0 4px rgba(31,138,118,0.15)" }}
        />
        <div className="flex-1">
          <div className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-flow">
            Support is online
          </div>
          <div className="text-[11px] text-riverline-flow/80">
            Avg response · under 2 minutes
          </div>
        </div>
      </div>

      <Subhead num="01" title="Reach us" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        {channels.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={
              "flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-riverline-card/40 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-riverline-card text-riverline-ink-2">
              {c.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                {c.label}
              </div>
              <div className="mt-0.5 text-[11.5px] text-riverline-mute">
                {c.sub}
              </div>
            </div>
            <Chevron />
          </button>
        ))}
      </div>

      <Subhead num="02" title="Common questions" mt />
      <div className="overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        {SUPPORT_FAQS.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div
              key={faq.q}
              className={i > 0 ? "border-t border-riverline-line/60" : ""}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
              >
                <span className="flex-1 text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
                  {faq.q}
                </span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: SOFT_EASE }}
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  className="mt-1 shrink-0 text-riverline-mute-2"
                >
                  <path
                    d="M2.5 4 L5.5 7 L8.5 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: SOFT_EASE }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-3.5 text-[12px] leading-[1.55] text-riverline-mute">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Legal ────────────────────────────────────────────────────────────────

const LEGAL_DOCS = [
  {
    title: "Terms of Service",
    sub: "What you agree to when using Riverline",
  },
  {
    title: "Privacy Policy",
    sub: "How we handle your financial data",
  },
  {
    title: "RBI Disclosures",
    sub: "Lending partner licenses & registrations",
  },
  {
    title: "NBFC Partner Information",
    sub: "Licensed lenders we work with",
  },
  {
    title: "Consent Management",
    sub: "Active permissions you've granted",
  },
  {
    title: "Data Usage Transparency",
    sub: "What we use, why, and for how long",
  },
];

export function LegalDetail() {
  const [search, setSearch] = useState("");
  const filtered = LEGAL_DOCS.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.sub.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="px-5 pb-6">
      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-[12px] bg-white px-3 py-2.5"
        style={tileShadow()}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle
            cx="5.5"
            cy="5.5"
            r="3.5"
            stroke="rgb(154,160,176)"
            strokeWidth="1.4"
          />
          <path
            d="M8.5 8.5 L11.5 11.5"
            stroke="rgb(154,160,176)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search legal documents…"
          className="flex-1 bg-transparent text-[13px] text-riverline-ink outline-none placeholder:text-riverline-mute-2"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-[16px] bg-white" style={cardShadow()}>
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center text-[12px] text-riverline-mute">
            No documents match &ldquo;{search}&rdquo;
          </div>
        )}
        {filtered.map((doc, i) => (
          <button
            key={doc.title}
            type="button"
            className={
              "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-riverline-card/40 " +
              (i > 0 ? "border-t border-riverline-line/60" : "")
            }
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-riverline-card text-riverline-ink-2">
              <IconDoc />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold tracking-[-0.005em] text-riverline-ink">
                {doc.title}
              </div>
              <div className="mt-0.5 text-[11.5px] text-riverline-mute">
                {doc.sub}
              </div>
            </div>
            <Chevron />
          </button>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-[1.55] text-riverline-mute-2">
        Riverline is a service that connects you with RBI-regulated lending
        partners. We do not lend directly. All disclosures are filed with
        regulatory authorities.
      </p>
    </div>
  );
}

// ─── Sign out confirm ─────────────────────────────────────────────────────

export function SignOutConfirm({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="px-5 pb-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-red-50">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M13 4.5 H6 a2 2 0 0 0-2 2 V15.5 a2 2 0 0 0 2 2 H13"
              stroke="rgb(196,73,58)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M16 7 L19 11 L16 15 M9 11 H19"
              stroke="rgb(196,73,58)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 font-serif text-[20px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
          Sign out of Riverline?
        </h3>
        <p className="mt-2 max-w-[280px] text-[12.5px] leading-[1.55] text-riverline-mute">
          You&rsquo;ll need to verify your phone number and Face ID the next
          time you sign in. Your financial data stays safe.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-[48px] w-full items-center justify-center rounded-[14px] bg-riverline-danger text-[13px] font-semibold text-white transition-opacity"
          style={{
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.08)",
              "0 1px 2px rgba(196,73,58,0.4)",
              "0 6px 14px -4px rgba(196,73,58,0.3)",
            ].join(", "),
          }}
        >
          Sign out
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[48px] w-full items-center justify-center rounded-[14px] border border-riverline-line bg-white text-[13px] font-semibold text-riverline-ink-2 transition-colors hover:bg-riverline-card"
        >
          Stay signed in
        </button>
      </div>
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

function Chevron() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      className="shrink-0 text-riverline-mute-2"
    >
      <path
        d="M3 6.5h5.5M6 4l2.5 2.5L6 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

const stroke = { stroke: "currentColor", strokeWidth: 1.4 } as const;

function IconChat() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.5 11 V5 a2 2 0 0 1 2-2 H11.5 a2 2 0 0 1 2 2 V11 a2 2 0 0 1-2 2 H6 L3 14.5 Z"
        {...stroke}
        strokeLinejoin="round"
      />
      <path d="M5.5 7.5 H10.5 M5.5 9.5 H8.5" {...stroke} strokeLinecap="round" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 3.5 L5.5 3.5 L7 6 L5.5 7.5 a8 8 0 0 0 3 3 L10 9 L12.5 10.5 V12.5 a1 1 0 0 1-1 1 C 7 13.5 2.5 9 2.5 4.5 a1 1 0 0 1 1-1 Z"
        {...stroke}
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconCallback() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5 a6.5 6.5 0 1 1-6.5 6.5"
        {...stroke}
        strokeLinecap="round"
      />
      <path d="M1.5 5 V8 H4.5" {...stroke} strokeLinecap="round" strokeLinejoin="round" />
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
function IconDoc() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 2.5 H10 L12.5 5 V13.5 H3.5 Z M10 2.5 V5 H12.5"
        {...stroke}
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8 H10.5 M5.5 10 H10.5 M5.5 12 H8.5"
        {...stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}
