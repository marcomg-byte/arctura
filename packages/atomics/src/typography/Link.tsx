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
 */
interface LinkClasses {
  /** Extra classes applied to the outer anchor element. */
  anchor?: string;
  /** Extra classes applied to the inner Typography element. */
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
 * Props for the Link component, combining anchor behavior with Typography styling.
 */
interface LinkProps extends TypographyProps {
  /** Additional props forwarded to the anchor element. */
  anchorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  /** Ref for the outer anchor element. */
  anchorRef?: Ref<HTMLAnchorElement>;
  /** Content rendered inside the link. */
  children?: ReactNode;
  /** Class overrides for the anchor and Typography elements. */
  classes?: LinkClasses;
  /** Typography color variant applied to the inner text. */
  color?: TypographyColor;
  /** Destination URL for the link. */
  href?: string;
  /** Click handler attached to the anchor element. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Target browsing context for the anchor element. */
  target?: string;
  /** Typography variant used to choose the rendered text style. */
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
 * import { Link } from '@/components/ui/atomics/typography';
 *
 * export function ContactLinks() {
 *   return (
 *     <div className="mg:flex mg:flex-col mg:gap-3">
 *       <Link
 *         href="mailto:hello@example.com"
 *         variant="h3"
 *         color="primary"
 *         classes={{
 *           anchor: 'mg:inline-flex',
 *           typography: 'mg:font-semibold',
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
  const anchorClasses = twMerge(classNames('mg:flex mg:group'), classes?.anchor);
  const typographyClasses = twMerge(
    classNames('mg:cursor-pointer', {
      'mg:group-hover:text-accent': color !== 'accent',
      'mg:group-hover:text-subtle-hover': color === 'accent',
      'mg:group-active:text-active mg:group-visited:text-active': color !== 'active',
      'mg:group-active:text-active-hover mg:group-visited:text-active-hover': color === 'active',
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
export type { LinkClasses };
