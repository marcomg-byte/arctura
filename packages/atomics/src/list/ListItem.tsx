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
import { Typography } from '@/src/typography';
import type { TypographyColor } from '@/src/typography';
import { useControlled } from '@/lib';

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

/** Optional class name hooks for the item sub-elements. */
interface ListItemClasses {
  /** Class names applied to the adornment element. */
  adornment?: string;
  /** Class names applied to the interactive root element. */
  button?: string;
  /** Class names applied to the text content wrapper. */
  children?: string;
  /** Class names applied to the inner container row. */
  container?: string;
  /** Class names applied to the outer root element. */
  root?: string;
  /** Class names applied to the label text. */
  label?: string;
  /** Class names applied to the title text. */
  title?: string;
}

/** Shared props that control the visual and behavioral state of a list item. */
interface BaseProps {
  /** Element type to render for the wrapper. */
  as?: 'a' | 'div' | 'li';
  /** Optional leading adornment. */
  adornment?: ListItemAdornment;
  /** Color token used for the adornment. */
  adornmentColor?: ListItemAdornmentColor;
  /** Custom class names for item sub-elements. */
  classes?: ListItemClasses;
  /** Text color used by the title and label typography. */
  color?: TypographyColor;
  /** Whether the item should start selected when uncontrolled. */
  defaultSelected?: boolean;
  /** Whether the item is disabled. */
  disabled?: boolean;
  /** Whether to render a separator below the item. */
  divider?: boolean;
  /** Whether this item is the first rendered item. */
  firstIndex?: boolean;
  /** Destination URL used when rendering as a link. */
  href?: string;
  /** Primary text shown for the item. */
  label?: string;
  /** Whether this item is the last rendered item. */
  lastIndex?: boolean;
  /** Whether the item can be selected. */
  selectable?: boolean;
  /** Status token that overrides or reinforces the adornment color. */
  status?: ListItemStatus;
  /** Keyboard focus order when the item is selectable. */
  tabIndex?: number;
  /** Optional secondary heading shown above the label. */
  title?: string;
  /** Controlled selected state. */
  selected?: boolean;
  /** Value associated with this item for selection tracking. */
  value?: string | number;
}

/** Props used when the item renders as an anchor. */
interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destination URL for the anchor. */
  href?: string;
  /** Click handler for the anchor variant. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Keyboard handler for the anchor variant. */
  onKeyDown?: (event: KeyboardEvent<HTMLAnchorElement>) => void;
  /** Optional ref forwarded to the anchor element. */
  ref?: Ref<HTMLAnchorElement>;
  /** Accessible role for the anchor element. */
  role?: JSX.IntrinsicElements['a']['role'];
  /** Optional target for the anchor element. */
  target?: string;
}

/** Props used when the item renders as a div. */
interface DivProps extends HTMLAttributes<HTMLDivElement> {
  /** Disallowed in the div variant. */
  href?: never;
  /** Click handler for the div variant. */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Keyboard handler for the div variant. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  /** Optional ref forwarded to the div element. */
  ref?: Ref<HTMLDivElement>;
  /** Accessible role for the div element. */
  role?: JSX.IntrinsicElements['div']['role'];
  /** Disallowed in the div variant. */
  target?: never;
}

/** Props used when the item renders as a list item. */
interface LiProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Disallowed in the li variant. */
  href?: never;
  /** Click handler for the li variant. */
  onClick?: (event: MouseEvent<HTMLLIElement>) => void;
  /** Keyboard handler for the li variant. */
  onKeyDown?: (event: KeyboardEvent<HTMLLIElement>) => void;
  /** Optional ref forwarded to the li element. */
  ref?: Ref<HTMLLIElement>;
  /** Accessible role for the li element. */
  role?: JSX.IntrinsicElements['li']['role'];
  /** Disallowed in the li variant. */
  target?: never;
}

/** Combined prop signature for the list item component. */
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
  const imageClasses = twMerge('mg:object-contain mg:animate-fade-in mg:duration-500', className);

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
 * import { ListItem } from '@/src/list/ListItem';
 *
 * export function Example() {
 *   return (
 *     <ul>
 *       <ListItem
 *         as="li"
 *         title="Projects"
 *         label="See the latest work"
 *         value="projects"
 *         selected
 *       />
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
    'mg:text-base mg:p-1 mg:group-hover:text-accent',
    {
      'mg:text-accent': adornmentColor === 'accent' && !status,
      'mg:text-black': adornmentColor === 'black' && !status,
      'mg:text-inverse': adornmentColor === 'inverse' && !status,
      'mg:text-primary': adornmentColor === 'primary' && !status,
      'mg:text-secondary': adornmentColor === 'secondary' && !status,
      'mg:text-subtle': adornmentColor === 'subtle' && !status,
      'mg:text-white': adornmentColor === 'white' && !status,
      'mg:text-success': status === 'success' || adornmentColor === 'success',
      'mg:text-danger': status === 'error' || adornmentColor === 'danger',
      'mg:text-info': status === 'info' || adornmentColor === 'info',
      'mg:text-warning': status === 'warning' || adornmentColor === 'warning',
    },
    classes?.adornment
  );

  const rootClasses = twMerge(
    classNames(
      'mg:flex mg:flex-col mg:items-center mg:w-full mg:transition-all',
      'mg:focus-visible:outline-1 mg:focus-visible:outline-offset-4 mg:focus-visible:outline-primary',
      {
        'mg:group mg:hover:cursor-pointer mg:duration-200': selectable,
        'mg:rounded-t-lg': firstIndex,
        'mg:bg-black/50': selected,
        'mg:opacity-80': disabled,
        'mg:rounded-b-lg': lastIndex,
        'mg:hover:scale-105 mg:hover:px-2 mg:duration-500': !selectable,
      }
    ),
    classes?.root
  );

  const containerClasses = twMerge(
    classNames('mg:flex mg:items-center mg:w-full'),
    classes?.container
  );

  const childrenClasses = twMerge(
    classNames('mg:flex mg:flex-col mg:grow mg:gap-2 mg:py-2 mg:pr-2'),
    classes?.children
  );

  const labelClasses = twMerge(classNames('mg:group-hover:text-accent'), classes?.label);

  const titleClasses = twMerge(classNames('mg:group-hover:text-accent'), classes?.title);

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
        <div className="mg:w-9/10 mg:h-0 mg:border-solid mg:border-b-1 mg:border-b-primary" />
      )}
    </li>
  );
}

ListItem.displayName = 'List.ListItem';

export { ListItem };
