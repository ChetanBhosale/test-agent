"use client";

import { useState } from "react";

/**
 * Premium fintech profile avatar.
 *
 * - Loads the real photo from `/public/profile.jpg` by default
 * - Smart face crop via `objectPosition` and a slight zoom (CSS scale) so the
 *   face fills the frame without any awkward background empty space
 * - Subtle 1px neutral border + soft 2-layer matte shadow (Apple Wallet feel)
 * - Falls back to a neutral iOS-contacts-style silhouette only if the image
 *   is missing — never a placeholder initial circle
 *
 * To use the real user portrait: drop the uploaded image at
 * `public/profile.jpg`. It will render automatically with the right crop.
 */
export function Avatar({
  name,
  size = 36,
  src = "/profile.jpg",
  className,
  /** 0..1 — how tightly to zoom toward the face. 0 = full image, 0.2 = +20% scale */
  zoom = 0.18,
  /** "x% y%" — where the face sits in the frame */
  focal = "50% 30%",
}: {
  name: string;
  size?: number;
  src?: string | null;
  className?: string;
  zoom?: number;
  focal?: string;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;

  return (
    <div
      role="img"
      aria-label={name}
      className={
        "relative shrink-0 overflow-hidden rounded-full bg-riverline-card " +
        (className ?? "")
      }
      style={{
        width: size,
        height: size,
        // Subtle elevation — no thick rings, just clean depth
        boxShadow: [
          "inset 0 0 0 1px rgba(255,255,255,0.55)",
          "0 0 0 1px rgba(12,14,20,0.07)",
          "0 1px 2px rgba(12,14,20,0.06)",
          "0 4px 12px -4px rgba(12,14,20,0.12)",
        ].join(", "),
      }}
    >
      {showImage ? (
        // Raw <img> is intentional here: we use onError to fall back to the
        // SVG silhouette when /profile.jpg is missing — next/image throws on
        // 404 instead of letting onError run.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading="eager"
          decoding="async"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
          /* Smart crop: bias upward to faces, with a tiny zoom for tighter
             framing so background blur doesn't dominate the small avatar */
          style={{
            objectPosition: focal,
            transform: `scale(${1 + zoom})`,
            transformOrigin: focal,
          }}
        />
      ) : (
        <Silhouette />
      )}
    </div>
  );
}

/**
 * Neutral iOS-contacts-style silhouette.
 * Shown only when no photo is available — feels like a default avatar,
 * not a placeholder initial.
 */
function Silhouette() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="avatarBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f1e8" />
          <stop offset="100%" stopColor="#e8e3d4" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" fill="url(#avatarBg)" />
      <circle cx="18" cy="14.5" r="5" fill="#9aa0b0" fillOpacity="0.5" />
      <path
        d="M6 32 C8 25 12 22 18 22 C24 22 28 25 30 32 Z"
        fill="#9aa0b0"
        fillOpacity="0.5"
      />
    </svg>
  );
}
