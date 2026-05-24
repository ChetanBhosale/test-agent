import { AppProvider } from "@/context/app-context";
import { PhoneShell } from "@/components/phone-shell";
import { WaveBackground } from "@/components/wave-background";

export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-[var(--page-bg)]">
      <WaveBackground />

      <div className="relative z-10 flex flex-col items-center">
        <AppProvider initialScreen="splash">
          <PhoneShell />
        </AppProvider>
      </div>
    </main>
  );
}
