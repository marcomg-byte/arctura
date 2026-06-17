import type { FC, HTMLAttributes, Ref } from 'react';
import { Button } from '../buttons';
import type { ButtonAdornment, ButtonVariant } from '../buttons';
import { Typography } from '../typography';

/**
 * Describes an action button for the Card Footer.
 *
 * @property {Adornment} [endAdornment] - Element to display at the end of the button (e.g., icon).
 * @property {string} [href] - URL to link to when the button is clicked.
 * @property {string} label - Button label text.
 * @property {() => void} [onClick] - Click handler for the button.
 * @property {Adornment} [startAdornment] - Element to display at the start of the button (e.g., icon).
 * @property {string} [target] - Target attribute for the link (e.g., '_blank').
 * @property {ButtonVariant} [variant] - Visual style variant for the button.
 */
interface FooterAction {
  endAdornment?: ButtonAdornment;
  href?: string;
  label: string;
  onClick?: () => void;
  startAdornment?: ButtonAdornment;
  target?: string;
  variant?: ButtonVariant;
}

/**
 * Props for the Card Footer component.
 *
 * @property {FooterAction[]} [actions] - Array of action button definitions to display in the footer.
 * @property {string} [description] - Optional description text to display below the title/subtitle.
 * @property {Ref<HTMLDivElement>} [ref] - Ref for the footer container div.
 * @property {string} [subtitle] - Optional subtitle text to display below the title.
 * @property {string} [title] - Title text to display in the footer.
 */
interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  actions?: FooterAction[];
  description?: string;
  ref?: Ref<HTMLDivElement>;
  subtitle?: string;
  title?: string;
}

/**
 * Card Footer component for displaying a title, subtitle, description, and action buttons.
 *
 * Renders a styled footer section with optional title, subtitle, description, and a row of action buttons. Each action is rendered as a Button with optional adornments and link support.
 *
 * @param {FooterProps} props - Props for configuring the footer content and actions.
 * @returns {JSX.Element} The rendered footer component.
 *
 * @example
 * ```tsx
 * import { Footer } from '@/components/ui/atomics';
 *
 * const MyCardFooter = () => (
 *  <Footer
 *    title="Footer Title"
 *    subtitle="Footer Subtitle"
 *    description="This is a description for the card footer."
 *    actions={[
 *      { label: 'Action 1', onClick: () => console.log('Action 1 clicked') },
 *      { label: 'Action 2', href: 'https://example.com', target: '_blank' },
 *    ]}
 *  />
 * );
 * ```
 */
const Footer: FC<FooterProps> = ({ actions, description, subtitle, title, ref, ...rest }) => {
  return (
    <div
      className="mg:flex mg:grow mg:flex-col mg:justify-between mg:items-start mg:gap-3 mg:w-full mg:px-3 mg:py-2"
      ref={ref}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      <div className="mg:flex mg:flex-col mg:justify-center mg:items-start mg:gap-1.5">
        {title && (
          <>
            <Typography
              className="mg:text-base mg:sm:text-xl mg:lg:text-3xl"
              clamp={3}
              bold
              variant="h3"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography clamp={10} variant="small">
                {subtitle}
              </Typography>
            )}
          </>
        )}
        {description && (
          <Typography clamp={10} variant="base">
            {description}
          </Typography>
        )}
      </div>
      {actions && (
        <div className="mg:flex mg:justify-start mg:items-center mg:gap-2">
          {actions.map((action, index) => (
            <Button
              classes={{ button: 'mg:animate-fade-in mg:duration-500' }}
              endAdornment={action?.endAdornment}
              href={action?.href as string}
              key={`footer-action-${index}`}
              onClick={action?.onClick}
              size="sm"
              startAdornment={action?.startAdornment}
              style={{ animationDelay: `${index * 0.1}s` }}
              target={action?.target}
              variant={action?.variant}
            >
              {action?.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

Footer.displayName = 'Card.Footer';

export { Footer };
export type { FooterAction };
