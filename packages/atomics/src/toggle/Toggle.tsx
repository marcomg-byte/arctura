import type { ChangeEvent, FC, InputHTMLAttributes, Ref } from 'react';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

/**
 * Class name hooks for the Toggle component internals.
 *
 * @property [container] - Class names applied to the wrapping label.
 * @property [input] - Class names applied to the native checkbox input.
 * @property [slider] - Class names applied to the visual slider.
 * @property [label] - Class names applied to the visible label.
 * @property [description] - Class names applied to the supporting description.
 */
interface ToggleClasses {
  /**
   * Class names applied to the wrapping label.
   * @defaultValue undefined
   */
  container?: string;
  /**
   * Class names applied to the native checkbox input.
   * @defaultValue undefined
   */
  input?: string;
  /**
   * Class names applied to the visual slider.
   * @defaultValue undefined
   */
  slider?: string;
  /**
   * Class names applied to the visible label.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Class names applied to the supporting description.
   * @defaultValue undefined
   */
  description?: string;
}

type ToggleSize = 'sm' | 'md' | 'lg';

type ToggleVariant = 'default' | 'success' | 'danger';

/**
 * Props for the Toggle component.
 *
 * Use this interface to configure a switch-style checkbox with controlled or
 * uncontrolled checked state, accessible labeling, visual sizing, and class
 * name hooks.
 *
 * @property [aria-label] - Accessible label when no visible label is present.
 * @property [aria-labelledby] - ID of the element that labels the toggle.
 * @property [aria-describedby] - ID of the element that describes the toggle.
 * @property [checked] - Controlled checked state.
 * @property [defaultChecked] - Initial checked state for uncontrolled usage.
 * @property [onCheckedChange] - Callback fired when the checked state changes.
 * @property [disabled] - Disables the toggle.
 * @property [required] - Marks the toggle as required for form submission.
 * @property [name] - Name attribute used for form submission.
 * @property [value] - Boolean value associated with the toggle.
 * @property [id] - ID applied to the native checkbox input.
 * @property [label] - Visible label text.
 * @property [description] - Supporting description text.
 * @property [size] - Size token controlling the visual scale.
 * @property [variant] - Visual variant used for the active state.
 * @property [classes] - Class name hooks for internal elements.
 * @property [ref] - Ref forwarded to the native checkbox input.
 * @property [containerRef] - Ref forwarded to the wrapping label.
 */
interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'size' | 'value'
> {
  /**
   * Accessible label when no visible label is present.
   * @defaultValue undefined
   */
  'aria-label'?: string;
  /**
   * ID of the element that labels the toggle.
   * @defaultValue undefined
   */
  'aria-labelledby'?: string;
  /**
   * ID of the element that describes the toggle.
   * @defaultValue undefined
   */
  'aria-describedby'?: string;
  /**
   * Controlled checked state.
   * @defaultValue undefined
   */
  checked?: boolean;
  /**
   * Initial checked state for uncontrolled usage.
   * @defaultValue false
   */
  defaultChecked?: boolean;
  /**
   * Callback fired when the checked state changes.
   * @defaultValue undefined
   */
  onCheckedChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  /**
   * Disables the toggle.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Marks the toggle as required for form submission.
   * @defaultValue false
   */
  required?: boolean;
  /**
   * Name attribute used for form submission.
   * @defaultValue undefined
   */
  name?: string;
  /**
   * Boolean value associated with the toggle.
   * @defaultValue undefined
   */
  value?: boolean;
  /**
   * ID applied to the native checkbox input.
   * @defaultValue undefined
   */
  id?: string;
  /**
   * Visible label text.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Supporting description text.
   * @defaultValue undefined
   */
  description?: string;
  /**
   * Size token controlling the visual scale.
   * @defaultValue 'md'
   */
  size?: ToggleSize;
  /**
   * Visual variant used for the active state.
   * @defaultValue 'default'
   */
  variant?: ToggleVariant;
  /**
   * Class name hooks for internal elements.
   * @defaultValue {}
   */
  classes?: ToggleClasses;
  /**
   * Ref forwarded to the native checkbox input.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLInputElement>;
  /**
   * Ref forwarded to the wrapping label.
   * @defaultValue undefined
   */
  containerRef?: Ref<HTMLLabelElement>;
}

const Toggle: FC<ToggleProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  required = false,
  name,
  value,
  id,
  label,
  description,
  size = 'md',
  variant = 'default',
  classes = {},
  ref,
  containerRef,
  ...rest
}) => {
  const containerClasses = twMerge(classNames(), classes?.container);
  const inputClasses = twMerge(classNames(), classes?.input);
  const sliderClasses = twMerge(classNames(), classes?.slider);
  const labelClasses = twMerge(classNames(), classes?.label);
  const descriptionClasses = twMerge(classNames(), classes?.description);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    rest.onChange?.(event);
    onCheckedChange?.(event, event.currentTarget.checked);
  };

  return (
    <label className={containerClasses} ref={containerRef}>
      <input
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={inputClasses}
        type="checkbox"
        role="switch"
        {...rest}
        id={id}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        ref={ref}
        value={value === undefined ? undefined : String(value)}
        data-size={size}
        data-variant={variant}
        onChange={handleChange}
      />
      <span className={sliderClasses}></span>
      <span className={labelClasses}>{label}</span>
      <span className={descriptionClasses}>{description}</span>
    </label>
  );
};

Toggle.displayName = 'Toggle';

export { Toggle };
export type { ToggleClasses, ToggleProps, ToggleSize, ToggleVariant };
