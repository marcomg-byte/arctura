'use client';
import { useEffect, useRef, useState } from 'react';
import type { FC, HTMLAttributes, MouseEvent, Ref } from 'react';
import classNames from 'classnames';
import { Button, Drawer, IconButton } from '@arctura/atomics';
import { Button as ThemeButton } from '@arctura/atomics/theme';
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
  /** Keeps the app bar fixed to the top of the viewport. */
  fixed?: boolean;
  /** Links rendered in the desktop menu and mobile drawer. */
  links: Link[];
  /** Forwarded ref to the root container element. */
  ref?: Ref<HTMLDivElement>;
}

const appbarButtonClasses = 'au:h-5 au:w-auto au:px-1.5 au:py-0.5 au:rounded-sm au:text-sm';
const appbarIconButtonClasses =
  'au:h-5 au:w-5 au:min-h-0 au:min-w-0 au:p-0.5 au:rounded-sm au:text-sm';

/**
 * Renders the full desktop navigation layout for the app bar.
 *
 * Props:
 * @property links - Links displayed in the desktop navigation.
 * @property pathname - Current route path used to highlight the active link.
 */
const DesktopLayout: FC<{ links: Link[]; pathname: string }> = ({ links, pathname }) => {
  const sectionClasses = classNames('au:flex au:items-center au:gap-3');

  return (
    <>
      <div className={sectionClasses}>
        <div className="au:relative au:h-[80px] au:w-[80px] au:transition-transform au:duration-300 au:ease-out au:hover:scale-130">
          <Image
            src="/images/arctura-appbar-logo.png"
            alt="Logo"
            fill
            sizes="80px"
            className="au:object-contain"
          />
        </div>
      </div>
      <div className={sectionClasses}>
        {links.map((link, index) => {
          const isCurrentPath = link.href === pathname;

          return (
            <Button
              key={`app-bar-button-${index + 1}`}
              classes={{ button: appbarButtonClasses }}
              href={isCurrentPath ? '/' : link.href}
              onClick={link?.action}
              size="sm"
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
          classes={{ button: appbarButtonClasses }}
          startAdornment={{ src: '/images/github.png', alt: 'Github logo' }}
          href="https://github.com/marcomg-byte/arctura"
          size="sm"
          target="_blank"
          variant="text"
        >
          Github
        </Button>
        <Button
          classes={{ button: appbarButtonClasses }}
          href="https://github.com/marcomg-byte/arctura/releases/"
          size="sm"
          target="_blank"
          variant="outline"
        >
          1.0.0
        </Button>
        <ThemeButton aria-label="Toggle theme" classes={{ iconButton: appbarIconButtonClasses }} />
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
  const sectionClasses = classNames('au:flex au:items-center au:gap-2');

  return (
    <>
      <div className={containerClasses}>
        <div className={sectionClasses}>
          <IconButton
            classes={{ iconButton: appbarIconButtonClasses }}
            onClick={action}
            variant="outline"
          >
            {faBars}
          </IconButton>
          <div className="au:relative au:h-[40px] au:w-[40px] au:transition-transform au:duration-300 au:ease-out au:hover:scale-130">
            <Image
              src="/images/arctura-appbar-logo.png"
              alt="Logo"
              fill
              sizes="40px"
              className="au:object-contain"
            />
          </div>
        </div>
        <div className={sectionClasses}>
          <Button
            classes={{ button: appbarButtonClasses }}
            startAdornment={{ src: '/images/github.png', alt: 'Github logo' }}
            href="https://github.com/marcomg-byte/arctura"
            size="sm"
            target="_blank"
            variant="text"
          >
            Github
          </Button>
          <Button
            classes={{ button: appbarButtonClasses }}
            href="https://github.com/marcomg-byte/arctura/releases/"
            size="sm"
            target="_blank"
            variant="outline"
          >
            1.0.0
          </Button>
          <ThemeButton
            aria-label="Toggle theme"
            classes={{ iconButton: appbarIconButtonClasses }}
          />
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
const Appbar: FC<AppbarProps> = ({ fixed = true, links, ref, ...rest }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [appbarHeight, setAppbarHeight] = useState<number>(0);
  const appbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isBelow } = useBreakpoints();
  const isBelowSm = isBelow('sm');

  const containerClasses = classNames(
    'au:flex au:items-center au:justify-between au:px-3 au:py-2 au:w-full au:bg-secondary',
    {
      'au:fixed au:top-0 au:left-0 au:right-0 au:z-50 au:shadow-md au:shadow-black/10': fixed,
    }
  );

  useEffect(() => {
    if (!fixed || !appbarRef.current) {
      setAppbarHeight(0);
      return;
    }

    const updateHeight = () => {
      setAppbarHeight(appbarRef.current?.offsetHeight ?? 0);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(appbarRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [fixed, isBelowSm]);

  const handleRef = (element: HTMLDivElement | null) => {
    appbarRef.current = element;

    if (!ref) return;

    if (typeof ref === 'function') {
      ref(element);
      return;
    }

    ref.current = element;
  };

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
    <>
      {fixed && <div aria-hidden style={{ height: appbarHeight }} />}
      <div className={containerClasses} ref={handleRef} {...rest}>
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
                  fullWidth
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
    </>
  );
};

Appbar.displayName = 'Appbar';

export { Appbar };
export type { Link };
