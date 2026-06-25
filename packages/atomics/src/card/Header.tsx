import type { ComponentProps, FC, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { cloneElement, isValidElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '../badge';
import { Typography } from '../typography';

/**
 * An adornment that may appear in the card header.
 *
 * This can be either:
 * - an `IconDefinition` (a FontAwesome icon) which will be rendered
 *   with `FontAwesomeIcon`, or
 * - an object with a `src` string and optional `alt` text which will be
 *   rendered using a native image element.
 */
type HeaderAdornment = IconDefinition | { src: string; alt?: string };

/**
 * Props for the Card Header component.
 *
 * @property {HeaderAdornment} [adornment] - Optional adornment which can be an icon definition or an image source with alt text.
 * @property {ReactElement<ComponentProps<typeof Badge>>} [badge] - Optional badge element to display.
 * @property {Ref<HTMLDivElement>} [ref] - Ref for the header div.
 * @property {ReactNode} [subtitle] - Optional subtitle content.
 * @property {string} title - Main title text (required).
 */
interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  adornment?: HeaderAdornment;
  badge?: ReactElement<ComponentProps<typeof Badge>>;
  ref?: Ref<HTMLDivElement>;
  subtitle?: ReactNode;
  title: string;
}

/**
 * @constant cloneBadge - Utility to clone a Badge element with animation and size props for consistent display in the header.
 * The function checks if the provided badge is a valid React element, and if so, it clones it with additional props for animation and size. If the badge is not valid, it returns the original badge without modification.
 *
 * @param {ReactElement<ComponentProps<typeof Badge>>} badge - The Badge element to clone and enhance.
 * @returns {ReactElement} The cloned Badge element with additional props, or the original if not valid.
 */
const cloneBadge = (badge: ReactElement<ComponentProps<typeof Badge>>) => {
  if (isValidElement(badge)) {
    return cloneElement(badge, {
      className: 'au:animate-fade-in',
      size: 'xs',
      style: { animationDuration: '2s' },
    });
  }
  return null;
};

/**
 * Render a header adornment.
 *
 * If the adornment is an object with a `src` field it will be rendered
 * as a native image. Otherwise it is assumed to be a FontAwesome
 * `IconDefinition` and will be rendered with `FontAwesomeIcon`.
 *
 * @param {HeaderAdornment} adornment - The adornment to render.
 * @returns {ReactElement | null} React element for the adornment, or `null`.
 */
const renderAdornment = (adornment: HeaderAdornment) => {
  if ('src' in adornment) {
    return (
      <img
        alt={adornment.alt || ''}
        src={adornment.src || ''}
        width={40}
        height={40}
        className="au:object-contain"
      />
    );
  }

  return <FontAwesomeIcon icon={adornment} className="au:text-sm" />;
};

/**
 * Card Header component for displaying a title, optional icon, badge, and subtitle.
 *
 * @param {HeaderProps} props - Props for configuring the header content and appearance.
 * @returns {JSX.Element} The rendered card header.
 *
 * @example
 * ```tsx
 * import { Badge, Header } from '@/src';
 * import { faStar } from '@fortawesome/free-solid-svg-icons';
 *
 * const MyCardHeader = () => (
 *  <Header
 *    title="Card Title"
 *    subtitle="This is a subtitle for the card header."
 *    adornment={faStar}
 *    badge={<Badge>New</Badge>}
 *  />
 * );
 * ```
 */
const Header: FC<HeaderProps> = ({ adornment, badge, ref, subtitle, title, ...rest }) => {
  return (
    <div
      className="au:flex au:flex-col au:gap-1 au:px-3 au:py-2"
      ref={ref}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      <div className="au:flex au:items-center au:gap-3">
        {adornment && renderAdornment(adornment)}
        <Typography
          clamp={3}
          bold
          className="au:lg:text-2xl au:sm:text-lg au:text-base"
          variant="h2"
        >
          {title}
        </Typography>
        {badge && cloneBadge(badge)}
      </div>
      {subtitle && (
        <Typography clamp={10} variant="small">
          {subtitle}
        </Typography>
      )}
    </div>
  );
};

Header.displayName = 'Card.Header';

export { Header };
