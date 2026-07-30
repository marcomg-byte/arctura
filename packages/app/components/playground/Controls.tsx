import { Fragment } from 'react';
import type { FC, JSX, HTMLAttributes } from 'react';
import { TextInput } from '@arctura/atomics';
import type { ComponentName, ComponentPropsByComponent } from './Component';

/**
 * Extracts the string prop names for a selected playground component.
 *
 * This keeps control records tied to real props on the component they edit.
 */
type ComponentPropName<K extends ComponentName> = Extract<
  keyof ComponentPropsByComponent[K],
  string
>;

/**
 * Describes one control entry for a component prop.
 *
 * The `type` field selects the control renderer, while `value` stores either a
 * prop name or nested slot controls.
 */
type ControlRecord<V extends string = string> =
  | { type: 'string'; value: V }
  | { type: 'number'; value: V }
  | { type: 'boolean'; value: V }
  | { type: 'slot'; value: ControlRecord<V>[] };

/** Playground control entry that can be rendered by the controls panel. */
type Control = ControlRecord;

/** Union of the supported playground control renderer kinds. */
type ControlType = Control['type'];

/** Value accepted by an individual control entry. */
type ControlValue = string | Control[];

/**
 * Control entry constrained to the props of a specific atomic component.
 *
 * For example, `ComponentControl<'Button'>` can only reference string prop
 * names that exist on the atomics `Button` component.
 */
type ComponentControl<K extends ComponentName> = ControlRecord<ComponentPropName<K>>;

/**
 * Registry shape for the controls available to each playground component.
 *
 * Component names are optional so unsupported components can omit their control
 * configuration and render without editor controls.
 */
type ComponentControls = {
  [K in ComponentName]?: readonly ComponentControl<K>[];
};

const componentControls: ComponentControls = {
  Button: [
    { type: 'string', value: 'variant' },
    { type: 'string', value: 'size' },
    { type: 'string', value: 'type' },
    { type: 'string', value: 'href' },
    { type: 'string', value: 'target' },
    { type: 'boolean', value: 'fullWidth' },
    { type: 'boolean', value: 'responsive' },
    { type: 'boolean', value: 'disabled' },
  ],
};

interface ControlsClasses {
  /** Optional class name for the controls root container. */
  root?: string;
  /** Optional class name for the controls children container. */
  children?: string;
}

interface ControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Optional class name hooks for controls internals. */
  classes?: ControlsClasses;
  /** Control entry or entries rendered by the component. */
  items?: Control | Control[];
  /** Desired direction for arranging rendered controls. */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Returns the configured controls for a selected playground component.
 *
 * The returned array is a shallow copy so callers can sort, filter, or extend
 * it without mutating the shared registry.
 */
const getControls = <K extends ComponentName>(component: K): ComponentControl<K>[] => {
  return [...(componentControls[component] ?? [])] as ComponentControl<K>[];
};

/**
 * Renders a single playground control entry.
 *
 * Unsupported primitive control types intentionally return `null` until their
 * specific input components are implemented.
 */
const renderControl = (item: Control): JSX.Element | null => {
  if (item.type === 'boolean') {
    return null;
  }

  if (item.type === 'number') {
    return null;
  }

  if (item.type === 'string') {
    return <TextInput name={item.value} label={item.value} />;
  }

  return (
    <>
      {item.value.map((entry, index) => (
        <Fragment key={index}>{renderControl(entry)}</Fragment>
      ))}
    </>
  );
};

/**
 * Renders one or more playground control entries.
 *
 * Arrays preserve their order from the component controls registry, while a
 * single item is delegated directly to `renderControl`.
 */
const renderItems = (items: Control | Control[]): JSX.Element | (JSX.Element | null)[] | null => {
  if (Array.isArray(items)) {
    return items.map((item) => renderControl(item));
  }

  return renderControl(items);
};

/**
 * Renders the editable control surface for playground component props.
 *
 * `Controls` accepts either a single control descriptor or the configured
 * control list returned by `getControls`. String controls render a `TextInput`
 * using the prop name as both the input `name` and visible label. Slot controls
 * render their nested controls recursively, which allows compound component
 * editors to group child controls while preserving the same descriptor shape.
 *
 * @example
 * ```tsx
 * import { Controls, getControls } from '@/components/playground';
 * import type { Control } from '@/components/playground';
 *
 * export function ButtonPlaygroundControls() {
 *   const buttonControls = getControls('Button');
 *
 *   const customControls: Control[] = [
 *     ...buttonControls,
 *     {
 *       type: 'slot',
 *       value: [
 *         { type: 'string', value: 'children' },
 *         { type: 'string', value: 'aria-label' },
 *       ],
 *     },
 *   ];
 *
 *   return (
 *     <section aria-label="Button controls">
 *       <Controls
 *         items={customControls}
 *         orientation="vertical"
 *         classes={{
 *           root: 'au:flex au:flex-col au:gap-3',
 *           children: 'au:grid au:grid-cols-2 au:gap-2',
 *         }}
 *       />
 *     </section>
 *   );
 * }
 * ```
 */
const Controls: FC<ControlProps> = ({ items }) => {
  const renderedItems = items && renderItems(items);

  return <>{renderedItems}</>;
};

Controls.displayName = 'Playground.Controls';

export type { Control, ControlType, ControlValue };
export { Controls, getControls };
