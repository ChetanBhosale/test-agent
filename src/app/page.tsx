import { AppProvider } from "@/context/app-context";
import { PhoneShell } from "@/components/phone-shell";
import { DevPanel } from "@/components/dev/dev-panel";

export default function Home() {
  return (
    <main className="page-surface relative flex min-h-svh flex-1 items-center justify-center overflow-hidden px-[max(16px,env(safe-area-inset-left))] py-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
      {/* Calm warm-ivory ambient — single layer, no neon, no purple */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,251,240,0.6) 0%, transparent 65%)",
        }}
      />

      {/* Subtle vignette focuses the device without darkening corners harshly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(28, 22, 12, 0.06) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <AppProvider initialScreen="splash">
          <PhoneShell />
          <DevPanel />
        </AppProvider>
      </div>
    </main>
  );
}
