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

/**
 * Optional class name hooks for the icon button internals.
 *
 * @property [children] - Class names applied to the rendered child icon or image.
 * @property [iconButton] - Class names applied to the outer button or anchor element.
 */
interface IconButtonClasses {
  /**
   * Class names applied to the rendered child icon or image.
   * @defaultValue undefined
   */
  children?: string;
  /**
   * Class names applied to the outer button or anchor element.
   * @defaultValue undefined
   */
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

/**
 * Shared props for both anchor and button variants.
 *
 * @property [children] - Icon or custom element rendered inside the control.
 * @property [classes] - Optional class name hooks for inner and outer styling.
 * @property [color] - Color token for the button styling.
 * @property [size] - Size token controlling the visual scale of the control.
 * @property [variant] - Visual style variant for the control.
 */
interface BaseProps {
  /**
   * Icon or custom element rendered inside the control.
   * @defaultValue undefined
   */
  children?: IconButtonChildren;
  /**
   * Optional class name hooks for inner and outer styling.
   * @defaultValue undefined
   */
  classes?: IconButtonClasses;
  /**
   * Color token for the button styling.
   * @defaultValue undefined
   */
  color?: IconButtonColor;
  /**
   * Size token controlling the visual scale of the control.
   * @defaultValue undefined
   */
  size?: IconButtonSize;
  /**
   * Visual style variant for the control.
   * @defaultValue undefined
   */
  variant?: IconButtonVariant;
}

/**
 * Props for the anchor variant of the IconButton component.
 *
 * @property [href] - Destination URL for the anchor variant.
 * @property [onClick] - Click handler for the anchor variant.
 * @property [ref] - Optional ref forwarded to the anchor element.
 * @property [target] - Optional target for the anchor element.
 */
interface AnchorProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className'
> {
  /**
   * Destination URL for the anchor variant.
   * @defaultValue undefined
   */
  href?: string;
  /**
   * Click handler for the anchor variant.
   * @defaultValue undefined
   */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Optional ref forwarded to the anchor element.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLAnchorElement>;
  /**
   * Optional target for the anchor element.
   * @defaultValue undefined
   */
  target?: string;
}

/**
 * Props for the button variant of the IconButton component.
 *
 * @property [href] - Disallowed for the button variant.
 * @property [onClick] - Click handler for the button variant.
 * @property [ref] - Optional ref forwarded to the button element.
 * @property [target] - Disallowed for the button variant.
 */
interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className'
> {
  /**
   * Disallowed for the button variant.
   * @defaultValue undefined
   */
  href?: never;
  /**
   * Click handler for the button variant.
   * @defaultValue undefined
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Optional ref forwarded to the button element.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLButtonElement>;
  /**
   * Disallowed for the button variant.
   * @defaultValue undefined
   */
  target?: never;
}

/**
 * Combined prop signature for the icon button component.
 *
 * @property [children] - FontAwesome icon or React element rendered inside the control.
 * @property [classes] - Optional class name hooks for the icon and root control.
 * @property [color] - Color token used by the icon button styling.
 * @property [href] - Optional URL that renders the icon button as an anchor.
 * @property [onClick] - Click handler for the rendered button or anchor.
 * @property [ref] - Ref forwarded to the rendered button or anchor element.
 * @property [size] - Size token controlling the icon button scale.
 * @property [target] - Anchor target used when the icon button renders as a link.
 * @property [variant] - Visual style variant for the control.
 */
type IconButtonProps = (AnchorProps | ButtonProps) & BaseProps;

/**
 * Normalizes the icon button child into the rendered icon or image element.
 *
 * Font Awesome icons are passed through directly with the shared class name,
 * while image-like children are cloned so they inherit the standard icon
 * sizing and motion classes used by the component.
 */
const renderChildren = (children: IconButtonChildren, className?: string) => {
  const imageClasses = twMerge('au:object-cover au:animate-fade-in au:duration-500', className);

  if ('iconName' in children) {
    return <FontAwesomeIcon key={children.iconName} className={className} icon={children} />;
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
 * import { IconButton } from '@arctura/atomics';
 * import { faGear } from '@fortawesome/free-solid-svg-icons';
 *
 * export function SettingsButton() {
 *   return (
 *     <IconButton aria-label="Open settings" color="secondary" size="md" onClick={() => openSettings()}>
 *       {faGear}
 *     </IconButton>
 *   );
 * }
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
    'au:flex au:items-center au:justify-center au:rounded-lg au:font-body au:p-1 au:min-h-2 au:min-w-2 au:hover:cursor-pointer',
    'au:focus-visible:outline-1 au:focus-visible:outline-offset-4 au:focus-visible:outline-primary',
    {
      'au:text-sm': size === 'sm',
      'au:text-base': size === 'md',
      'au:text-lg': size === 'lg',
    }
  );

  const outlineClasses =
    variant === 'outline'
      ? classNames(
          'au:border-solid au:border-1 au:hover:border-accent au:bg-transparent au:text-primary',
          {
            'au:text-primary au:border-primary': color === 'primary',
            'au:text-secondary au:border-secondary': color === 'secondary',
            'au:text-accent au:border-accent': color === 'accent',
          }
        )
      : '';

  const filledClasses =
    variant === 'filled'
      ? classNames('au:text-primary au:hover:text-inverse', {
          'au:bg-primary au:hover:bg-primary-hover': color === 'primary',
          'au:bg-secondary au:hover:bg-secondary-hover': color === 'secondary',
          'au:bg-accent au:hover:bg-accent-hover': color === 'accent',
        })
      : '';

  const iconButtonClasses = twMerge(
    classNames(containerClasses, outlineClasses, filledClasses),
    classes?.iconButton
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
export type {
  IconButtonChildren,
  IconButtonClasses,
  IconButtonColor,
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
};
