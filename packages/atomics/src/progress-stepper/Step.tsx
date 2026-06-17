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
import { Fab } from '@/src/buttons';
import type { FabClasses } from '@/src/buttons';
import { Node } from '@/src/progress-stepper/Node';
import type { NodeClasses } from '@/src/progress-stepper/Node';
import { Typography } from '@/src/typography';
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
          className: 'mg:text-xs mg:sm:text-sm mg:lg:text-lg',
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
    'mg:animate-fade-in mg:transition-opacity mg:duration-300',
    classes?.body
  );

  const descriptionContainerClasses = twMerge(
    'mg:flex mg:flex-col mg:text-primary mg:gap-1',
    classes?.descriptionContainer
  );

  const rootClasses = twMerge(
    classNames('mg:flex mg:max-w-44 mg:p-3 mg:rounded-md', {
      'mg:flex-col mg:gap-1': orientation === 'horizontal',
      'mg:justify-between mg:items-start': orientation === 'vertical',
      'mg:relative mg:z-10 mg:min-w-32 mg:hover:bg-primary mg:transition-all mg:duration-200 mg:ease-in-out mg:hover:scale-105 mg:hover:shadow-lg':
        active,
    }),
    classes?.root
  );

  const titleClasses = classNames('mg:text-base mg:sm:text-xl mg:lg:text-3xl', classes?.title);

  const nodeContainerClasses = twMerge('mg:flex mg:pb-2', classes?.nodeContainer);

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
