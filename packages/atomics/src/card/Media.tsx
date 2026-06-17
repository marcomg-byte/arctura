import type { FC, HTMLAttributes, Ref } from 'react';
import classNames from 'classnames';

/**
 * Supported aspect ratios for the Media component.
 *
 * - '1:1': Square
 * - '16:9': Widescreen
 * - '4:3': Standard
 * - '3:2': Classic photo
 * - '21:9': Ultra-wide
 */
type AspectRatio = '1:1' | '16:9' | '4:3' | '3:2' | '21:9';

/**
 * Image loading priority for the Media component.
 *
 * - 'eager': Loads image immediately (high priority)
 * - 'lazy': Defers loading until needed (default)
 */
type MediaPriority = 'eager' | 'lazy';

/**
 * Props for the Card Media component.
 *
 * @property {string} [alt] - Alternative text for the image.
 * @property {AspectRatio} [aspectRatio] - Aspect ratio for the media container.
 * @property {boolean} [footerless] - If true, applies rounded corners to the bottom of the media.
 * @property {boolean} [headerless] - If true, applies rounded corners to the top of the media.
 * @property {MediaPriority} [priority] - Image loading priority ('eager' or 'lazy').
 * @property {Ref<HTMLDivElement>} [ref] - Ref for the media container div.
 * @property {string} [sizes] - Responsive image sizes attribute.
 * @property {string} [src] - Image source URL.
 */
interface MediaProps extends HTMLAttributes<HTMLDivElement> {
  alt?: string;
  aspectRatio?: AspectRatio;
  footerless?: boolean;
  headerless?: boolean;
  priority?: MediaPriority;
  ref?: Ref<HTMLDivElement>;
  sizes?: string;
  src?: string;
}

/**
 * * @constant aspectRatioClasses - Object mapping aspect ratios to Tailwind CSS classes for styling.
 * Used to ensure the media container maintains the correct aspect ratio.
 * @property {1:1} aspectRatio - Square aspect ratio class.
 * @property {16:9} aspectRatio - Widescreen aspect ratio class.
 * @property {4:3} aspectRatio - Standard aspect ratio class.
 * @property {3:2} aspectRatio - Classic photo aspect ratio class.
 * @property {21:9} aspectRatio - Ultra-wide aspect ratio class.
 * @returns {Record<AspectRatio, string>} Object mapping aspect ratios to their corresponding CSS classes.
 */
const aspectRatioClasses: Record<AspectRatio, string> = {
  '1:1': 'mg:aspect-square',
  '16:9': 'mg:aspect-video',
  '4:3': 'mg:aspect-[4/3]',
  '3:2': 'mg:aspect-[3/2]',
  '21:9': 'mg:aspect-[21/9]',
};

/**
 * Card Media component for displaying an image with configurable aspect ratio and rounded corners.
 * Renders a responsive image with support for custom aspect ratios, header/footer corner rounding, and loading priority.
 *
 * @param {MediaProps} props - Props for configuring the media content and appearance.
 * @returns {JSX.Element} The rendered media component.
 *
 * @example
 * ```tsx
 * import { Media } from '@/components/ui/atomics';
 *
 * const MyCardMedia = () => (
 *  <Media
 *    src="/path/to/image.jpg"
 *    alt="Description of the image"
 *    aspectRatio="16:9"
 *    priority="eager"
 *  />
 * );
 * ```
 */
const Media: FC<MediaProps> = ({
  alt = '',
  aspectRatio = '4:3',
  headerless = false,
  footerless = false,
  priority = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  src = '',
  ref,
  ...rest
}) => {
  const classes = classNames(
    'mg:relative mg:w-full mg:overflow-hidden',
    aspectRatioClasses[aspectRatio],
    {
      'mg:rounded-tl-lg mg:rounded-tr-lg': headerless,
      'mg:rounded-bl-lg mg:rounded-br-lg': footerless,
    },
  );

  return (
    <div
      className={classes}
      ref={ref}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      <img
        alt={alt}
        src={src}
        loading={priority}
        sizes={sizes}
        className="mg:absolute mg:inset-0 mg:h-full mg:w-full mg:object-cover mg:animate-fade-in"
      />
    </div>
  );
};

Media.displayName = 'Card.Media';

export { Media };
export type { MediaProps };
