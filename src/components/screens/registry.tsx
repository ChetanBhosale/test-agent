"use client";

import type { ComponentType } from "react";
import type { ScreenId } from "@/lib/screens";
import { BlankScreen } from "./blank-screen";
import { SplashScreen } from "./onboarding/splash";
import { WelcomeScreen } from "./onboarding/welcome";
import { PhoneScreen } from "./onboarding/phone";
import { OtpScreen } from "./onboarding/otp";
import { TrustScreen } from "./onboarding/trust";
import { PanScreen } from "./onboarding/pan";
import { AadhaarScreen } from "./onboarding/aadhaar";
import { CibilFetchScreen } from "./onboarding/cibil-fetch";
import { SecurityScreen } from "./onboarding/security";
import { WorkspaceScreen } from "./onboarding/workspace";
import { HomeScreen } from "../home/home-screen";
import { ProfileScreen } from "../profile/profile-screen";
import { CreditScreen } from "../credit/credit-screen";
import { LoansScreen } from "../loans/loans-screen";

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
  trust: TrustScreen,
  pan: PanScreen,
  aadhaar: AadhaarScreen,
  "cibil-fetch": CibilFetchScreen,
  security: SecurityScreen,
  workspace: WorkspaceScreen,

  // Core app
  home: HomeScreen,
  credit: CreditScreen,
  loans: LoansScreen,
  ai: HomeScreen,
  profile: ProfileScreen,
  notifications: BlankScreen,
  settings: BlankScreen,
};
