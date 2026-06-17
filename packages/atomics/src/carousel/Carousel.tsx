'use client';
import type { FC, HTMLAttributes, ReactNode, Ref } from 'react';
import { Children, useState, useEffect, useRef, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/src/buttons';
import type { IconButtonVariant } from '@/src/buttons';

/**
 * Optional class overrides for the carousel layout regions.
 */
interface CarouselClasses {
  /** Class applied to the outer carousel container. */
  container?: string;
  /** Class applied to the carousel controls. */
  controls?: string;
  /** Class applied to the controls wrapper. */
  controlsContainer?: string;
  /** Class applied to each pagination dot. */
  dot?: string;
  /** Class applied to the pagination dots container. */
  dotsContainer?: string;
  /** Class applied to the root carousel wrapper. */
  root?: string;
  /** Class applied to each carousel slide. */
  slide?: string;
  /** Class applied to the slides container. */
  slidesContainer?: string;
  /** Class applied to the inner slide content wrapper. */
  slideInner?: string;
}

/**
 * Gap size (in px) between carousel slides.
 * @type {8|16|24|32|40|48}
 */
type CarouselGap = 8 | 16 | 24 | 32 | 40 | 48;

/**
 * ARIA role for the carousel container for accessibility.
 * @type {'region'|'listbox'|'group'}
 */
type CarouselRole = 'region' | 'listbox' | 'group';

/**
 * Number of slides visible at once in the carousel.
 * @type {1|2|3|4|5}
 */
type CarouselSlidesPerView = 1 | 2 | 3 | 4 | 5;

/**
 * Number of slides to scroll per navigation action.
 * @type {1|2|3|4|5}
 */
type CarouselSlidesPerGroup = 1 | 2 | 3 | 4 | 5;

/**
 * Type of transition animation between slides.
 * @type {'fade'|'slide'}
 */
type CarouselTransition = 'fade' | 'slide';

/**
 * Maps CarouselSlidesPerView values to small breakpoint slide basis classes.
 */
const smSlideBasisClasses: Record<CarouselSlidesPerView, string> = {
  1: 'mg:sm:basis-[90%]',
  2: 'mg:sm:basis-[45%]',
  3: 'mg:sm:basis-[45%]',
  4: 'mg:sm:basis-[45%]',
  5: 'mg:sm:basis-[45%]',
};

/**
 * Maps CarouselSlidesPerView values to large breakpoint slide basis classes.
 */
const lgSlideBasisClasses: Record<CarouselSlidesPerView, string> = {
  1: 'mg:lg:basis-[90%]',
  2: 'mg:lg:basis-[45%]',
  3: 'mg:lg:basis-[30%]',
  4: 'mg:lg:basis-[22.5%]',
  5: 'mg:lg:basis-[18%]',
};

/**
 * Props for the Carousel component.
 */
interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** ARIA label for the carousel region. */
  'aria-label'?: string;
  /** Automatically advances slides on an interval. */
  autoPlay?: boolean;
  /** Slide content rendered inside the carousel. */
  children?: ReactNode;
  /** Optional class overrides for carousel layout regions. */
  classes?: CarouselClasses;
  /** Visual variant for the previous and next controls. */
  controlsVariant?: IconButtonVariant;
  /** Initial slide index to show on mount. */
  defaultIndex?: number;
  /** Enables swipe and drag gestures. */
  enableSwipe?: boolean;
  /** Horizontal gap between slides, in pixels. */
  gap?: CarouselGap;
  /** Autoplay interval, in milliseconds. */
  interval?: number;
  /** Number of slides visible in the viewport. */
  slidesPerView?: CarouselSlidesPerView;
  /** Number of slides advanced per navigation action. */
  slidesPerGroup?: CarouselSlidesPerGroup;
  /** Enables looping when the carousel reaches either end. */
  loop?: boolean;
  /** Pauses autoplay while the pointer is over the carousel. */
  pauseOnHover?: boolean;
  /** ARIA role for the carousel wrapper. */
  role?: CarouselRole;
  /** Ref forwarded to the outer carousel wrapper. */
  ref?: Ref<HTMLDivElement>;
  /** Shows the previous and next navigation buttons. */
  showControls?: boolean;
  /** Shows pagination dots below the carousel. */
  showDots?: boolean;
  /** Transition style between slides. */
  transition?: CarouselTransition;
  /** Transition duration used by Embla, in milliseconds. */
  transitionDuration?: number;
}

/**
 * Carousel component for displaying a set of slides with optional autoplay, navigation controls, dots, and swipe support.
 *
 * @param {CarouselProps} props - Props for configuring the carousel behavior and appearance.
 * @returns {JSX.Element} The rendered carousel component.
 *
 * @example
 * ```tsx
 * import { Carousel } from '@/src';
 *
 * const MyCarousel = () => (
 *  <Carousel
 *     aria-label="Example Carousel"
 *     autoPlay
 *     interval={5000}
 *     slidesPerView={1}
 *     showControls
 *     showDots
 *     transition="fade"
 *     transitionDuration={50}
 * >
 *    <div>Slide 1</div>
 *    <div>Slide 2</div>
 *    <div>Slide 3</div>
 * </Carousel>
 * );
 * ```
 */
const Carousel: FC<CarouselProps> = ({
  'aria-label': ariaLabel,
  autoPlay = false,
  children,
  controlsVariant = 'filled',
  classes = {},
  defaultIndex = 0,
  enableSwipe = true,
  gap = 16,
  interval = 3000,
  slidesPerView = 3,
  slidesPerGroup = 3,
  loop = true,
  pauseOnHover = true,
  ref,
  role = 'region',
  showControls = true,
  showDots = true,
  transition = 'slide',
  transitionDuration = 25,
  ...rest
}) => {
  const smSlidesPerGroup = Math.min(slidesPerGroup, 2) as CarouselSlidesPerGroup;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      startIndex: defaultIndex,
      watchDrag: enableSwipe,
      slidesToScroll: slidesPerGroup,
      duration: Math.min(Math.max(transitionDuration, 20), 60),
      breakpoints: {
        '(max-width: 39.999rem)': { slidesToScroll: 1 },
        '(min-width: 40rem) and (max-width: 63.999rem)': {
          slidesToScroll: smSlidesPerGroup,
        },
      },
    },
    [...(transition === 'fade' ? [Fade()] : [])]
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>(() => emblaApi?.scrollSnapList() ?? []);

  const isPaused = useRef(false);
  const slidesLength = Children.toArray(children).length;
  const hasMultipleSlides = slidesLength > 1;

  const handleMouseEnter = () => {
    if (pauseOnHover) isPaused.current = true;
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) isPaused.current = false;
  };

  const handleNext = useCallback(() => {
    if (!emblaApi) return;
    const lastSnapIndex = emblaApi.scrollSnapList().length - 1;
    const isLastSnap = emblaApi.selectedScrollSnap() === lastSnapIndex;

    if (loop && isLastSnap) {
      emblaApi.scrollTo(0);
      return;
    }

    emblaApi.scrollNext();
  }, [emblaApi, loop]);

  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const handleScrollTo = (index: number) => {
    if (!emblaApi) return;
    emblaApi?.scrollTo(index);
  };

  const handlePrev = () => {
    if (!emblaApi) return;
    const lastSnapIndex = emblaApi.scrollSnapList().length - 1;
    const isFirstSnap = emblaApi.selectedScrollSnap() === 0;

    if (loop && isFirstSnap) {
      emblaApi.scrollTo(lastSnapIndex);
      return;
    }

    emblaApi.scrollPrev();
  };

  const rootClasses = twMerge(
    'mg:flex mg:flex-col mg:justify-center mg:items-center mg:w-full',
    classes?.root
  );

  const containerClasses = twMerge(
    classNames(
      'mg:relative mg:flex mg:justify-start mg:w-full mg:pt-4 mg:px-3 mg:overflow-hidden mg:xs:px-4 mg:sm:pt-6 mg:sm:px-8',
      {
        'mg:cursor-grab': enableSwipe,
      }
    ),
    classes?.container
  );

  const controlsContainerClasses = twMerge(
    'mg:absolute mg:top-1/2 mg:left-0 mg:w-full mg:flex mg:items-center mg:justify-between mg:px-1 mg:pointer-events-none mg:sm:px-2',
    classes?.controlsContainer
  );

  const controlsClasses = classNames('mg:pointer-events-auto', classes?.controls);

  const dotClasses = (index: number) =>
    twMerge(
      classNames('mg:w-2 mg:h-2 mg:rounded-full mg:hover:cursor-pointer', {
        'mg:bg-secondary': index === selectedIndex,
        'mg:bg-secondary-subtle': index !== selectedIndex,
      }),
      classes?.dot
    );

  const dotsContainerClasses = twMerge(
    'mg:flex mg:justify-center mg:items-center mg:gap-2 mg:w-full mg:h-6',
    classes?.dotsContainer
  );

  const slidesContainerClasses = twMerge(
    classNames('mg:flex mg:items-stretch mg:justify-start mg:pb-3 mg:w-full', {
      'mg:gap-1 mg:pl-1': gap === 8,
      'mg:gap-2 mg:pl-2': gap === 16,
      'mg:gap-3 mg:pl-3': gap === 24,
      'mg:gap-4 mg:pl-4': gap === 32,
      'mg:gap-5 mg:pl-5': gap === 40,
      'mg:gap-6 mg:pl-6': gap === 48,
    }),
    classes?.slidesContainer
  );

  const slideClasses = twMerge(
    classNames(
      'mg:h-full mg:flex mg:justify-center mg:items-stretch mg:min-w-0 mg:basis-[90%] mg:p-2 mg:shrink-0',
      smSlideBasisClasses[slidesPerView],
      lgSlideBasisClasses[slidesPerView]
    ),
    classes?.slide
  );

  const slideInnerClasses = twMerge(
    classNames('mg:flex mg:w-full', {
      'mg:justify-center': slidesPerView > 1,
    }),
    classes?.slideInner
  );

  const renderSlides = (children: ReactNode) => {
    const slides = Children.toArray(children);

    return slides.map((slide, index) => (
      <div key={`slide-${index}`} className={slideClasses}>
        <div className={slideInnerClasses}>{slide}</div>
      </div>
    ));
  };

  useEffect(() => {
    if (!emblaApi) return;
    const onReInit = () => setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('reInit', onReInit);
    emblaApi.on('select', handleSelect);
    return () => {
      emblaApi.off('reInit', onReInit);
      emblaApi.off('select', handleSelect);
    };
  }, [emblaApi, handleSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    queueMicrotask(() => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [children, emblaApi, slidesPerGroup, slidesPerView, smSlidesPerGroup]);

  useEffect(() => {
    if (!autoPlay || !emblaApi) return;
    const tick = () => {
      if (!isPaused.current) handleNext();
    };
    const timer = setInterval(tick, interval);
    return () => clearInterval(timer);
  }, [autoPlay, emblaApi, handleNext, interval]);

  return (
    <div className={rootClasses} ref={ref} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      <div
        aria-label={ariaLabel}
        role={role}
        className={containerClasses}
        ref={emblaRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={slidesContainerClasses}>{renderSlides(children)}</div>
        {showControls && hasMultipleSlides && (
          <div className={controlsContainerClasses}>
            <IconButton
              variant={controlsVariant}
              color="secondary"
              classes={{ iconButton: controlsClasses }}
              onClick={handlePrev}
            >
              {faChevronLeft}
            </IconButton>
            <IconButton
              variant={controlsVariant}
              color="secondary"
              classes={{ iconButton: controlsClasses }}
              onClick={handleNext}
            >
              {faChevronRight}
            </IconButton>
          </div>
        )}
      </div>
      {showDots && scrollSnaps.length >= 1 && (
        <div className={dotsContainerClasses}>
          {scrollSnaps.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={dotClasses(index)}
              onClick={() => handleScrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.displayName = 'Carousel';

export { Carousel };
