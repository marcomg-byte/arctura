'use client';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, JSX, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * Supported adornments for the Button component: either a FontAwesome icon or an image.
 */
type ButtonAdornment = IconDefinition | ButtonImage;

/**
 * Class name hooks for the Button component internals.
 *
 * @property [adornment] - Class names applied to the rendered adornment.
 * @property [button] - Class names applied to the outer button or anchor element.
 */
interface ButtonClasses {
  /** Class names applied to the rendered adornment. */
  adornment?: string;
  /** Class names applied to the outer button or anchor element. */
  button?: string;
}

/**
 * Image object for use as a button adornment.
 *
 * @property [src] - Image source URL.
 * @property [alt] - Alternative text for the image.
 */
interface ButtonImage {
  /** Image source URL. */
  src?: string;
  /** Alternative text for the image. */
  alt?: string;
}

/**
 * Supported button types for the native button element.
 *
 * - 'button': Standard button (default)
 * - 'submit': Submits a form
 * - 'reset': Resets a form
 */
type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Size options for the Button component.
 *
 * - 'sm': Small
 * - 'md': Medium
 * - 'lg': Large
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Visual style variants for the Button component.
 *
 * - 'primary': Main action button
 * - 'secondary': Secondary action button
 * - 'text': Text-only button
 * - 'outline': Outlined button
 */
type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline';

/**
 * Maps ButtonSize values to fixed width, height, spacing, radius, and text size classes.
 */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'au:h-7 au:w-24 au:px-1.5 au:py-1 au:rounded-sm au:text-sm',
  md: 'au:h-9 au:w-32 au:px-2.5 au:py-2 au:rounded-md au:text-sm',
  lg: 'au:h-12 au:w-40 au:px-3.5 au:py-3 au:rounded-lg au:text-base',
};

/**
 * Maps ButtonSize values to mobile-first width, height, spacing, radius, and text size classes.
 * Larger breakpoints preserve the fixed size classes.
 */
const responsiveSizeClasses: Record<ButtonSize, string> = {
  sm: 'au:h-7 au:w-24 au:px-1.5 au:py-1 au:rounded-sm au:text-sm',
  md: 'au:h-8 au:w-28 au:px-2 au:py-1.5 au:rounded-md au:text-sm au:sm:h-9 au:sm:w-32 au:sm:px-2.5 au:sm:py-2',
  lg: 'au:h-9 au:w-32 au:px-2.5 au:py-2 au:rounded-md au:text-sm au:sm:h-12 au:sm:w-40 au:sm:px-3.5 au:sm:py-3 au:sm:rounded-lg au:sm:text-base',
};

const fullWidthSizeClasses: Record<ButtonSize, string> = {
  sm: 'au:h-7 au:w-full au:px-1.5 au:py-1 au:rounded-sm au:text-sm',
  md: 'au:h-9 au:w-full au:px-2.5 au:py-2 au:rounded-md au:text-sm',
  lg: 'au:h-12 au:w-full au:px-3.5 au:py-3 au:rounded-lg au:text-base',
};

const responsiveFullWidthSizeClasses: Record<ButtonSize, string> = {
  sm: 'au:h-7 au:w-full au:px-1.5 au:py-1 au:rounded-sm au:text-sm',
  md: 'au:h-8 au:w-full au:px-2 au:py-1.5 au:rounded-md au:text-sm au:sm:h-9 au:sm:px-2.5 au:sm:py-2',
  lg: 'au:h-9 au:w-full au:px-2.5 au:py-2 au:rounded-md au:text-sm au:sm:h-12 au:sm:px-3.5 au:sm:py-3 au:sm:rounded-lg au:sm:text-base',
};

/**
 * Common props for the Button component, shared by both anchor and button variants.
 *
 * @property [children] - Content rendered inside the button.
 * @property [classes] - Optional class name hooks for internal elements.
 * @property [endAdornment] - Icon or image rendered after the button content.
 * @property [fullWidth] - Expands the button to fill the width of its parent container.
 * @property [responsive] - Enables mobile-first responsive sizing.
 * @property [size] - Size token controlling the button dimensions and spacing.
 * @property [startAdornment] - Icon or image rendered before the button content.
 * @property [ref] - Ref forwarded to the rendered anchor element.
 * @property [variant] - Visual style variant for the button.
 */
interface BaseProps {
  /** Content rendered inside the button. */
  children?: ReactNode;
  /** Optional class name hooks for internal elements. */
  classes?: ButtonClasses;
  /** Icon or image rendered after the button content. */
  endAdornment?: ButtonAdornment;
  /** Expands the button to fill the width of its parent container. */
  fullWidth?: boolean;
  /** Enables mobile-first responsive sizing. */
  responsive?: boolean;
  /** Size token controlling the button dimensions and spacing. */
  size?: ButtonSize;
  /** Icon or image rendered before the button content. */
  startAdornment?: ButtonAdornment;
  /** Ref forwarded to the rendered anchor element. */
  ref?: Ref<HTMLAnchorElement>;
  /** Visual style variant for the button. */
  variant?: ButtonVariant;
}

/**
 * Props for the anchor variant of the Button component.
 *
 * @property href - URL used by the anchor button.
 * @property [ref] - Ref forwarded to the rendered anchor element.
 * @property [target] - Optional target attribute for the anchor element.
 * @property [type] - Disallowed for the anchor variant.
 */
interface AnchorProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  /** URL used by the anchor button. */
  href: string;
  /** Ref forwarded to the rendered anchor element. */
  ref?: Ref<HTMLAnchorElement>;
  /** Optional target attribute for the anchor element. */
  target?: string;
  /** Disallowed for the anchor variant. */
  type?: never;
}

/**
 * Props for the button variant of the Button component.
 *
 * @property [href] - Disallowed for the native button variant.
 * @property [ref] - Ref forwarded to the rendered button element.
 * @property [target] - Disallowed for the native button variant.
 * @property [type] - Native button type attribute.
 */
interface ButtonNativeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Disallowed for the native button variant. */
  href?: never;
  /** Ref forwarded to the rendered button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Disallowed for the native button variant. */
  target?: never;
  /** Native button type attribute. */
  type?: ButtonType;
}

/**
 * Props for the Button component, supporting both anchor and button variants.
 * Combines common button props with either anchor-specific or button-specific props, allowing the component to render as a link or a button.
 * The component will determine which element to render based on the presence of the 'href' prop:
 * - If 'href' is provided, it renders as an anchor (<a>).
 * - If 'href' is not provided, it renders as a button (<button>).
 *
 * @property [children] - Content rendered inside the button.
 * @property [classes] - Optional class name hooks for the button and adornment.
 * @property [endAdornment] - Icon or image rendered after the button content.
 * @property [fullWidth] - Expands the button to fill the width of its parent.
 * @property [href] - Optional URL that renders the button as an anchor.
 * @property [ref] - Ref forwarded to the rendered button or anchor element.
 * @property [responsive] - Enables mobile-first responsive sizing.
 * @property [size] - Size token controlling button dimensions and spacing.
 * @property [startAdornment] - Icon or image rendered before the button content.
 * @property [target] - Anchor target used when the button renders as a link.
 * @property [type] - Native button type used when rendering a button element.
 * @property [variant] - Visual style variant for the button.
 */
type ButtonProps = (AnchorProps | ButtonNativeProps) & BaseProps;

/**
 * Utility function to render a button adornment (icon or image).
 *
 * @param {ButtonAdornment} adornment - The adornment to render (FontAwesome icon or image object).
 * @returns {JSX.Element} The rendered icon or image element.
 */
const renderAdornment = (adornment: ButtonAdornment, className?: string) => {
  const iconClasses = twMerge('au:text-xs', className);
  const imageClasses = twMerge('au:object-contain au:animate-fade-in au:duration-500', className);

  if ('iconName' in adornment) {
    return <FontAwesomeIcon key={adornment.iconName} icon={adornment} className={iconClasses} />;
  }

  return (
    <img
      alt={adornment.alt || ''}
      src={adornment.src || ''}
      width={16}
      height={16}
      className={imageClasses}
    />
  );
};

/**
 * Button component supporting both anchor (<a>) and button (<button>) variants.
 *
 * Renders a styled button or anchor element with optional start/end adornments (icon or image),
 * supporting multiple visual variants and sizes. The element type is determined by the presence of the 'href' prop:
 * - If 'href' is provided, renders an anchor (<a>).
 * - Otherwise, renders a native button (<button>).
 *
 * @param {ButtonComponentProps} props - Button or anchor props.
 * @returns {JSX.Element} The rendered button or anchor element.
 *
 * @example
 * ```tsx
 * import { Button } from '@arctura/atomics';
 * import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
 *
 * export function ProjectLink() {
 *   return (
 *     <Button href="/projects" size="md" endAdornment={faArrowRight}>
 *       View projects
 *     </Button>
 *   );
 * }
 * ```
 */
function Button(props: AnchorProps & BaseProps): JSX.Element;
function Button(props: ButtonNativeProps & BaseProps): JSX.Element;
function Button({
  children,
  classes = {},
  endAdornment,
  href,
  fullWidth = false,
  responsive = true,
  size = 'md',
  startAdornment,
  ref,
  target,
  type = 'button',
  variant = 'primary',
  ...rest
}: ButtonProps): JSX.Element {
  const isStartAdornmentIcon = startAdornment && 'iconName' in startAdornment;
  const isEndAdornmentIcon = endAdornment && 'iconName' in endAdornment;
  const isStartAdornmentImage = startAdornment && 'src' in startAdornment;
  const isEndAdornmentImage = endAdornment && 'src' in endAdornment;
  const buttonSizeClasses = responsive ? responsiveSizeClasses[size] : sizeClasses[size];
  const fullWidthClasses = responsive
    ? responsiveFullWidthSizeClasses[size]
    : fullWidthSizeClasses[size];

  const buttonClasses = twMerge(
    classNames(
      'au:inline-flex au:shrink-0 au:justify-start au:items-center au:font-body au:text-primary au:hover:text-primary-hover au:hover:cursor-pointer',
      'au:focus-visible:outline-1 au:focus-visible:outline-offset-4 au:focus-visible:outline-primary',
      fullWidth ? fullWidthClasses : buttonSizeClasses,
      {
        'au:bg-primary au:hover:bg-primary-hover': variant === 'primary',
        'au:bg-secondary au:hover:bg-secondary-hover': variant === 'secondary',
        'au:bg-transparent au:hover:border-solid au:hover:border-1 au:hover:border-accent':
          variant === 'text',
        'au:border-solid au:border-1 au:border-primary au:hover:border-accent':
          variant === 'outline',
        'au:gap-2': (isStartAdornmentIcon || isEndAdornmentIcon) && children,
        'au:gap-1': (isStartAdornmentImage || isEndAdornmentImage) && children,
      }
    ),
    classes?.button
  );

  if (href) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={buttonClasses}
        href={href}
        target={target}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {startAdornment && renderAdornment(startAdornment)}
        {children}
        {endAdornment && renderAdornment(endAdornment)}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={buttonClasses}
      type={type}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {startAdornment && renderAdornment(startAdornment)}
      {children}
      {endAdornment && renderAdornment(endAdornment)}
    </button>
  );
}

Button.displayName = 'Button';

export { Button };
export type { ButtonAdornment, ButtonClasses, ButtonProps, ButtonSize, ButtonType, ButtonVariant };
