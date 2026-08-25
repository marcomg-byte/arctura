import { Fragment } from 'react';
import type { FC, JSX, HTMLAttributes } from 'react';
import { Select, TextInput, Toggle } from '@arctura/atomics';
import type { ComponentDocsPrimitive, ComponentDocsProp } from '@arctura/docs';

type ControlPrimitive = Extract<ComponentDocsPrimitive, 'boolean' | 'string' | 'number'>;
type ControlObjectValue = Record<string, unknown> | unknown[] | null | undefined;
type ComponentDocsProps = ComponentDocsProp[];

const PrimitiveTypes: ControlPrimitive[] = ['boolean', 'number', 'string'];

/**
 * Describes one control entry for a component prop.
 *
 * The `type` field selects the control renderer, while `value` stores the
 * prop default value.
 */
type ControlRecord =
  | { name: string; type: 'string'; value: string | undefined }
  | { name: string; options: string[]; type: 'enum'; value: string | undefined }
  | { name: string; type: 'number'; value: number | undefined }
  | { name: string; type: 'boolean'; value: boolean | undefined }
  | { controls: ControlRecord[]; name: string; type: 'object'; value: ControlObjectValue };

/** Playground control entry that can be rendered by the controls panel. */
type Control = ControlRecord;

/** Union of the supported playground control renderer kinds. */
type ControlType = Control['type'];

/** Value accepted by an individual control entry. */
type ControlValue = Control['value'];

const getPrimitiveType = ({ primitive }: ComponentDocsProp): ControlPrimitive | undefined => {
  if (primitive === 'boolean' || primitive === 'number' || primitive === 'string') {
    return primitive;
  }

  return undefined;
};

const emptyDefaultValues = new Set(['', 'undefined']);

const cleanDefaultValue = (defaultValue?: string) => defaultValue?.trim() ?? '';

const getStringDefaultValue = (defaultValue?: string) => {
  const value = cleanDefaultValue(defaultValue);
  if (emptyDefaultValues.has(value)) return undefined;

  const quotedValue = /^(['"])(.*)\1$/.exec(value);

  return quotedValue?.[2] ?? value;
};

const getBooleanDefaultValue = (defaultValue?: string) => {
  const value = cleanDefaultValue(defaultValue);
  if (emptyDefaultValues.has(value)) return undefined;

  return value === 'true';
};

const getNumberDefaultValue = (defaultValue?: string) => {
  const value = cleanDefaultValue(defaultValue);
  if (emptyDefaultValues.has(value)) return undefined;

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const getObjectDefaultValue = (defaultValue?: string): ControlObjectValue => {
  const value = cleanDefaultValue(defaultValue);
  if (emptyDefaultValues.has(value)) return undefined;
  if (value === 'null') return null;
  if (value === '{}') return {};
  if (value === '[]') return [];

  return undefined;
};

const getEnumOptions = ({ values }: ComponentDocsProp) =>
  values?.map((value) => String(value)) ?? [];

const getControls = (componentProps: ComponentDocsProps): Control[] => {
  return componentProps.flatMap<Control>((prop) => {
    const primitiveType = getPrimitiveType(prop);

    if (prop.type?.properties?.length) {
      return [
        {
          name: prop.name,
          type: 'object',
          value: getObjectDefaultValue(prop.defaultValue),
          controls: getControls(prop.type.properties),
        },
      ];
    }

    if (prop.kind === 'enum' && primitiveType === 'string') {
      return [
        {
          name: prop.name,
          options: getEnumOptions(prop),
          type: 'enum',
          value: getStringDefaultValue(prop.defaultValue),
        },
      ];
    }

    if (primitiveType === 'boolean') {
      return [
        { name: prop.name, type: primitiveType, value: getBooleanDefaultValue(prop.defaultValue) },
      ];
    }

    if (primitiveType === 'number') {
      return [
        { name: prop.name, type: primitiveType, value: getNumberDefaultValue(prop.defaultValue) },
      ];
    }

    if (primitiveType === 'string') {
      return [
        { name: prop.name, type: primitiveType, value: getStringDefaultValue(prop.defaultValue) },
      ];
    }

    return [];
  });
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
 * Renders a single playground control entry.
 *
 * Unsupported primitive control types intentionally return `null` until their
 * specific input components are implemented.
 */
const renderControl = (item: Control): JSX.Element | null => {
  if (item.type === 'boolean') {
    return <Toggle name={item.name} label={item.name} defaultChecked={item.value} />;
  }

  if (item.type === 'number') {
    return null;
  }

  if (item.type === 'enum') {
    return (
      <Select
        name={item.name}
        label={item.name}
        defaultValue={item.value}
        color="white"
        options={item.options.map((option) => ({ value: option, label: option }))}
      />
    );
  }

  if (item.type === 'string') {
    return (
      <TextInput color="primary" name={item.name} label={item.name} defaultValue={item.value} />
    );
  }

  return (
    <>
      {item.controls.map((entry, index) => (
        <Fragment key={`control-${index + 1}`}>{renderControl(entry)}</Fragment>
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
 * using the prop name as both the input `name` and visible label. Object
 * controls render their nested controls recursively, which allows compound
 * component editors to group child controls while preserving the same descriptor
 * shape.
 *
 * @example
 * ```tsx
 * import { Controls, getControls } from '@/components/playground';
 * import type { Control } from '@/components/playground';
 * import type { ComponentDocsProp } from '@arctura/docs';
 *
 * export function ButtonPlaygroundControls({ props }: { props: ComponentDocsProp[] }) {
 *   const buttonControls = getControls(props);
 *
 *   const customControls: Control[] = [
 *     ...buttonControls,
 *     {
 *       name: 'slots',
 *       type: 'object',
 *       value: {},
 *       controls: [
 *         { name: 'children', type: 'string', value: undefined },
 *         { name: 'variant', options: ['primary', 'secondary'], type: 'enum', value: 'primary' },
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

export type { ComponentDocsProps, Control, ControlType, ControlValue, ControlPrimitive };
export { Controls, getControls, PrimitiveTypes };
