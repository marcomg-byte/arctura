import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Card } from '../../src/card/Card';
import { Header } from '../../src/card/Header';
import { Media } from '../../src/card/Media';
import { Footer } from '../../src/card/Footer';

afterEach(cleanup);

describe('Card', () => {
  it('renders only recognized card slots in header, media, footer order', () => {
    const { container } = render(
      <Card data-testid="card">
        <Footer title="Footer title" />
        <span>Ignored child</span>
        <Media src="/images/card.jpg" alt="Card media" />
        <Header title="Header title" />
      </Card>
    );

    const card = screen.getByTestId('card');
    const directChildren = Array.from(card.children);

    expect(card.className).toContain('mg:flex');
    expect(screen.queryByText('Ignored child')).toBeNull();
    expect(directChildren[0].textContent).toContain('Header title');
    expect(directChildren[1].querySelector('img')?.getAttribute('alt')).toBe('Card media');
    expect(directChildren[2].textContent).toContain('Footer title');
    expect(container.querySelector('img')?.getAttribute('src')).toContain('card.jpg');
  });

  it('marks standalone media as headerless and footerless', () => {
    const { container } = render(
      <Card>
        <Media src="/images/card.jpg" alt="Card media" />
      </Card>
    );

    const media = container.querySelector('img')?.parentElement as HTMLElement;

    expect(media.className).toContain('mg:rounded-tl-lg');
    expect(media.className).toContain('mg:rounded-bl-lg');
  });
});
