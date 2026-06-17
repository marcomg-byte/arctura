import type { AnchorHTMLAttributes, JSX, HTMLAttributes, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Supported color schemes for the Badge component.
 *
 * - 'primary': Main brand color
 * - 'secondary': Secondary color
 * - 'subtle': Neutral/subtle color
 * - 'accent': Accent color
 * - 'success': Success/positive color
 * - 'danger': Error/negative color
 * - 'warning': Warning/alert color
 * - 'info': Informational color
 */
type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'subtle'
  | 'accent'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

/**
 * Position of the icon relative to the badge content.
 *
 * - 'start': Icon appears before the content
 * - 'end': Icon appears after the content
 */
type IconPosition = 'start' | 'end';

/**
 * Supported size options for the Badge component.
 *
 * - 'xs': Extra small
 * - 'sm': Small
 * - 'md': Medium (default)
 * - 'lg': Large
 */
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Visual style variants for the Badge component.
 *
 * - 'filled': Solid background and border
 * - 'outline': Transparent background with border
 * - 'ghost': Transparent background, no border
 */
type BadgeVariant = 'filled' | 'outline' | 'ghost';

/**
 * Common props for the Badge component, shared by both div and anchor variants.
 *
 * @property {ReactNode} [children] - Content to display inside the badge.
 * @property {string} [className] - Additional CSS classes for the badge.
 * @property {BadgeColor} [color] - Color scheme for the badge.
 * @property {IconDefinition} [icon] - FontAwesome icon to display in the badge.
 * @property {IconPosition} [iconPosition] - Position of the icon relative to the content ('start' or 'end').
 * @property {BadgeSize} [size] - Size of the badge ('xs', 'sm', 'md', 'lg').
 * @property {BadgeVariant} [variant] - Visual style variant ('filled', 'outline', 'ghost').
 */
interface BaseProps {
  children?: ReactNode;
  className?: string;
  color?: BadgeColor;
  icon?: IconDefinition;
  iconPosition?: IconPosition;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

/**
 * Props for a Badge rendered as a <div> (non-link).
 *
 * @property {never} [href] - Disallowed for div variant.
 * @property {Ref<HTMLDivElement>} [ref] - Ref for the div element.
 * @property {never} [target] - Disallowed for div variant.
 */
interface DivProps extends HTMLAttributes<HTMLDivElement> {
  href?: never;
  ref?: Ref<HTMLDivElement>;
  target?: never;
}

/**
 * Props for a Badge rendered as an <a> (link).
 *
 * @property {string} href - URL for the anchor element.
 * @property {Ref<HTMLAnchorElement>} [ref] - Ref for the anchor element.
 * @property {string} [target] - Target attribute for the anchor (e.g., '_blank').
 */
interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
  target?: string;
}

/**
 * Props for the Badge component, supporting both <div> and <a> variants.
 *
 * Combines common badge props with either div-specific or anchor-specific props, allowing the badge to render as a non-link or a link.
 * The component will determine which element to render based on the presence of the 'href' prop.
 * - If 'href' is provided, it renders as an anchor (<a>).
 * - If 'href' is not provided, it renders as a div (<div>).
 * This design allows for flexible usage of the Badge component in various contexts, such as displaying status indicators or clickable links.
 */
type BadgeProps = (DivProps | AnchorProps) & BaseProps;

/**
 * Badge component for displaying status, labels, or links with optional icon and color styling.
 *
 * Renders as either a <div> or <a> element depending on the presence of the 'href' prop. Supports different color schemes, sizes, variants, and icon positions.
 *
 * @param {BadgeProps} props - Props for configuring the badge appearance and behavior.
 * @returns {JSX.Element} The rendered badge component.
 *
 * @example
 * ```tsx
 * import { Badge } from '@/src';
 * import { faCheck } from '@fortawesome/free-solid-svg-icons';
 *
 * const MyBadge = () => (
 *  <Badge
 *   color="success"
 *   icon={faCheck}
 *   iconPosition="start"
 *   size="sm"
 *   variant="outline"
 *  >
 *    Active
 *  </Badge>
 * );
 * ```
 */
function Badge(props: DivProps & BaseProps): JSX.Element;
function Badge(props: AnchorProps & BaseProps): JSX.Element;
function Badge({
  children,
  className,
  color = 'primary',
  href,
  icon,
  iconPosition = 'end',
  ref,
  size = 'md',
  target,
  variant = 'filled',
  ...rest
}: BadgeProps): JSX.Element {
  const filledClasses =
    variant === 'filled'
      ? classNames('mg:border-solid mg:border-1', {
          'mg:bg-primary mg:border-primary': color === 'primary',
          'mg:hover:bg-primary-hover': color === 'primary' && href,
          'mg:bg-secondary mg:border-secondary': color === 'secondary',
          'mg:hover:bg-secondary-hover': color === 'secondary' && href,
          'mg:bg-subtle mg:border-subtle': color === 'subtle',
          'mg:hover:bg-subtle-hover': color === 'subtle' && href,
          'mg:bg-accent mg:border-accent': color === 'accent',
          'mg:hover:bg-accent-hover': color === 'accent' && href,
          'mg:bg-success-primary mg:border-success': color === 'success',
          'mg:hover:bg-success-hover': color === 'success' && href,
          'mg:bg-danger-primary mg:border-danger': color === 'danger',
          'mg:hover:bg-danger-hover': color === 'danger' && href,
          'mg:bg-warning-primary mg:border-warning': color === 'warning',
          'mg:hover:bg-warning-hover': color === 'warning' && href,
          'mg:bg-info-primary mg:border-info': color === 'info',
          'mg:hover:bg-info-hover': color === 'info' && href,
        })
      : '';

  const ghostClasses =
    variant === 'ghost'
      ? classNames('mg:bg-transparent', {
          'mg:text-primary': color === 'primary',
          'mg:hover:text-primary-hover': color === 'primary' && href,
          'mg:text-secondary': color === 'secondary',
          'mg:hover:text-secondary-hover': color === 'secondary' && href,
          'mg:text-subtle': color === 'subtle',
          'mg:hover:text-subtle-hover': color === 'subtle' && href,
          'mg:text-accent': color === 'accent',
          'mg:hover:text-accent-hover': color === 'accent' && href,
          'mg:text-success': color === 'success',
          'mg:hover:text-success-hover': color === 'success' && href,
          'mg:text-danger': color === 'danger',
          'mg:hover:text-danger-hover': color === 'danger' && href,
          'mg:text-warning': color === 'warning',
          'mg:hover:text-warning-hover': color === 'warning' && href,
          'mg:text-info': color === 'info',
          'mg:hover:text-info-hover': color === 'info' && href,
        })
      : '';

  const iconClasses = classNames('mg:text-xs', {
    'mg:text-primary': color === 'primary',
    'mg:text-secondary': color === 'secondary',
    'mg:text-subtle': color === 'subtle',
    'mg:text-accent': color === 'accent',
    'mg:text-success': color === 'success',
    'mg:text-danger': color === 'danger',
    'mg:text-warning': color === 'warning',
    'mg:text-info': color === 'info',
  });

  const outlineClasses =
    variant === 'outline'
      ? classNames('mg:bg-transparent mg:border-solid mg:border-1', {
          'mg:border-primary ': color === 'primary',
          'mg:hover:border-primary': color === 'primary' && href,
          'mg:border-secondary': color === 'secondary',
          'mg:hover:border-secondary': color === 'secondary' && href,
          'mg:border-subtle': color === 'subtle',
          'mg:hover:border-subtle': color === 'subtle' && href,
          'mg:border-accent': color === 'accent',
          'mg:hover:border-accent': color === 'accent' && href,
          'mg:border-success': color === 'success',
          'mg:hover:border-success': color === 'success' && href,
          'mg:border-danger': color === 'danger',
          'mg:hover:border-danger': color === 'danger' && href,
          'mg:border-warning': color === 'warning',
          'mg:hover:border-warning': color === 'warning' && href,
          'mg:border-info': color === 'info',
          'mg:hover:border-info': color === 'info' && href,
        })
      : '';

  const classes = classNames(
    'mg:flex mg:items-center mg:justify-between mg:rounded-full',
    {
      'mg:px-1 mg:py-0.5 mg:text-xs': size === 'xs',
      'mg:px-2 mg:py-1 mg:text-sm': size === 'sm',
      'mg:px-3 mg:py-1.5 mg:text-base': size === 'md',
      'mg:px-4 mg:py-2 mg:text-lg': size === 'lg',
    },
    filledClasses,
    ghostClasses,
    outlineClasses,
    className
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        ref={ref as Ref<HTMLAnchorElement>}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon && iconPosition === 'start' && (
          <FontAwesomeIcon icon={icon} className={iconClasses} />
        )}
        {children}
        {icon && iconPosition === 'end' && <FontAwesomeIcon icon={icon} className={iconClasses} />}
      </a>
    );
  }

  return (
    <div
      className={classes}
      ref={ref as Ref<HTMLDivElement>}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {icon && iconPosition === 'start' && <FontAwesomeIcon icon={icon} className={iconClasses} />}
      {children}
      {icon && iconPosition === 'end' && <FontAwesomeIcon icon={icon} className={iconClasses} />}
    </div>
  );
}

Badge.displayName = 'Badge';

export { Badge };
