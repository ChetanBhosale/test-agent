/**
 * Single source of truth for every screen in the prototype.
 *
 * To add a new screen:
 *  1. Add an entry to `SCREEN_IDS`.
 *  2. Optionally extend `SCREEN_META` with display info.
 *  3. Register the component in `src/components/screens/registry.tsx`.
 */

export const SCREEN_IDS = [
  // Onboarding flow
  "splash",
  "welcome",
  "phone",
  "otp",
  "trust",
  "pan",
  "aadhaar",
  "cibil-fetch",
  "security",
  "workspace",

  // Core app (post-onboarding)
  "home",
  "credit",
  "loans",
  "ai",
  "profile",
  "notifications",
  "settings",
] as const;

export type ScreenId = (typeof SCREEN_IDS)[number];

export type ScreenMeta = {
  /** Human-readable label, used in nav, debug, etc. */
  label: string;
  /** Status bar tint — "light" for dark screens, "dark" for light screens. */
  tint: "light" | "dark";
  /** Whether this screen appears in the bottom tab bar. */
  isTab?: boolean;
};

export const SCREEN_META: Record<ScreenId, ScreenMeta> = {
  // Onboarding
  splash: { label: "Splash", tint: "dark" },
  welcome: { label: "Welcome", tint: "dark" },
  phone: { label: "Phone", tint: "dark" },
  otp: { label: "OTP", tint: "dark" },
  trust: { label: "Trust & Consent", tint: "dark" },
  pan: { label: "PAN", tint: "dark" },
  aadhaar: { label: "Aadhaar", tint: "dark" },
  "cibil-fetch": { label: "Fetching CIBIL", tint: "dark" },
  security: { label: "Security Setup", tint: "dark" },
  workspace: { label: "Workspace", tint: "dark" },

  // Core app
  home: { label: "Home", tint: "dark", isTab: true },
  credit: { label: "Credit", tint: "dark", isTab: true },
  loans: { label: "Loans", tint: "dark", isTab: true },
  ai: { label: "AI", tint: "dark", isTab: true },
  profile: { label: "Profile", tint: "dark", isTab: true },
  notifications: { label: "Notifications", tint: "dark" },
  settings: { label: "Settings", tint: "dark" },
};

export const TAB_SCREENS: ScreenId[] = SCREEN_IDS.filter(
  (id) => SCREEN_META[id].isTab,
);

export const isTabScreen = (id: ScreenId) => Boolean(SCREEN_META[id].isTab);

/** Ordered list of screens that make up the onboarding flow. */
export const ONBOARDING_FLOW: ScreenId[] = [
  "splash",
  "welcome",
  "phone",
  "otp",
  "trust",
  "pan",
  "aadhaar",
  "cibil-fetch",
  "security",
  "workspace",
  "home",
];
