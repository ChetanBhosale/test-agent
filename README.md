# Riverline

Premium AI-native fintech experience — a credit health, loans, and AI
counsellor app that runs inside an iPhone frame on the web.

> _"Goal is to make credit-line flow smoothly like a River. River-line."_

Riverline is a B2C consumer prototype: an AI-powered loan and credit-health
app that connects borrowers to RBI-regulated banking partners. Editorial,
calm, and built at Apple-level quality.

---

## Live demo

- **Production:** _set after first Vercel deploy_
- **GitHub:** _set after first push_

---

## Features

### Onboarding (11 screens)

Splash → Welcome carousel → Phone → OTP → Trust & consent → PAN → Aadhaar →
CIBIL fetch → Security setup (Face ID) → Workspace assemble → Home.

Every screen uses the shared `screen-kit` and unified field system, with
strategic Riverline brand-purple accents on focus halos, OTP cells, KYC step
indicators, progress bars, and active stage spinners.

### Home dashboard

Pulse card with animated 682 → 742 score, ring, six-month chart, and AI
forecast. Smart actions carousel. Ask Copilot strip. Upcoming EMI timeline.
Pre-approved loan carousel (272 × 384 px equal-height cards). Health journey
ladder (Bronze → Diamond) with brand-purple progress. Daily intelligence.

### Credit

Editorial snapshot, annotated 6-month timeline with interactive scrubbing,
AI insight feed, behavior breakdown bars, active commitments, improvement
roadmap, personalized offers.

### Loans

Borrowing capacity arc with safe / careful / strain zones, curated
recommendations, affordability simulator with custom range slider, active
commitments, AI advisor (dark surface), refinance opportunity, financial
protection checklist.

### Profile

Identity hero with avatar, reputation panel with sparkline, insights feed,
trust panel with security score ring, AI assistant strip, and settings rows.

### Sheets

Drag-to-dismiss bottom sheets for credit detail (4 tabs), action plans,
loan offers, EMI detail, refinance workspace (7 sections including payoff
trajectory chart), profile detail (account, notifications, support, legal,
sign-out), and trust detail (PAN, Aadhaar, biometric, RBI, encryption).

### AI Copilot

Full-screen sheet with home, chat, and voice modes. Scripted responses with
thinking states, word-by-word reveal, and an animated waveform. Triggered
from the Ask Copilot strip on home, the center compass button on the tab bar,
or the AI assistant strip on profile.

### Microinteraction system

Centralized motion tokens (`SOFT_EASE = [0.4, 0, 0.2, 1]`, four spring
presets, six durations, four tap presets). Universal `<Tactile>` button
primitive. Vertical-stack page transitions instead of horizontal slides.

### Brand identity

Riverline blue-purple (`#4A33B8`) is the product's primary color — applied
to CTAs, active tabs, progress bars, chart highlights, AI glow, focused
inputs, sliders, and toggles. Emerald (`#1F8A76`) is reserved for success,
health, and positive repayment signals only.

---

## Tech stack

| Area              | Choice                                       |
| ----------------- | -------------------------------------------- |
| Framework         | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Runtime           | React 19                                     |
| Language          | TypeScript 5                                 |
| Styling           | Tailwind CSS 4 + custom `riverline-*` tokens |
| Animation         | [Motion](https://motion.dev) (Framer Motion's successor) |
| Fonts             | Inter (sans) + Instrument Serif (display) via `next/font` |
| Icons             | Hand-rolled inline SVG                       |
| Hosting           | [Vercel](https://vercel.com)                 |

Lean dependency footprint:

```text
clsx · motion · next · react · react-dom · tailwind-merge
```

---

## Run locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/<your-username>/riverline-app.git
cd riverline-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | What it does                                |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start dev server on port 3000               |
| `npm run build` | Build for production with Turbopack         |
| `npm run start` | Run the production build                    |
| `npm run lint`  | ESLint check (`--max-warnings=0` ready)     |

---

## Project structure

```text
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Metadata, viewport, fonts
│   ├── page.tsx               # Single page that renders the iPhone shell
│   └── globals.css            # Tailwind + Riverline tokens + slider styles
├── components/
│   ├── app-router.tsx         # In-app navigation between screens
│   ├── iphone-frame.tsx       # 390×844 device frame, auto-scaling
│   ├── phone-shell.tsx        # AppRouter + SwipeNavigator inside the frame
│   ├── swipe-navigator.tsx    # iOS-style edge-swipe navigation
│   ├── brand/                 # Logo, avatar, bank chips
│   ├── copilot/               # AI Copilot full-screen sheet
│   ├── credit/                # Credit screen
│   ├── dev/                   # Dev-only screen jumper (hidden in prod)
│   ├── home/                  # Home screen + tab bar
│   ├── loans/                 # Loans screen
│   ├── profile/               # Profile screen
│   ├── screens/onboarding/    # 11-step onboarding flow
│   ├── shared/                # screen-kit, field, typography, motion
│   └── sheets/                # Bottom sheets and detail panels
├── context/app-context.tsx    # Screen state, user state
└── lib/screens.ts             # ScreenId type + ordered screen list
```

---

## Design system

- **Editorial heading rhythm** — serif title + tracked uppercase eyebrow
- **Numbered eyebrows** `01–06` in mono font, `tracking-[0.1em]`
- **Card depth** only via `softShadow("hero" | "card" | "tile")`
- **Single ease curve** `[0.4, 0, 0.2, 1]` named `SOFT_EASE`
- **90% neutral / 10% accent** color ratio
- **Loan cards locked at 272 × 384 px**, equal-height with `mt-auto`
- **`text-wrap: balance`** on headings, `pretty` on body
- **Section header** uses `min-w-0 truncate` + `shrink-0` so CTAs never clip

---

## Environment variables

None required for the demo. If you fork and add API integrations, copy
`.env.example` to `.env.local`.

---

## Deployment

This project is configured for one-click Vercel deployment. See
[`DEPLOY.md`](./DEPLOY.md) for the full guide.

Quick path:

1. Push this repo to GitHub.
2. Open [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — keep all defaults and click **Deploy**.

---

## Screenshots

_Add device-frame screenshots of Splash, Home, Credit, Loans, Profile, and
Copilot sheets here. Recommended size: 1170 × 2532 (iPhone 15 Pro)._

---

## Credits

Inspired by Apple Wallet, Revolut Ultra, Arc Browser, and Notion AI
onboarding. Built as a design exploration of what an AI-native consumer
fintech experience could feel like in 2026.

---

## License

All rights reserved. Demo / portfolio use only.
