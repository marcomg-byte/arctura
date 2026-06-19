import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Node } from '../../src/progress-stepper/Node';

afterEach(cleanup);

describe('Node', () => {
  it('renders a circular node with default size and color', () => {
    render(<Node>1</Node>);

    const node = screen.getByText('1');

    expect(node.className).toContain('mg:inline-flex');
    expect(node.className).toContain('mg:rounded-full');
    expect(node.className).toContain('mg:h-6');
    expect(node.className).toContain('mg:border-primary');
  });

  it('applies extended variant, color, size, and custom classes', () => {
    render(
      <Node variant="extended" size="lg" color="warning" classes={{ container: 'custom-node' }}>
        Step
      </Node>
    );

    const node = screen.getByText('Step');

    expect(node.className).toContain('mg:rounded-lg');
    expect(node.className).toContain('mg:w-6');
    expect(node.className).toContain('mg:h-4');
    expect(node.className).toContain('mg:border-warning');
    expect(node.className).toContain('custom-node');
  });

  it('renders start and end adornments', () => {
    const { container } = render(
      <Node
        startAdornment={faCheck}
        endAdornment={{ src: '/images/icon.png', alt: 'Icon' }}
        classes={{ adornment: 'custom-adornment' }}
      >
        2
      </Node>
    );

    const icon = container.querySelector('svg');
    const image = screen.getByAltText('Icon');

    expect(icon?.getAttribute('data-icon')).toBe('check');
    expect(icon?.getAttribute('class')).toContain('custom-adornment');
    expect(image.getAttribute('src')).toContain('icon.png');
  });
});
