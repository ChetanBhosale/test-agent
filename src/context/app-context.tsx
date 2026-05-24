"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  ONBOARDING_FLOW,
  SCREEN_META,
  TAB_SCREENS,
  isTabScreen,
  type ScreenId,
} from "@/lib/screens";

// ─── Types ──────────────────────────────────────────────────────────────────

export type User = {
  name: string;
  initials: string;
  email?: string;
};

export type Theme = "light" | "dark";

type AppState = {
  /** Navigation stack (top of stack = current screen) */
  stack: ScreenId[];
  /** Direction of the last navigation: forward (push/replace) or back (pop) */
  direction: "forward" | "back";
  /** Lightweight global app data */
  user: User | null;
  theme: Theme;
  /** Per-screen scratch state, e.g. { otp: { phone: "..." } } */
  screenParams: Record<string, Record<string, unknown> | undefined>;
};

type Action =
  | { type: "PUSH"; screen: ScreenId; params?: Record<string, unknown> }
  | { type: "REPLACE"; screen: ScreenId; params?: Record<string, unknown> }
  | { type: "POP" }
  | { type: "RESET"; screen: ScreenId }
  | { type: "SET_USER"; user: User | null }
  | { type: "SET_THEME"; theme: Theme }
  | { type: "SET_PARAMS"; screen: ScreenId; params: Record<string, unknown> };

const INITIAL_STATE: AppState = {
  stack: ["splash"],
  direction: "forward",
  user: null,
  theme: "light",
  screenParams: {},
};

// ─── Reducer ────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "PUSH": {
      const top = state.stack[state.stack.length - 1];
      if (top === action.screen) return state;

      // Tab navigation: replace whole app stack with the tab,
      // unless we're still in the pre-home onboarding flow.
      if (isTabScreen(action.screen) && state.stack.includes("home")) {
        return {
          ...state,
          stack: [action.screen],
          direction: "forward",
          screenParams: action.params
            ? { ...state.screenParams, [action.screen]: action.params }
            : state.screenParams,
        };
      }

      return {
        ...state,
        stack: [...state.stack, action.screen],
        direction: "forward",
        screenParams: action.params
          ? { ...state.screenParams, [action.screen]: action.params }
          : state.screenParams,
      };
    }

    case "REPLACE": {
      const next = [...state.stack];
      next[next.length - 1] = action.screen;
      return {
        ...state,
        stack: next,
        direction: "forward",
        screenParams: action.params
          ? { ...state.screenParams, [action.screen]: action.params }
          : state.screenParams,
      };
    }

    case "POP": {
      if (state.stack.length <= 1) return state;
      return {
        ...state,
        stack: state.stack.slice(0, -1),
        direction: "back",
      };
    }

    case "RESET":
      return { ...state, stack: [action.screen], direction: "forward" };

    case "SET_USER":
      return { ...state, user: action.user };

    case "SET_THEME":
      return { ...state, theme: action.theme };

    case "SET_PARAMS":
      return {
        ...state,
        screenParams: { ...state.screenParams, [action.screen]: action.params },
      };

    default:
      return state;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Given the current screen, return the screen that the user can swipe forward
 * into. Right now this is a hard-coded onboarding chain — later we'll lift it
 * to per-screen metadata so any screen can declare its own next step.
 */
function nextInFlow(current: ScreenId): ScreenId | null {
  const idx = ONBOARDING_FLOW.indexOf(current);
  if (idx === -1 || idx === ONBOARDING_FLOW.length - 1) return null;
  return ONBOARDING_FLOW[idx + 1];
}

// ─── Context ────────────────────────────────────────────────────────────────

type AppContextValue = {
  // Navigation state
  screen: ScreenId;
  stack: ScreenId[];
  canGoBack: boolean;
  direction: "forward" | "back";
  tabs: ScreenId[];
  /** Tint for the device status bar based on current screen. */
  statusBarTint: "light" | "dark";

  // Navigation actions
  navigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  replace: (screen: ScreenId, params?: Record<string, unknown>) => void;
  goBack: () => void;
  /** Navigate to the next screen in the canonical flow, if one exists. */
  goForward: () => void;
  reset: (screen: ScreenId) => void;

  // Per-screen params
  getParams: <T = Record<string, unknown>>(screen: ScreenId) => T | undefined;
  setParams: (screen: ScreenId, params: Record<string, unknown>) => void;

  // Global app state
  user: User | null;
  setUser: (user: User | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({
  children,
  initialScreen = "splash",
}: {
  children: ReactNode;
  initialScreen?: ScreenId;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    stack: [initialScreen],
  });

  const navigate = useCallback(
    (screen: ScreenId, params?: Record<string, unknown>) =>
      dispatch({ type: "PUSH", screen, params }),
    [],
  );
  const replace = useCallback(
    (screen: ScreenId, params?: Record<string, unknown>) =>
      dispatch({ type: "REPLACE", screen, params }),
    [],
  );
  const goBack = useCallback(() => dispatch({ type: "POP" }), []);
  const reset = useCallback(
    (screen: ScreenId) => dispatch({ type: "RESET", screen }),
    [],
  );
  const setUser = useCallback(
    (user: User | null) => dispatch({ type: "SET_USER", user }),
    [],
  );
  const setTheme = useCallback(
    (theme: Theme) => dispatch({ type: "SET_THEME", theme }),
    [],
  );
  const setParams = useCallback(
    (screen: ScreenId, params: Record<string, unknown>) =>
      dispatch({ type: "SET_PARAMS", screen, params }),
    [],
  );

  const screen = state.stack[state.stack.length - 1];

  const goForward = useCallback(() => {
    const next = nextInFlow(screen);
    if (next) dispatch({ type: "PUSH", screen: next });
  }, [screen]);

  const value = useMemo<AppContextValue>(
    () => ({
      screen,
      stack: state.stack,
      canGoBack: state.stack.length > 1,
      direction: state.direction,
      tabs: TAB_SCREENS,
      statusBarTint: SCREEN_META[screen].tint,
      navigate,
      replace,
      goBack,
      goForward,
      reset,
      getParams: <T = Record<string, unknown>,>(s: ScreenId) =>
        state.screenParams[s] as T | undefined,
      setParams,
      user: state.user,
      setUser,
      theme: state.theme,
      setTheme,
    }),
    [
      screen,
      state.stack,
      state.direction,
      state.screenParams,
      state.user,
      state.theme,
      navigate,
      replace,
      goBack,
      goForward,
      reset,
      setParams,
      setUser,
      setTheme,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an <AppProvider>");
  }
  return ctx;
}

/** Convenience hook that mirrors useApp() but exposes only nav helpers. */
export function useNavigation() {
  const { navigate, replace, goBack, goForward, reset, screen, canGoBack } =
    useApp();
  return { navigate, replace, goBack, goForward, reset, screen, canGoBack };
}

/** Convenience hook to read/write params for a specific screen. */
export function useScreenParams<T = Record<string, unknown>>(screen: ScreenId) {
  const { getParams, setParams } = useApp();
  return [
    getParams<T>(screen),
    (params: Record<string, unknown>) => setParams(screen, params),
  ] as const;
}
