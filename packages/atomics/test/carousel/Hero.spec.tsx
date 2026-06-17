import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Hero } from '@/src/carousel/Hero';

const emblaState = vi.hoisted(() => ({
  selected: 0,
  snaps: [0, 1],
  ref: vi.fn(),
  api: {
    on: vi.fn(),
    off: vi.fn(),
    scrollNext: vi.fn(),
    scrollPrev: vi.fn(),
    scrollTo: vi.fn((index: number) => {
      emblaState.selected = index;
    }),
    scrollSnapList: vi.fn(() => emblaState.snaps),
    selectedScrollSnap: vi.fn(() => emblaState.selected),
  },
}));

vi.mock('embla-carousel-react', () => ({
  default: vi.fn(() => [emblaState.ref, emblaState.api]),
}));

beforeEach(() => {
  emblaState.selected = 0;
  emblaState.snaps = [0, 1];
  Object.values(emblaState.api).forEach((method) => {
    if ('mockClear' in method) method.mockClear();
  });
});

afterEach(cleanup);

const images = [
  { src: '/images/hero-1.jpg', alt: 'Hero one' },
  { src: '/images/hero-2.jpg', alt: 'Hero two' },
];

describe('Hero', () => {
  it('renders images, header content, and action links', () => {
    render(
      <Hero
        images={images}
        header={{
          title: 'Welcome',
          description: <p>Build something useful.</p>,
          links: [{ href: '/projects', label: 'Projects', variant: 'outline' }],
          variant: 'h2',
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Welcome' })).toBeDefined();
    expect(screen.getByText('Build something useful.')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Projects' }).getAttribute('href')).toBe('/projects');
    expect(screen.getByAltText('Hero one').getAttribute('src')).toContain('hero-1.jpg');
    expect(screen.getByAltText('Hero two').getAttribute('src')).toContain('hero-2.jpg');
  });

  it('renders controls and dots for multiple images and calls mocked Embla API', () => {
    render(<Hero images={images} />);

    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[3]);

    expect(emblaState.api.scrollPrev).toHaveBeenCalledTimes(1);
    expect(emblaState.api.scrollNext).toHaveBeenCalledTimes(1);
    expect(emblaState.api.scrollTo).toHaveBeenCalledWith(1);
  });

  it('hides controls and dots when disabled or when only one image exists', () => {
    render(<Hero images={images} showControls={false} showDots={false} />);

    expect(screen.queryAllByRole('button')).toHaveLength(0);

    cleanup();
    render(<Hero images={[images[0]]} />);

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('applies layout, object fit, lazy loading, and fade styles', () => {
    const { container } = render(
      <Hero
        images={images}
        aspectRatio="16:9"
        responsive={false}
        objectFit="contain"
        lazyLoad
        transition="fade"
        transitionDuration={700}
        classes={{ root: 'custom-hero', slide: 'custom-slide' }}
      />
    );

    const firstImage = screen.getByAltText('Hero one');
    const firstSlide = firstImage.parentElement as HTMLElement;

    expect(container.firstElementChild?.className).toContain('custom-hero');
    expect(firstSlide.className).toContain('mg:aspect-[16/9]');
    expect(firstSlide.className).toContain('mg:transition-opacity');
    expect(firstSlide.className).toContain('custom-slide');
    expect(firstSlide.getAttribute('style')).toContain('transition-duration: 700ms');
    expect(firstImage.getAttribute('loading')).toBe('lazy');
    expect(firstImage.getAttribute('style')).toContain('object-fit: contain');
  });
});
