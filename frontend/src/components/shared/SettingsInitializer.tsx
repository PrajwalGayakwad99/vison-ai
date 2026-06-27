'use client';

// ─── Settings Initializer ──────────────────────────────────────────────────
// Runs on mount to hydrate the settings store from localStorage and apply
// theme/font/animation side effects. Prevents flash of wrong styles.

import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

// Inject reduce-motion CSS when needed
const REDUCE_MOTION_CSS = `
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation-duration: 0ms !important;
  transition-duration: 0ms !important;
  scroll-behavior: auto !important;
}
`;

export function SettingsInitializer() {
  const initialize = useSettingsStore((state) => state.initialize);
  const theme = useSettingsStore((state) => state.theme);
  const animations = useSettingsStore((state) => state.animations);

  // Initialize once on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Inject reduce-motion style tag when needed
  useEffect(() => {
    let styleEl: HTMLStyleElement | null = null;

    if (!animations) {
      styleEl = document.createElement('style');
      styleEl.textContent = REDUCE_MOTION_CSS;
      document.head.appendChild(styleEl);
    }

    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [animations]);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const html = document.documentElement;
      const prefersDark = mq.matches;
      html.classList.remove('dark', 'light');
      html.classList.add(prefersDark ? 'dark' : 'light');
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return null;
}
