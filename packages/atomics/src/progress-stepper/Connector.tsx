'use client';
import type { FC, HTMLAttributes, Ref } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/**
 * Class name overrides for the connector container and line.
 */
interface ConnectorClasses {
  /** Classes applied to the outer connector wrapper. */
  container?: string;
  /** Classes applied to the inner connector line. */
  content?: string;
}

/**
 * Props accepted by the `Connector` component.
 */
interface ConnectorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Whether the connector is currently active (uses active styling). */
  active?: boolean;
  /** Optional class overrides for the connector wrapper and line. */
  classes?: ConnectorClasses;
  /** Whether the preceding step has been completed. */
  completed?: boolean;
  /** If true, the connector will not be rendered for the last step. */
  lastIndex?: boolean;
  /** Orientation of the connector: horizontal or vertical. */
  orientation?: 'horizontal' | 'vertical';
  /** Ref forwarded to the connector container element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Visual divider between steps.
 *
 * Renders a horizontal or vertical line whose appearance reflects whether
 * the step is active, completed, or pending.
 *
 * @param {ConnectorProps} props - Configuration for rendering the connector.
 * @returns {JSX.Element | null} The connector element or `null` for the last step.
 * @example
 * ```tsx
 * import { Connector } from '@/src';
 *
 * const MyConnector = () => (
 *  <Connector active={true} completed={false} orientation="horizontal" />
 * );
 * ```
 */
const Connector: FC<ConnectorProps> = ({
  active = false,
  classes = {},
  completed = false,
  lastIndex = false,
  orientation = 'horizontal',
  ref,
  ...rest
}) => {
  const containerClasses = twMerge('au:relative au:flex au:h-full au:grow', classes?.container);

  const contentClasses = twMerge(
    classNames('au:relative au:transform au:translate-y-7', {
      'au:h-2px au:w-full': orientation === 'horizontal',
      'au:w-2px au:h-full': orientation === 'vertical',
      'au:bg-accent': !active && !completed,
      'au:bg-primary': active,
      'au:bg-success-primary': completed,
    }),
    classes?.content
  );

  if (lastIndex) {
    return null;
  }

  return (
    <div className={containerClasses} ref={ref} {...rest}>
      <div className={contentClasses} />
    </div>
  );
};

export { Connector };
export type { ConnectorClasses };
