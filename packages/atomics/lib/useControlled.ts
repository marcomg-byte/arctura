import { useState } from 'react';

/**
 * Props for the useControlled hook.
 *
 * @template StateType - The type of the state value.
 * @property {StateType} [defaultValue] - The initial value for uncontrolled mode.
 * @property {StateType} [value] - The controlled value (if provided, component is controlled).
 */
interface useControlledProps<StateType> {
  defaultValue?: StateType;
  value?: StateType;
}

/**
 * React hook for managing controlled and uncontrolled component state.
 *
 * If a `value` prop is provided, the hook acts as a controlled component (external state).
 * If no `value` is provided, it manages its own state internally using `defaultValue`.
 *
 * @template StateType - The type of the state value.
 * @param {Object} props - The props object.
 * @param {StateType} [props.defaultValue] - The initial value for uncontrolled mode.
 * @param {StateType} [props.value] - The controlled value (if provided, component is controlled).
 * @returns {[StateType | undefined, (newValue: StateType) => void]} - The current value and a setter function.
 *
 * @example
 * // Uncontrolled usage
 * const [value, setValue] = useControlled({ defaultValue: 0 });
 *
 * @example
 * // Controlled usage
 * const [value, setValue] = useControlled({ value: externalValue });
 *
 * @see https://reactjs.org/docs/forms.html#controlled-components for more on controlled components.
 * @see https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook for more on custom hooks.
 * @see useControlledProps
 */
function useControlled<StateType>({
  defaultValue,
  value,
}: useControlledProps<StateType>) {
  const [internalValue, setInternalValue] = useState<StateType | undefined>(
    defaultValue,
  );

  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : internalValue;

  const setValue = (newValue: StateType) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
  };

  return [currentValue, setValue] as const;
}

export { useControlled };
