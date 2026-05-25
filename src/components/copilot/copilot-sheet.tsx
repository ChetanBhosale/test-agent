"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const SOFT_EASE = [0.4, 0, 0.2, 1] as const;

/**
 * Riverline Copilot — the intelligent, conversational heart of the app.
 *
 * A near-full-screen modal that opens from the center dock button and feels
 * alive. Three modes:
 *   • home   — greeting + proactive insights + suggested prompts
 *   • chat   — full conversation transcript with thinking states & cards
 *   • voice  — full-takeover voice UI with animated waveform
 *
 * Responses are scripted (keyword-matched) so the UI feels real even
 * without a backend LLM. Swap `getResponse()` for a real API later.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

type InsightDetail = { label: string; value: string };
type InsightCard = {
  id: string;
  tone: "ok" | "warn" | "info";
  title: string;
  body: string;
  details?: InsightDetail[];
  actions?: string[];
};

type UserMessage = { id: string; role: "user"; text: string };
type AIMessage = {
  id: string;
  role: "ai";
  text: string;
  cards?: InsightCard[];
};
type ThinkingMessage = {
  id: string;
  role: "thinking";
  steps: string[];
};
type Message = UserMessage | AIMessage | ThinkingMessage;

type Script = {
  thinking: string[];
  text: string;
  cards?: InsightCard[];
};

// ─── Response engine ───────────────────────────────────────────────────────
// Keyword-matched scripted responses. Each one includes a chain of
// thinking steps, the AI's reply, and optional rich insight cards.

function getResponse(prompt: string): Script {
  const p = prompt.toLowerCase();

  // Improve credit score
  if (
    (p.includes("improve") ||
      p.includes("increase") ||
      p.includes("higher") ||
      p.includes("boost")) &&
    (p.includes("score") || p.includes("cibil") || p.includes("credit"))
  ) {
    return {
      thinking: [
        "Analyzing your credit profile…",
        "Reviewing repayment behavior…",
        "Building improvement plan…",
      ],
      text:
        "Three quick wins, in order of impact. Reducing utilization to 30% adds ~12 points. Skipping new credit applications for 45 days adds 6 more. Your on-time streak keeps adding 1–2 monthly.",
      cards: [
        {
          id: "imp-util",
          tone: "ok",
          title: "Reduce utilization to 30%",
          body: "Bring your card balance under ₹18,000 before statement.",
          details: [
            { label: "Gain", value: "+12 pts" },
            { label: "Time", value: "~4 weeks" },
          ],
          actions: ["Set reminder", "Simulate"],
        },
        {
          id: "imp-inq",
          tone: "info",
          title: "Pause new applications",
          body: "Skip new loans or cards until mid-July.",
          details: [
            { label: "Gain", value: "+6 pts" },
            { label: "Time", value: "~6 weeks" },
          ],
          actions: ["Track"],
        },
      ],
    };
  }

  // Refinance / save interest
  if (
    p.includes("refinanc") ||
    (p.includes("save") &&
      (p.includes("interest") ||
        p.includes("emi") ||
        p.includes("rate"))) ||
    p.includes("lower interest")
  ) {
    return {
      thinking: [
        "Comparing refinance options…",
        "Calculating total savings…",
        "Checking approval probability…",
      ],
      text:
        "Switching your HDFC loan to 9.10% saves ₹38,400 in interest. EMI drops by ₹680/month and tenure shortens by 4 months. Approval probability is high based on your repayment history.",
      cards: [
        {
          id: "ref-hdfc",
          tone: "ok",
          title: "HDFC refinance · 9.10%",
          body: "Best long-term option for your profile.",
          details: [
            { label: "New EMI", value: "₹12,160/mo" },
            { label: "EMI saved", value: "₹680/mo" },
            { label: "Tenure", value: "20 mo (−4)" },
            { label: "Approval", value: "High" },
          ],
          actions: ["Compare", "Apply"],
        },
      ],
    };
  }

  // Affordability
  if (
    p.includes("afford") ||
    (p.includes("can i") &&
      (p.includes("loan") || p.includes("borrow") || p.includes("take"))) ||
    (p.includes("new") && (p.includes("loan") || p.includes("borrow")))
  ) {
    return {
      thinking: [
        "Checking affordability…",
        "Running stress simulation…",
        "Reviewing income against EMIs…",
      ],
      text:
        "Based on ₹95,000 monthly income and ₹16,050 in current EMIs, you have comfortable room for about ₹12,400 more — roughly a ₹4L loan over 36 months. Beyond ₹6L starts pressuring your safe range.",
      cards: [
        {
          id: "aff-safe",
          tone: "ok",
          title: "Comfortable · ₹4L",
          body: "Stays within healthy DTI.",
          details: [
            { label: "New EMI", value: "₹12,840/mo" },
            { label: "DTI", value: "22%" },
          ],
          actions: ["Simulate"],
        },
        {
          id: "aff-stretch",
          tone: "warn",
          title: "Stretch · ₹8L",
          body: "Tightens monthly cash flow.",
          details: [
            { label: "New EMI", value: "₹25,680/mo" },
            { label: "DTI", value: "44%" },
          ],
        },
      ],
    };
  }

  // Reduce EMI burden
  if (
    (p.includes("reduc") ||
      p.includes("lower") ||
      p.includes("less") ||
      p.includes("decrease")) &&
    (p.includes("emi") || p.includes("burden") || p.includes("pressure"))
  ) {
    return {
      thinking: [
        "Reviewing your active EMIs…",
        "Modeling restructuring options…",
      ],
      text:
        "Three ways to lower your monthly burden. Refinancing HDFC is cleanest — ₹680/mo without changing total cost much. Closing the Bajaj card EMI saves ₹3,210/mo immediately. Extending tenure helps short-term but adds long-term interest.",
      cards: [
        {
          id: "red-ref",
          tone: "ok",
          title: "Refinance HDFC",
          body: "Best long-term option.",
          details: [{ label: "Saves", value: "₹680/mo" }],
          actions: ["Explore"],
        },
        {
          id: "red-close",
          tone: "info",
          title: "Close Bajaj early",
          body: "Frees cash flow immediately.",
          details: [{ label: "Saves", value: "₹3,210/mo" }],
          actions: ["Plan payoff"],
        },
      ],
    };
  }

  // Forecast / predict
  if (
    p.includes("predict") ||
    p.includes("forecast") ||
    (p.includes("next") &&
      (p.includes("week") || p.includes("month") || p.includes("days"))) ||
    p.includes("upcoming") ||
    p.includes("ahead")
  ) {
    return {
      thinking: ["Forecasting next 30 days…", "Modeling cash flow…"],
      text:
        "Your next 30 days look stable. ₹16,050 in EMIs across two payments. Score projected between 745–752 by month-end. No risk events flagged.",
      cards: [
        {
          id: "fc-30",
          tone: "ok",
          title: "30-day outlook",
          body: "Stable. No risk events.",
          details: [
            { label: "EMIs", value: "₹16,050" },
            { label: "Score", value: "745–752" },
          ],
        },
      ],
    };
  }

  // Default
  return {
    thinking: ["Thinking…"],
    text:
      "I can help with credit improvement, refinancing, affordability checks, EMI reduction, and 30-day forecasts. What would you like to explore?",
  };
}

// ─── Sheet shell ───────────────────────────────────────────────────────────

type Mode = "home" | "chat" | "voice";

let _id = 0;
const nextId = () => `m-${++_id}-${Date.now()}`;

export function CopilotSheet({
  open,
  onClose,
  seedPrompt,
}: {
  open: boolean;
  onClose: () => void;
  /** When provided, auto-sends this prompt as soon as the sheet opens.
   *  Used by the Home "Ask Copilot" strip so users land in a live
   *  conversation rather than the empty home view. */
  seedPrompt?: string | null;
}) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state shortly after close so the user sees clean state on re-open
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setMode("home");
      setMessages([]);
      setInput("");
      setBusy(false);
    }, 380);
    return () => clearTimeout(t);
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (mode !== "chat") return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages, mode]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;

      setMode("chat");
      setBusy(true);
      const userId = nextId();
      const thinkingId = nextId();
      const aiId = nextId();
      const script = getResponse(text);

      // 1 — push user message + thinking placeholder
      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", text },
        { id: thinkingId, role: "thinking", steps: script.thinking },
      ]);
      setInput("");

      // 2 — wait through thinking steps
      const total = Math.min(700 * script.thinking.length + 400, 3000);
      await new Promise((r) => setTimeout(r, total));

      // 3 — replace thinking with the AI reply
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== thinkingId)
          .concat({
            id: aiId,
            role: "ai",
            text: script.text,
            cards: script.cards,
          }),
      );
      setBusy(false);
    },
    [busy],
  );

  // Auto-fire the seeded prompt once when the sheet opens — keyed on the
  // prompt itself so re-opening with the same prompt doesn't re-fire.
  // Adds a tiny delay so the spring entrance settles first.
  useEffect(() => {
    if (!open || !seedPrompt) return;
    if (messages.length > 0) return; // don't disrupt an existing conversation
    const t = setTimeout(() => send(seedPrompt), 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seedPrompt]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="copilot-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: SOFT_EASE }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-riverline-ink/45 backdrop-blur-[3px]"
            aria-hidden
          />

          <motion.div
            key="copilot-sheet"
            role="dialog"
            aria-label="Riverline Copilot"
            aria-modal
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.32 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
            initial={{ y: "100%", scale: 0.97, opacity: 0.5 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: "100%", scale: 0.97, opacity: 0.4 }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 40,
              mass: 0.85,
            }}
            className="absolute inset-x-0 bottom-0 top-[58px] z-50 flex flex-col overflow-hidden rounded-t-[28px] bg-riverline-bg"
            style={{
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.95)",
                "0 -1px 0 rgba(12,14,20,0.06)",
                "0 -8px 24px -8px rgba(12,14,20,0.18)",
                "0 -28px 64px -16px rgba(12,14,20,0.24)",
              ].join(", "),
            }}
          >
            {/* Drag handle */}
            <div className="flex shrink-0 justify-center pt-2 pb-1.5">
              <div className="h-[5px] w-[40px] rounded-full bg-riverline-ink/15" />
            </div>

            <Header
              mode={mode}
              onClose={onClose}
              onBack={() => setMode("home")}
            />

            {mode === "voice" ? (
              <VoiceMode
                onCancel={() => setMode(messages.length ? "chat" : "home")}
                onTranscript={(t) => {
                  setMode("chat");
                  send(t);
                }}
              />
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="no-scroll flex-1 overflow-y-auto"
                >
                  {mode === "home" ? (
                    <HomeView onPrompt={send} />
                  ) : (
                    <ConversationView messages={messages} />
                  )}
                </div>
                <InputBar
                  value={input}
                  onChange={setInput}
                  onSend={() => send(input)}
                  onVoice={() => setMode("voice")}
                  busy={busy}
                />
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────

function Header({
  mode,
  onClose,
  onBack,
}: {
  mode: Mode;
  onClose: () => void;
  onBack: () => void;
}) {
  return (
    <div className="relative z-10 flex shrink-0 items-center justify-between px-5 pt-1.5 pb-3">
      <div className="flex items-center gap-2.5">
        <SmallOrb mode={mode} />
        <div>
          <div className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
            Riverline Copilot
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-riverline-mute">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
              className="block h-[5px] w-[5px] rounded-full bg-riverline-flow"
            />
            <span>
              {mode === "voice"
                ? "Listening"
                : mode === "chat"
                  ? "Responding"
                  : "Online"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {mode === "chat" && (
          <button
            type="button"
            onClick={onBack}
            aria-label="New conversation"
            className="flex h-8 items-center gap-1 rounded-md px-2 text-[11.5px] font-medium text-riverline-mute transition-colors hover:bg-riverline-card hover:text-riverline-ink"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 1.5 V4 H4.5 M2 4 a4 4 0 1 1-1 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-full text-riverline-mute hover:bg-riverline-card hover:text-riverline-ink"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M2.5 2.5l6 6m0-6l-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SmallOrb({ mode }: { mode: Mode }) {
  return (
    <div
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, #2a2d3c 0%, #14161e 55%, #0a0b11 100%)",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.12)",
          "inset 0 -1px 0 rgba(0,0,0,0.5)",
          "0 0 0 1px rgba(12,14,20,0.4)",
          "0 1px 2px rgba(12,14,20,0.4)",
        ].join(", "),
      }}
    >
      <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
        <motion.path
          d="M11 2 L11 8 M11 14 L11 20 M2 11 L8 11 M14 11 L20 11"
          stroke="white"
          strokeOpacity="0.95"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            opacity: mode === "voice" ? 1 : [0.85, 1, 0.85],
          }}
          transition={{
            duration: mode === "voice" ? 0.6 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <path
          d="M5.5 5.5 L7.2 7.2 M14.8 14.8 L16.5 16.5 M16.5 5.5 L14.8 7.2 M7.2 14.8 L5.5 16.5"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="11" cy="11" r="1.6" fill="white" />
      </svg>
    </div>
  );
}

// ─── Home view ─────────────────────────────────────────────────────────────

const PROACTIVE: InsightCard[] = [
  {
    id: "p-ref",
    tone: "ok",
    title: "Refinance saves ₹38,400",
    body: "Switching HDFC to 9.10% cuts EMI by ₹680/mo and shortens tenure by 4 months.",
    details: [
      { label: "New EMI", value: "₹12,160/mo" },
      { label: "Tenure", value: "20 mo (−4)" },
      { label: "Confidence", value: "High" },
    ],
    actions: ["Compare", "Apply"],
  },
  {
    id: "p-tier",
    tone: "ok",
    title: "Two months from Platinum",
    body: "You're 68% of the way there. Keep utilization low and EMIs on time.",
    details: [
      { label: "Progress", value: "68%" },
      { label: "ETA", value: "~Jul 2026" },
    ],
    actions: ["Track"],
  },
  {
    id: "p-emi",
    tone: "warn",
    title: "EMI load slightly high",
    body: "Holding off on new EMIs for 60 days keeps DTI under 17%.",
    details: [
      { label: "DTI now", value: "16.9%" },
      { label: "Safe", value: "<30%" },
    ],
  },
];

const SUGGESTED_PROMPTS = [
  "How can I improve my credit score?",
  "Show refinance options",
  "Can I afford a new ₹4L loan?",
  "Reduce my monthly EMI burden",
  "Predict next 30 days",
];

function HomeView({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="px-5 pt-1 pb-4">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: SOFT_EASE }}
      >
        <p className="font-serif text-[22px] leading-[1.2] tracking-[-0.018em] text-riverline-ink">
          Good evening, Shubham. <br />
          You&rsquo;re{" "}
          <em className="not-italic text-riverline-flow">
            financially stable
          </em>{" "}
          this week.
        </p>
        <p className="mt-2 max-w-[300px] text-[12.5px] leading-[1.55] text-riverline-mute">
          Three observations worth your attention. Tap one to explore, or ask
          me anything below.
        </p>
      </motion.div>

      {/* Proactive insights */}
      <div className="mt-5 space-y-2">
        {PROACTIVE.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: SOFT_EASE,
              delay: 0.12 + i * 0.06,
            }}
          >
            <InsightCardView card={card} />
          </motion.div>
        ))}
      </div>

      {/* Suggested prompts */}
      <div className="mt-7">
        <div className="mb-2.5 flex items-baseline gap-2.5 px-1">
          <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-riverline-mute-2">
            ASK
          </span>
          <h3 className="text-[13px] font-semibold tracking-[-0.012em] text-riverline-ink">
            Try one of these
          </h3>
        </div>
        <div className="flex flex-col gap-1.5">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <motion.button
              key={p}
              type="button"
              onClick={() => onPrompt(p)}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease: SOFT_EASE,
                delay: 0.3 + i * 0.04,
              }}
              whileTap={{ scale: 0.99 }}
              className="group flex items-center justify-between rounded-[12px] bg-white px-3.5 py-2.5 text-left transition-colors hover:bg-riverline-card"
              style={{
                boxShadow: [
                  "inset 0 1px 0 rgba(255,255,255,0.9)",
                  "0 1px 1px rgba(12,14,20,0.03)",
                ].join(", "),
              }}
            >
              <span className="text-[12.5px] font-medium tracking-[-0.005em] text-riverline-ink">
                {p}
              </span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                className="text-riverline-mute-2 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M3 5.5h5M6 3l2.5 2.5L6 8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Conversation view ─────────────────────────────────────────────────────

function ConversationView({ messages }: { messages: Message[] }) {
  return (
    <div className="px-5 pt-2 pb-4">
      <div className="space-y-3.5">
        {messages.map((m) =>
          m.role === "user" ? (
            <UserBubble key={m.id} text={m.text} />
          ) : m.role === "thinking" ? (
            <ThinkingIndicator key={m.id} steps={m.steps} />
          ) : (
            <AIResponse key={m.id} message={m} />
          ),
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: SOFT_EASE }}
      className="flex justify-end"
    >
      <div
        className="max-w-[80%] rounded-[16px] rounded-tr-[6px] bg-riverline-ink px-3.5 py-2 text-[12.5px] leading-[1.45] text-white"
        style={{
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.06)",
            "0 1px 2px rgba(12,14,20,0.3)",
          ].join(", "),
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

function ThinkingIndicator({ steps }: { steps: string[] }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= steps.length - 1) return;
    const t = setTimeout(() => setStepIndex((i) => i + 1), 700);
    return () => clearTimeout(t);
  }, [stepIndex, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: SOFT_EASE }}
      className="flex items-center gap-2.5"
    >
      <ThinkingDot />
      <AnimatePresence mode="wait">
        <motion.span
          key={stepIndex}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.3, ease: SOFT_EASE }}
          className="text-[12px] italic leading-[1.45] text-riverline-mute"
        >
          {steps[stepIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

function ThinkingDot() {
  return (
    <motion.span
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.6,
        ease: "easeInOut",
      }}
      className="block h-[6px] w-[6px] rounded-full bg-riverline-ink/55"
    />
  );
}

function AIResponse({ message }: { message: AIMessage }) {
  const reduce = useReducedMotion();
  // Word-by-word reveal so it feels generated live
  const words = message.text.split(" ");

  return (
    <div className="space-y-3">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: SOFT_EASE }}
        className="font-serif text-[15.5px] leading-[1.45] tracking-[-0.012em] text-riverline-ink"
      >
        {reduce
          ? message.text
          : words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  ease: SOFT_EASE,
                  delay: i * 0.022,
                }}
                className="inline-block"
              >
                {w}
                {i < words.length - 1 && "\u00A0"}
              </motion.span>
            ))}
      </motion.p>

      {message.cards && message.cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: SOFT_EASE,
            delay: Math.min(words.length * 0.022 + 0.15, 0.9),
          }}
          className="space-y-2"
        >
          {message.cards.map((c) => (
            <InsightCardView key={c.id} card={c} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Insight card (expandable) ─────────────────────────────────────────────

function InsightCardView({ card }: { card: InsightCard }) {
  const [open, setOpen] = useState(false);
  const hasDetails =
    (card.details && card.details.length > 0) ||
    (card.actions && card.actions.length > 0);

  return (
    <motion.div
      whileTap={{ scale: 0.998 }}
      className="overflow-hidden rounded-[14px] bg-white"
      style={{
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.9)",
          "0 1px 1px rgba(12,14,20,0.03)",
          "0 4px 10px -6px rgba(12,14,20,0.05)",
        ].join(", "),
      }}
    >
      <button
        type="button"
        onClick={() => hasDetails && setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-3.5 py-3 text-left"
        aria-expanded={open}
      >
        <ToneDot tone={card.tone} />
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-semibold tracking-[-0.005em] text-riverline-ink">
            {card.title}
          </div>
          <p className="mt-0.5 text-[11.5px] leading-[1.5] text-riverline-mute">
            {card.body}
          </p>
        </div>
        {hasDetails && (
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: SOFT_EASE }}
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            className="mt-1 shrink-0 text-riverline-mute-2"
          >
            <path
              d="M2.5 4 L5.5 7 L8.5 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: SOFT_EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-riverline-line/60 px-3.5 py-3">
              {card.details && card.details.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {card.details.map((d) => (
                    <div key={d.label}>
                      <div className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-riverline-mute-2">
                        {d.label}
                      </div>
                      <div className="mt-0.5 text-[12px] font-semibold tabular-nums tracking-[-0.005em] text-riverline-ink">
                        {d.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {card.actions && card.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {card.actions.map((a, i) => (
                    <button
                      key={a}
                      type="button"
                      className={
                        "rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-[-0.005em] transition-colors " +
                        (i === 0
                          ? "bg-riverline-ink text-white hover:bg-riverline-ink-2"
                          : "bg-riverline-card text-riverline-ink-2 hover:bg-riverline-line")
                      }
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ToneDot({ tone }: { tone: "ok" | "warn" | "info" }) {
  const color =
    tone === "ok"
      ? "bg-riverline-flow"
      : tone === "warn"
        ? "bg-amber-500"
        : "bg-riverline-ink/55";
  const halo =
    tone === "ok"
      ? "0 0 0 4px rgba(31,138,118,0.1)"
      : tone === "warn"
        ? "0 0 0 4px rgba(217,119,6,0.1)"
        : "0 0 0 4px rgba(12,14,20,0.05)";
  return (
    <motion.span
      animate={{ opacity: [0.55, 1, 0.55] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      className={"mt-1.5 block h-[7px] w-[7px] shrink-0 rounded-full " + color}
      style={{ boxShadow: halo }}
    />
  );
}

// ─── Voice mode ────────────────────────────────────────────────────────────
// Full takeover. Big animated waveform + listening label + cancel.
// Tap "Done" to send a sample transcript through to the chat.

function VoiceMode({
  onCancel,
  onTranscript,
}: {
  onCancel: () => void;
  onTranscript: (t: string) => void;
}) {
  const [phase, setPhase] = useState<"listening" | "captured">("listening");
  const [transcript, setTranscript] = useState("");

  // Simulate live transcription building up over time
  useEffect(() => {
    const sample = "How can I improve my credit score?";
    if (phase !== "listening") return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i > sample.length) {
        clearInterval(id);
        setPhase("captured");
      } else {
        setTranscript(sample.slice(0, i));
      }
    }, 60);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between px-5 pb-6 pt-6">
      {/* Top label */}
      <div className="text-center">
        <div className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-riverline-mute-2">
          {phase === "listening" ? "Listening" : "Captured"}
        </div>
        <p className="mt-3 max-w-[280px] font-serif text-[18px] leading-[1.35] tracking-[-0.012em] text-riverline-ink-2">
          {transcript || "I'm listening. Ask anything about your finances."}
          {phase === "listening" && (
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
                ease: "easeInOut",
              }}
              className="ml-0.5 inline-block h-[16px] w-[2px] translate-y-[2px] rounded-[1px] bg-riverline-ink"
            />
          )}
        </p>
      </div>

      {/* Big waveform centerpiece */}
      <Waveform active={phase === "listening"} />

      {/* Bottom actions */}
      <div className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-[14px] border border-riverline-line bg-white py-3 text-[12.5px] font-semibold text-riverline-ink-2 transition-colors hover:bg-riverline-card"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!transcript}
          onClick={() => onTranscript(transcript)}
          className="flex-1 rounded-[14px] bg-riverline-ink py-3 text-[12.5px] font-semibold text-white transition-opacity disabled:opacity-40"
          style={{
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.06)",
              "0 1px 2px rgba(12,14,20,0.4)",
              "0 6px 14px -4px rgba(12,14,20,0.3)",
            ].join(", "),
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  // 28 bars with sinewave amplitudes
  const bars = Array.from({ length: 28 }, (_, i) => {
    const phase = i / 28;
    const base = 18 + Math.sin(phase * Math.PI) * 32;
    const amp = 12 + Math.cos(phase * Math.PI * 2) * 10;
    return { base, amp, delay: i * 0.04 };
  });

  return (
    <div className="flex h-[140px] items-center justify-center gap-[3px] py-6">
      {bars.map((b, i) => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-full bg-riverline-ink"
          animate={
            active
              ? {
                  height: [b.base, b.base + b.amp, b.base, b.base - b.amp / 2, b.base],
                  opacity: [0.5, 1, 0.5, 0.7, 0.5],
                }
              : { height: 8, opacity: 0.2 }
          }
          transition={
            active
              ? {
                  repeat: Infinity,
                  duration: 1.4,
                  delay: b.delay,
                  ease: "easeInOut",
                }
              : { duration: 0.3, ease: SOFT_EASE }
          }
          style={{ height: b.base }}
        />
      ))}
    </div>
  );
}

// ─── Input bar ─────────────────────────────────────────────────────────────

function InputBar({
  value,
  onChange,
  onSend,
  onVoice,
  busy,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onVoice: () => void;
  busy: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea up to ~4 lines
  const handleInput = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  };

  useEffect(handleInput, [value]);

  return (
    <div
      className="relative shrink-0 px-4 pt-3 pb-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(251,250,246,0) 0%, rgba(251,250,246,0.95) 30%, rgba(251,250,246,1) 100%)",
      }}
    >
      <div
        className="flex items-end gap-2 rounded-[18px] bg-white p-2"
        style={{
          boxShadow: [
            "inset 0 0 0 1px rgba(12,14,20,0.05)",
            "inset 0 1px 0 rgba(255,255,255,0.95)",
            "0 1px 2px rgba(12,14,20,0.04)",
            "0 8px 20px -10px rgba(12,14,20,0.1)",
          ].join(", "),
        }}
      >
        <button
          type="button"
          onClick={onVoice}
          aria-label="Voice"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-riverline-ink-2 transition-colors hover:bg-riverline-card"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <rect
              x="5"
              y="1.5"
              width="5"
              height="8"
              rx="2.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M2.5 7.5 a5 5 0 0 0 10 0 M7.5 12.5 V14"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask anything about your finances…"
          className="min-h-[36px] flex-1 resize-none bg-transparent px-1 py-2 text-[13px] leading-[1.4] tracking-[-0.005em] text-riverline-ink outline-none placeholder:text-riverline-mute-2"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim() || busy}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-riverline-ink text-white transition-opacity disabled:opacity-30"
          style={{
            boxShadow: [
              "inset 0 1px 0 rgba(255,255,255,0.1)",
              "0 1px 2px rgba(12,14,20,0.4)",
            ].join(", "),
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M6.5 11 V2.5 M3 6 L6.5 2.5 L10 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
