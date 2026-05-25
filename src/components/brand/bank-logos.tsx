"use client";

import { type CSSProperties, type ReactNode } from "react";

/**
 * Bank brand chips for Riverline.
 *
 * Only verified, accurately-recreated marks ship here. We deliberately
 * removed ICICI and Bajaj because their proper marks (the tilted-i and the
 * stylized "B") are difficult to reproduce at 32–36px without distortion.
 * Using fewer correct logos beats showing many poorly-implemented ones.
 *
 * Each mark sits inside a soft white tile so the brand color reads cleanly
 * against the matte fintech surface (Stable / CRED pattern).
 */

// ─── Brand marks ───────────────────────────────────────────────────────────

function HdfcMark({ size = 24 }: { size?: number }) {
  // Four red right-angle brackets framing a blue center square.
  // HDFC red #ED232A, blue #0E4D9A.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 3 H10 V6 H6 V10 H3 Z" fill="#ED232A" />
      <path d="M14 3 H21 V10 H18 V6 H14 Z" fill="#ED232A" />
      <path d="M3 14 H6 V18 H10 V21 H3 Z" fill="#ED232A" />
      <path d="M18 14 H21 V21 H14 V18 H18 Z" fill="#ED232A" />
      <rect x="9.5" y="9.5" width="5" height="5" fill="#0E4D9A" />
    </svg>
  );
}

function AxisMark({ size = 24 }: { size?: number }) {
  // Axis Bank "A" mark — official two-piece geometric letterform.
  //
  // - Left blade:   sharp apex at top, widens straight down to bottom-left,
  //                 with the inner edge defining the right side of the stroke
  // - Right foot:   slanted parallelogram forming the foot/crossbar
  //
  // Coordinates are mapped from the official asset (1024×862) into a
  // 100×100 viewBox with vertical padding so the logo's natural aspect
  // ratio is preserved when rendered into a square chip.
  //
  // Color: official Axis burgundy #97144D.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      {/* Left blade — apex, bottom-inner edge, bottom-outer corner */}
      <path d="M48 9 L32 91 L12 91 Z" fill="#97144D" />
      {/* Right foot — slanted parallelogram */}
      <path d="M56 59 L74 59 L89 91 L72 91 Z" fill="#97144D" />
    </svg>
  );
}

function SbiMark({ size = 24 }: { size?: number }) {
  // SBI keyhole — solid blue circle with a black keyhole cutout.
  // SBI blue #22409A.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#22409A" />
      <circle cx="12" cy="12" r="2.2" fill="#0a0a0a" />
      <rect x="11.4" y="13.2" width="1.2" height="8" fill="#0a0a0a" />
    </svg>
  );
}

// ─── Brand registry ────────────────────────────────────────────────────────

type BankBrand = {
  label: string;
  Mark: (props: { size?: number }) => ReactNode;
};

const BRANDS = {
  hdfc: { label: "HDFC Bank", Mark: HdfcMark },
  axis: { label: "Axis Bank", Mark: AxisMark },
  sbi: { label: "State Bank of India", Mark: SbiMark },
} as const satisfies Record<string, BankBrand>;

export type BankId = keyof typeof BRANDS;

// ─── Chip component ────────────────────────────────────────────────────────

export function BankChip({
  bank,
  size = 36,
  className,
  style,
}: {
  bank: BankId;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const b = BRANDS[bank];
  const markSize = Math.round(size * 0.6);

  return (
    <div
      className={
        "relative shrink-0 overflow-hidden rounded-[10px] bg-white " +
        (className ?? "")
      }
      role="img"
      aria-label={b.label}
      style={{
        width: size,
        height: size,
        boxShadow: [
          "inset 0 0 0 1px rgba(12,14,20,0.05)",
          "inset 0 1px 0 rgba(255,255,255,0.9)",
          "0 1px 1px rgba(12,14,20,0.04)",
          "0 2px 6px -2px rgba(12,14,20,0.06)",
        ].join(", "),
        ...style,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <b.Mark size={markSize} />
      </div>
    </div>
  );
}

export function getBankLabel(bank: BankId) {
  return BRANDS[bank].label;
}
