import type { ComponentProps, FC, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import React, { Children } from 'react';
import { Header } from './Header';
import { Media } from './Media';
import { Footer } from './Footer';

/**
 * Props for the Card component.
 *
 * Use these props when rendering a composable card shell that arranges
 * `CardHeader`, `CardMedia`, and `CardFooter` children while forwarding
 * standard div attributes to the card container.
 *
 * @property {ReactNode} [children] - Card content, typically Header, Media, and Footer components.
 * @property {Ref<HTMLDivElement>} [ref] - Ref for the card container div.
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Card component for displaying content with optional Header, Media, and Footer slots.
 *
 * Automatically detects and arranges Header, Media, and Footer children. If Media is present without Header or Footer, it adds headerless/footerless props for styling.
 *
 * @param {CardProps} props - Props for configuring the card container and its children.
 * @returns {JSX.Element} The rendered card component.
 *
 * @example
 * ```tsx
 * import { Card, CardFooter, CardHeader, CardMedia } from '@arctura/atomics';
 *
 * export function FeatureCard() {
 *   return (
 *     <Card aria-label="Component quality">
 *       <CardHeader title="Accessible atoms" subtitle="Ready for product surfaces" />
 *       <CardMedia src="/images/quality.png" alt="Interface quality preview" />
 *       <CardFooter actions={[{ label: 'Learn more', href: '/components' }]} />
 *     </Card>
 *   );
 * }
 * ```
 */
const Card: FC<CardProps> = ({ children, ref, ...rest }) => {
  const clonedChildren = (children: ReactNode) => {
    const slots: {
      header?: ReactNode;
      media?: ReactElement<ComponentProps<typeof Media>>;
      footer?: ReactNode;
    } = {};

    Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      if (child.type === Header) slots.header = child;
      else if (child.type === Media)
        slots.media = child as ReactElement<ComponentProps<typeof Media>>;
      else if (child.type === Footer) slots.footer = child;
    });

    if (!slots.header && slots.media) {
      slots.media = React.cloneElement(slots.media, { headerless: true });
    }

    if (!slots.footer && slots.media) {
      slots.media = React.cloneElement(slots.media, { footerless: true });
    }

    return (
      <>
        {slots.header}
        {slots.media}
        {slots.footer}
      </>
    );
  };

  return (
    <div
      className="au:flex au:min-w-36 au:max-w-52 au:w-full au:flex-col au:justify-start au:bg-primary-subtle au:rounded-lg au:shadow-lg au:shadow-black/20 au:ring-1 au:ring-black/5 au:transition-transform au:duration-200 au:hover:scale-[1.02]"
      ref={ref}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {clonedChildren(children)}
    </div>
  );
};

Card.displayName = 'Card';

export { Card };
export type { CardProps };
