'use client';
import { Button, TextInput, Typography } from '@arctura/atomics';
import { Page, Navbar, Playground as PlaygroundComponent } from '@/components';
import Image from 'next/image';
import {
  faSearch,
  faHome,
  faRocket,
  faPalette,
  faArrowDownAZ,
  faRuler,
  faLayerGroup,
  faIcons,
  faAtom,
  faTerminal,
  faArrowRightLong,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const components = [
  { label: 'Button', href: '#button' },
  { label: 'Carousel', href: '#carousel' },
  { label: 'Hero', href: '#hero' },
  { label: 'IconButton', href: '#iconbutton' },
  { label: 'TextInput', href: '#textinput' },
  { label: 'TextArea', href: '#textarea' },
  { label: 'Select', href: '#select' },
];

export default function Playground() {
  return (
    <Page color="primary">
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
        <div className="au:absolute au:top-1/8 au:left-4 au:sm:left-6 au:lg:left-8 au:md:top-1/4 au:md:left-12 au:flex au:flex-col au:gap-3 au:w-1/2">
          <div className="au:w-full au:flex au:flex-col au:gap-2">
            <Typography clamp={8} removePadding color="white" variant="h1">
              Components
            </Typography>
            <Typography clamp={8} removePadding color="white" variant="base">
              Beautifully designed, accessible and composable components to help you build
              consistent and exceptional user interfaces
            </Typography>
          </div>
          <div className="au:flex au:w-full au:lg:w-1/3">
            <TextInput startAdornment={faSearch} color="white" fullWidth />
          </div>
        </div>
      </div>
      <div className="au:flex au:w-full au:bg-inherit">
        <div className="au:w-1/2 au:sm:w-1/4 au:lg:w-1/5 au:flex au:flex-col au:gap-4 au:py-4 au:px-2 au:border-solid au:border-r-1 au:border-r-primary">
          <Navbar classes={{ root: 'au:w-full au:gap-3' }}>
            <div className="au:flex au:flex-col au:gap-0">
              <Typography className="au:text-sm au:sm:text-md au:lg:text-xl" variant="h3">
                COMPONENTS
              </Typography>
              <Button fullWidth href="#overview" target="_blank" startAdornment={faHome}>
                Overview
              </Button>
              <Button fullWidth href="#getting-started" target="_blank" startAdornment={faRocket}>
                Getting Started
              </Button>
            </div>
            <div className="au:flex au:flex-col au:gap-0">
              <Typography className="au:text-sm au:sm:text-md au:lg:text-xl" variant="h3">
                FOUNDATIONS
              </Typography>
              <Button fullWidth startAdornment={faPalette} href="#colors">
                Colors
              </Button>
              <Button fullWidth startAdornment={faArrowDownAZ} href="#typography">
                Typography
              </Button>
              <Button fullWidth startAdornment={faRuler} href="#spacing">
                Spacing
              </Button>
              <Button fullWidth startAdornment={faLayerGroup} href="#elevation">
                Elevation
              </Button>
              <Button fullWidth startAdornment={faIcons} href="#icons">
                Icons
              </Button>
            </div>
            <div className="au:flex au:flex-col au:gap-0">
              <Typography className="au:text-sm au:sm:text-md au:lg:text-xl" variant="h3">
                COMPONENTS
              </Typography>
              {components.map((component, index) => (
                <Button
                  key={`navbar-button-${index + 1}`}
                  href={component.href}
                  fullWidth
                  startAdornment={faAtom}
                >
                  {component.label}
                </Button>
              ))}
            </div>
          </Navbar>
          <div className="au:flex au:flex-col au:gap-2 au:rounded-lg au:border-solid au:border-1 au:border-primary au:p-1.5 au:sm:gap-3 au:sm:p-2">
            <div className="au:flex au:flex-col au:gap-1">
              <div className="au:flex au:items-center au:justify-start">
                <div className="au:flex au:items-center au:justify-center au:p-1 au:border-solid au:border-1 au:border-primary au:rounded-lg">
                  <FontAwesomeIcon
                    className="au:text-base au:sm:text-lg au:lg:text-2xl"
                    icon={faTerminal}
                  />
                </div>
              </div>
              <Typography
                removePadding
                className="au:text-sm au:sm:text-lg au:lg:text-2xl"
                bold
                variant="h3"
              >
                Build faster with Arctura UI
              </Typography>
              <Typography clamp={6} className="au:text-xs au:sm:text-base" removePadding>
                Copy, paste and ship. Designed for developers.
              </Typography>
            </div>
            <Button
              classes={{
                button:
                  'au:h-auto au:min-h-8 au:px-1 au:py-1 au:text-xs au:sm:h-9 au:sm:px-2.5 au:sm:py-2 au:sm:text-sm',
              }}
              endAdornment={faArrowRightLong}
              variant="text"
              href="https://github.com/marcomg-byte/arctura"
              target="_blank"
              fullWidth
            >
              View on github
            </Button>
          </div>
        </div>
        <main className="au:flex au:min-w-0 au:flex-1 au:flex-col au:gap-4 au:p-3 au:sm:p-4 au:lg:p-6 au:bg-inherit">
          <PlaygroundComponent component="Button" />
        </main>
      </div>
    </Page>
  );
}
