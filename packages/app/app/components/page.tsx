import { Navbar, Page } from '@/components';
import { Button, TextInput, Typography } from '@arctura/atomics';
import Image from 'next/image';
import { faHome, faRocket, faSearch } from '@fortawesome/free-solid-svg-icons';

const components = ['Button', 'Carousel', 'Hero', 'IconButton', 'TextInput', 'TextArea', 'Select'];

export default function Components() {
  return (
    <Page color="primary" title="Components">
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
              Components
            </Typography>
            <Typography clamp={8} removePadding color="white" variant="base">
              Beautifully designed, accessible and composable components to help you build
              consistent and exceptional user interfaces
            </Typography>
          </div>
          <div className="au:flex au:w-1/3">
            <TextInput startAdornment={faSearch} color="white" fullWidth />
          </div>
        </div>
      </div>
      <div className="au:flex au:w-full">
        <Navbar classes={{ root: 'au:w-1/4 au:gap-4 au:p-2' }}>
          <div className="au:flex au:flex-col au:gap-0">
            <Typography className="au:text-sm au:sm:text-md au:lg:text-xl" variant="h3">
              COMPONENTS
            </Typography>
            <Button href="#overview" target="_blank" startAdornment={faHome}>
              Overview
            </Button>
            <Button href="#getting-started" target="_blank" startAdornment={faRocket}>
              Getting Started
            </Button>
          </div>
        </Navbar>
      </div>
    </Page>
  );
}
