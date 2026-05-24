"use client";

import { IPhoneFrame } from "@/components/iphone-frame";
import { AppRouter } from "@/components/app-router";
import { SwipeNavigator } from "@/components/swipe-navigator";
import { useApp } from "@/context/app-context";

/**
 * Connects the iPhone device frame to the app context, plus enables
 * iOS-style edge-swipe navigation across screens.
 */
export function PhoneShell() {
  const { statusBarTint } = useApp();

  return (
    <IPhoneFrame statusBarTint={statusBarTint}>
      <SwipeNavigator>
        <AppRouter />
      </SwipeNavigator>
    </IPhoneFrame>
  );
}
