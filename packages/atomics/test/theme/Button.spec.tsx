import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button } from '../../src/theme';

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

describe('Theme Button', () => {
  it('renders the dark-mode icon while current mode is light', async () => {
    localStorage.setItem('theme-mode', 'light');

    const { container } = render(<Button aria-label="Toggle theme" />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    const icon = container.querySelector('svg');

    expect(button.className).toContain('au:flex');
    expect(icon?.getAttribute('data-icon')).toBe('moon');
  });

  it('renders the light-mode icon while current mode is dark', async () => {
    localStorage.setItem('theme-mode', 'dark');

    const { container } = render(<Button aria-label="Toggle theme" />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    expect(container.querySelector('svg')?.getAttribute('data-icon')).toBe('sun');
  });

  it('toggles stored mode and applied data-theme on click', async () => {
    localStorage.setItem('theme-mode', 'light');

    render(<Button aria-label="Toggle theme" />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }));

    await waitFor(() => {
      expect(localStorage.getItem('theme-mode')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('merges custom class overrides into button and icon', () => {
    localStorage.setItem('theme-mode', 'light');

    const { container } = render(
      <Button
        aria-label="Toggle theme"
        classes={{
          children: 'custom-theme-icon',
          iconButton: 'custom-theme-button',
        }}
      />
    );

    expect(screen.getByRole('button', { name: 'Toggle theme' }).className).toContain(
      'custom-theme-button'
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('custom-theme-icon');
  });
});
