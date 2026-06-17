'use client';
import type {
  ComponentProps,
  JSX,
  HTMLAttributes,
  OlHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { Children, cloneElement, isValidElement, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { useControlled } from '@/lib';
import { ListItem as ListItemComponent } from './ListItem';

/** React element helper that guarantees an optional `children` prop. */
type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

/** Supported colors for list adornments. */
type ListAdornmentColor =
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

/** Status variants that can be forwarded to list items. */
type ListStatus = 'error' | 'info' | 'success' | 'warning';

/** Background variants for the list container. */
type ListBackground = 'primary' | 'secondary' | 'subtle' | 'inverse';

/** Text and surface colors supported by the list container. */
type ListColor = 'accent' | 'black' | 'inverse' | 'primary' | 'secondary' | 'subtle' | 'white';

/** Internal list item shape used to track selection state. */
interface ListItem {
  /** Stable identifier assigned while walking the nested children tree. */
  key?: string;
  /** Human-readable label for the item. */
  label?: string;
  /** Whether the item is currently selected. */
  selected?: boolean;
  /** Backing value associated with the item. */
  value?: string | number;
}

/** Public item payload emitted to consumers. */
type Item = Omit<ListItem, 'selected'>;

/** React element type for rendered list items. */
type ListItemElement = ReactElement<ComponentProps<typeof ListItemComponent>>;

/** Props extracted from the reusable list item component. */
type ListItemProps = ComponentProps<typeof ListItemComponent>;

/** Shared props supported by all list render targets. */
interface BaseProps {
  /** Render target to use for the outer list wrapper. */
  as?: 'ul' | 'ol' | 'div';
  /** Color token used for item adornments. */
  adornmentColor?: ListAdornmentColor;
  /** Background token for the list container. */
  background?: ListBackground;
  /** Nested content used to discover and render list items. */
  children?: ReactNode;
  /** Additional class names merged onto the wrapper. */
  className?: string;
  /** Color token applied to text and item accents. */
  color?: ListColor;
  /** Compact spacing mode for dense layouts. */
  compact?: boolean;
  /** Whether to render dividers between items. */
  divider?: boolean;
  /** Whether the list and its items are disabled. */
  disabled?: boolean;
  /** Whether the wrapper should expand to the full available width. */
  fullWidth?: boolean;
  /** Element type to render for nested list items. */
  itemsAs?: 'a' | 'div' | 'li';
  /** Callback fired when the selected item set changes. */
  onChange?: (selectedItems: Item[]) => void;
  /** Whether list items can be selected. */
  selectable?: boolean;
  /** Size token controlling the wrapper width. */
  size?: 'sm' | 'md' | 'lg';
  /** Status token forwarded to child items. */
  status?: ListStatus;
  /** Controlled value used to seed or manage selected items. */
  value?: ListItem[];
}

/** Props for rendering the list as a div. */
interface DivProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Optional ref forwarded to the div wrapper. */
  ref?: Ref<HTMLDivElement>;
  /** Accessible role for the div wrapper. */
  role?: JSX.IntrinsicElements['div']['role'];
}

/** Props for rendering the list as an ordered list. */
interface OlProps extends Omit<OlHTMLAttributes<HTMLOListElement>, 'onChange'> {
  /** Optional ref forwarded to the ordered list wrapper. */
  ref?: Ref<HTMLOListElement>;
  /** Accessible role for the ordered list wrapper. */
  role?: JSX.IntrinsicElements['ol']['role'];
}

/** Props for rendering the list as an unordered list. */
interface UlProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange'> {
  /** Optional ref forwarded to the unordered list wrapper. */
  ref?: Ref<HTMLUListElement>;
  /** Accessible role for the unordered list wrapper. */
  role?: JSX.IntrinsicElements['ul']['role'];
}

/** Combined prop signature for the overloaded list component. */
type ListProps = (DivProps | OlProps | UlProps) & BaseProps;

/**
 * Renders a selectable list container that can behave like a `ul`, `ol`, or
 * `div` while discovering nested `ListItem` children and wiring selection
 * state for them.
 *
 * The component supports controlled and uncontrolled selection, optional
 * divider display, responsive width tokens, and item-level presentation
 * variants such as adornment color, background, status, and disabled state.
 * It is intended to wrap `ListItem` children and propagate the interaction
 * props needed for consistent list behavior across the design system.
 *
 * @example
 * ```tsx
 * import { List } from '@/components/ui';
 * import { ListItem } from '@/components/ui';
 *
 * export function Example() {
 *   return (
 *     <List
 *       as="ul"
 *       selectable
 *       fullWidth
 *       size="md"
 *       onChange={(selectedItems) => {
 *         console.log('Selected items:', selectedItems);
 *       }}
 *     >
 *       <ListItem label="Overview" value="overview" selected />
 *       <ListItem label="Projects" value="projects" />
 *       <ListItem label="Contact" value="contact" />
 *     </List>
 *   );
 * }
 * ```
 */
function List(props: DivProps & BaseProps): JSX.Element;
function List(props: OlProps & BaseProps): JSX.Element;
function List(props: UlProps & BaseProps): JSX.Element;
function List({
  as = 'ul',
  adornmentColor,
  background = 'primary',
  children,
  className,
  color,
  divider = false,
  disabled = false,
  fullWidth = false,
  itemsAs,
  onChange,
  ref,
  selectable = true,
  size = 'md',
  status,
  value: valueProp,
  ...rest
}: ListProps) {
  const mapState = (children: ReactNode): ListItem[] => {
    let counter = 0;
    const results: ListItem[] = [];

    const walk = (node?: ReactNode) => {
      Children.forEach(node, (child) => {
        if (!isValidElement(child)) return;

        if (isValidElement(child) && child.type === ListItemComponent) {
          counter++;
          const key = `list-item-${counter}`;
          const props = child.props as ListItemProps;
          results.push({
            key,
            label: props?.label || '',
            selected: (props?.selected || props?.defaultSelected || false) && selectable,
            value: props?.value,
          });
        }

        if (isValidElement(child) && (child as ElementWithChildren).props?.children) {
          walk((child as ElementWithChildren).props.children);
        }
      });
    };

    walk(children);
    return results;
  };

  const initialState: ListItem[] = selectable ? mapState(children) : [];
  const controlledInitialState: Item[] = initialState
    .filter((item) => item?.selected)
    .map((item) => ({
      key: item?.key,
      label: item?.label,
      value: item?.value,
    }));
  const [items, setItems] = useState<ListItem[]>(initialState);
  const [, setValue] = useControlled<Item[]>({
    defaultValue: controlledInitialState,
    value: valueProp,
  });
  const controlledValue = useMemo<Item[]>(
    () =>
      items
        .filter((item) => item.selected)
        .map((item) => ({
          key: item?.key,
          label: item?.label,
          value: item?.value,
        })),
    [items]
  );

  const classes = twMerge(
    classNames('mg:flex mg:flex-col mg:rounded-lg', {
      'mg:bg-inverse': background === 'inverse',
      'mg:bg-primary': background === 'primary',
      'mg:bg-secondary': background === 'secondary',
      'mg:bg-subtle': background === 'subtle',
      'mg:w-full': fullWidth,
      'mg:w-24': size === 'sm' && !fullWidth,
      'mg:w-32': size === 'md' && !fullWidth,
      'mg:w-40': size === 'lg' && !fullWidth,
    }),
    className
  );

  const handleClick = (key: string) => {
    if (selectable) {
      const newItemsState = items.map((item) => {
        if (item.key === key) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
      setItems(newItemsState);
    }
  };

  const renderChildren = (children: ReactNode) => {
    let counter = 0;
    const results: ListItemElement[] = [];

    const walk = (node?: ReactNode) => {
      const nodeArray = Children.toArray(node);
      nodeArray.forEach((child) => {
        if (!isValidElement(child)) return;

        if (isValidElement(child) && child.type === ListItemComponent) {
          counter++;
          const key = `list-item-${counter}`;
          results.push(
            cloneElement(child as ListItemElement, {
              key,
              as: itemsAs,
              adornmentColor,
              color,
              divider,
              disabled,
              onClick: () => handleClick(key),
              selected: items.find((item) => item.key === key)?.selected,
              selectable,
              status,
            })
          );
        }

        if (isValidElement(child) && (child as ElementWithChildren).props?.children) {
          walk((child as ElementWithChildren).props?.children);
        }
      });
    };

    walk(children);
    const indexedResults = results.map((child, index) =>
      cloneElement(child, {
        firstIndex: index === 0,
        lastIndex: results.length - 1 === index,
      })
    );
    return indexedResults;
  };

  useEffect(() => {
    if (selectable) {
      if (onChange) {
        onChange(controlledValue);
      } else {
        setValue(controlledValue);
      }
    }
  }, [items, setValue, onChange, controlledValue, selectable]);

  if (as === 'div') {
    return (
      <div
        className={classes}
        ref={ref as Ref<HTMLDivElement>}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {children && renderChildren(children)}
      </div>
    );
  }

  if (as === 'ol') {
    return (
      <ol
        className={classes}
        ref={ref as Ref<HTMLOListElement>}
        {...(rest as OlHTMLAttributes<HTMLOListElement>)}
      >
        {children && renderChildren(children)}
      </ol>
    );
  }

  return (
    <ul
      className={classes}
      ref={ref as Ref<HTMLUListElement>}
      {...(rest as HTMLAttributes<HTMLUListElement>)}
    >
      {children && renderChildren(children)}
    </ul>
  );
}

List.displayName = 'List';

export { List };
export type { Item };
