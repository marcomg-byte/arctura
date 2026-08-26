import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Toggle } from '../../src/toggle/Toggle';

afterEach(cleanup);

describe('Toggle', () => {
  it('renders label, description, and switch attributes', () => {
    render(
      <Toggle
        aria-label="Enable notifications"
        description="Receive product updates"
        label="Notifications"
        name="notifications"
        required
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Enable notifications' });

    expect(screen.getByText('Notifications')).toBeDefined();
    expect(screen.getByText('Receive product updates')).toBeDefined();
    expect(toggle.getAttribute('name')).toBe('notifications');
    expect(toggle.hasAttribute('required')).toBe(true);
  });

  it('calls onCheckedChange with the new checked state', () => {
    const handleCheckedChange = vi.fn();

    render(<Toggle aria-label="Enable" onCheckedChange={handleCheckedChange} />);

    fireEvent.click(screen.getByRole('switch', { name: 'Enable' }));

    expect(handleCheckedChange).toHaveBeenCalledWith(expect.any(Object), true);
  });

  it('uses current palette utilities for slider variants and text', () => {
    const { container, rerender } = render(
      <Toggle description="Extra details" label="Enabled" variant="success" />
    );

    const slider = container.querySelector('span') as HTMLSpanElement;

    expect(slider.className).toContain('au:bg-subtle');
    expect(slider.className).toContain('au:after:top-1/2');
    expect(slider.className).toContain('au:after:-mt-1.5');
    expect(slider.className).toContain('au:after:border-none');
    expect(slider.className).toContain('au:after:bg-success-primary');
    expect(slider.className).toContain('au:peer-checked:bg-success-primary-subtle');
    expect(slider.className).toContain('au:peer-focus-visible:ring-offset-4');
    expect(slider.className).toContain('au:peer-focus-visible:ring-offset-transparent');
    expect(slider.className).toContain(
      'au:peer-focus-visible:[--tw-ring-offset-shadow:0_0_#0000]'
    );
    expect(slider.className).not.toContain('bg-gray-200');
    expect(slider.className).not.toContain('peer-checked:bg-blue-600');
    expect(screen.getByText('Enabled').className).toContain('au:text-primary');
    expect(screen.getByText('Extra details').className).toContain('au:text-subtle');

    rerender(<Toggle label="Delete" variant="danger" />);

    expect((container.querySelector('span') as HTMLSpanElement).className).toContain(
      'au:peer-checked:bg-danger-primary-subtle'
    );
  });
});
