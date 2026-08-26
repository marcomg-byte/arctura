import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Selector } from '../../src/theme';

const matchMediaState = vi.hoisted(() => ({ matches: false }));

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      matches: matchMediaState.matches,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

afterEach(cleanup);

describe('Theme Selector', () => {
  it('renders current system mode and theme options', () => {
    render(<Selector />);

    expect(screen.getByText('Theme')).toBeDefined();
    expect(screen.getByText('system')).toBeDefined();

    fireEvent.click(screen.getByText('system'));

    expect(screen.getByText('Light')).toBeDefined();
    expect(screen.getByText('Dark')).toBeDefined();
  });

  it('updates stored mode when selecting a valid option', async () => {
    render(<Selector />);

    fireEvent.click(screen.getByText('system'));
    fireEvent.click(screen.getByText('Dark'));

    await waitFor(() => {
      expect(localStorage.getItem('theme-mode')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('reflects an existing stored mode', async () => {
    localStorage.setItem('theme-mode', 'light');

    render(<Selector />);

    await waitFor(() => {
      expect(screen.getByText('light')).toBeDefined();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('resolves system mode from matchMedia', async () => {
    matchMediaState.matches = true;

    render(<Selector />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
