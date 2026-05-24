"use client";

import type { ComponentType } from "react";
import type { ScreenId } from "@/lib/screens";
import { BlankScreen } from "./blank-screen";
import { SplashScreen } from "./onboarding/splash";
import { WelcomeScreen } from "./onboarding/welcome";
import { PhoneScreen } from "./onboarding/phone";
import { OtpScreen } from "./onboarding/otp";
import { PanScreen } from "./onboarding/pan";
import { AadhaarScreen } from "./onboarding/aadhaar";
import { CibilFetchScreen } from "./onboarding/cibil-fetch";

/**
 * Maps every ScreenId to a React component.
 * Add new screens by importing them and registering here.
 *
 * Until a screen is built, it falls through to <BlankScreen />.
 */
export const SCREEN_REGISTRY: Record<ScreenId, ComponentType> = {
  // Onboarding
  splash: SplashScreen,
  welcome: WelcomeScreen,
  phone: PhoneScreen,
  otp: OtpScreen,
  pan: PanScreen,
  aadhaar: AadhaarScreen,
  "cibil-fetch": CibilFetchScreen,

  // Core app — placeholders for now
  home: BlankScreen,
  credit: BlankScreen,
  loans: BlankScreen,
  ai: BlankScreen,
  profile: BlankScreen,
  notifications: BlankScreen,
  settings: BlankScreen,
};
