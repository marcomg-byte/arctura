import * as components from '@arctura/atomics';
import type { ComponentType, FC } from 'react';

/**
 * Namespace type for every runtime export exposed by `@arctura/atomics`.
 *
 * This is the source map used to derive which exports are renderable React
 * components and what props each one accepts.
 */
type Atomics = typeof components;

/**
 * Extracts the props from a React component type.
 *
 * Non-component values resolve to `never`, which lets the mapped types below
 * filter out hooks, constants, utilities, and other non-renderable exports.
 */
type PropsOf<T> = T extends ComponentType<infer Props> ? Props : never;

/**
 * Union of atomics export names that can be rendered as React components.
 *
 * Example values include names such as `'Button'`, `'Typography'`, or
 * `'TextInput'`, depending on the exports available from `@arctura/atomics`.
 */
type AtomicComponentName = {
  [K in keyof Atomics]: PropsOf<Atomics[K]> extends never ? never : K;
}[keyof Atomics];

/**
 * Lookup table that maps each renderable atomic component name to its props.
 *
 * For example, `AtomicPropsByComponent['Button']` resolves to the props accepted
 * by the exported `Button` component.
 */
type AtomicPropsByComponent = {
  [K in AtomicComponentName]: PropsOf<Atomics[K]>;
};

/**
 * Props for the playground dynamic component renderer.
 *
 * The generic parameter links `component` and `props`, so a selected component
 * name determines which props are valid for that render.
 */
interface PlaygroundComponentProps<K extends AtomicComponentName = AtomicComponentName> {
  /**
   * Name of the atomic component export to render.
   *
   * This must be one of the React component exports from `@arctura/atomics`.
   */
  component: K;
  /**
   * Props passed through to the selected atomic component.
   *
   * The expected shape is derived from `component`, so `component="Button"`
   * receives Button props, `component="Typography"` receives Typography props,
   * and so on.
   */
  props?: AtomicPropsByComponent[K];
}

/**
 * Dynamically renders one component from `@arctura/atomics` with type-checked
 * props.
 *
 * @example
 * ```tsx
 * import { Component } from '@/components/playground';
 *
 * export function PlaygroundPreview() {
 *   return (
 *     <Component
 *       component="Button"
 *       props={{
 *         children: 'Save changes',
 *         color: 'primary',
 *         variant: 'filled',
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * import type { ComponentName } from '@/components/playground';
 *
 * const componentName: ComponentName = 'Typography';
 *
 * <Component
 *   component={componentName}
 *   props={{
 *     children: 'A typed atomic preview',
 *     variant: 'paragraph',
 *   }}
 * />;
 * ```
 */
const Component: FC<PlaygroundComponentProps> = ({ component, props }) => {
  const SelectedComponent = components[component] as ComponentType<typeof props>;

  return <SelectedComponent {...props} />;
};

Component.displayName = 'Playground.Component';

export type {
  AtomicComponentName as ComponentName,
  AtomicPropsByComponent as ComponentPropsByComponent,
};
export { Component };
