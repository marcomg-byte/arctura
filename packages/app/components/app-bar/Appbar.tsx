'use client';
import { useState } from 'react';
import type { FC, HTMLAttributes, MouseEvent, Ref } from 'react';
import classNames from 'classnames';
import { Button, Drawer, IconButton } from '@arctura/atomics';
import { useBreakpoints } from '@arctura/atomics/hooks';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { faBars } from '@fortawesome/free-solid-svg-icons';

/** Describes a navigation link rendered in the app bar. */
interface Link {
  /** Optional click handler invoked before navigation. */
  action?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Destination URL for the link. */
  href: string;
  /** Optional target attribute for the rendered anchor. */
  target?: string;
  /** Visible text label shown for the link. */
  text: string;
}

/** Props accepted by the app bar container. */
interface AppbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Links rendered in the desktop menu and mobile drawer. */
  links: Link[];
  /** Forwarded ref to the root container element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Renders the full desktop navigation layout for the app bar.
 *
 * Props:
 * @property links - Links displayed in the desktop navigation.
 * @property pathname - Current route path used to highlight the active link.
 */
const DesktopLayout: FC<{ links: Link[]; pathname: string }> = ({ links, pathname }) => {
  const sectionClasses = classNames('au:flex au:gap-3');

  return (
    <>
      <div className={sectionClasses}>
        <Image
          src="/images/arctura-logo-banner.png"
          alt="Logo"
          height={80}
          width={80}
          className="au:object-cover au:transition-transform au:duration-300 au:ease-out au:hover:scale-110"
        />
      </div>
      <div className={sectionClasses}>
        {links.map((link, index) => {
          const isCurrentPath = link.href === pathname;

          return (
            <Button
              key={`app-bar-button-${index + 1}`}
              href={isCurrentPath ? '/' : link.href}
              onClick={link?.action}
              target={link?.target}
              variant="text"
            >
              {isCurrentPath ? 'Home' : link?.text}
            </Button>
          );
        })}
      </div>
      <div className={sectionClasses}>
        <Button
          startAdornment={{ src: '/images/github.png', alt: 'Github logo' }}
          href="https://github.com/marcomg-byte/arctura"
          target="_blank"
          variant="text"
        >
          Github
        </Button>
        <Button
          href="https://github.com/marcomg-byte/arctura/releases/"
          target="_blank"
          variant="outline"
        >
          1.0.0
        </Button>
      </div>
    </>
  );
};
DesktopLayout.displayName = 'Appbar.DesktopLayout';

/**
 * Renders the compact mobile layout with the drawer trigger.
 *
 * Props:
 * @property action - Callback invoked when the menu button is pressed.
 */
const MobileLayout: FC<{ action: (event: MouseEvent<HTMLButtonElement>) => void }> = ({
  action,
}) => {
  const containerClasses = classNames('au:flex au:items-center au:justify-between au:w-full');
  const sectionClasses = classNames('au:flex au:gap-2');

  return (
    <>
      <div className={containerClasses}>
        <IconButton onClick={action} variant="outline">
          {faBars}
        </IconButton>
        <div className={sectionClasses}>
          <Button
            startAdornment={{ src: '/images/github.png', alt: 'Github logo' }}
            href="https://github.com/marcomg-byte/arctura"
            target="_blank"
            variant="text"
          >
            Github
          </Button>
          <Button
            href="https://github.com/marcomg-byte/arctura/releases/"
            target="_blank"
            variant="outline"
          >
            1.0.0
          </Button>
        </div>
      </div>
    </>
  );
};
MobileLayout.displayName = 'Appbar.MobileLayout';

/**
 * App bar container that switches between desktop and mobile navigation.
 *
 * ```tsx
 * import { Appbar, type Link } from '@/components/app-bar/AppBar';
 *
 * const links: Link[] = [
 *   { href: '/', text: 'Home' },
 *   { href: '/projects', text: 'Projects' },
 *   { href: '/contact', text: 'Contact' },
 * ];
 *
 * export function MyComponents() {
 *   return (
 *     <Appbar
 *       links={links}
 *       className="au:sticky au:top-0 au:z-50"
 *       aria-label="Primary navigation"
 *     />
 *   );
 * }
 * ```
 */
const Appbar: FC<AppbarProps> = ({ links, ref, ...rest }) => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { isBelow } = useBreakpoints();
  const isBelowSm = isBelow('sm');

  const containerClasses = classNames(
    'au:flex au:items-center au:justify-between au:bg-primary au:px-3 au:py-2 au:w-full'
  );

  const handleBackdropClick = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={containerClasses} ref={ref} {...rest}>
      {isBelowSm ? (
        <MobileLayout action={handleOpen} />
      ) : (
        <DesktopLayout links={links} pathname={pathname} />
      )}
      {isBelowSm && open && (
        <Drawer
          classes={{ header: { root: 'au:px-3' } }}
          onBackdropClick={handleBackdropClick}
          onClose={handleClose}
          open={open}
        >
          {links.map((link, index) => {
            const isCurrentPath = link.href === pathname;

            return (
              <Button
                key={`app-bar-button-${index + 1}`}
                href={isCurrentPath ? '/' : link.href}
                onClick={link?.action}
                target={link?.target}
                variant="text"
              >
                {isCurrentPath ? 'Home' : link?.text}
              </Button>
            );
          })}
        </Drawer>
      )}
    </div>
  );
};

Appbar.displayName = 'Appbar';

export { Appbar };
export type { Link };
