'use client';
import type { FC, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/src/buttons';
import { useControlled } from '@/lib';

interface DrawerClasses {
  body?: string;
  backdrop?: string;
  header?: {
    center?: string;
    left?: string;
    right?: string;
    root?: string;
  };
  overlay?: string;
  root?: string;
}

interface DrawerHeader {
  title?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  classes?: DrawerClasses;
  closeOnEscape?: boolean;
  children?: ReactNode;
  backdropProps?: HTMLAttributes<HTMLDivElement>;
  backdropRef?: Ref<HTMLDivElement>;
  header?: DrawerHeader;
  id?: string;
  onBackdropClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onClose: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  open: boolean;
  ref?: Ref<HTMLDivElement>;
  showBackdrop?: boolean;
}

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
