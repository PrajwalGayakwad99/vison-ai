// ─── Settings Store ────────────────────────────────────────────────────────
// Global settings with localStorage persistence and immediate side effects.

import { create } from 'zustand';

export type Theme = 'dark' | 'light' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

const STORAGE_KEYS = {
  theme: 'axiom_theme',
  fontSize: 'axiom_font_size',
  animations: 'axiom_animations',
  pushNotifications: 'axiom_push_notifications',
  emailDigest: 'axiom_email_digest',
  challengeReminders: 'axiom_challenge_reminders',
  defaultLanguage: 'axiom_default_language',
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

// ── Apply theme to <html> ─────────────────────────────────────────────────

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('dark', 'light');

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    html.classList.add(theme);
  }
}

// ── Apply font size to CSS variable ───────────────────────────────────────

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: '13px',
  medium: '15px',
  large: '17px',
};

function applyFontSize(size: FontSize) {
  document.documentElement.style.setProperty('--font-size-base', FONT_SIZE_MAP[size]);
}

// ── Apply reduced-motion class ────────────────────────────────────────────

function applyAnimations(enabled: boolean) {
  const html = document.documentElement;
  if (!enabled) {
    html.classList.add('reduce-motion');
  } else {
    html.classList.remove('reduce-motion');
  }
}

// ── Store Definition ──────────────────────────────────────────────────────

interface SettingsState {
  // State
  theme: Theme;
  fontSize: FontSize;
  animations: boolean;
  pushNotifications: boolean;
  emailDigest: boolean;
  challengeReminders: boolean;
  defaultLanguage: string;

  // Actions
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setAnimations: (enabled: boolean) => void;
  setPushNotifications: (enabled: boolean) => Promise<boolean>;
  setEmailDigest: (enabled: boolean) => void;
  setChallengeReminders: (enabled: boolean) => void;
  setDefaultLanguage: (lang: string) => void;

  // Initialize from localStorage (called once on app load)
  initialize: () => void;
}

const DEFAULT_STATE = {
  theme: 'dark' as Theme,
  fontSize: 'medium' as FontSize,
  animations: true,
  pushNotifications: false,
  emailDigest: false,
  challengeReminders: true,
  defaultLanguage: 'python',
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_STATE,

  setTheme: (theme) => {
    set({ theme });
    saveToStorage(STORAGE_KEYS.theme, theme);
    applyTheme(theme);
  },

  setFontSize: (fontSize) => {
    set({ fontSize });
    saveToStorage(STORAGE_KEYS.fontSize, fontSize);
    applyFontSize(fontSize);
  },

  setAnimations: (animations) => {
    set({ animations });
    saveToStorage(STORAGE_KEYS.animations, animations);
    applyAnimations(animations);
  },

  setPushNotifications: async (enabled) => {
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        // Snap back to OFF
        set({ pushNotifications: false });
        saveToStorage(STORAGE_KEYS.pushNotifications, false);
        return false;
      }
    }
    set({ pushNotifications: enabled });
    saveToStorage(STORAGE_KEYS.pushNotifications, enabled);
    return enabled;
  },

  setEmailDigest: (emailDigest) => {
    set({ emailDigest });
    saveToStorage(STORAGE_KEYS.emailDigest, emailDigest);
  },

  setChallengeReminders: (challengeReminders) => {
    set({ challengeReminders });
    saveToStorage(STORAGE_KEYS.challengeReminders, challengeReminders);
  },

  setDefaultLanguage: (defaultLanguage) => {
    set({ defaultLanguage });
    saveToStorage(STORAGE_KEYS.defaultLanguage, defaultLanguage);
  },

  initialize: () => {
    const state = {
      theme: loadFromStorage<Theme>(STORAGE_KEYS.theme, DEFAULT_STATE.theme),
      fontSize: loadFromStorage<FontSize>(STORAGE_KEYS.fontSize, DEFAULT_STATE.fontSize),
      animations: loadFromStorage<boolean>(STORAGE_KEYS.animations, DEFAULT_STATE.animations),
      pushNotifications: loadFromStorage<boolean>(STORAGE_KEYS.pushNotifications, DEFAULT_STATE.pushNotifications),
      emailDigest: loadFromStorage<boolean>(STORAGE_KEYS.emailDigest, DEFAULT_STATE.emailDigest),
      challengeReminders: loadFromStorage<boolean>(STORAGE_KEYS.challengeReminders, DEFAULT_STATE.challengeReminders),
      defaultLanguage: loadFromStorage<string>(STORAGE_KEYS.defaultLanguage, DEFAULT_STATE.defaultLanguage),
    };

    set(state);

    // Apply all side effects
    applyTheme(state.theme);
    applyFontSize(state.fontSize);
    applyAnimations(state.animations);

    // Set up system theme listener
    if (state.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', () => applyTheme('system'));
    }
  },
}));
