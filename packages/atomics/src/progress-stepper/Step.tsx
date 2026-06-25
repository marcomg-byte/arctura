'use client';
import type {
  ComponentProps,
  HTMLAttributes,
  FC,
  MouseEvent,
  ReactNode,
  ReactElement,
  Ref,
} from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import classNames from 'classnames';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab } from '../buttons';
import type { FabClasses } from '../buttons';
import { Node } from './Node';
import type { NodeClasses } from './Node';
import { Typography } from '../typography';
import { twMerge } from 'tailwind-merge';

/**
 * Class name overrides for the `Step` component parts.
 */
interface StepClasses {
  /** Classes applied to the description wrapper. */
  descriptionContainer?: string;
  /** Classes applied to the step body content. */
  body?: string;
  /** Class overrides passed to the node or fab used for the step marker. */
  node?: FabClasses | NodeClasses;
  /** Classes applied to the node container wrapper. */
  nodeContainer?: string;
  /** Classes applied to the root step container. */
  root?: string;
  /** Classes applied to the step title. */
  title?: string;
}

/**
 * @description Allowed color variants for the step/node components.
 * - `primary`: Uses the primary color from the theme.
 * - `secondary`: Uses the secondary color from the theme.
 * - `accent`: Uses the accent color from the theme.
 * - `error`: Uses the error color from the theme.
 * - `info`: Uses the info color from the theme.
 * - `warning`: Uses the warning color from the theme.
 */
type StepColor = 'primary' | 'secondary' | 'accent' | 'error' | 'info' | 'warning';

/**
 * @interface StepProps
 * @extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>
 * @description Props accepted by the `Step` component.
 */
interface StepProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'className'> {
  /** Whether the step is currently active (shows expanded content). */
  active?: boolean;
  /** Optional class overrides for the step container, node, and content. */
  classes?: StepClasses;
  /** Color variant for the step node. */
  color?: StepColor;
  /** Whether the step is marked as completed. */
  completed?: boolean;
  /** Optional descriptive content displayed when the step is active. */
  description?: ReactNode;
  /** Optional FontAwesome icon rendered inside the node. */
  icon?: IconDefinition;
  /** Zero-based index assigned by the parent stepper. */
  index?: number;
  /** Optional label displayed when step is active. */
  label?: string;
  /** When true, stepper enforces linear progression; when false the step is interactive. */
  linear?: boolean;
  /** Click handler for interactive (non-linear) steps. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Layout orientation for the step content. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref forwarded to the step container element. */
  ref?: Ref<HTMLDivElement>;
  /** Title displayed when the step is active. */
  title?: string;
}

/**
 * React element shape for the `Typography` helper used in descriptions.
 */
type TypographyComponent = ReactElement<ComponentProps<typeof Typography>>;

/**
 * Props inferred from the `Typography` component.
 */
type TypographyProps = ComponentProps<typeof Typography>;

/**
 * Render step description content while preserving nested `Typography`
 * styling conventions.
 *
 * @param {ReactNode} description - Description content to render.
 * @returns {ReactNode} The rendered description tree.
 */
const renderDescription = (description: ReactNode): ReactNode => {
  const walk = (node?: ReactNode): ReactNode => {
    return Children.map(node, (child) => {
      if (!isValidElement(child)) return child;

      if (child.type === Typography) {
        return cloneElement<TypographyProps>(child as TypographyComponent, {
          className: 'au:text-xs au:sm:text-sm au:lg:text-lg',
        });
      }

      return child;
    });
  };

  return walk(description);
};

/**
 * @component Step
 * @description
 * Renders a single step node used by `ProgressStepper`.
 * - When `linear` is `true`, renders a static `Node`; when `false`, renders an interactive `Fab`.
 * - When `active` is `true`, the step displays its `title` and `description`.
 *
 * @param {StepProps} props - Props for configuring appearance and behavior.
 * @returns {JSX.Element} The rendered step element.
 *
 * @example
 * ```tsx
 * import { Step } from '@/src';
 *
 * const MyStep = () => (
 *  <Step
 *   active={true}
 *   color="primary"
 *   title="Step Title"
 *   description="Detailed description of the step content."
 *   icon={faMugHot}
 *  />
 * );
 * ```
 */
const Step: FC<StepProps> = ({
  active = false,
  classes = {},
  color = 'primary',
  completed = false,
  description,
  icon,
  index: indexProp,
  label,
  linear = true,
  onClick,
  orientation = 'horizontal',
  ref,
  title,
  ...rest
}) => {
  const bodyClasses = twMerge(
    'au:animate-fade-in au:transition-opacity au:duration-300',
    classes?.body
  );

  const descriptionContainerClasses = twMerge(
    'au:flex au:flex-col au:text-primary au:gap-1',
    classes?.descriptionContainer
  );

  const rootClasses = twMerge(
    classNames('au:flex au:max-w-44 au:p-3 au:rounded-md', {
      'au:flex-col au:gap-1': orientation === 'horizontal',
      'au:justify-between au:items-start': orientation === 'vertical',
      'au:relative au:z-10 au:min-w-32 au:hover:bg-primary au:transition-all au:duration-200 au:ease-in-out au:hover:scale-105 au:hover:shadow-lg':
        active,
    }),
    classes?.root
  );

  const titleClasses = classNames('au:text-base au:sm:text-xl au:lg:text-3xl', classes?.title);

  const nodeContainerClasses = twMerge('au:flex au:pb-2', classes?.nodeContainer);

  const index = indexProp !== undefined ? (indexProp + 1).toString() : '–';

  if (!linear) {
    return (
      <div className={rootClasses} ref={ref} {...rest}>
        <div className={nodeContainerClasses}>
          <Fab
            aria-label={label}
            classes={classes?.node as FabClasses}
            color={completed ? 'success' : color}
            onClick={onClick}
            variant="circular"
          >
            {icon ? <FontAwesomeIcon icon={icon} /> : index}
          </Fab>
        </div>
        {active && (
          <div className={bodyClasses}>
            <Typography removePadding className={titleClasses} bold color="primary" variant="h3">
              {title}
            </Typography>
            <div className={descriptionContainerClasses}>
              {description && renderDescription(description)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={rootClasses} ref={ref} {...rest}>
      <div className={nodeContainerClasses}>
        <Node
          aria-label={label}
          classes={classes?.node as NodeClasses}
          color={completed ? 'success' : color}
          variant="circular"
        >
          {icon ? <FontAwesomeIcon icon={icon} /> : index}
        </Node>
      </div>
      {active && (
        <div className={bodyClasses}>
          <Typography removePadding className={titleClasses} bold color="primary" variant="h3">
            {title}
          </Typography>
          <div className={descriptionContainerClasses}>
            {description && renderDescription(description)}
          </div>
        </div>
      )}
    </div>
  );
};

Step.displayName = 'ProgressStepper.Step';

export { Step };
export type { StepClasses };
