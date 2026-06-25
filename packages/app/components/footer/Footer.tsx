'use client';
import classNames from 'classnames';
import type { FC, HTMLAttributes, Ref } from 'react';
import { Link as LinkComponent, Typography } from '@arctura/atomics';

/** Props accepted by the footer container. */
interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Forwarded ref to the root footer element. */
  ref?: Ref<HTMLDivElement>;
}

/** Describes a footer navigation link. */
interface Link {
  /** Destination URL for the footer link. */
  href: string;
  /** Optional target attribute for the rendered anchor. */
  target?: string;
  /** Visible text label shown for the link. */
  text: string;
}

const links: Link[] = [
  { href: '#Privacy', target: '_blank', text: 'Privacy' },
  { href: '#Terms', target: '_blank', text: 'Terms' },
  { href: '#License', target: '_blank', text: 'License' },
];

/**
 * Footer container for the application layout.
 *
 * ```tsx
 * import { Footer } from '@/components/footer/Footer';
 *
 * export function SiteFooter() {
 *   return (
 *     <Footer
 *       className="au:border-t au:border-neutral-200 au:bg-background"
 *       aria-label="Site footer"
 *     />
 *   );
 * }
 * ```
 */
const Footer: FC<FooterProps> = ({ ref, ...rest }) => {
  const containerClasses = classNames(
    'au:flex au:items-center au:justify-between au:w-full au:bg-primary au:py-2 au:px-3'
  );

  const sectionClasses = classNames('au:flex au:gap-2');

  return (
    <div className={containerClasses} ref={ref} {...rest}>
      <div className={sectionClasses}>
        <Typography>&copy; Arctura. All rights reserved</Typography>
      </div>
      <div className={sectionClasses}>
        {links.map((link, index) => (
          <LinkComponent href={link.href} key={`footer-link-${index + 1}`} target={link?.target}>
            {link.text}
          </LinkComponent>
        ))}
      </div>
    </div>
  );
};

Footer.displayName = 'Footer';

export { Footer };
