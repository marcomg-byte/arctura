import type { ComponentProps, FC, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import React, { Children } from 'react';
import { Header } from '@/src/card/Header';
import { Media } from '@/src/card/Media';
import { Footer } from '@/src/card/Footer';

/**
 * Props for the Card component.
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
 * import { Card, Header, Media, Footer } from '@/src';
 *
 * const MyCard = () => (
 *  <Card>
 *    <Header title="Card Title" subtitle="Card Subtitle" />
 *    <Media src="/path/to/image.jpg" alt="Card Image" />
 *    <Footer actions={[{ label: 'Action', onClick: () => { console.log('Action clicked'); } }]} />
 *  </Card>
 * );
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
      className="mg:flex mg:min-w-36 mg:max-w-52 mg:w-full mg:flex-col mg:justify-start mg:bg-primary-subtle mg:rounded-lg mg:shadow-lg mg:shadow-black/20 mg:ring-1 mg:ring-black/5 mg:transition-transform mg:duration-200 mg:hover:scale-[1.02]"
      ref={ref}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {clonedChildren(children)}
    </div>
  );
};

Card.displayName = 'Card';

export { Card };
