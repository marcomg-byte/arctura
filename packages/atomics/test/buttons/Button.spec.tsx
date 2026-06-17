import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/atomics/buttons/Button';

afterEach(cleanup);

describe('Button', () => {
  it('renders a native button with default props and classes', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toContain('mg:inline-flex');
    expect(button.className).toContain('mg:bg-primary');
    expect(button.className).toContain('mg:px-2');
    expect(button.className).toContain('mg:sm:px-2.5');
  });

  it('renders an anchor when href is provided', () => {
    render(
      <Button href="/projects" target="_blank" aria-label="Open projects">
        Projects
      </Button>,
    );

    const button = screen.getByRole('link', { name: 'Open projects' });

    expect(button.tagName).toBe('A');
    expect(button.getAttribute('href')).toBe('/projects');
    expect(button.getAttribute('target')).toBe('_blank');
    expect(button.getAttribute('aria-label')).toBe('Open projects');
    expect(button.className).toContain('mg:bg-primary');
  });

  it('applies explicit size, variant, full width, and custom button classes', () => {
    render(
      <Button
        fullWidth
        responsive={false}
        size="lg"
        variant="outline"
        classes={{ button: 'custom-button' }}
      >
        Continue
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Continue' });

    expect(button.className).toContain('mg:w-full');
    expect(button.className).toContain('mg:py-3');
    expect(button.className).toContain('mg:text-base');
    expect(button.className).toContain('mg:border-primary');
    expect(button.className).toContain('custom-button');
  });

  it('forwards native button props', () => {
    render(
      <Button type="submit" disabled aria-label="Submit form">
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit form' });

    expect(button.getAttribute('type')).toBe('submit');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('renders a start icon before the button content', () => {
    const { container } = render(
      <Button startAdornment={faCheck}>Done</Button>,
    );

    const button = screen.getByRole('button', { name: 'Done' });
    const icon = container.querySelector('svg');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('data-icon')).toBe('check');
    expect(icon?.getAttribute('class')).toContain('mg:text-xs');
    expect(button.className).toContain('mg:gap-2');
    expect(button.firstElementChild).toBe(icon);
  });

  it('renders an end icon after the button content', () => {
    const { container } = render(<Button endAdornment={faCheck}>Done</Button>);

    const button = screen.getByRole('button', { name: 'Done' });
    const icon = container.querySelector('svg');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('data-icon')).toBe('check');
    expect(icon?.getAttribute('class')).toContain('mg:text-xs');
    expect(button.className).toContain('mg:gap-2');
    expect(button.lastElementChild).toBe(icon);
  });
});
