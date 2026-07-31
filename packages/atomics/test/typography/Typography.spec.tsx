import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Typography } from '../../src/typography/Typography';

afterEach(cleanup);

describe('Typography', () => {
  it('renders heading variants as the matching heading element', () => {
    render(
      <Typography variant="h2" bold color="accent" align="center">
        Section title
      </Typography>
    );

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Section title',
    });

    expect(heading.tagName).toBe('H2');
    expect(heading.className).toContain('au:font-extrabold');
    expect(heading.className).toContain('au:text-accent');
    expect(heading.className).toContain('au:text-center');
    expect(heading.className).toContain('au:text-4xl');
  });

  it('renders paragraph variants by default', () => {
    render(
      <Typography variant="large" color="secondary" clamp={4}>
        Body copy
      </Typography>
    );

    const paragraph = screen.getByText('Body copy');

    expect(paragraph.tagName).toBe('P');
    expect(paragraph.className).toContain('au:font-body');
    expect(paragraph.className).toContain('au:text-secondary');
    expect(paragraph.className).toContain('au:line-clamp-4');
  });

  it('renders as a span when requested', () => {
    render(
      <Typography span variant="small" truncate underline removePadding className="custom-type">
        Inline label
      </Typography>
    );

    const span = screen.getByText('Inline label');

    expect(span.tagName).toBe('SPAN');
    expect(span.className).toContain('au:truncate');
    expect(span.className).toContain('au:underline');
    expect(span.className).toContain('custom-type');
    expect(span.className).not.toContain('au:py-1');
  });
});
