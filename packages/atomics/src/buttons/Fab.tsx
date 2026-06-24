import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  JSX,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/**
 * Adornment used by the Fab. Can be a Font Awesome `IconDefinition`
 * (rendered via `FontAwesomeIcon`) or an image payload (`FabImage`).
 */
type FabAdornment = IconDefinition | FabImage;

interface FabClasses {
  adornment?: string;
  button?: string;
}

/**
 * Allowed color theme names for the Fab component.
 */
type FabColor = 'primary' | 'secondary' | 'accent' | 'error' | 'info' | 'success' | 'warning';

/**
 * Image payload for a Fab adornment.
 * @property {string} src - Image source URL or path.
 * @property {string} [alt] - Optional alt text for the image.
 */
type FabImage = { alt?: string; src: string };

/**
 * Variant of the Fab component.
 * - 'circular': round icon-only floating action button.
 * - 'extended': pill-shaped button that can contain text and icons.
 */
type FabVariant = 'circular' | 'extended';

/**
 * Common props shared between anchor and button variants of `Fab`.
 */
interface BaseProps {
  /** Content placed inside the button. */
  children?: ReactNode;
  /** Additional CSS classes to apply. */
  classes?: FabClasses;
  /** Color theme for the Fab. */
  color?: FabColor;
  /** Adornment rendered after the children. */
  endAdornment?: FabAdornment;
  /** Size variant for the Fab: 'sm' | 'md' | 'lg'. */
  size?: 'sm' | 'md' | 'lg';
  /** Adornment rendered before the children. */
  startAdornment?: FabAdornment;
  /** Visual variant of the Fab: 'circular' or 'extended'. */
  variant?: FabVariant;
}

/**
 * Props when the `Fab` is rendered as an anchor (`<a>`).
 * Extends native anchor attributes but disallows `type`.
 */
interface AnchorProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  /** Destination URL for the anchor. */
  href?: string;
  /** Click handler when rendered as an anchor. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Ref forwarded to the anchor element. */
  ref?: Ref<HTMLAnchorElement>;
  /** Link target (for example, '_blank'). */
  target?: string;
  /** Explicitly disallowed on the anchor variant. */
  type?: never;
}

/**
 * Props when the `Fab` is rendered as a button (`<button>`).
 * Extends native button attributes but disallows `href` and `target`.
 */
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Explicitly disallowed on the button variant. */
  href?: never;
  /** Click handler when rendered as a button. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Ref forwarded to the button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Target is not applicable for button elements. */
  target?: never;
  /** Button `type` attribute (e.g. 'button' | 'submit' | 'reset'). */
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

/**
 * Combined props accepted by `Fab`.
 * Either the anchor props or button props together with shared base props.
 */
type FabProps = (AnchorProps | ButtonProps) & BaseProps;

/**
 * Render a `FabAdornment` as either a FontAwesome icon or an image.
 * @param {FabAdornment} adornment - IconDefinition or FabImage to render.
 * @returns {JSX.Element} The rendered adornment element.
 */
const renderAdornment = (adornment: FabAdornment, className?: string) => {
  const iconClasses = classNames('au:text-xs', className);

  const imageClasses = twMerge('au:object-contain au:animate-fade-in au:duration-500', className);

  if ('iconName' in adornment) {
    return <FontAwesomeIcon className={iconClasses} icon={adornment} />;
  }

  return (
    <img
      alt={adornment.alt || ''}
      className={imageClasses}
      height={16}
      src={adornment.src || ''}
      width={16}
    />
  );
};

/**
 * Floating Action Button (`Fab`) component.
 * Renders either an anchor (`<a>`) when `href` is provided, or a native
 * button (`<button>`) otherwise. Supports start/end adornments and
 * multiple visual variants and sizes.
 * @param {FabProps} props - Props for the Fab component (anchor or button variant).
 * @returns {JSX.Element} The rendered Fab element.
 *
 * @example
 * ```tsx
 * import { Fab } from  '@/src';
 * import { faPlus } from '@fortawesome/free-solid-svg-icons';
 *
 * const MyComponent = () => (
 *  <Fab
 *     color="primary"
 *      variant="extended"
 *    startAdornment={faPlus}
 *    onClick={() => console.log('Fab clicked!')}
 *  >
 *   Add Item
 *. </Fab>
 * );
 * ```
 */
function Fab(props: AnchorProps & BaseProps): JSX.Element;
function Fab(props: ButtonProps & BaseProps): JSX.Element;
function Fab({
  children,
  classes = {},
  color = 'primary',
  endAdornment,
  href,
  onClick,
  target,
  type,
  ref,
  size = 'md',
  startAdornment,
  variant = 'circular',
  ...rest
}: FabProps): JSX.Element {
  const circularClasses =
    variant === 'circular'
      ? classNames('au:rounded-full', {
          'au:h-4 au:w-4': size === 'sm',
          'au:h-6 au:w-6': size === 'md',
          'au:h-8 au:w-8': size === 'lg',
        })
      : '';
  const extendedClasses =
    variant === 'extended'
      ? classNames('au:rounded-lg', {
          'au:w-4 au:h-2': size === 'sm',
          'au:w-5 au:h-3': size === 'md',
          'au:w-6 au:h-4': size === 'lg',
        })
      : '';
  const buttonClasses = twMerge(
    classNames(
      'au:inline-flex au:items-center au:justify-center au:border-solid au:border-1 au:hover:cursor-pointer',
      'au:focus-visible:outline-1 au:focus-visible:outline-offset-4 au:focus-visible:outline-primary',
      {
        'au:border-primary au:text-primary': color === 'primary',
        'au:border-secondary au:text-secondary': color === 'secondary',
        'au:border-accent au:hover:border-accent-hover au:text-accent au:hover:text-accent-hover':
          color === 'accent',
        'au:border-error au:text-danger': color === 'error',
        'au:border-info au:text-info': color === 'info',
        'au:border-success au:text-success': color === 'success',
        'au:border-warning au:text-warning': color === 'warning',
        'au:hover:border-accent au:hover:text-accent': color !== 'accent',
      },
      circularClasses,
      extendedClasses
    ),
    classes?.button
  );

  if (href) {
    return (
      <a
        className={buttonClasses}
        href={href}
        onClick={onClick as (event: MouseEvent<HTMLAnchorElement>) => void}
        target={target}
        ref={ref as Ref<HTMLAnchorElement>}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {startAdornment && renderAdornment(startAdornment, classes?.adornment)}
        {children}
        {endAdornment && renderAdornment(endAdornment, classes?.adornment)}
      </a>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={onClick as (event: MouseEvent<HTMLButtonElement>) => void}
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {startAdornment && renderAdornment(startAdornment, classes?.adornment)}
      {children}
      {endAdornment && renderAdornment(endAdornment, classes?.adornment)}
    </button>
  );
}

Fab.displayName = 'Fab';

export { Fab };
export type { FabClasses };
