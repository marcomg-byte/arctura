'use client';
import { useLayoutEffect, useSyncExternalStore } from 'react';

/**
 * ThemeMode represents the possible theme modes for the application.
 *
 * - 'light' | 'Light': Light mode
 * - 'dark'  | 'Dark' : Dark mode
 * - 'system'| 'System': Follows the system preference
 */
type ThemeMode = 'light' | 'dark' | 'system' | 'System' | 'Light' | 'Dark';

/**
 * List of supported theme modes for the application.
 *
 * Used for theme selection and validation.
 * Only lowercase values are included for internal logic.
 */
const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

/**
 * Options for theme mode selection UI.
 *
 * Each option contains a value (used internally) and a label (for display).
 * Used in theme switchers and select components.
 */
const THEME_OPTIONS: { value: ThemeMode; label: ThemeMode }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const STORAGE_KEY = 'theme-mode';

function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system';
}

function resolveDataTheme(mode: ThemeMode): ThemeMode {
  if (mode !== 'system') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', resolveDataTheme(mode));
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function useTheme() {
  const mode = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredMode(),
    () => 'system' as ThemeMode
  );

  // Apply theme and subscribe to OS changes when mode === 'system'
  useLayoutEffect(() => {
    applyTheme(mode);

    if (mode !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setMode = (next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  };

  return { mode, setMode };
}

export { THEME_MODES, THEME_OPTIONS, useTheme };
export type { ThemeMode };
