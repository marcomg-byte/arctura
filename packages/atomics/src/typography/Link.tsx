import type { AnchorHTMLAttributes, FC, MouseEvent, ReactNode, Ref } from 'react';
import { headingVariants, Typography } from './Typography';
import type {
  HeadingVariant,
  ParagraphVariant,
  TypographyColor,
  TypographyProps as TypographyComponentProps,
  TypographyVariant,
} from './Typography';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

/**
 * Determines whether the provided typography variant should render as a heading.
 *
 * @param variant - Typography variant to inspect.
 * @returns True when the variant maps to one of the heading tags.
 */
const isHeadingVariant = (variant: TypographyVariant): variant is HeadingVariant =>
  headingVariants.includes(variant as HeadingVariant);

/**
 * Optional class name overrides for the anchor wrapper and Typography content.
 *
 * @property [anchor] - Extra classes applied to the outer anchor element.
 * @property [typography] - Extra classes applied to the inner Typography element.
 */
interface LinkClasses {
  /**
   * Extra classes applied to the outer anchor element.
   * @defaultValue undefined
   */
  anchor?: string;
  /**
   * Extra classes applied to the inner Typography element.
   * @defaultValue undefined
   */
  typography?: string;
}

/**
 * Typography props allowed through Link after excluding anchor-specific fields.
 */
type TypographyProps = Omit<
  TypographyComponentProps,
  'className' | 'color' | 'ref' | 'variant' | 'target' | 'href' | 'onClick'
>;

/**
 * Props for the Link component.
 *
 * Use this interface when a text link needs standard anchor behavior plus the
 * typography system's variant, color, clamp, and emphasis controls.
 *
 * @property [anchorProps] - Additional props forwarded to the anchor element.
 * @property [anchorRef] - Ref forwarded to the outer anchor element.
 * @property [children] - Content rendered inside the link.
 * @property [classes] - Class name hooks for anchor and Typography elements.
 * @property [color] - Typography color variant applied to the inner text.
 * @property [href] - Destination URL for the link.
 * @property [onClick] - Click handler attached to the anchor element.
 * @property [target] - Target browsing context for the anchor element.
 * @property [variant] - Typography variant used for the rendered text style.
 */
interface LinkProps extends TypographyProps {
  /**
   * Additional props forwarded to the anchor element.
   * @defaultValue {}
   */
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  /**
   * Ref for the outer anchor element.
   * @defaultValue undefined
   */
  anchorRef?: Ref<HTMLAnchorElement>;
  /**
   * Content rendered inside the link.
   * @defaultValue undefined
   */
  children?: ReactNode;
  /**
   * Class overrides for the anchor and Typography elements.
   * @defaultValue {}
   */
  classes?: LinkClasses;
  /**
   * Typography color variant applied to the inner text.
   * @defaultValue 'primary'
   */
  color?: TypographyColor;
  /**
   * Destination URL for the link.
   * @defaultValue undefined
   */
  href?: string;
  /**
   * Click handler attached to the anchor element.
   * @defaultValue undefined
   */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Target browsing context for the anchor element.
   * @defaultValue undefined
   */
  target?: string;
  /**
   * Typography variant used to choose the rendered text style.
   * @defaultValue 'base'
   */
  variant?: TypographyVariant;
}

/**
 * Link component that pairs a native anchor with the Typography system.
 *
 * Use this when you want link behavior, theme-aware text styling, and the
 * same variant handling used throughout the typography atoms. The component
 * keeps anchor concerns on the outer element and typography concerns on the
 * inner text, so you can style each layer independently.
 *
 * @example
 * ```tsx
 * import { Link } from '@arctura/atomics';
 *
 * export function ContactLinks() {
 *   return (
 *     <div className="au:flex au:flex-col au:gap-3">
 *       <Link
 *         href="mailto:hello@example.com"
 *         variant="h3"
 *         color="primary"
 *         classes={{
 *           anchor: 'au:inline-flex',
 *           typography: 'au:font-semibold',
 *         }}
 *       >
 *         hello@example.com
 *       </Link>
 *
 *       <Link
 *         href="https://example.com/projects"
 *         target="_blank"
 *         rel="noreferrer"
 *         variant="base"
 *         color="secondary"
 *         anchorProps={{
 *           'aria-label': 'Open projects page in a new tab',
 *         }}
 *       >
 *         View projects
 *       </Link>
 *     </div>
 *   );
 * }
 * ```
 */
const Link: FC<LinkProps> = ({
  anchorProps = {},
  anchorRef,
  children,
  classes = {},
  color = 'primary',
  href,
  onClick,
  target,
  variant = 'base',
  ...rest
}) => {
  const anchorClasses = twMerge(classNames('au:flex au:group'), classes?.anchor);
  const typographyClasses = twMerge(
    classNames('au:cursor-pointer', {
      'au:group-hover:text-accent': color !== 'accent',
      'au:group-hover:text-subtle-hover': color === 'accent',
      'au:group-active:text-active au:group-visited:text-active': color !== 'active',
      'au:group-active:text-active-hover au:group-visited:text-active-hover': color === 'active',
    }),
    classes?.typography
  );

  if (isHeadingVariant(variant)) {
    return (
      <a
        className={anchorClasses}
        href={href}
        onClick={onClick}
        ref={anchorRef}
        target={target}
        {...anchorProps}
      >
        <Typography
          className={typographyClasses}
          color={color}
          variant={variant as HeadingVariant}
          {...rest}
        >
          {children}
        </Typography>
      </a>
    );
  }

  return (
    <a
      className={anchorClasses}
      href={href}
      onClick={onClick}
      ref={anchorRef}
      target={target}
      {...anchorProps}
    >
      <Typography
        className={typographyClasses}
        color={color}
        variant={variant as ParagraphVariant}
        {...rest}
      >
        {children}
      </Typography>
    </a>
  );
};

Link.displayName = 'Link';

export { Link };
export type { LinkClasses, LinkProps };
