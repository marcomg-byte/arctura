import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '../../src/badge/Badge';

afterEach(cleanup);

describe('Badge', () => {
  it('renders a div badge with the default size, color, and variant', () => {
    render(<Badge>Available</Badge>);

    const badge = screen.getByText('Available');

    expect(badge.tagName).toBe('DIV');
    expect(badge.className).toContain('au:flex');
    expect(badge.className).toContain('au:px-3');
    expect(badge.className).toContain('au:text-base');
    expect(badge.className).toContain('au:bg-primary');
    expect(badge.className).toContain('au:border-primary');
  });

  it('renders an anchor badge when href is provided', () => {
    render(
      <Badge href="/projects" target="_blank" aria-label="Projects badge">
        Projects
      </Badge>
    );

    const badge = screen.getByRole('link', { name: 'Projects badge' });

    expect(badge.tagName).toBe('A');
    expect(badge.getAttribute('href')).toBe('/projects');
    expect(badge.getAttribute('target')).toBe('_blank');
    expect(badge.getAttribute('aria-label')).toBe('Projects badge');
    expect(badge.className).toContain('au:hover:bg-primary-hover');
  });

  it('applies explicit size, color, variant, and custom classes', () => {
    render(
      <Badge color="danger" size="lg" variant="outline" className="custom-badge">
        Critical
      </Badge>
    );

    const badge = screen.getByText('Critical');

    expect(badge.className).toContain('au:px-4');
    expect(badge.className).toContain('au:text-lg');
    expect(badge.className).toContain('au:bg-transparent');
    expect(badge.className).toContain('au:border-danger');
    expect(badge.className).toContain('custom-badge');
  });

  it('renders a start icon before the badge content', () => {
    const { container } = render(
      <Badge icon={faCheck} iconPosition="start" color="success">
        Done
      </Badge>
    );

    const badge = screen.getByText('Done');
    const icon = container.querySelector('svg');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('data-icon')).toBe('check');
    expect(icon?.getAttribute('class')).toContain('au:text-success');
    expect(badge.firstElementChild).toBe(icon);
  });

  it('renders an end icon after the badge content by default', () => {
    const { container } = render(
      <Badge icon={faCheck} color="info">
        Done
      </Badge>
    );

    const badge = screen.getByText('Done');
    const icon = container.querySelector('svg');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('data-icon')).toBe('check');
    expect(icon?.getAttribute('class')).toContain('au:text-info');
    expect(badge.lastElementChild).toBe(icon);
  });
});
