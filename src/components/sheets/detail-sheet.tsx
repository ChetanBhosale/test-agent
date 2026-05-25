"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { ease, spring } from "@/components/shared/motion-system";

/**
 * Riverline detail sheet — the shared contextual expansion surface.
 *
 * Opens from the bottom with a calm spring. Used for "Details", "Plan it",
 * loan-card and EMI-card detail expansions. Each consumer renders its own
 * content; the shell handles backdrop, spring physics, drag-to-dismiss,
 * Esc, and visual continuity (drag handle + scrollable interior + bottom
 * fade for action bars).
 *
 * Why this pattern (instead of routing to a new screen):
 *   • Preserves spatial continuity — the user never "leaves" home
 *   • Keeps focus — backdrop blur fades the rest of the OS
 *   • Faster — no route mount, no transition flash
 *   • Dismissible by drag, backdrop tap, or Esc
 */
export function DetailSheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  height = "82%",
}: {
  open: boolean;
  onClose: () => void;
  /** Compact serif title shown at the top of the sheet header */
  title: string;
  /** Tracked uppercase label above the title */
  eyebrow?: string;
  children: ReactNode;
  /** Optional sticky action bar pinned to the bottom */
  footer?: ReactNode;
  /** Sheet height (CSS value). Defaults to 82% of the device. */
  height?: string;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: ease.soft }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-riverline-ink/35 backdrop-blur-[3px]"
            aria-hidden
          />

          <motion.div
            key="sheet"
            role="dialog"
            aria-modal
            aria-label={title}
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.32 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
            initial={{ y: "100%", scale: 0.98, opacity: 0.6 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: "100%", scale: 0.98, opacity: 0.4 }}
            transition={spring.sheet}
            className="absolute inset-x-0 bottom-0 z-50 flex flex-col overflow-hidden rounded-t-[24px] bg-riverline-bg"
            style={{
              height,
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.95)",
                "0 -1px 0 rgba(12,14,20,0.06)",
                "0 -8px 24px -8px rgba(12,14,20,0.18)",
                "0 -28px 64px -16px rgba(12,14,20,0.24)",
              ].join(", "),
            }}
          >
            {/* Drag handle */}
            <div className="flex shrink-0 justify-center pt-2 pb-1.5">
              <div className="h-[5px] w-[40px] rounded-full bg-riverline-ink/15" />
            </div>

            {/* Header */}
            <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-2 pb-3">
              <div className="min-w-0 flex-1">
                {eyebrow && (
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-riverline-mute">
                    {eyebrow}
                  </div>
                )}
                <h2 className="mt-1 font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-riverline-mute hover:bg-riverline-card hover:text-riverline-ink"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2.5 2.5l6 6m0-6l-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="no-scroll flex-1 overflow-y-auto">{children}</div>

            {/* Optional footer */}
            {footer && (
              <div
                className="relative shrink-0 px-4 pt-3 pb-4"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(251,250,246,0) 0%, rgba(251,250,246,0.95) 30%, rgba(251,250,246,1) 100%)",
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
