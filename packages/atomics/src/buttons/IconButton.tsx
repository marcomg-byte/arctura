import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  JSX,
  MouseEvent,
  ReactElement,
  Ref,
} from 'react';
import { cloneElement, isValidElement } from 'react';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/** Child content supported by the icon button. */
type IconButtonChildren = IconDefinition | ReactElement;

/** Optional class name hooks for the icon button internals. */
interface IconButtonClasses {
  /** Class names applied to the rendered child icon or image. */
  children?: string;
  /** Class names applied to the outer button or anchor element. */
  iconButton?: string;
}

/**
 * Color options for the IconButton component.
 *
 * - 'primary': Primary color style
 * - 'secondary': Secondary color style
 * - 'accent': Accent color style
 */
type IconButtonColor = 'primary' | 'secondary' | 'accent';

/**
 * Size options for the IconButton component.
 *
 * - 'sm': Small
 * - 'md': Medium
 * - 'lg': Large
 */
type IconButtonSize = 'sm' | 'md' | 'lg';

/**
 * Visual style variants for the IconButton component.
 *
 * - 'outline': Bordered, transparent background
 * - 'filled': Solid background
 */
type IconButtonVariant = 'outline' | 'filled';

type ImageLikeElement = ReactElement<{
  alt?: string;
  className?: string;
  height?: number;
  src?: string;
  width?: number;
}>;

/** Shared props for both anchor and button variants. */
interface BaseProps {
  /** Icon or custom element rendered inside the control. */
  children?: IconButtonChildren;
  /** Optional class name hooks for inner and outer styling. */
  classes?: IconButtonClasses;
  /** Color token for the button styling. */
  color?: IconButtonColor;
  /** Size token controlling the visual scale of the control. */
  size?: IconButtonSize;
  /** Visual style variant for the control. */
  variant?: IconButtonVariant;
}

/** Props for the anchor variant of the IconButton component. */
interface AnchorProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className'
> {
  /** Destination URL for the anchor variant. */
  href?: string;
  /** Click handler for the anchor variant. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Optional ref forwarded to the anchor element. */
  ref?: Ref<HTMLAnchorElement>;
  /** Optional target for the anchor element. */
  target?: string;
}

/** Props for the button variant of the IconButton component. */
interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className'
> {
  /** Disallowed for the button variant. */
  href?: never;
  /** Click handler for the button variant. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Optional ref forwarded to the button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Disallowed for the button variant. */
  target?: never;
}

/** Combined prop signature for the icon button component. */
type IconButtonProps = (AnchorProps | ButtonProps) & BaseProps;

/**
 * Normalizes the icon button child into the rendered icon or image element.
 *
 * Font Awesome icons are passed through directly with the shared class name,
 * while image-like children are cloned so they inherit the standard icon
 * sizing and motion classes used by the component.
 */
const renderChildren = (children: IconButtonChildren, className?: string) => {
  const imageClasses = twMerge(
    'mg:object-cover mg:animate-fade-in mg:duration-500',
    className,
  );

  if ('iconName' in children) {
    return (
      <FontAwesomeIcon
        key={children.iconName}
        className={className}
        icon={children}
      />
    );
  }

  if (isValidElement(children)) {
    const imageProps = children.props as ImageLikeElement['props'];

    if (!imageProps.src) return children;

    return cloneElement(children as ImageLikeElement, {
      src: imageProps.src || '',
      alt: imageProps.alt || '',
      width: 24,
      height: 24,
      className: imageClasses,
    });
  }

  return children;
};

/**
 * IconButton component.
 *
 * Renders a styled button or anchor containing a FontAwesome icon, supporting different sizes, variants, and color styles.
 * The element type is determined by the presence of the 'href' prop:
 * - If 'href' is provided, renders an anchor (<a>).
 * - Otherwise, renders a native button (<button>).
 *
 * @param {AnchorProps | ButtonProps} props - Props for the anchor or button variant.
 * @returns {JSX.Element} The rendered icon button element.
 *
 * @example
 * ```tsx
 * import { IconButton } from '@/components/ui/atomics';
 * import { faCoffee } from '@fortawesome/free-solid-svg-icons';
 *
 * const MyIconButton = () => (
 *  <IconButton
 *    color="primary"
 *    size="md"
 *    variant="outline"
 *    onClick={() => alert('Icon button clicked!')}
 *  >
 *    faCoffee
 *  </IconButton>
 * );
 * ```
 */
function IconButton(props: AnchorProps & BaseProps): JSX.Element;
function IconButton(props: ButtonProps & BaseProps): JSX.Element;
function IconButton({
  children,
  classes = {},
  color = 'primary',
  href,
  size = 'sm',
  onClick,
  variant = 'outline',
  ...rest
}: IconButtonProps): JSX.Element {
  const containerClasses = classNames(
    'mg:flex mg:items-center mg:justify-center mg:rounded-lg mg:font-body mg:p-1 mg:min-h-2 mg:min-w-2 mg:hover:cursor-pointer',
    'mg:focus-visible:outline-1 mg:focus-visible:outline-offset-4 mg:focus-visible:outline-primary',
    {
      'mg:text-sm': size === 'sm',
      'mg:text-base': size === 'md',
      'mg:text-lg': size === 'lg',
    },
  );

  const outlineClasses =
    variant === 'outline'
      ? classNames(
          'mg:border-solid mg:border-1 mg:hover:border-accent mg:bg-transparent mg:text-primary',
          {
            'mg:text-primary mg:border-primary': color === 'primary',
            'mg:text-secondary mg:border-secondary': color === 'secondary',
            'mg:text-accent mg:border-accent': color === 'accent',
          },
        )
      : '';

  const filledClasses =
    variant === 'filled'
      ? classNames('mg:text-primary mg:hover:text-inverse', {
          'mg:bg-primary mg:hover:bg-primary-hover': color === 'primary',
          'mg:bg-secondary mg:hover:bg-secondary-hover': color === 'secondary',
          'mg:bg-accent mg:hover:bg-accent-hover': color === 'accent',
        })
      : '';

  const iconButtonClasses = twMerge(
    classNames(containerClasses, outlineClasses, filledClasses),
    classes?.iconButton,
  );

  if (href) {
    return (
      <a
        className={iconButtonClasses}
        href={href}
        onClick={onClick as (event: MouseEvent<HTMLAnchorElement>) => void}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children && renderChildren(children, classes?.children)}
      </a>
    );
  }

  return (
    <button
      className={iconButtonClasses}
      onClick={onClick as (event: MouseEvent<HTMLButtonElement>) => void}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children && renderChildren(children, classes?.children)}
    </button>
  );
}

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonClasses, IconButtonVariant };
