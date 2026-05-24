# Riverline — Product Brief

## What Riverline actually is

Riverline (Pointfront Technologies Pvt. Ltd., founded 2024 by Ankit Sanghvi,
Jayanth Krishnaprakash, Abhishek Gupta — IIT Madras / CMU, backed by South Park
Commons) is a **full-stack AI debt collection agency**. Today they sell B2B to
banks and NBFCs:

- AI **voice agents** that call borrowers
- AI **WhatsApp / email agents** that nudge and resolve
- A unified collections funnel + analytics for lenders
- Already managing 200+ Cr in debt recovery for digital lenders (e.g., slice)

Their long-term thesis (from their public manifesto): replace collections call
centers with AI agents → own and resolve loan books → identify a unique credit
segment → eventually launch a bank with lower interest rates.

Tag-line: _"Goal is to make credit-line flow smoothly like a River. River-line."_

## What we're building

A **B2C consumer app** — Riverline expanding from B2B collections into directly
owning the borrower relationship. AI-powered loan & credit-health app that
connects borrowers to banking partners.

### Core features

1. **Onboarding & KYC** — PAN, Aadhaar, identity storage, CIBIL fetch on signup
2. **Loan marketplace** — personalized loan offers from banking/NBFC partners
3. **Credit health & CIBIL improvement** — track score, AI tips, learning
4. **Repayment management** — EMI reminders, multi-loan tracking, AI voice agent
   on missed payments (their core product, embedded in the app)
5. **AI Financial Counsellor** — chat / voice (Hindi, Kannada, Tamil, etc.)

### Mental model

CRED (loans + repayment) × OneScore (CIBIL + marketplace) + Riverline's voice
counsellor as the differentiator.

---

## Brand & Design Direction

### Brand voice
Trustworthy, calm, professional. River metaphor = smooth flow, patient, never
tired. AI that **listens** rather than pressures.

### Color palette
Sourced from riverline.ai (purple accent on white base, "🟣" in their own
copy) and the river/credit-flow metaphor.

| Token             | Hex       | Use                                             |
| ----------------- | --------- | ----------------------------------------------- |
| `riverline-bg`    | `#FFFFFF` | App background                                  |
| `riverline-ink`   | `#0B1020` | Primary headings (deep navy, not pure black)    |
| `riverline-ink-2` | `#1F2540` | Body copy                                       |
| `riverline-mute`  | `#6B7185` | Secondary text                                  |
| `riverline-line`  | `#E7E9F2` | Hairlines, dividers                             |
| `riverline-card`  | `#F6F7FB` | Soft section background                         |
| `riverline-primary`| `#5B2FE0`| **Primary brand purple** — CTAs, focus, accents |
| `riverline-primary-soft` | `#7B5CF0` | Hover / secondary                       |
| `riverline-river` | `#1B6FE6` | Trust / data viz blue                           |
| `riverline-river-soft` | `#E6F0FF` | Tinted backgrounds                         |
| `riverline-flow`  | `#2FA890` | Positive money / success                        |
| `riverline-warn`  | `#E89B2B` | Warnings (missed EMIs etc.)                     |
| `riverline-danger`| `#E15643` | Errors                                          |

### Typography
- Inter for the whole UI (already loaded). Bold for numbers / scores, regular
  for body. Optional: Instrument Serif for emotive headlines (we already have
  it from v1).

### UI rules
- White base, lots of breathing room.
- Card-based layout, **r-16 to r-24**, shadow-soft, no harsh borders.
- Numbers tabular and large.
- Primary CTA = purple pill, secondary = ghost.
- No gradients on text. Subtle "river" gradients only on accent surfaces.

---

## Onboarding Flow (v1 spec)

This is the flow we are implementing now in the prototype.

```
Splash
  ↓
Welcome (intro carousel — 3 slides)
  ↓
Phone login (enter mobile)
  ↓
OTP (6-digit verify)
  ↓
KYC: PAN
  ↓
KYC: Aadhaar
  ↓
Fetching CIBIL (animated wait state)
  ↓
Onboarding done — push to Home
```

### Per-screen details

1. **Splash** — Riverline mark, brief tag-line, auto-advance.
2. **Welcome carousel** — 3 slides
   - "Loans that flow"
   - "Your CIBIL, always in view"
   - "An AI counsellor on call, 24/7"
   - CTA: _Get started_
3. **Phone login** — `+91` input, _Continue_ button, T&Cs link.
4. **OTP** — 6 boxes, resend timer (30s), auto-submit on full input.
5. **PAN** — single input, validates `[A-Z]{5}[0-9]{4}[A-Z]{1}` shape.
6. **Aadhaar** — last-4-digit entry → simulated OTP/consent screen.
7. **Fetching CIBIL** — loading state with copy: _"Pulling your credit
   profile from the bureau."_ Auto-advance to home in ~2.5 s.
8. **Home** — landed (out of scope for this milestone, render
   `<BlankScreen />` for now).

All onboarding screens use light tint, white background, deep-navy ink,
purple primary CTA.
