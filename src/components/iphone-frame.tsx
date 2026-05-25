"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";

type IPhoneFrameProps = {
  children: ReactNode;
  /** When true, scales the device to fit the viewport */
  fitToViewport?: boolean;
  /**
   * Status bar tint. "light" = white icons (for dark screens),
   * "dark" = black icons (for light screens).
   */
  statusBarTint?: "light" | "dark";
};

const DEVICE_W = 390;
const DEVICE_H = 844;

function StatusBar({ tint = "light" }: { tint?: "light" | "dark" }) {
  const color = tint === "dark" ? "black" : "white";
  const textColor = tint === "dark" ? "text-black" : "text-white";
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-[60] flex h-[54px] items-center justify-between px-7 ${textColor}`}
    >
      <span className="text-[15px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="0.7" fill={color} />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.7" fill={color} />
          <rect x="9" y="3" width="3" height="9" rx="0.7" fill={color} />
          <rect x="13.5" y="0" width="3" height="12" rx="0.7" fill={color} />
        </svg>
        {/* Wi-Fi */}
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
          <path
            d="M8 3C10 3 11.8 3.8 13.2 5.1L14.2 4C12.5 2.4 10.4 1.4 8 1.4C5.6 1.4 3.5 2.4 1.8 4L2.8 5.1C4.2 3.8 6 3 8 3Z"
            fill={color}
          />
          <path
            d="M8 6.5C9.2 6.5 10.3 7 11.1 7.7L12.1 6.6C11 5.6 9.6 5 8 5C6.4 5 5 5.6 3.9 6.6L4.9 7.7C5.7 7 6.8 6.5 8 6.5Z"
            fill={color}
          />
          <circle cx="8" cy="10" r="1.4" fill={color} />
        </svg>
        {/* Battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3"
            stroke={color}
            strokeOpacity="0.4"
            fill="none"
          />
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill={color} />
          <path
            d="M24 4v4c0.7-0.3 1.2-1 1.2-2s-0.5-1.7-1.2-2z"
            fill={color}
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}

export function IPhoneFrame({
  children,
  fitToViewport = true,
  statusBarTint = "light",
}: IPhoneFrameProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!fitToViewport) return;
    const fit = () => {
      // Tighter padding on small screens so the device fills the viewport
      const isCompact = window.innerWidth < 480;
      const padX = isCompact ? 12 : 64;
      const padY = isCompact ? 12 : 64;
      const sH = (window.innerHeight - padY) / DEVICE_H;
      const sW = (window.innerWidth - padX) / DEVICE_W;
      setScale(Math.min(1, sH, sW));
    };
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, [fitToViewport]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      }}
      className="relative flex flex-col items-center"
      style={{
        width: DEVICE_W * scale,
        height: DEVICE_H * scale,
      }}
    >
      <div
        className="relative shrink-0 overflow-hidden bg-black"
        style={{
          width: DEVICE_W,
          height: DEVICE_H,
          borderRadius: 56,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          boxShadow: [
            "0 100px 180px -40px rgba(10, 14, 26, 0.22)",
            "0 50px 90px -25px rgba(10, 14, 26, 0.15)",
            "0 0 0 1px rgba(10, 14, 26, 0.08)",
            "inset 0 0 0 2px rgba(255,255,255,0.05)",
          ].join(", "),
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 top-[11px] z-[80] -translate-x-1/2 bg-black"
          style={{ width: 126, height: 37, borderRadius: 24 }}
          aria-hidden
        />

        <StatusBar tint={statusBarTint} />

        {/* Inner screen content */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: 50 }}
        >
          {children}
        </div>

        {/* Home indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[100] flex justify-center">
          <div
            className={
              statusBarTint === "dark" ? "bg-black/30" : "bg-white/55"
            }
            style={{ width: 134, height: 5, borderRadius: 100 }}
            aria-hidden
          />
        </div>
      </div>
    </motion.div>
  );
}
