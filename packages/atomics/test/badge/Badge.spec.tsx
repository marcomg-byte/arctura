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
    expect(badge.className).toContain('mg:flex');
    expect(badge.className).toContain('mg:px-3');
    expect(badge.className).toContain('mg:text-base');
    expect(badge.className).toContain('mg:bg-primary');
    expect(badge.className).toContain('mg:border-primary');
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
    expect(badge.className).toContain('mg:hover:bg-primary-hover');
  });

  it('applies explicit size, color, variant, and custom classes', () => {
    render(
      <Badge color="danger" size="lg" variant="outline" className="custom-badge">
        Critical
      </Badge>
    );

    const badge = screen.getByText('Critical');

    expect(badge.className).toContain('mg:px-4');
    expect(badge.className).toContain('mg:text-lg');
    expect(badge.className).toContain('mg:bg-transparent');
    expect(badge.className).toContain('mg:border-danger');
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
    expect(icon?.getAttribute('class')).toContain('mg:text-success');
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
    expect(icon?.getAttribute('class')).toContain('mg:text-info');
    expect(badge.lastElementChild).toBe(icon);
  });
});
