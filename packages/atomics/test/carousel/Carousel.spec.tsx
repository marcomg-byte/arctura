import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Carousel } from '@/components/ui/atomics/carousel/Carousel';

const emblaState = vi.hoisted(() => ({
  selected: 0,
  snaps: [0, 1, 2],
  ref: vi.fn(),
  api: {
    on: vi.fn(),
    off: vi.fn(),
    reInit: vi.fn(),
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

vi.mock('embla-carousel-fade', () => ({
  default: vi.fn(() => ({ name: 'fade' })),
}));

beforeEach(() => {
  emblaState.selected = 0;
  emblaState.snaps = [0, 1, 2];
  Object.values(emblaState.api).forEach((method) => {
    if ('mockClear' in method) method.mockClear();
  });
});

afterEach(cleanup);

describe('Carousel', () => {
  it('renders slides, controls, and dots', () => {
    render(
      <Carousel aria-label="Featured projects">
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>,
    );

    expect(
      screen.getByRole('region', { name: 'Featured projects' }),
    ).toBeDefined();
    expect(screen.getByText('Slide 1')).toBeDefined();
    expect(screen.getByText('Slide 2')).toBeDefined();
    expect(screen.getByText('Slide 3')).toBeDefined();
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('calls mocked Embla navigation from controls and dots', () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>,
    );

    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[4]);

    expect(emblaState.api.scrollTo).toHaveBeenCalledWith(2);
    expect(emblaState.api.scrollTo).toHaveBeenCalledWith(0);
  });

  it('hides controls and dots when disabled', () => {
    render(
      <Carousel showControls={false} showDots={false}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>,
    );

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('applies custom classes and responsive slide basis', () => {
    const { container } = render(
      <Carousel
        gap={32}
        slidesPerView={4}
        classes={{
          root: 'custom-root',
          container: 'custom-container',
          slide: 'custom-slide',
        }}
      >
        <div>Slide 1</div>
      </Carousel>,
    );

    expect(container.firstElementChild?.className).toContain('custom-root');
    expect(
      screen.getByText('Slide 1').parentElement?.parentElement?.className,
    ).toContain('custom-slide');
    expect(
      screen.getByText('Slide 1').parentElement?.parentElement?.className,
    ).toContain('mg:lg:basis-[22.5%]');
    expect(container.querySelector('.custom-container')?.className).toContain(
      'mg:cursor-grab',
    );
  });
});
