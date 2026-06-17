'use client';
import { useSyncExternalStore } from 'react';
import tokens from '@/tokens.json';

/**
 * Viewport breakpoint names recognized by the app.
 */
type Breakpoint = keyof typeof tokens.theme.breakpoints;

/**
 * Mapping of breakpoint names to their min-width values.
 */
type Breakpoints = Record<Breakpoint, string>;

/**
 * Breakpoint scale loaded from the theme tokens.
 */
const breakpoints: Breakpoints = tokens.theme.breakpoints as Breakpoints;

/**
 * Ordered breakpoint names used to compare viewport ranges.
 */
const breakpointsKeys = Object.keys(breakpoints) as Breakpoint[];

/**
 * Default breakpoint used before the browser viewport can be measured.
 */
const defaultBreakpoint = breakpointsKeys[0];

/**
 * Converts a rem value to pixels using the root font size.
 *
 * @param value - A CSS length expressed in rem units.
 * @returns The equivalent pixel value.
 */
function remToPx(value: string): number {
  const rem = Number(value.replace('rem', ''));
  const rootFontSize = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );

  return rem * rootFontSize;
}

/**
 * Resolves the current viewport breakpoint from the window width.
 *
 * @returns The active breakpoint name from the configured breakpoint scale.
 */
function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return defaultBreakpoint;

  let current: Breakpoint = defaultBreakpoint;

  Object.entries(breakpoints).forEach(([breakpoint, value]) => {
    if (window.innerWidth >= remToPx(value)) {
      current = breakpoint as Breakpoint;
    }
  });

  return current;
}

/**
 * Subscribes to viewport changes that can affect breakpoint resolution.
 *
 * @param callback - Function to invoke when the viewport size changes.
 * @returns A cleanup function that removes the listeners.
 */
function subscribeToViewport(callback: () => void) {
  window.addEventListener('resize', callback);
  window.addEventListener('orientationchange', callback);
  window.visualViewport?.addEventListener('resize', callback);

  return () => {
    window.removeEventListener('resize', callback);
    window.removeEventListener('orientationchange', callback);
    window.visualViewport?.removeEventListener('resize', callback);
  };
}

/**
 * React hook that exposes the current breakpoint and convenience guards.
 *
 * @returns The active breakpoint, the breakpoint map, and comparison helpers.
 *
 * @example
 * ```tsx
 * const { breakpoint, isAtLeast } = useBreakpoints();
 *
 * if (isAtLeast('lg')) {
 *   console.log('Desktop layout', breakpoint);
 * }
 * ```
 *
 * @example
 * ```tsx
 * const { isBelow } = useBreakpoints();
 *
 * if (isBelow('md')) {
 *   console.log('Mobile or tablet layout');
 * }
 * ```
 *
 * @example
 * ```tsx
 * const { breakpoints } = useBreakpoints();
 *
 * console.log(breakpoints.sm);
 * ```
 */
function useBreakpoints(): {
  breakpoint: Breakpoint;
  breakpoints: Breakpoints;
  isAtLeast: (target: Breakpoint) => boolean;
  isBelow: (target: Breakpoint) => boolean;
} {
  const breakpoint: Breakpoint = useSyncExternalStore(
    subscribeToViewport,
    getCurrentBreakpoint,
    () => defaultBreakpoint,
  );
  const breakpointIndex = breakpointsKeys.indexOf(breakpoint);

  const isAtLeast = (target: Breakpoint) =>
    breakpointIndex >= breakpointsKeys.indexOf(target);

  const isBelow = (target: Breakpoint) =>
    breakpointIndex < breakpointsKeys.indexOf(target);

  return {
    breakpoint,
    breakpoints,
    isAtLeast,
    isBelow,
  };
}

export { useBreakpoints };
export type { Breakpoint };
