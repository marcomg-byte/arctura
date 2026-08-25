'use client';
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  JSX,
  KeyboardEvent,
  LiHTMLAttributes,
  MouseEvent,
  Ref,
} from 'react';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../typography';
import type { TypographyColor } from '../typography';
import { useControlled } from '../../lib/hooks';

/** Either an icon definition or an image source used for the leading adornment. */
type ListItemAdornment = IconDefinition | { src: string; alt?: string };

/** Color tokens available for the list item adornment. */
type ListItemAdornmentColor =
  | 'accent'
  | 'black'
  | 'danger'
  | 'error'
  | 'info'
  | 'inverse'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'subtle'
  | 'warning'
  | 'white';

/** Status tokens that influence the item accent color. */
type ListItemStatus = 'success' | 'warning' | 'error' | 'info';

/**
 * Optional class name hooks for the item sub-elements.
 *
 * @property [adornment] - Class names applied to the adornment element.
 * @property [button] - Class names applied to the interactive root element.
 * @property [children] - Class names applied to the text content wrapper.
 * @property [container] - Class names applied to the inner container row.
 * @property [root] - Class names applied to the outer root element.
 * @property [label] - Class names applied to the label text.
 * @property [title] - Class names applied to the title text.
 */
interface ListItemClasses {
  /**
   * Class names applied to the adornment element.
   * @defaultValue undefined
   */
  adornment?: string;
  /**
   * Class names applied to the interactive root element.
   * @defaultValue undefined
   */
  button?: string;
  /**
   * Class names applied to the text content wrapper.
   * @defaultValue undefined
   */
  children?: string;
  /**
   * Class names applied to the inner container row.
   * @defaultValue undefined
   */
  container?: string;
  /**
   * Class names applied to the outer root element.
   * @defaultValue undefined
   */
  root?: string;
  /**
   * Class names applied to the label text.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Class names applied to the title text.
   * @defaultValue undefined
   */
  title?: string;
}

/**
 * Shared props that control the visual and behavioral state of a list item.
 *
 * These props describe the selectable content, adornment, value, and
 * presentation state used whether the item renders as a link, div, or native
 * list item.
 *
 * @property [as] - Element type to render for the wrapper.
 * @property [adornment] - Optional leading adornment.
 * @property [adornmentColor] - Color token used for the adornment.
 * @property [classes] - Custom class names for item sub-elements.
 * @property [color] - Text color used by the title and label typography.
 * @property [defaultSelected] - Whether the item should start selected when uncontrolled.
 * @property [disabled] - Whether the item is disabled.
 * @property [divider] - Whether to render a separator below the item.
 * @property [firstIndex] - Whether this item is the first rendered item.
 * @property [href] - Destination URL used when rendering as a link.
 * @property [label] - Primary text shown for the item.
 * @property [lastIndex] - Whether this item is the last rendered item.
 * @property [selectable] - Whether the item can be selected.
 * @property [status] - Status token that overrides or reinforces the adornment color.
 * @property [tabIndex] - Keyboard focus order when the item is selectable.
 * @property [title] - Optional secondary heading shown above the label.
 * @property [selected] - Controlled selected state.
 * @property [value] - Value associated with this item for selection tracking.
 */
interface BaseProps {
  /**
   * Element type to render for the wrapper.
   * @defaultValue undefined
   */
  as?: 'a' | 'div' | 'li';
  /**
   * Optional leading adornment.
   * @defaultValue undefined
   */
  adornment?: ListItemAdornment;
  /**
   * Color token used for the adornment.
   * @defaultValue undefined
   */
  adornmentColor?: ListItemAdornmentColor;
  /**
   * Custom class names for item sub-elements.
   * @defaultValue undefined
   */
  classes?: ListItemClasses;
  /**
   * Text color used by the title and label typography.
   * @defaultValue undefined
   */
  color?: TypographyColor;
  /**
   * Whether the item should start selected when uncontrolled.
   * @defaultValue undefined
   */
  defaultSelected?: boolean;
  /**
   * Whether the item is disabled.
   * @defaultValue undefined
   */
  disabled?: boolean;
  /**
   * Whether to render a separator below the item.
   * @defaultValue undefined
   */
  divider?: boolean;
  /**
   * Whether this item is the first rendered item.
   * @defaultValue undefined
   */
  firstIndex?: boolean;
  /**
   * Destination URL used when rendering as a link.
   * @defaultValue undefined
   */
  href?: string;
  /**
   * Primary text shown for the item.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Whether this item is the last rendered item.
   * @defaultValue undefined
   */
  lastIndex?: boolean;
  /**
   * Whether the item can be selected.
   * @defaultValue undefined
   */
  selectable?: boolean;
  /**
   * Status token that overrides or reinforces the adornment color.
   * @defaultValue undefined
   */
  status?: ListItemStatus;
  /**
   * Keyboard focus order when the item is selectable.
   * @defaultValue undefined
   */
  tabIndex?: number;
  /**
   * Optional secondary heading shown above the label.
   * @defaultValue undefined
   */
  title?: string;
  /**
   * Controlled selected state.
   * @defaultValue undefined
   */
  selected?: boolean;
  /**
   * Value associated with this item for selection tracking.
   * @defaultValue undefined
   */
  value?: string | number;
}

/**
 * Props used when the item renders as an anchor.
 *
 * @property [href] - Destination URL for the anchor.
 * @property [onClick] - Click handler for the anchor variant.
 * @property [onKeyDown] - Keyboard handler for the anchor variant.
 * @property [ref] - Optional ref forwarded to the anchor element.
 * @property [role] - Accessible role for the anchor element.
 * @property [target] - Optional target for the anchor element.
 */
interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Destination URL for the anchor.
   * @defaultValue undefined
   */
  href?: string;
  /**
   * Click handler for the anchor variant.
   * @defaultValue undefined
   */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Keyboard handler for the anchor variant.
   * @defaultValue undefined
   */
  onKeyDown?: (event: KeyboardEvent<HTMLAnchorElement>) => void;
  /**
   * Optional ref forwarded to the anchor element.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLAnchorElement>;
  /**
   * Accessible role for the anchor element.
   * @defaultValue undefined
   */
  role?: JSX.IntrinsicElements['a']['role'];
  /**
   * Optional target for the anchor element.
   * @defaultValue undefined
   */
  target?: string;
}

/**
 * Props used when the item renders as a div.
 *
 * @property [href] - Disallowed in the div variant.
 * @property [onClick] - Click handler for the div variant.
 * @property [onKeyDown] - Keyboard handler for the div variant.
 * @property [ref] - Optional ref forwarded to the div element.
 * @property [role] - Accessible role for the div element.
 * @property [target] - Disallowed in the div variant.
 */
interface DivProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Disallowed in the div variant.
   * @defaultValue undefined
   */
  href?: never;
  /**
   * Click handler for the div variant.
   * @defaultValue undefined
   */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /**
   * Keyboard handler for the div variant.
   * @defaultValue undefined
   */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  /**
   * Optional ref forwarded to the div element.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLDivElement>;
  /**
   * Accessible role for the div element.
   * @defaultValue undefined
   */
  role?: JSX.IntrinsicElements['div']['role'];
  /**
   * Disallowed in the div variant.
   * @defaultValue undefined
   */
  target?: never;
}

/**
 * Props used when the item renders as a list item.
 *
 * @property [href] - Disallowed in the li variant.
 * @property [onClick] - Click handler for the li variant.
 * @property [onKeyDown] - Keyboard handler for the li variant.
 * @property [ref] - Optional ref forwarded to the li element.
 * @property [role] - Accessible role for the li element.
 * @property [target] - Disallowed in the li variant.
 */
interface LiProps extends LiHTMLAttributes<HTMLLIElement> {
  /**
   * Disallowed in the li variant.
   * @defaultValue undefined
   */
  href?: never;
  /**
   * Click handler for the li variant.
   * @defaultValue undefined
   */
  onClick?: (event: MouseEvent<HTMLLIElement>) => void;
  /**
   * Keyboard handler for the li variant.
   * @defaultValue undefined
   */
  onKeyDown?: (event: KeyboardEvent<HTMLLIElement>) => void;
  /**
   * Optional ref forwarded to the li element.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLLIElement>;
  /**
   * Accessible role for the li element.
   * @defaultValue undefined
   */
  role?: JSX.IntrinsicElements['li']['role'];
  /**
   * Disallowed in the li variant.
   * @defaultValue undefined
   */
  target?: never;
}

/**
 * Combined prop signature for the list item component.
 *
 * Use `ListItemProps` when typing reusable navigation rows or selectable
 * content items that should preserve the same overloaded render targets as
 * the component itself.
 *
 * @property [as] - Element type used for the item wrapper.
 * @property [adornment] - Optional leading icon or image adornment.
 * @property [adornmentColor] - Color token used for the adornment.
 * @property [classes] - Class name hooks for item sub-elements.
 * @property [color] - Typography color for title and label text.
 * @property [defaultSelected] - Initial selected state when uncontrolled.
 * @property [disabled] - Disables the item.
 * @property [divider] - Renders a separator below the item.
 * @property [firstIndex] - Marks the item as first in a rendered list.
 * @property [href] - Destination URL used when rendering as a link.
 * @property [label] - Primary text shown for the item.
 * @property [lastIndex] - Marks the item as last in a rendered list.
 * @property [onClick] - Click handler for the rendered item.
 * @property [onKeyDown] - Keyboard handler for the rendered item.
 * @property [ref] - Ref forwarded to the rendered item element.
 * @property [role] - Accessible role for the rendered item.
 * @property [selectable] - Whether the item can be selected.
 * @property [status] - Status token that influences item accent color.
 * @property [tabIndex] - Keyboard focus order when selectable.
 * @property [target] - Anchor target used when rendering as a link.
 * @property [title] - Optional secondary heading shown above the label.
 * @property [selected] - Controlled selected state.
 * @property [value] - Value associated with selection tracking.
 */
type ListItemProps = (AnchorProps | DivProps | LiProps) & BaseProps;

/**
 * Renders the leading adornment for a list item as either a Font Awesome icon
 * or an optimized image, depending on the shape of the provided adornment.
 *
 * When an icon definition is passed in, the icon is rendered with the
 * provided class name. When an image descriptor is passed in, the function
 * renders a `next/image` element with the shared adornment sizing and motion
 * classes applied.
 */
const renderAdornment = (adornment: ListItemAdornment, className?: string) => {
  const imageClasses = twMerge('au:object-contain au:animate-fade-in au:duration-500', className);

  if ('iconName' in adornment) {
    return <FontAwesomeIcon icon={adornment} className={className} />;
  }

  return (
    <img
      src={adornment?.src || ''}
      alt={adornment?.alt || ''}
      width={40}
      height={40}
      className={imageClasses}
    />
  );
};

/**
 * Renders a list item that can behave as a link, div, or native `li` while
 * supporting selection state, optional adornments, and design-system text
 * styling.
 *
 * The component is typically rendered inside `List`, which can wire up
 * selection and divider behavior automatically. `ListItem` itself handles the
 * visual structure, including optional title/label text, adornment rendering,
 * and the styling for selected or disabled states.
 *
 * @example
 * ```tsx
 * import { ListItem } from '@arctura/atomics';
 *
 * export function SidebarItem() {
 *   return (
 *     <ul>
 *       <ListItem as="li" title="Projects" label="See the latest work" value="projects" selected />
 *       <ListItem
 *         as="a"
 *         href="/contact"
 *         title="Contact"
 *         label="Start a conversation"
 *         adornment={{ src: '/images/avatar.png', alt: 'Profile avatar' }}
 *       />
 *     </ul>
 *   );
 * }
 * ```
 */
function ListItem(props: AnchorProps & BaseProps): JSX.Element;
function ListItem(props: DivProps & BaseProps): JSX.Element;
function ListItem(props: LiProps & BaseProps): JSX.Element;
function ListItem({
  as = 'li',
  adornment,
  adornmentColor = 'primary',
  disabled = false,
  defaultSelected,
  divider = false,
  classes = {},
  color = 'primary',
  firstIndex = false,
  href,
  label,
  lastIndex = false,
  onClick,
  ref,
  selectable = true,
  selected: selectedProp,
  status,
  tabIndex = 0,
  target,
  title,
  ...rest
}: ListItemProps) {
  const [selected, setSelected] = useControlled<boolean>({
    defaultValue: defaultSelected && selectable,
    value: selectedProp,
  });

  const adornmentClasses = classNames(
    'au:text-base au:p-1 au:group-hover:text-accent',
    {
      'au:text-accent': adornmentColor === 'accent' && !status,
      'au:text-black': adornmentColor === 'black' && !status,
      'au:text-inverse': adornmentColor === 'inverse' && !status,
      'au:text-primary': adornmentColor === 'primary' && !status,
      'au:text-secondary': adornmentColor === 'secondary' && !status,
      'au:text-subtle': adornmentColor === 'subtle' && !status,
      'au:text-white': adornmentColor === 'white' && !status,
      'au:text-success': status === 'success' || adornmentColor === 'success',
      'au:text-danger': status === 'error' || adornmentColor === 'danger',
      'au:text-info': status === 'info' || adornmentColor === 'info',
      'au:text-warning': status === 'warning' || adornmentColor === 'warning',
    },
    classes?.adornment
  );

  const rootClasses = twMerge(
    classNames(
      'au:flex au:flex-col au:items-center au:w-full au:transition-all',
      'au:focus-visible:outline-1 au:focus-visible:outline-offset-4 au:focus-visible:outline-primary',
      {
        'au:group au:hover:cursor-pointer au:duration-200': selectable,
        'au:rounded-t-lg': firstIndex,
        'au:bg-black/50': selected,
        'au:opacity-80': disabled,
        'au:rounded-b-lg': lastIndex,
        'au:hover:scale-105 au:hover:px-2 au:duration-500': !selectable,
      }
    ),
    classes?.root
  );

  const containerClasses = twMerge(
    classNames('au:flex au:items-center au:w-full'),
    classes?.container
  );

  const childrenClasses = twMerge(
    classNames('au:flex au:flex-col au:grow au:gap-2 au:py-2 au:pr-2'),
    classes?.children
  );

  const labelClasses = twMerge(classNames('au:group-hover:text-accent'), classes?.label);

  const titleClasses = twMerge(classNames('au:group-hover:text-accent'), classes?.title);

  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLLIElement>) => {
    if (onClick) {
      if ((as === 'a' || href) && onClick) {
        (onClick as AnchorProps['onClick'])!(event as MouseEvent<HTMLAnchorElement>);
      } else if (as === 'div') {
        (onClick as DivProps['onClick'])!(event as MouseEvent<HTMLDivElement>);
      } else {
        (onClick as LiProps['onClick'])!(event as MouseEvent<HTMLLIElement>);
      }
    } else {
      setSelected(true);
    }
  };

  if (as === 'a' || href) {
    return (
      <a
        className={rootClasses}
        href={href}
        onClick={handleClick}
        ref={ref as Ref<HTMLAnchorElement>}
        tabIndex={selectable ? tabIndex : -1}
        target={target}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <div className={containerClasses}>
          {adornment && renderAdornment(adornment, adornmentClasses)}
          <div className={childrenClasses}>
            {title && (
              <Typography className={titleClasses} color={color} removePadding>
                {title}
              </Typography>
            )}
            {label && (
              <Typography className={labelClasses} color={color} removePadding>
                {label}
              </Typography>
            )}
          </div>
        </div>
      </a>
    );
  }

  if (as === 'div') {
    return (
      <div
        className={rootClasses}
        tabIndex={selectable ? tabIndex : -1}
        onClick={handleClick}
        ref={ref as Ref<HTMLDivElement>}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        <div className={containerClasses}>
          {adornment && renderAdornment(adornment, adornmentClasses)}
          <div className={childrenClasses}>
            {title && (
              <Typography className={titleClasses} color={color} removePadding>
                {title}
              </Typography>
            )}
            {label && (
              <Typography className={labelClasses} color={color} removePadding>
                {label}
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <li
      className={rootClasses}
      onClick={handleClick}
      ref={ref as Ref<HTMLLIElement>}
      tabIndex={selectable ? tabIndex : -1}
      {...(rest as LiHTMLAttributes<HTMLLIElement>)}
    >
      <div className={containerClasses}>
        {adornment && renderAdornment(adornment, adornmentClasses)}
        <div className={childrenClasses}>
          {title && (
            <Typography className={titleClasses} color={color} removePadding>
              {title}
            </Typography>
          )}
          {label && (
            <Typography className={labelClasses} color={color} removePadding>
              {label}
            </Typography>
          )}
        </div>
      </div>
      {divider && !lastIndex && (
        <div className="au:w-9/10 au:h-0 au:border-solid au:border-b-1 au:border-b-primary" />
      )}
    </li>
  );
}

ListItem.displayName = 'List.ListItem';

export { ListItem };
export type {
  ListItemAdornment,
  ListItemAdornmentColor,
  ListItemClasses,
  ListItemProps,
  ListItemStatus,
};
