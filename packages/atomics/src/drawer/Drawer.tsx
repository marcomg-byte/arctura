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
      'mg:fixed mg:w-full mg:h-full mg:inset-0 mg:z-40 mg:flex mg:overflow-hidden mg:transition-opacity mg:duration-200 mg:ease-out',
      {
        'mg:items-start mg:justify-start': anchor === 'left',
        'mg:items-start mg:justify-end': anchor === 'right',
        'mg:items-start mg:justify-stretch': anchor === 'top',
        'mg:items-end mg:justify-stretch': anchor === 'bottom',
      }
    ),
    classes?.backdrop
  );

  const overlayClasses = twMerge(
    classNames(
      'mg:absolute mg:inset-0 mg:bg-secondary/80 mg:backdrop-blur-sm mg:transition-opacity mg:duration-200 mg:ease-out',
      {
        'mg:opacity-100': showBackdrop,
        'mg:opacity-0': !showBackdrop,
      }
    ),
    classes?.overlay
  );
  const headerClasses = twMerge(
    classNames('mg:flex mg:justify-between mg:w-full mg:py-3 mg:px-6'),
    classes?.header?.root
  );

  const headerCenterClasses = twMerge(classNames('mg:flex mg:gap-3'), classes?.header?.center);

  const headerLeftSectionClasses = twMerge(classNames('mg:flex mg:gap-3'), classes?.header?.left);

  const headerRightClasses = twMerge(classNames('mg:flex mg:gap-3'), classes?.header?.right);

  const bodyClasses = twMerge(classNames('mg:flex mg:flex-col mg:w-full'), classes?.body);

  const rootClasses = twMerge(
    classNames(
      'mg:relative mg:flex mg:w-full mg:max-w-full mg:grow-0 mg:flex-col mg:pb-2 mg:z-50 mg:bg-secondary mg:opacity-100 mg:text-primary mg:shadow-xl mg:shadow-black/20 mg:transition-transform mg:duration-300 mg:ease-out',
      {
        'mg:max-w-80 mg:sm:max-w-96': anchor === 'left' || anchor === 'right',
        'mg:max-h-[85dvh]': anchor === 'top' || anchor === 'bottom',
        'mg:translate-x-0': open && (anchor === 'left' || anchor === 'right'),
        'mg:translate-y-0': open && (anchor === 'top' || anchor === 'bottom'),
        'mg:-translate-x-full': !open && anchor === 'left',
        'mg:translate-x-full': !open && anchor === 'right',
        'mg:-translate-y-full': !open && anchor === 'top',
        'mg:translate-y-full': !open && anchor === 'bottom',
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
