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
  const iconClasses = twMerge('au:text-sm', className);
  const imageClasses = twMerge('au:object-contain au:animate-fade-in au:duration-500', className);

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
 * import { Node } from '@/src';
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
      ? classNames('au:rounded-full', {
          'au:h-4 au:w-4': size === 'sm',
          'au:h-6 au:w-6': size === 'md',
          'au:h-8 au:w-8': size === 'lg',
        })
      : '';
  const extendedClasses =
    variant === 'extended'
      ? classNames('au:rounded-lg', {
          'au:w-4 au:h-2': size === 'sm',
          'au:w-5 au:h-3': size === 'md',
          'au:w-6 au:h-4': size === 'lg',
        })
      : '';
  const containerClasses = twMerge(
    classNames(
      'au:inline-flex au:items-center au:justify-center au:border-solid au:border-1 au:text-primary',
      {
        'au:border-primary au:hover:border-primary-hover au:text-primary au:hover:text-primary-hover':
          color === 'primary',
        'au:border-secondary au:hover:border-secondary-hover au:text-secondary au:hover:text-secondary-hover':
          color === 'secondary',
        'au:border-accent au:hover:border-accent-hover au:text-accent au:hover:text-accent-hover':
          color === 'accent',
        'au:border-error au:hover:border-error-hover au:text-danger au:hover:text-danger-hover':
          color === 'error',
        'au:border-info au:hover:border-info-hover au:text-info au:hover:text-info-hover':
          color === 'info',
        'au:border-success au:hover:border-success-hover au:text-success au:hover:text-success-hover':
          color === 'success',
        'au:border-warning au:hover:border-warning-hover au:text-warning au:hover:text-warning-hover':
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
