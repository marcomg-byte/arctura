import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Connector } from '@/src/progress-stepper/Connector';

afterEach(cleanup);

describe('Connector', () => {
  it('renders horizontal pending connector by default', () => {
    const { container } = render(<Connector data-testid="connector" />);

    const content = container.querySelector('[data-testid="connector"]')
      ?.firstElementChild as HTMLElement;

    expect(content.className).toContain('mg:h-2px');
    expect(content.className).toContain('mg:w-full');
    expect(content.className).toContain('mg:bg-accent');
  });

  it('renders active, completed, and vertical states', () => {
    const { rerender, container } = render(
      <Connector active orientation="vertical" data-testid="connector" />
    );

    let content = container.querySelector('[data-testid="connector"]')
      ?.firstElementChild as HTMLElement;
    expect(content.className).toContain('mg:w-2px');
    expect(content.className).toContain('mg:h-full');
    expect(content.className).toContain('mg:bg-primary');

    rerender(<Connector completed data-testid="connector" />);
    content = container.querySelector('[data-testid="connector"]')
      ?.firstElementChild as HTMLElement;
    expect(content.className).toContain('mg:bg-success-primary');
  });

  it('renders nothing for the last index', () => {
    const { container } = render(<Connector lastIndex />);

    expect(container.firstElementChild).toBeNull();
  });
});
