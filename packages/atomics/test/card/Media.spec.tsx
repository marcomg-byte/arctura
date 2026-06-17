import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Media } from '@/components/ui/atomics/card/Media';

afterEach(cleanup);

describe('Media', () => {
  it('renders a Next image with default media classes', () => {
    const { container } = render(
      <Media src="/images/project.jpg" alt="Project preview" />,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    const image = screen.getByAltText('Project preview');

    expect(wrapper.className).toContain('mg:relative');
    expect(wrapper.className).toContain('mg:aspect-[4/3]');
    expect(image.getAttribute('src')).toContain('project.jpg');
    expect(image.getAttribute('sizes')).toContain('100vw');
    expect(image.className).toContain('mg:object-cover');
  });

  it('applies aspect ratio and header/footer rounding props', () => {
    const { container } = render(
      <Media
        src="/images/project.jpg"
        alt="Project preview"
        aspectRatio="16:9"
        headerless
        footerless
        priority="eager"
        sizes="50vw"
      />,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    const image = screen.getByAltText('Project preview');

    expect(wrapper.className).toContain('mg:aspect-video');
    expect(wrapper.className).toContain('mg:rounded-tl-lg');
    expect(wrapper.className).toContain('mg:rounded-br-lg');
    expect(image.getAttribute('sizes')).toBe('50vw');
    expect(image.getAttribute('loading')).not.toBe('lazy');
  });
});
