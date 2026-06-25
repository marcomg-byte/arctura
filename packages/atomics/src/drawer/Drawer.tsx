'use client';
import type { FC, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '../buttons';
import { useControlled } from '../../lib/hooks';

/**
 * Optional class name hooks for the drawer sub-elements.
 */
interface DrawerClasses {
  /** Classes applied to the drawer body. */
  body?: string;
  /** Classes applied to the backdrop container. */
  backdrop?: string;
  /** Classes applied to the drawer header sections. */
  header?: DrawerHeaderClasses;
  /** Classes applied to the overlay element. */
  overlay?: string;
  /** Classes applied to the drawer panel root. */
  root?: string;
}

/**
 * Optional class name hooks for the drawer header sections.
 */
interface DrawerHeaderClasses {
  /** Classes applied to the center header section. */
  center?: string;
  /** Classes applied to the left header section. */
  left?: string;
  /** Classes applied to the right header section. */
  right?: string;
  /** Classes applied to the header container. */
  root?: string;
}

/**
 * Header content rendered inside the drawer.
 */
interface DrawerHeader {
  /** Content rendered to the left of the title. */
  leftSlot?: ReactNode;
  /** Content rendered to the right of the title. */
  rightSlot?: ReactNode;
  /** Optional title rendered in the center section. */
  title?: string;
}

/**
 * Props for configuring the drawer component.
 */
interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Accessible label for the drawer when there is no visible title. */
  'aria-label'?: string;
  /** Accessible labelled-by target for the drawer when the title is rendered elsewhere. */
  'aria-labelledby'?: string;
  /** Side of the screen where the drawer opens. */
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  /** Class name overrides for the drawer internals. */
  classes?: DrawerClasses;
  /** Whether pressing Escape closes the drawer. */
  closeOnEscape?: boolean;
  /** Content rendered inside the drawer body. */
  children?: ReactNode;
  /** Additional props forwarded to the backdrop wrapper. */
  backdropProps?: HTMLAttributes<HTMLDivElement>;
  /** Ref forwarded to the backdrop wrapper. */
  backdropRef?: Ref<HTMLDivElement>;
  /** Header content and slot configuration. */
  header?: DrawerHeader;
  /** Optional id for the drawer root element. */
  id?: string;
  /** Callback fired when the backdrop is clicked. */
  onBackdropClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Callback fired when the drawer should close. */
  onClose: () => void;
  /** Key down handler for the drawer panel. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  /** Controlled open state for the drawer. */
  open: boolean;
  /** Ref forwarded to the drawer panel. */
  ref?: Ref<HTMLDivElement>;
  /** Whether the backdrop should be visible. */
  showBackdrop?: boolean;
}

/**
 * Drawer component for sliding panels with an optional backdrop and header slots.
 *
 * @param {DrawerProps} props - Props for configuring the drawer content, behavior, and placement.
 * @returns {JSX.Element} The rendered drawer.
 *
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { Drawer, Button } from '@arctura/atomics';
 *
 * const Example = () => {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setOpen(true)}>Open drawer</Button>
 *       <Drawer
 *         anchor="right"
 *         header={{ title: 'Settings' }}
 *         open={open}
 *         onClose={() => setOpen(false)}
 *       >
 *         Drawer content goes here.
 *       </Drawer>
 *     </>
 *   );
 * };
 * ```
 */
const Drawer: FC<DrawerProps> = ({
  anchor = 'left',
  backdropProps,
  backdropRef,
  closeOnEscape = true,
  children,
  classes,
  header,
  onBackdropClick,
  onClose,
  onKeyDown,
  open: openProp,
  ref,
  showBackdrop = true,
  ...rest
}) => {
  const [open, setOpen] = useControlled({
    defaultValue: false,
    value: openProp,
  });

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return;
    }

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        onClose();
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [closeOnEscape, onClose, open, setOpen]);

  const backdropClasses = twMerge(
    classNames(
      'au:fixed au:w-full au:h-full au:inset-0 au:z-40 au:flex au:overflow-hidden au:transition-opacity au:duration-200 au:ease-out',
      {
        'au:items-start au:justify-start': anchor === 'left',
        'au:items-start au:justify-end': anchor === 'right',
        'au:items-start au:justify-stretch': anchor === 'top',
        'au:items-end au:justify-stretch': anchor === 'bottom',
      }
    ),
    classes?.backdrop
  );

  const overlayClasses = twMerge(
    classNames(
      'au:absolute au:inset-0 au:bg-secondary/80 au:backdrop-blur-sm au:transition-opacity au:duration-200 au:ease-out',
      {
        'au:opacity-100': showBackdrop,
        'au:opacity-0': !showBackdrop,
      }
    ),
    classes?.overlay
  );
  const headerClasses = twMerge(
    classNames('au:flex au:justify-between au:w-full au:py-3 au:px-6'),
    classes?.header?.root
  );

  const headerCenterClasses = twMerge(classNames('au:flex au:gap-3'), classes?.header?.center);

  const headerLeftSectionClasses = twMerge(classNames('au:flex au:gap-3'), classes?.header?.left);

  const headerRightClasses = twMerge(classNames('au:flex au:gap-3'), classes?.header?.right);

  const bodyClasses = twMerge(classNames('au:flex au:flex-col au:w-full'), classes?.body);

  const rootClasses = twMerge(
    classNames(
      'au:relative au:flex au:w-full au:max-w-full au:grow-0 au:flex-col au:pb-2 au:z-50 au:bg-secondary au:opacity-100 au:text-primary au:shadow-xl au:shadow-black/20 au:transition-transform au:duration-300 au:ease-out',
      {
        'au:max-w-80 au:sm:max-w-96': anchor === 'left' || anchor === 'right',
        'au:max-h-[85dvh]': anchor === 'top' || anchor === 'bottom',
        'au:translate-x-0': open && (anchor === 'left' || anchor === 'right'),
        'au:translate-y-0': open && (anchor === 'top' || anchor === 'bottom'),
        'au:-translate-x-full': !open && anchor === 'left',
        'au:translate-x-full': !open && anchor === 'right',
        'au:-translate-y-full': !open && anchor === 'top',
        'au:translate-y-full': !open && anchor === 'bottom',
      }
    ),
    classes?.root
  );

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (onBackdropClick) {
      onBackdropClick(event);
    } else {
      setOpen(false);
    }
  };

  return (
    <div className={backdropClasses} ref={backdropRef} tabIndex={-1} {...backdropProps}>
      <div className={overlayClasses} aria-hidden onClick={handleBackdropClick} />
      <div className={rootClasses} onKeyDown={onKeyDown} ref={ref} {...rest}>
        <div className={headerClasses}>
          <div className={headerLeftSectionClasses}>
            <IconButton onClick={onClose}>{faClose}</IconButton>
            {header?.leftSlot}
          </div>
          <div className={headerCenterClasses}>{header?.title}</div>
          <div className={headerRightClasses}>{header?.rightSlot}</div>
        </div>
        <div className={bodyClasses}>{children}</div>
      </div>
    </div>
  );
};

Drawer.displayName = 'Drawer';

export { Drawer };
export type { DrawerClasses };
