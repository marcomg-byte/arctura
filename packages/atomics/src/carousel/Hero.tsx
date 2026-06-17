'use client';
import type { FC, HTMLAttributes, ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Button, IconButton } from '../buttons';
import { Typography } from '../typography';
import type { HeadingVariant } from '../typography';

/**
 * Optional class overrides for the hero layout regions.
 */
interface HeaderClasses {
  /** Class applied to the header action row. */
  action?: string;
  /** Class applied to the overlay controls wrapper. */
  controls?: string;
  /** Class applied to each pagination dot. */
  dot?: string;
  /** Class applied to the pagination dots container. */
  dotsContainer?: string;
  /** Class applied to the root hero container. */
  root?: string;
  /** Class applied to each hero slide. */
  slide?: string;
  /** Class applied to the slide viewport wrapper. */
  viewport?: string;
  /** Classes applied to header overlay regions. */
  header?: {
    /** Class applied to the main header overlay container. */
    root?: string;
    /** Class applied to the header title. */
    title?: string;
  };
}

/**
 * Represents a link/button in the Hero section.
 */
interface HeroLink {
  /** Destination URL for the hero action. */
  href: string;
  /** Visible label for the action. */
  label: string;
  /** Optional visual style for the action button. */
  variant?: 'primary' | 'secondary' | 'text' | 'outline';
}

/**
 * Header content for the Hero section, including title, description, and links.
 */
interface HeroHeader {
  /** Optional description text rendered below the title. */
  description?: ReactNode;
  /** Optional array of action links or buttons shown in the header. */
  links?: HeroLink[];
  /** Optional title content, either plain text or JSX. */
  title?: string;
  /** Typography variant used for the title. */
  variant?: HeadingVariant;
}

/**
 * Represents an image displayed in the Hero carousel.
 */
interface HeroImage {
  /** Source path or URL for the hero image. */
  src: string;
  /** Alternative text describing the hero image. */
  alt: string;
}

/**
 * Allowed height options for the Hero component.
 * @type {'sm'|'md'|'lg'|'xl'|'full'}
 */
type HeroHeight = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Maps HeroHeight values to Tailwind CSS height classes.
 * @property {'sm'} sm - Small height class.
 * @property {'md'} md - Medium height class.
 * @property {'lg'} lg - Large height class.
 * @property {'xl'} xl - Extra large height class.
 * @property {'full'} full - Full height class.
 */
const heightClasses: Record<HeroHeight, string> = {
  sm: 'mg:h-[300px]',
  md: 'mg:h-[450px]',
  lg: 'mg:h-[600px]',
  xl: 'mg:h-[750px]',
  full: 'mg:h-full',
};

/**
 * Maps HeroHeight values to responsive Tailwind CSS height classes.
 * @property {'sm'} sm - Small responsive height class.
 * @property {'md'} md - Medium responsive height class.
 * @property {'lg'} lg - Large responsive height class.
 * @property {'xl'} xl - Extra large responsive height class.
 * @property {'full'} full - Full-height responsive class.
 */
const responsiveHeightClasses: Record<HeroHeight, string> = {
  sm: 'mg:h-[260px] mg:sm:h-[300px]',
  md: 'mg:h-[340px] mg:sm:h-[450px]',
  lg: 'mg:h-[420px] mg:sm:h-[600px]',
  xl: 'mg:h-[520px] mg:sm:h-[750px]',
  full: 'mg:min-h-svh mg:h-svh',
};

/**
 * Allowed aspect ratio options for the Hero component.
 * @type {'16:9'|'4:3'|'1:1'}
 */
type HeroAspectRatio = '16:9' | '4:3' | '1:1';

/**
 * Maps HeroAspectRatio values to Tailwind CSS aspect ratio classes.
 * @property {'16:9'} '16:9' - 16:9 aspect ratio class.
 * @property {'4:3'} '4:3' - 4:3 aspect ratio class.
 * @property {'1:1'} '1:1' - 1:1 aspect ratio class.
 */
const aspectRatioClasses: Record<HeroAspectRatio, string> = {
  '16:9': 'mg:aspect-[16/9]',
  '4:3': 'mg:aspect-[4/3]',
  '1:1': 'mg:aspect-square',
};

/**
 * Maps HeroAspectRatio values to responsive Tailwind CSS aspect ratio classes.
 * @property {'16:9'} '16:9' - 16:9 responsive aspect ratio class.
 * @property {'4:3'} '4:3' - 4:3 responsive aspect ratio class.
 * @property {'1:1'} '1:1' - 1:1 responsive aspect ratio class.
 */
const responsiveAspectRatioClasses: Record<HeroAspectRatio, string> = {
  '16:9': 'mg:aspect-[4/5] mg:sm:aspect-[16/9]',
  '4:3': 'mg:aspect-[4/5] mg:sm:aspect-[4/3]',
  '1:1': 'mg:aspect-square',
};

/**
 * Props for the Hero component, configuring layout, images, header, and carousel behavior.
 */
interface HeroProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Aspect ratio used when the hero is rendered as an image container. */
  aspectRatio?: HeroAspectRatio;
  /** Automatically advances between images on a timer. */
  autoPlay?: boolean;
  /** Optional class overrides for hero layout regions. */
  classes?: HeaderClasses;
  /** Enables swipe and drag gestures for the hero carousel. */
  enableSwipe?: boolean;
  /** Header content rendered over the hero images. */
  header?: HeroHeader;
  /** Fixed hero height preset used when `aspectRatio` is not provided. */
  height?: HeroHeight;
  /** Images displayed inside the hero carousel. */
  images?: HeroImage[];
  /** Autoplay interval in milliseconds. */
  interval?: number;
  /** Uses lazy loading for hero images instead of eager loading. */
  lazyLoad?: boolean;
  /** Enables looping when the carousel reaches either end. */
  loop?: boolean;
  /** CSS object-fit value used for the hero images. */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Shows the previous and next navigation controls. */
  showControls?: boolean;
  /** Pauses autoplay while the pointer is over the hero. */
  pauseOnHover?: boolean;
  /** Enables the mobile-first responsive layout. */
  responsive?: boolean;
  /** Shows pagination dots below the hero. */
  showDots?: boolean;
  /** Transition style used between hero images. */
  transition?: 'fade' | 'slide';
  /** Transition duration in milliseconds. */
  transitionDuration?: number;
}

/**
 * Hero component for displaying a prominent section with images, header, and carousel features.
 *
 * @param {HeroProps} props - Props for configuring the hero section's layout, images, and behavior.
 * @returns {JSX.Element} The rendered hero section.
 *
 * @example
 * ```tsx
 * import { Hero } from '@/components/ui/atomics';
 *
 * const MyHero = () => (
 *  <Hero
 *     aspectRatio="16:9"
 *     autoPlay
 *     header={{
 *      title: 'Welcome to Our Site',
 *      description: 'Discover our amazing products and services.',
 *      links: [
 *        { href: '/products', label: 'Shop Now', variant: 'primary' },
 *        { href: '/about', label: 'Learn More', variant: 'secondary' },
 *      ],
 *    }}
 *    height="lg"
 *    images={[
 *      { src: '/images/hero1.jpg', alt: 'Hero Image 1' },
 *      { src: '/images/hero2.jpg', alt: 'Hero Image 2' },
 *    ]}
 *    interval={5000}
 *    lazyLoad
 *    loop
 *    objectFit="cover"
 *    showControls
 *    pauseOnHover
 *    responsive
 *    showDots
 *    transition="fade"
 *    transitionDuration={700}
 *  >
 *    {Hero content goes here}
 *  </Hero>
 * );
 * ```
 */
const Hero: FC<HeroProps> = ({
  aspectRatio,
  autoPlay = false,
  classes = {},
  enableSwipe = true,
  header = { links: [], variant: 'h2' },
  height = 'md',
  images = [],
  interval = 3000,
  lazyLoad = false,
  loop = true,
  objectFit = 'cover',
  showControls = true,
  pauseOnHover = true,
  responsive = true,
  showDots = true,
  transition = 'slide',
  transitionDuration = 500,
  ...rest
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    watchDrag: enableSwipe,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>(() =>
    images.map((_, i) => i),
  );
  const isPaused = useRef(false);

  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const handleMouseEnter = () => {
    if (pauseOnHover) isPaused.current = true;
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) isPaused.current = false;
  };

  const handleNext = () => {
    if (!emblaApi) return;
    emblaApi?.scrollNext();
  };

  const handlePrev = () => {
    if (!emblaApi) return;
    emblaApi?.scrollPrev();
  };

  const handleScrollTo = (index: number) => {
    if (!emblaApi) return;
    emblaApi?.scrollTo(index);
  };

  const imageContainerClasses = aspectRatio
    ? responsive
      ? responsiveAspectRatioClasses[aspectRatio]
      : aspectRatioClasses[aspectRatio]
    : responsive
      ? responsiveHeightClasses[height]
      : heightClasses[height];

  const containerClasses = twMerge(
    classNames(
      'mg:relative mg:overflow-hidden mg:isolate',
      responsive && 'mg:w-full',
      enableSwipe && 'mg:cursor-grab',
    ),
    classes?.root,
  );

  const viewportClasses = twMerge(
    classNames('mg:flex', {
      'mg:touch-pan-y': enableSwipe,
    }),
    classes?.viewport,
  );

  const dotClasses = (index: number) =>
    twMerge(
      classNames(
        'mg:w-2 mg:h-2 mg:rounded-full mg:transition-colors mg:hover:cursor-pointer',
        {
          'mg:bg-secondary': index === selectedIndex,
          'mg:bg-secondary-subtle': index !== selectedIndex,
        },
      ),
      classes?.dot,
    );

  const slideClasses = twMerge(
    classNames('mg:flex-[0_0_100%] mg:relative', imageContainerClasses, {
      'mg:transition-opacity': transition === 'fade',
    }),
    classes?.slide,
  );

  const headerClasses = twMerge(
    classNames(
      'mg:absolute mg:z-10 mg:flex mg:flex-col',
      responsive
        ? 'mg:inset-x-4 mg:top-1/2 mg:max-w-[calc(100%-2rem)] mg:-translate-y-1/2 mg:sm:inset-x-auto mg:sm:top-1/4 mg:sm:left-1/6 mg:sm:max-w-[min(72%,48rem)] mg:sm:translate-y-0 mg:gap-1 mg:sm:gap-2'
        : 'mg:top-1/4 mg:left-1/6 mg:gap-2',
    ),
    classes?.header?.root,
  );

  const actionClasses = twMerge(
    classNames(
      'mg:flex mg:justify-start',
      responsive
        ? 'mg:items-start mg:gap-2 mg:xs:flex-row mg:xs:flex-wrap mg:sm:items-center mg:sm:gap-4'
        : 'mg:items-center mg:gap-4',
    ),
    classes?.action,
  );

  const controlsClasses = twMerge(
    classNames(
      'mg:absolute mg:left-0 mg:z-10 mg:flex mg:w-full mg:items-center mg:justify-between mg:pointer-events-none',
      responsive
        ? 'mg:top-1/2 mg:-translate-y-1/2 mg:px-2 mg:sm:top-1/3 mg:sm:translate-y-0 mg:sm:px-6'
        : 'mg:top-1/3 mg:px-6',
    ),
    classes?.controls,
  );

  const dotsContainerClasses = twMerge(
    classNames(
      'mg:absolute mg:left-1/2 mg:z-10 mg:flex mg:-translate-x-1/2 mg:gap-2',
      responsive ? 'mg:bottom-3 mg:sm:bottom-4' : 'mg:bottom-4',
    ),
    classes?.dotsContainer,
  );

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
    if (!autoPlay || !emblaApi) return;
    const tick = () => {
      if (!isPaused.current) emblaApi.scrollNext();
    };
    const timer = setInterval(tick, interval);
    return () => clearInterval(timer);
  }, [autoPlay, emblaApi, interval]);

  return (
    <div
      className={containerClasses}
      ref={emblaRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      <div className={viewportClasses}>
        {images.map((image, index) => (
          <div
            key={`hero-image-${index}`}
            className={slideClasses}
            style={
              transition === 'fade'
                ? {
                    opacity: index === selectedIndex ? 1 : 0,
                    transitionDuration: `${transitionDuration}ms`,
                  }
                : undefined
            }
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={lazyLoad ? 'lazy' : 'eager'}
              className="mg:absolute mg:inset-0 mg:h-full mg:w-full"
              style={{ objectFit }}
            />
          </div>
        ))}
      </div>
      <div className={headerClasses}>
        {header?.title && (
          <Typography
            className={classes?.header?.title}
            color="white"
            variant={header?.variant}
          >
            {header.title}
          </Typography>
        )}
        {header?.description}
        <div className={actionClasses}>
          {header?.links?.map((link, index) => (
            <Button
              key={`hero-link-${index}`}
              href={link.href}
              variant={link.variant}
              classes={{ button: 'mg:animate-fade-in mg:duration-500' }}
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>
      {showControls && images.length > 1 && (
        <div className={controlsClasses}>
          <IconButton
            variant="filled"
            color="secondary"
            classes={{
              iconButton: 'mg:pointer-events-auto mg:animate-slide-in-left',
            }}
            onClick={handlePrev}
          >
            {faChevronLeft}
          </IconButton>
          <IconButton
            variant="filled"
            color="secondary"
            classes={{
              iconButton: 'mg:pointer-events-auto mg:animate-slide-in-right',
            }}
            onClick={handleNext}
          >
            {faChevronRight}
          </IconButton>
        </div>
      )}
      {showDots && scrollSnaps.length > 1 && (
        <div className={dotsContainerClasses}>
          {scrollSnaps.map((_, index) => (
            <button
              key={`hero-dot-${index}`}
              className={dotClasses(index)}
              onClick={() => handleScrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Hero.displayName = 'Hero';

export { Hero };
