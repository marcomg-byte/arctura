import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Fab } from '../../src/buttons/Fab';

afterEach(cleanup);

describe('Fab', () => {
  it('renders a circular native button with default classes', () => {
    render(<Fab aria-label="Add item" startAdornment={faPlus} />);

    const fab = screen.getByRole('button', { name: 'Add item' });
    const icon = fab.querySelector('svg');

    expect(fab.tagName).toBe('BUTTON');
    expect(fab.className).toContain('mg:inline-flex');
    expect(fab.className).toContain('mg:rounded-full');
    expect(fab.className).toContain('mg:h-6');
    expect(fab.className).toContain('mg:w-6');
    expect(fab.className).toContain('mg:border-primary');
    expect(fab.className).toContain('mg:text-primary');
    expect(icon?.getAttribute('data-icon')).toBe('plus');
  });

  it('renders an anchor when href is provided', () => {
    render(
      <Fab href="/contact" target="_blank" aria-label="Open contact">
        Contact
      </Fab>
    );

    const fab = screen.getByRole('link', { name: 'Open contact' });

    expect(fab.tagName).toBe('A');
    expect(fab.getAttribute('href')).toBe('/contact');
    expect(fab.getAttribute('target')).toBe('_blank');
    expect(fab.getAttribute('aria-label')).toBe('Open contact');
    expect(fab.className).toContain('mg:border-primary');
  });

  it('applies extended variant, size, color, and custom classes', () => {
    render(
      <Fab variant="extended" size="lg" color="accent" classes={{ button: 'custom-fab' }}>
        Create
      </Fab>
    );

    const fab = screen.getByRole('button', { name: 'Create' });

    expect(fab.className).toContain('mg:rounded-lg');
    expect(fab.className).toContain('mg:w-6');
    expect(fab.className).toContain('mg:h-4');
    expect(fab.className).toContain('mg:border-accent');
    expect(fab.className).toContain('mg:text-accent');
    expect(fab.className).toContain('custom-fab');
  });

  it('forwards native button props and click handlers', () => {
    const handleClick = vi.fn();

    render(
      <Fab type="submit" onClick={handleClick}>
        Send
      </Fab>
    );

    const fab = screen.getByRole('button', { name: 'Send' });

    fireEvent.click(fab);

    expect(fab.getAttribute('type')).toBe('submit');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders a start icon before the content with custom adornment classes', () => {
    render(
      <Fab startAdornment={faCheck} classes={{ adornment: 'custom-icon' }}>
        Done
      </Fab>
    );

    const fab = screen.getByRole('button', { name: 'Done' });
    const icon = fab.querySelector('svg');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('data-icon')).toBe('check');
    expect(icon?.getAttribute('class')).toContain('mg:text-xs');
    expect(icon?.getAttribute('class')).toContain('custom-icon');
    expect(fab.firstElementChild).toBe(icon);
  });

  it('renders an end icon after the content', () => {
    render(<Fab endAdornment={faCheck}>Done</Fab>);

    const fab = screen.getByRole('button', { name: 'Done' });
    const icon = fab.querySelector('svg');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('data-icon')).toBe('check');
    expect(icon?.getAttribute('class')).toContain('mg:text-xs');
    expect(fab.lastElementChild).toBe(icon);
  });
});
