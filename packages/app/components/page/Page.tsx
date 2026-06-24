import type { FC, HTMLAttributes, ReactNode, Ref } from 'react';
import classNames from 'classnames';

/**
 * Background color variants for the Page component.
 *
 * - 'primary': Main background color
 * - 'secondary': Secondary background color
 * - 'subtle': Subtle/neutral background color
 */
type PageColor = 'accent' | 'primary' | 'secondary' | 'subtle' | 'white' | 'black';

/**
 * Props for the Page component.
 *
 * @property {ReactNode} [children] - Content to render inside the page.
 * @property {PageColor} [color] - Background color variant for the page.
 * @property {Ref<HTMLDivElement>} [ref] - Ref for the root div element.
 * Inherits all standard HTML div attributes.
 */
interface PageProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  color?: PageColor;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Page component.
 *
 * Renders a main container for page content, applying layout and background styles.
 * Accepts all standard div attributes and a ref.
 *
 * @param {PageProps} props - Props for the page container.
 * @returns {JSX.Element} The rendered main element containing the page content.
 *
 * @example
 * ```tsx
 * import { Page } from '@/components/ui/';
 *
 * const MyPage = () => (
 *  <Page>
 *    <h1>Welcome to My Page</h1>
 *    <p>This is an example of using the Page component.</p>
 *  </Page>
 * );
 * ```
 */
const Page: FC<PageProps> = ({ children, color = 'primary', ref, ...rest }) => {
  const classes = classNames('au:flex au:flex-col au:flex-1 au:items-center au:justify-start', {
    'au:bg-accent': color === 'accent',
    'au:bg-black': color === 'black',
    'au:bg-primary': color === 'primary',
    'au:bg-secondary': color === 'secondary',
    'au:bg-subtle': color === 'subtle',
    'au:bg-white': color === 'white',
  });
  return (
    <main className={classes} ref={ref} {...rest}>
      {children}
    </main>
  );
};

export { Page };
