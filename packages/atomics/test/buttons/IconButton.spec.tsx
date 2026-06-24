import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MouseEvent } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '../../src/buttons/IconButton';

afterEach(cleanup);

describe('IconButton', () => {
  it('renders a native button with default outline classes', () => {
    render(<IconButton aria-label="Confirm">{faCheck}</IconButton>);

    const button = screen.getByRole('button', { name: 'Confirm' });
    const icon = button.querySelector('svg');

    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toContain('au:flex');
    expect(button.className).toContain('au:text-sm');
    expect(button.className).toContain('au:bg-transparent');
    expect(button.className).toContain('au:border-primary');
    expect(button.className).toContain('au:text-primary');
    expect(icon?.getAttribute('data-icon')).toBe('check');
  });

  it('renders an anchor when href is provided', () => {
    render(
      <IconButton href="/projects" target="_blank" aria-label="Open projects">
        {faPlus}
      </IconButton>
    );

    const button = screen.getByRole('link', { name: 'Open projects' });
    const icon = button.querySelector('svg');

    expect(button.tagName).toBe('A');
    expect(button.getAttribute('href')).toBe('/projects');
    expect(button.getAttribute('target')).toBe('_blank');
    expect(icon?.getAttribute('data-icon')).toBe('plus');
  });

  it('applies explicit size, color, variant, and custom classes', () => {
    render(
      <IconButton
        aria-label="Accent action"
        color="accent"
        size="lg"
        variant="filled"
        classes={{
          children: 'custom-child',
          iconButton: 'custom-icon-button',
        }}
      >
        {faCheck}
      </IconButton>
    );

    const button = screen.getByRole('button', { name: 'Accent action' });
    const icon = button.querySelector('svg');

    expect(button.className).toContain('au:text-lg');
    expect(button.className).toContain('au:bg-accent');
    expect(button.className).toContain('au:hover:bg-accent-hover');
    expect(button.className).toContain('custom-icon-button');
    expect(icon?.getAttribute('class')).toContain('custom-child');
  });

  it('forwards native button props and click handlers', () => {
    const handleClick = vi.fn();

    render(
      <IconButton aria-label="Submit" disabled onClick={handleClick} type="submit">
        {faCheck}
      </IconButton>
    );

    const button = screen.getByRole('button', { name: 'Submit' });

    fireEvent.click(button);

    expect(button.getAttribute('type')).toBe('submit');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards anchor click handlers', () => {
    const handleClick = vi.fn((event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });

    render(
      <IconButton href="/contact" aria-label="Open contact" onClick={handleClick}>
        {faCheck}
      </IconButton>
    );

    const button = screen.getByRole('link', { name: 'Open contact' });

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders and normalizes native image children', () => {
    render(
      <IconButton aria-label="Profile" classes={{ children: 'custom-image' }}>
        <img src="/images/profile.jpg" alt="Profile image" width={1} height={1} />
      </IconButton>
    );

    const button = screen.getByRole('button', { name: 'Profile' });
    const image = screen.getByAltText('Profile image');

    expect(button.contains(image)).toBe(true);
    expect(image.getAttribute('width')).toBe('24');
    expect(image.getAttribute('height')).toBe('24');
    expect(image.getAttribute('class')).toContain('au:object-cover');
    expect(image.getAttribute('class')).toContain('custom-image');
  });
});
