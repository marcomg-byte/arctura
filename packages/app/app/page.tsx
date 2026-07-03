'use client';
import type { FC } from 'react';
import { Page, PreviewPanel } from '@/components';
import { Button, Link, Typography } from '@arctura/atomics';
import { useBreakpoints } from '@arctura/atomics/hooks';
import { faArrowRightLong, faCube } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import classNames from 'classnames';

type CardBackground = 'accent' | 'primary' | 'secondary' | 'subtle';

interface CardAdornment {
  background?: CardBackground;
  image?: CardImage;
}

interface CardImage {
  src: string;
  alt?: string;
}

interface CardProps {
  adornment?: CardAdornment;
  text?: string;
  title?: string;
}

const Card: FC<CardProps> = ({ adornment = {}, text, title }) => {
  const containerClasses = classNames(
    'au:flex au:flex-col au:gap-3 au:items-start au:self-stretch au:snap-start au:scroll-ml-5 au:sm:scroll-ml-0 au:max-w-[calc(100vw-5rem)] au:min-w-[calc(100vw-5rem)] au:sm:max-w-28 au:sm:min-w-28 au:md:max-w-36 au:md:min-w-36 au:lg:max-w-44 au:lg:min-w-44 au:rounded-lg au:p-3 au:shadow-md au:transition au:duration-500 au:ease-out au:hover:scale-105 au:hover:shadow-xl'
  );
  const adornmentContainerClasses = classNames(
    'au:flex au:items-center au:justify-center au:p-2 au:rounded-lg',
    {
      'au:bg-accent': adornment?.background === 'accent',
      'au:bg-primary': adornment?.background === 'primary',
      'au:bg-secondary': adornment?.background === 'secondary',
      'au:bg-subtle': adornment?.background === 'subtle',
    }
  );
  const bodyContainerClasses = classNames('au:flex au:flex-col au:gap-1 au:w-full');
  const imageClasses = classNames('au:object-contain au:h-6 au:w-6');

  return (
    <div className={containerClasses}>
      <div className={adornmentContainerClasses}>
        <Image
          src={adornment?.image?.src || ''}
          alt={adornment?.image?.alt || ''}
          width={48}
          height={48}
          className={imageClasses}
        />
      </div>
      <div className={bodyContainerClasses}>
        <Typography className="au:text-2xl au:sm:text-3xl au:lg:text-4xl" variant="h2">
          {title}
        </Typography>
        <Typography clamp={8} removePadding variant="base">
          {text}
        </Typography>
      </div>
    </div>
  );
};

const cards: CardProps[] = [
  {
    adornment: {
      background: 'primary',
      image: { src: '/images/scalability.png', alt: 'Scalability Icon' },
    },
    title: 'Scalability',
    text: 'Built to scale with your product and your team. From prototype to enterprise',
  },
  {
    adornment: {
      background: 'secondary',
      image: { src: '/images/coding.png', alt: 'Coding Icon' },
    },
    title: 'Maintainability',
    text: 'Clean, consistent and well documented components that are easy to understand and evolve.',
  },
  {
    adornment: {
      background: 'accent',
      image: { src: '/images/flash.png', alt: 'Lightning Icon' },
    },
    title: 'Innovation',
    text: 'Modern tooling, headless architecture and a future-proof approach to UI development.',
  },
  {
    adornment: {
      background: 'subtle',
      image: { src: '/images/quality.png', alt: 'Medal Icon' },
    },
    title: 'Quality',
    text: 'Accessible, tested and crafted with attention to every detail.',
  },
];

export default function Home() {
  const { isBelow } = useBreakpoints();
  const isBelowSm = isBelow('sm');

  return (
    <Page color="white" title="Home">
      <div className="au:relative au:w-full au:overflow-hidden au:h-64 au:sm:h-56 au:md:h-64 au:lg:h-72 au:xl:h-80">
        <Image
          src="/images/arctura_banner.gif"
          alt="Arctura Banner Image"
          fill
          unoptimized
          sizes="100vw"
          loading="eager"
          className="au:object-left au:sm:object-center"
        />
        <div className="au:absolute au:top-1/8 au:left-8 au:md:top-1/4 au:md:left-12 au:flex au:flex-col au:gap-3 au:w-1/2">
          <div className="au:w-full au:flex au:flex-col au:gap-2">
            <Typography clamp={8} removePadding color="white" variant="h1">
              Build consistent products, <span className="au:text-accent">faster.</span>
            </Typography>
            <Typography clamp={8} removePadding color="white" variant="base">
              Arctura is a modern, scalable and accesible component library built for React,
              TailwindCSS and TypeScript.
            </Typography>
          </div>
          <div className="au:flex au:gap-2 au:md:gap-4">
            <Button href="#Docs" endAdornment={faArrowRightLong}>
              Get started
            </Button>
            <Button href="#Components" endAdornment={faCube}>
              Explore components
            </Button>
          </div>
        </div>
      </div>
      <div className="au:flex au:w-full au:snap-x au:snap-mandatory au:items-stretch au:justify-start au:gap-4 au:overflow-x-auto au:overscroll-x-contain au:px-4 au:py-4 au:sm:justify-center au:sm:gap-6 au:sm:px-6 au:sm:py-6 au:md:gap-12">
        {cards.map((card, index) => (
          <Card
            key={`card-${index + 1}`}
            adornment={card.adornment}
            title={card.title}
            text={card.text}
          />
        ))}
      </div>
      <div className="au:flex au:w-full au:flex-col au:gap-6 au:p-4 au:sm:p-6 au:lg:flex-row au:lg:items-start au:lg:justify-between">
        <div className="au:flex au:w-full au:flex-col au:gap-3 au:lg:w-1/2">
          <div className="au:flex au:flex-col au:gap-2 au:w-full">
            <div className="au:flex au:flex-col au:gap-0 au:w-full">
              <Typography
                align="justify"
                clamp={5}
                className="au:text-lg au:sm:text-xl au:lg:text-3xl"
                color="accent"
                removePadding
                variant="h2"
              >
                COMPONENTS
              </Typography>
              <Typography clamp={8} color="primary" variant="h2">
                Beautifully designed.
                <br />
                Engineered to scale.
              </Typography>
            </div>
            <Typography removePadding clamp={5} color="primary" variant="base">
              A comprehensive set of components, built with accessibility and developer experience
              in mind.
            </Typography>
          </div>
          <div>
            <Button size="sm" variant="text" endAdornment={faArrowRightLong}>
              Browse all components
            </Button>
          </div>
        </div>
        <PreviewPanel />
      </div>
      <div className="au:flex au:w-full au:px-4 au:pb-4 au:sm:px-6 au:sm:pb-6">
        <div className="au:flex au:w-full au:flex-col au:items-center au:gap-4 au:rounded-lg au:bg-primary au:p-3 au:sm:items-start au:sm:p-4 au:md:p-6">
          <div className="au:flex au:w-full au:max-w-7xl au:flex-col au:items-center au:gap-3 au:sm:items-start au:lg:max-w-none">
            <div className="au:flex au:w-full au:flex-col au:items-center au:gap-1 au:sm:items-start">
              <Typography
                align={isBelowSm ? 'center' : 'left'}
                color="accent"
                className="au:text-lg au:sm:text-xl au:lg:text-3xl"
                removePadding
                variant="h2"
              >
                DEVELOPER EXPERIENCE
              </Typography>
              <Typography align={isBelowSm ? 'center' : 'left'} removePadding variant="h3">
                Everything you need to <br /> build with confidence
              </Typography>
              <Typography align={isBelowSm ? 'center' : 'left'} removePadding>
                Powerful APIs, theming, dark mode, TypeScript first and a great developer experience
              </Typography>
            </div>
            <div>
              <Button endAdornment={faArrowRightLong} href="#docs" target="_blank" variant="text">
                Explore the docs
              </Button>
            </div>
          </div>
        </div>
      </div>
      <hr className="au:h-px au:w-9/10 au:bg-accent" />
      <div className="au:flex au:w-full au:flex-col au:items-start au:gap-6 au:p-4 au:sm:p-6 au:lg:flex-row au:lg:items-center au:lg:justify-between">
        <div className="au:flex au:w-full au:flex-col au:items-center au:sm:items-start au:gap-3 au:lg:max-w-72">
          <div className="au:relative au:w-full au:max-w-24 au:aspect-240/170 au:sm:max-w-30 au:lg:w-30">
            <Image
              src="/images/arctura-footer-logo.png"
              alt="Arctura Logo"
              fill
              sizes="(min-width: 1024px) 240px, (min-width: 640px) 240px, 192px"
              className="au:object-contain au:transition-transform au:duration-300 au:ease-out au:hover:scale-110"
            />
          </div>
          <Typography align={isBelowSm ? 'center' : 'left'} removePadding clamp={10}>
            A modern UI library for building scalable and consistent digital products.
          </Typography>
        </div>
        <div className="au:flex au:w-full au:flex-col au:gap-4 au:sm:flex-row au:sm:flex-wrap au:sm:items-start au:sm:justify-between au:lg:w-auto au:lg:min-w-fit au:lg:flex-nowrap">
          <div className="au:flex au:min-w-32 au:flex-1 au:flex-col au:items-center au:sm:items-start au:gap-0 au:lg:flex-none">
            <Typography color="subtle">DOCUMENTATION</Typography>
            <Link href="#getting-started" target="_blank">
              Getting Started
            </Link>
            <Link href="#components" target="_blank">
              Components
            </Link>
            <Link href="#theming" target="_blank">
              Theming
            </Link>
            <Link href="#resources" target="_blank">
              Resources
            </Link>
          </div>
          <div className="au:flex au:min-w-32 au:flex-1 au:flex-col au:items-center au:sm:items-start au:gap-0 au:lg:flex-none">
            <Typography color="subtle">RESOURCES</Typography>
            <Link href="#playground" target="_blank">
              Playground
            </Link>
            <Link href="#contributing" target="_blank">
              Contributing
            </Link>
            <Link href="#changelog" target="_blank">
              Changelog
            </Link>
          </div>
          <div className="au:flex au:min-w-32 au:flex-1 au:flex-col au:items-center au:sm:items-start au:gap-0 au:lg:flex-none">
            <Typography color="subtle">COMMUNITY</Typography>
            <Link href="#github" target="_blank">
              Github
            </Link>
            <Link href="#discussions" target="_blank">
              Discussions
            </Link>
            <Link href="#discord" target="_blank">
              Discord
            </Link>
          </div>
        </div>
        <div className="au:flex au:w-full au:flex-col au:gap-4 au:border-solid au:border-primary au:border-1 au:rounded-lg au:p-3 au:sm:max-w-80 au:lg:w-auto">
          <div className="au:flex au:items-start au:gap-3">
            <div className="au:shrink-0 au:bg-subtle au:rounded-lg au:p-1">
              <div className="au:relative au:w-3 au:h-3 au:lg:w-5 au:lg:h-5">
                <Image
                  src="/images/github.png"
                  alt="Github Logo"
                  fill
                  sizes="(min-width: 1024px) 40px, 20px"
                  className="au:object-contain"
                />
              </div>
            </div>
            <div className="au:flex au:flex-col au:gap-0.5">
              <Typography removePadding variant="h5" bold>
                Star us on Github
              </Typography>
              <Typography removePadding>Help us make Arctura even better</Typography>
            </div>
          </div>
          <div>
            <Button
              classes={{
                button: 'au:justify-center au:whitespace-nowrap au:[&>svg]:h-3 au:[&>svg]:w-3',
              }}
              startAdornment={faStar}
            >
              Star on Github
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
