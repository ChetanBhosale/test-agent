"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/app-context";
import type { ScreenId } from "@/lib/screens";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

const IS_DEV =
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

type Group = {
  label: string;
  items: Array<{ id: ScreenId; label: string; hint?: string }>;
};

const GROUPS: Group[] = [
  {
    label: "App",
    items: [
      { id: "home", label: "Home Dashboard", hint: "Hero · CIBIL · offers" },
      { id: "credit", label: "Credit" },
      { id: "loans", label: "Loans" },
      { id: "ai", label: "AI Advisor" },
      { id: "profile", label: "Profile" },
    ],
  },
  {
    label: "Onboarding",
    items: [
      { id: "splash", label: "Splash" },
      { id: "welcome", label: "Welcome" },
      { id: "phone", label: "Phone" },
      { id: "otp", label: "OTP" },
      { id: "trust", label: "Trust & Consent", hint: "Pre-KYC layer" },
      { id: "pan", label: "PAN" },
      { id: "aadhaar", label: "Aadhaar" },
      { id: "cibil-fetch", label: "CIBIL Fetch" },
      { id: "security", label: "Security Setup", hint: "Face ID" },
      { id: "workspace", label: "Workspace", hint: "Build dashboard" },
    ],
  },
];

const APP_SCREENS: ScreenId[] = [
  "home",
  "credit",
  "loans",
  "ai",
  "profile",
];

/**
 * Tiny floating dev shortcut. Only renders in non-production builds.
 *
 * - Click the chip → panel with quick navigation
 * - Click "Open Home Dashboard" → seeds a fake user and resets to home
 * - Listen for `riverline:open-dev` event so other parts of the UI (e.g. a
 *   long-press on the splash logo) can also open the panel
 */
export function DevPanel() {
  const { reset, navigate, screen, setUser } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!IS_DEV) return;
    const onOpen = () => setOpen(true);
    window.addEventListener("riverline:open-dev", onOpen);
    return () => window.removeEventListener("riverline:open-dev", onOpen);
  }, []);

  if (!IS_DEV) return null;

  const goTo = (id: ScreenId) => {
    // Seed a user so post-onboarding screens render correctly
    setUser({ name: "Shubham", initials: "S" });

    // Tab/app screens reset the stack; onboarding screens just navigate
    if (APP_SCREENS.includes(id)) reset(id);
    else navigate(id);

    setOpen(false);
  };

  return (
    <>
      {/* Floating launcher — sits in the page corner, outside the device frame */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Developer tools"
        aria-expanded={open}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 backdrop-blur-md transition-colors hover:bg-white"
        style={{
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.06), 0 8px 24px -10px rgba(0,0,0,0.18)",
          fontFeatureSettings: '"ss01", "tnum"',
        }}
      >
        <span
          className="block h-1.5 w-1.5 rounded-full bg-emerald-500"
          aria-hidden
        />
        <span className="tracking-[-0.005em]">Dev</span>
        <span className="text-zinc-400">·</span>
        <span className="font-mono text-[10px] text-zinc-500 normal-case">
          {screen}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-label="Developer quick navigation"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: SOFT_EASE }}
              className="fixed bottom-16 right-4 z-50 w-[280px] overflow-hidden rounded-[14px] border border-black/10 bg-white text-zinc-900"
              style={{
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.06), 0 24px 64px -16px rgba(0,0,0,0.24)",
                fontFeatureSettings: '"ss01", "cv11", "tnum"',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="block h-1.5 w-1.5 rounded-full bg-emerald-500"
                    aria-hidden
                  />
                  <span className="text-[11px] font-semibold tracking-[-0.005em] text-zinc-900">
                    Dev shortcut
                  </span>
                  <span className="rounded-sm bg-zinc-100 px-1 py-px text-[9.5px] font-mono uppercase tracking-wider text-zinc-500">
                    Local
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M2.5 2.5l6 6m0-6l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Primary: Skip to dashboard */}
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => goTo("home")}
                  className="group flex w-full items-center gap-2.5 rounded-[10px] bg-zinc-900 px-3 py-2.5 text-left text-white transition-colors hover:bg-zinc-800"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path
                        d="M2.5 6.5 L6.5 2.5 L10.5 6.5 V10.5 H2.5 Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold tracking-[-0.005em]">
                      Open Home Dashboard
                    </div>
                    <div className="text-[10.5px] text-white/55">
                      Skips KYC · seeds demo user
                    </div>
                  </div>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    className="text-white/60 transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 5.5h5M6 3l2.5 2.5L6 8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Quick navigation groups */}
              <div className="border-t border-zinc-100 p-2">
                {GROUPS.map((group) => (
                  <div key={group.label} className="mb-2 last:mb-0">
                    <div className="mb-1 px-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                      {group.label}
                    </div>
                    <div className="space-y-px">
                      {group.items.map((item) => {
                        const active = screen === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => goTo(item.id)}
                            aria-current={active}
                            className={
                              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12px] transition-colors " +
                              (active
                                ? "bg-zinc-100 text-zinc-900"
                                : "text-zinc-700 hover:bg-zinc-50")
                            }
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={
                                  "block h-1 w-1 rounded-full " +
                                  (active ? "bg-zinc-900" : "bg-zinc-300")
                                }
                                aria-hidden
                              />
                              <span className="font-medium tracking-[-0.005em]">
                                {item.label}
                              </span>
                              {item.hint && (
                                <span className="text-[10px] font-normal text-zinc-400">
                                  {item.hint}
                                </span>
                              )}
                            </span>
                            <span className="font-mono text-[9.5px] text-zinc-400">
                              {item.id}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-[10.5px] text-zinc-500">
                Long-press the splash logo to reopen this panel.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Inline subtle "Skip to Dashboard" link — for placing inside onboarding
 * screens during development. Renders nothing in production.
 */
export function DevSkipToDashboard({
  variant = "link",
}: {
  variant?: "link" | "chip";
}) {
  const { reset, setUser } = useApp();
  if (!IS_DEV) return null;

  const skip = () => {
    setUser({ name: "Shubham", initials: "S" });
    reset("home");
  };

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={skip}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-2.5 py-1 text-[10.5px] font-medium text-zinc-600 backdrop-blur-md transition-colors hover:bg-white hover:text-zinc-900"
        style={{
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <span
          className="block h-1 w-1 rounded-full bg-emerald-500"
          aria-hidden
        />
        Skip to Dashboard
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path
            d="M2 4.5h4.5M5 2.5l2 2-2 2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={skip}
      className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
    >
      <span
        className="mr-0.5 block h-1 w-1 rounded-full bg-emerald-500"
        aria-hidden
      />
      Skip to Dashboard
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path
          d="M2 4.5h4.5M5 2.5l2 2-2 2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
export function useDevLongPress() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!IS_DEV) {
    return {
      onPointerDown: undefined,
      onPointerUp: undefined,
      onPointerLeave: undefined,
      onPointerCancel: undefined,
    } as const;
  }

  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      window.dispatchEvent(new Event("riverline:open-dev"));
    }, 600);
  };
  const cancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  } as const;
}
