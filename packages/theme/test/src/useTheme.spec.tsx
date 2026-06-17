import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { THEME_MODES, THEME_OPTIONS, useTheme } from '@/src/hooks/useTheme';

const mediaState = vi.hoisted(() => ({
  matches: false,
  changeHandler: undefined as ((event: MediaQueryListEvent) => void) | undefined,
  addEventListener: vi.fn((_event: string, handler: (event: MediaQueryListEvent) => void) => {
    mediaState.changeHandler = handler;
  }),
  removeEventListener: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  mediaState.matches = false;
  mediaState.changeHandler = undefined;
  mediaState.addEventListener.mockClear();
  mediaState.removeEventListener.mockClear();

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      matches: mediaState.matches,
      media: '(prefers-color-scheme: dark)',
      addEventListener: mediaState.addEventListener,
      removeEventListener: mediaState.removeEventListener,
    })),
  });
});

afterEach(() => {
  cleanup();
});

describe('useTheme', () => {
  it('exports supported theme modes and options', () => {
    expect(THEME_MODES).toEqual(['system', 'light', 'dark']);
    expect(THEME_OPTIONS).toEqual([
      { value: 'system', label: 'System' },
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ]);
  });

  it('defaults to system mode and resolves the light system theme', async () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.mode).toBe('system');

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
    expect(mediaState.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('reads stored mode and applies it directly', async () => {
    localStorage.setItem('theme-mode', 'dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.mode).toBe('dark');

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
    expect(mediaState.addEventListener).not.toHaveBeenCalled();
  });

  it('updates localStorage and hook state through setMode', async () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setMode('dark');
    });

    await waitFor(() => {
      expect(localStorage.getItem('theme-mode')).toBe('dark');
      expect(result.current.mode).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('responds to system preference changes in system mode', async () => {
    renderHook(() => useTheme());

    await waitFor(() => {
      expect(mediaState.changeHandler).toBeDefined();
    });

    act(() => {
      mediaState.matches = true;
      mediaState.changeHandler?.({} as MediaQueryListEvent);
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
