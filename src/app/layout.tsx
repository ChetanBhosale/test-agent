import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://riverline-app.vercel.app"),
  title: {
    default: "Riverline — Credit that flows",
    template: "%s · Riverline",
  },
  description:
    "AI-powered loans, credit health, and a counsellor that listens. Built for borrowers who want clarity.",
  applicationName: "Riverline",
  keywords: [
    "Riverline",
    "AI fintech",
    "credit health",
    "personal loan",
    "CIBIL",
    "refinance",
    "AI copilot",
  ],
  authors: [{ name: "Riverline" }],
  openGraph: {
    title: "Riverline — Credit that flows",
    description:
      "AI-powered loans, credit health, and a counsellor that listens.",
    url: "/",
    siteName: "Riverline",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riverline — Credit that flows",
    description:
      "AI-powered loans, credit health, and a counsellor that listens.",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ece6d8" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e14" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--page-bg)] font-sans text-riverline-ink">
        {children}
      </body>
    </html>
  );
}
