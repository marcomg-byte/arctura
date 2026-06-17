import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MouseEvent } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Link } from '@/components/ui/atomics/typography/Link';

afterEach(cleanup);

describe('Link', () => {
  it('renders a paragraph-style typography link by default', () => {
    render(
      <Link href="/projects" target="_blank" color="secondary">
        Projects
      </Link>
    );

    const anchor = screen.getByRole('link', { name: 'Projects' });
    const text = screen.getByText('Projects');

    expect(anchor.getAttribute('href')).toBe('/projects');
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.className).toContain('mg:flex');
    expect(text.tagName).toBe('P');
    expect(text.className).toContain('mg:text-secondary');
    expect(text.className).toContain('mg:cursor-pointer');
  });

  it('renders heading typography for heading variants', () => {
    render(
      <Link href="/about" variant="h3" color="accent">
        About
      </Link>
    );

    const heading = screen.getByRole('heading', { level: 3, name: 'About' });

    expect(heading.tagName).toBe('H3');
    expect(heading.className).toContain('mg:text-accent');
    expect(heading.className).toContain('mg:group-hover:text-subtle-hover');
  });

  it('forwards anchor props, click handlers, and custom classes', () => {
    const handleClick = vi.fn((event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });

    render(
      <Link
        href="/contact"
        onClick={handleClick}
        classes={{ anchor: 'custom-anchor', typography: 'custom-type' }}
        anchorProps={{ 'aria-label': 'Open contact page', rel: 'noreferrer' }}
      >
        Contact
      </Link>
    );

    const anchor = screen.getByRole('link', { name: 'Open contact page' });
    const text = screen.getByText('Contact');

    fireEvent.click(anchor);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(anchor.getAttribute('rel')).toBe('noreferrer');
    expect(anchor.className).toContain('custom-anchor');
    expect(text.className).toContain('custom-type');
  });
});
