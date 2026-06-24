'use client';
import type { FC, HTMLAttributes, ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Button, IconButton } from '@/src/buttons';
import { Typography } from '@/src/typography';
import type { HeadingVariant } from '@/src/typography';

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
  sm: 'au:h-[300px]',
  md: 'au:h-[450px]',
  lg: 'au:h-[600px]',
  xl: 'au:h-[750px]',
  full: 'au:h-full',
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
  sm: 'au:h-[260px] au:sm:h-[300px]',
  md: 'au:h-[340px] au:sm:h-[450px]',
  lg: 'au:h-[420px] au:sm:h-[600px]',
  xl: 'au:h-[520px] au:sm:h-[750px]',
  full: 'au:min-h-svh au:h-svh',
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
  '16:9': 'au:aspect-[16/9]',
  '4:3': 'au:aspect-[4/3]',
  '1:1': 'au:aspect-square',
};

/**
 * Maps HeroAspectRatio values to responsive Tailwind CSS aspect ratio classes.
 * @property {'16:9'} '16:9' - 16:9 responsive aspect ratio class.
 * @property {'4:3'} '4:3' - 4:3 responsive aspect ratio class.
 * @property {'1:1'} '1:1' - 1:1 responsive aspect ratio class.
 */
const responsiveAspectRatioClasses: Record<HeroAspectRatio, string> = {
  '16:9': 'au:aspect-[4/5] au:sm:aspect-[16/9]',
  '4:3': 'au:aspect-[4/5] au:sm:aspect-[4/3]',
  '1:1': 'au:aspect-square',
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
 * import { Hero } from '@/src';
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
  const [scrollSnaps, setScrollSnaps] = useState<number[]>(() => images.map((_, i) => i));
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
      'au:relative au:overflow-hidden au:isolate',
      responsive && 'au:w-full',
      enableSwipe && 'au:cursor-grab'
    ),
    classes?.root
  );

  const viewportClasses = twMerge(
    classNames('au:flex', {
      'au:touch-pan-y': enableSwipe,
    }),
    classes?.viewport
  );

  const dotClasses = (index: number) =>
    twMerge(
      classNames('au:w-2 au:h-2 au:rounded-full au:transition-colors au:hover:cursor-pointer', {
        'au:bg-secondary': index === selectedIndex,
        'au:bg-secondary-subtle': index !== selectedIndex,
      }),
      classes?.dot
    );

  const slideClasses = twMerge(
    classNames('au:flex-[0_0_100%] au:relative', imageContainerClasses, {
      'au:transition-opacity': transition === 'fade',
    }),
    classes?.slide
  );

  const headerClasses = twMerge(
    classNames(
      'au:absolute au:z-10 au:flex au:flex-col',
      responsive
        ? 'au:inset-x-4 au:top-1/2 au:max-w-[calc(100%-2rem)] au:-translate-y-1/2 au:sm:inset-x-auto au:sm:top-1/4 au:sm:left-1/6 au:sm:max-w-[min(72%,48rem)] au:sm:translate-y-0 au:gap-1 au:sm:gap-2'
        : 'au:top-1/4 au:left-1/6 au:gap-2'
    ),
    classes?.header?.root
  );

  const actionClasses = twMerge(
    classNames(
      'au:flex au:justify-start',
      responsive
        ? 'au:items-start au:gap-2 au:xs:flex-row au:xs:flex-wrap au:sm:items-center au:sm:gap-4'
        : 'au:items-center au:gap-4'
    ),
    classes?.action
  );

  const controlsClasses = twMerge(
    classNames(
      'au:absolute au:left-0 au:z-10 au:flex au:w-full au:items-center au:justify-between au:pointer-events-none',
      responsive
        ? 'au:top-1/2 au:-translate-y-1/2 au:px-2 au:sm:top-1/3 au:sm:translate-y-0 au:sm:px-6'
        : 'au:top-1/3 au:px-6'
    ),
    classes?.controls
  );

  const dotsContainerClasses = twMerge(
    classNames(
      'au:absolute au:left-1/2 au:z-10 au:flex au:-translate-x-1/2 au:gap-2',
      responsive ? 'au:bottom-3 au:sm:bottom-4' : 'au:bottom-4'
    ),
    classes?.dotsContainer
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
              className="au:absolute au:inset-0 au:h-full au:w-full"
              style={{ objectFit }}
            />
          </div>
        ))}
      </div>
      <div className={headerClasses}>
        {header?.title && (
          <Typography className={classes?.header?.title} color="white" variant={header?.variant}>
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
              classes={{ button: 'au:animate-fade-in au:duration-500' }}
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
              iconButton: 'au:pointer-events-auto au:animate-slide-in-left',
            }}
            onClick={handlePrev}
          >
            {faChevronLeft}
          </IconButton>
          <IconButton
            variant="filled"
            color="secondary"
            classes={{
              iconButton: 'au:pointer-events-auto au:animate-slide-in-right',
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
