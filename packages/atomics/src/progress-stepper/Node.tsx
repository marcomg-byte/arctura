import type { FC, HTMLAttributes, ReactNode, Ref } from 'react';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/**
 * @typedef NodeAdornment
 * @description An adornment for the node: either a FontAwesome `IconDefinition` or an image descriptor.
 */
type NodeAdornment = IconDefinition | NodeImage;

interface NodeClasses {
  /** Classes applied to the adornment icon or image. */
  adornment?: string;
  /** Classes applied to the root node container. */
  container?: string;
}

/**
 * @typedef NodeColor
 * @description Allowed color variants applied to the node border and hover states.
 * - `primary`, `secondary`, `accent`, `error`, `info`, `success`, `warning`
 */
type NodeColor = 'primary' | 'secondary' | 'accent' | 'error' | 'info' | 'success' | 'warning';

/**
 * @typedef NodeImage
 * @description Shape for an image adornment used inside a node.
 * @property {string} [alt] - Optional alt text for the image.
 * @property {string} src - Image source URL.
 */
type NodeImage = { alt?: string; src: string };

/**
 * Props accepted by the `Node` component.
 */
interface NodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Child nodes rendered inside the node (e.g., text or icon). */
  children?: ReactNode;
  /** Optional class overrides for the node container and adornments. */
  classes?: NodeClasses;
  /** Color variant applied to the node border and hover state. */
  color?: NodeColor;
  /** Optional adornment rendered after the children (e.g., icon or image). */
  endAdornment?: NodeAdornment;
  /** Ref forwarded to the root container element. */
  ref?: Ref<HTMLDivElement>;
  /** Size modifier for the node: `sm` | `md` | `lg`. */
  size?: 'sm' | 'md' | 'lg';
  /** Optional adornment rendered before the children (e.g., icon or image). */
  startAdornment?: NodeAdornment;
  /** Visual variant: `circular` (default) or `extended`. */
  variant?: 'circular' | 'extended';
}

/**
 * Render a node adornment as either a FontAwesome icon or a native image.
 *
 * @param {NodeAdornment} adornment - IconDefinition or NodeImage to render.
 * @param {string} [className] - Optional class names applied to the rendered adornment.
 * @returns {JSX.Element} The rendered adornment element.
 */
const renderAdornment = (adornment: NodeAdornment, className?: string) => {
  const iconClasses = twMerge('mg:text-sm', className);
  const imageClasses = twMerge('mg:object-contain mg:animate-fade-in mg:duration-500', className);

  if ('iconName' in adornment) {
    return <FontAwesomeIcon className={iconClasses} icon={adornment} />;
  }

  return (
    <img
      alt={adornment.alt || ''}
      className={imageClasses}
      height={16}
      src={adornment.src || ''}
      width={16}
    />
  );
};

/**
 * @component Node
 * @description
 * Presentational stepper node with optional start and end adornments.
 * The node can render as circular or extended and supports multiple
 * color and size variants for different progress states.
 *
 * @param {NodeProps} props - Props for configuring the node element.
 * @returns {JSX.Element} The rendered node element.
 * @example
 * ```tsx
 * import { Node } from '@/components/ui/atomics';
 * import { faCheck } from '@fortawesome/free-solid-svg-icons';
 *
 * const MyNode = () => (
 *  <Node color="primary" size="md" variant="circular" endAdornment={faCheck}>
 *   1
 * </Node>
 * );
 * ```
 */
const Node: FC<NodeProps> = ({
  children,
  classes = {},
  color = 'primary',
  endAdornment,
  size = 'md',
  startAdornment,
  variant = 'circular',
  ref,
  ...rest
}) => {
  const circularClasses =
    variant === 'circular'
      ? classNames('mg:rounded-full', {
          'mg:h-4 mg:w-4': size === 'sm',
          'mg:h-6 mg:w-6': size === 'md',
          'mg:h-8 mg:w-8': size === 'lg',
        })
      : '';
  const extendedClasses =
    variant === 'extended'
      ? classNames('mg:rounded-lg', {
          'mg:w-4 mg:h-2': size === 'sm',
          'mg:w-5 mg:h-3': size === 'md',
          'mg:w-6 mg:h-4': size === 'lg',
        })
      : '';
  const containerClasses = twMerge(
    classNames(
      'mg:inline-flex mg:items-center mg:justify-center mg:border-solid mg:border-1 mg:text-primary',
      {
        'mg:border-primary mg:hover:border-primary-hover mg:text-primary mg:hover:text-primary-hover':
          color === 'primary',
        'mg:border-secondary mg:hover:border-secondary-hover mg:text-secondary mg:hover:text-secondary-hover':
          color === 'secondary',
        'mg:border-accent mg:hover:border-accent-hover mg:text-accent mg:hover:text-accent-hover':
          color === 'accent',
        'mg:border-error mg:hover:border-error-hover mg:text-danger mg:hover:text-danger-hover':
          color === 'error',
        'mg:border-info mg:hover:border-info-hover mg:text-info mg:hover:text-info-hover':
          color === 'info',
        'mg:border-success mg:hover:border-success-hover mg:text-success mg:hover:text-success-hover':
          color === 'success',
        'mg:border-warning mg:hover:border-warning-hover mg:text-warning mg:hover:text-warning-hover':
          color === 'warning',
      },
      circularClasses,
      extendedClasses
    ),
    classes?.container
  );

  return (
    <div className={containerClasses} ref={ref} {...rest}>
      {startAdornment && renderAdornment(startAdornment, classes?.adornment)}
      {children}
      {endAdornment && renderAdornment(endAdornment, classes?.adornment)}
    </div>
  );
};

Node.displayName = 'ProgressStepper.Node';

export { Node };
export type { NodeClasses };
