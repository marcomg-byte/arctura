import type { HTMLAttributes, JSX, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/**
 * Number of lines to clamp text to.
 * Used for truncating text with CSS line clamping utilities.
 * Valid values: 1 to 10.
 */
type ClampLine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * @constant - clampClasses
 * Maps ClampLine values to their corresponding CSS utility classes for line clamping.
 * Used internally by Typography to apply the correct line-clamp class.
 * @see ClampLine
 */
const clampClasses: Record<ClampLine, string> = {
  1: 'au:line-clamp-1',
  2: 'au:line-clamp-2',
  3: 'au:line-clamp-3',
  4: 'au:line-clamp-4',
  5: 'au:line-clamp-5',
  6: 'au:line-clamp-6',
  7: 'au:line-clamp-7',
  8: 'au:line-clamp-8',
  9: 'au:line-clamp-9',
  10: 'au:line-clamp-10',
};

/**
 * TypographyColor options for Typography text.
 * Determines the text color utility class applied.
 *
 * - 'black': Solid black color
 * - 'primary': Main foreground color
 * - 'secondary': Secondary color
 * - 'accent': Accent color
 * - 'subtle': Subtle/less prominent color
 * - 'inverse': For use on dark backgrounds
 * - 'white': Solid white color
 */
type TypographyColor =
  | 'active'
  | 'black'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'subtle'
  | 'inverse'
  | 'white';

/**
 * Heading tag variants for Typography.
 * Determines which HTML heading element is rendered.
 * Valid values: 'h1' through 'h6'.
 */
type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * List of all valid heading variants for Typography.
 * Used internally for type checks and rendering.
 * @see HeadingVariant
 */
const headingVariants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as HeadingVariant[];

/**
 * Paragraph style variants for Typography.
 * Determines the text size and style for paragraphs and spans.
 * Valid values: 'base', 'small', 'large'.
 */
type ParagraphVariant = 'base' | 'small' | 'large';

/**
 * Combined heading and paragraph variants supported by Typography.
 * Used internally for responsive text sizing and variant lookups.
 */
type TypographyVariant = HeadingVariant | ParagraphVariant;

/**
 * List of all valid paragraph variants for Typography.
 * Used internally for type checks and rendering.
 * @see ParagraphVariant
 */
const paragraphVariants = ['base', 'small', 'large'] as ParagraphVariant[];

/**
 * Maps typography variants to mobile-first text size classes.
 * Larger breakpoints preserve the current desktop sizes.
 */
const variantTextClasses: Record<TypographyVariant, string> = {
  base: 'au:text-base',
  small: 'au:text-sm',
  large: 'au:text-base au:sm:text-lg',
  h1: 'au:text-5xl au:sm:text-6xl au:lg:text-8xl',
  h2: 'au:text-4xl au:sm:text-5xl au:lg:text-7xl',
  h3: 'au:text-3xl au:sm:text-4xl au:lg:text-6xl',
  h4: 'au:text-base au:sm:text-lg',
  h5: 'au:text-sm au:sm:text-base',
  h6: 'au:text-sm',
};

/**
 * Common base props for Typography components.
 */
interface BaseProps {
  /** Text alignment. */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Whether to use bold font weight. */
  bold?: boolean;
  /** Additional CSS classes to apply. */
  className?: string;
  /** Text color variant. */
  color?: TypographyColor;
  /** Number of lines to clamp, truncating overflow. */
  clamp?: ClampLine;
  /** Content to render inside the component. */
  children?: ReactNode;
  /** Removes the default vertical padding when true. */
  removePadding?: boolean;
  /** Renders the content as a `span` instead of a heading or paragraph. */
  span?: boolean;
  /** Truncates text with an ellipsis when it overflows. */
  truncate?: boolean;
  /** Underlines the text. */
  underline?: boolean;
}

/**
 * Props for heading elements (h1-h6) in Typography.
 */
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** React ref for the heading element. */
  ref?: Ref<HTMLHeadingElement>;
  /** Specifies which heading tag to render (`h1`-`h6`). */
  variant?: HeadingVariant;
}

/**
 * Props for paragraph elements in Typography.
 */
interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  /** React ref for the paragraph element. */
  ref?: Ref<HTMLParagraphElement>;
  /** Paragraph style variant (`base`, `small`, or `large`). */
  variant?: ParagraphVariant;
}

/**
 * Props for span elements in Typography.
 */
interface SpanProps extends HTMLAttributes<HTMLSpanElement> {
  /** React ref for the span element. */
  ref?: Ref<HTMLSpanElement>;
  /** Span style variant (`base`, `small`, or `large`). */
  variant?: ParagraphVariant;
}

/**
 * All valid props for the Typography component.
 *
 * Combines base props with props for headings, paragraphs, and spans.
 *
 * @see BaseProps
 * @see HeadingProps
 * @see ParagraphProps
 * @see SpanProps
 */
type TypographyProps = BaseProps & (HeadingProps | ParagraphProps | SpanProps);

/**
 * Typography component for rendering headings, paragraphs, or spans with flexible styling.
 *
 * Renders the appropriate HTML element (h1-h6, p, or span) based on the `variant` and `span` props.
 * Applies utility classes for alignment, color, font weight, truncation, underline, and line clamping.
 *
 * @param {TypographyProps} props - Props for controlling typography style and element type.
 * @returns {JSX.Element} The rendered typography element.
 *
 * @example
 * ```tsx
 * import { Typography } from './Typography';
 *
 * function MyComponent() {
 *  return (
 *    <div>
 *       <Typography variant="h1" color="primary" bold>
 *         Heading 1
 *       </Typography>
 *       <Typography variant="base" color="secondary" clamp={3}>
 *         This is a paragraph that will be clamped to 3 lines if it exceeds the limit.
 *       </Typography>
 *     </div>
 *   );
 * }
 * ```
 */
function Typography(props: HeadingProps & BaseProps): JSX.Element;
function Typography(props: ParagraphProps & BaseProps): JSX.Element;
function Typography(props: SpanProps & BaseProps): JSX.Element;
function Typography({
  align = 'left',
  bold = false,
  className,
  children,
  clamp = 2,
  color = 'primary',
  removePadding = false,
  span = false,
  truncate = false,
  underline = false,
  variant = 'base',
  ...rest
}: TypographyProps): JSX.Element {
  const isHeading = headingVariants.includes(variant as HeadingVariant);
  const isParagraph = paragraphVariants.includes(variant as ParagraphVariant);

  const headingClasses = isHeading
    ? classNames({
        'au:font-extrabold': bold,
        'au:font-heading': !bold,
      })
    : '';

  const paragraphClasses = isParagraph
    ? classNames({
        'au:font-bold': bold,
        'au:font-body': !bold,
      })
    : '';

  const spanClasses = span
    ? classNames({
        'au:font-bold': bold,
        'au:font-body': isParagraph,
        'au:font-heading': isHeading,
      })
    : '';

  const classes = twMerge(
    classNames(
      {
        'au:py-1': !removePadding,
        'au:text-left': align === 'left',
        'au:text-center': align === 'center',
        'au:text-right': align === 'right',
        'au:text-justify': align === 'justify',
        'au:truncate': truncate,
        'au:underline': underline,
        'au:text-active': color === 'active',
        'au:text-black': color === 'black',
        'au:text-primary': color === 'primary',
        'au:text-secondary': color === 'secondary',
        'au:text-accent': color === 'accent',
        'au:text-subtle': color === 'subtle',
        'au:text-inverse': color === 'inverse',
        'au:text-white': color === 'white',
      },
      headingClasses,
      paragraphClasses,
      spanClasses,
      variantTextClasses[variant as TypographyVariant],
      clamp ? clampClasses[clamp] : ''
    ),
    className
  );

  if (span) {
    return (
      <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
        {children}
      </span>
    );
  }

  if (isHeading) {
    const Component = variant as HeadingVariant;
    return (
      <Component className={classes} {...(rest as HTMLAttributes<HTMLHeadingElement>)}>
        {children}
      </Component>
    );
  }

  return (
    <p className={classes} {...(rest as HTMLAttributes<HTMLParagraphElement>)}>
      {children}
    </p>
  );
}

Typography.displayName = 'Typography';

export { headingVariants, paragraphVariants, Typography };
export type {
  HeadingVariant,
  ParagraphVariant,
  TypographyColor,
  TypographyProps,
  TypographyVariant,
};
