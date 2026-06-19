import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '../../src/badge/Badge';
import { Header } from '../../src/card/Header';

afterEach(cleanup);

describe('Header', () => {
  it('renders title and subtitle typography', () => {
    render(<Header title="Project" subtitle="Featured work" />);

    const title = screen.getByRole('heading', { level: 2, name: 'Project' });
    const subtitle = screen.getByText('Featured work');

    expect(title.className).toContain('mg:lg:text-2xl');
    expect(subtitle.tagName).toBe('P');
  });

  it('renders icon adornments and cloned badges', () => {
    const { container } = render(
      <Header title="Project" adornment={faStar} badge={<Badge color="success">New</Badge>} />
    );

    const icon = container.querySelector('svg');
    const badge = screen.getByText('New');

    expect(icon?.getAttribute('data-icon')).toBe('star');
    expect(badge.className).toContain('mg:animate-fade-in');
    expect(badge.className).toContain('mg:text-xs');
    expect(badge.getAttribute('style')).toContain('animation-duration: 2s');
  });

  it('renders image adornments', () => {
    render(<Header title="Project" adornment={{ src: '/images/logo.png', alt: 'Logo' }} />);

    const image = screen.getByAltText('Logo');

    expect(image.getAttribute('src')).toContain('logo.png');
    expect(image.getAttribute('width')).toBe('40');
    expect(image.getAttribute('height')).toBe('40');
  });
});
