import type { ChangeEvent, FC, InputHTMLAttributes, KeyboardEvent, Ref } from 'react';
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
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>, checked?: boolean) => void;
  /**
   * Disables the toggle.
   * @defaultValue false
   */
  disabled?: boolean;
  fullWidth?: boolean;
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
  onKeyDown,
  disabled = false,
  fullWidth = false,
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
  const containerClasses = twMerge(
    classNames(
      'au:relative au:inline-flex au:items-center au:gap-3 au:pl-1.5 au:pr-0.5 au:pt-1 au:pb-3 au:hover:cursor-pointer',
      {
        'au:w-22': size === 'sm' && !fullWidth,
        'au:w-32': size === 'md' && !fullWidth,
        'au:w-52': size === 'lg' && !fullWidth,
        'au:w-full': fullWidth,
      }
    ),
    classes?.container
  );
  const inputClasses = twMerge(classNames('au:sr-only au:peer'), classes?.input);
  const sliderClasses = twMerge(
    classNames(
      'au:relative au:rounded-full au:bg-subtle au:transition-colors au:duration-200 au:h-1.5',
      "au:after:absolute au:after:h-3 au:after:w-3 au:after:top-1/2 au:after:-inset-s-1.5 au:after:-mt-1.5 au:after:rounded-full au:after:border-none au:after:content-[''] au:after:transition-all",
      'au:peer-focus-visible:outline-1 au:peer-focus-visible:outline-primary au:peer-focus-visible:outline-offset-2 au:rtl:peer-checked:after:-translate-x-full',
      {
        'au:peer-checked:bg-accent-subtle au:after:bg-accent': variant === 'default',
        'au:peer-checked:bg-success-primary-subtle au:after:bg-success-primary':
          variant === 'success',
        'au:peer-checked:bg-danger-primary-subtle au:after:bg-danger-primary': variant === 'danger',
        'au:opacity-50': disabled,
        'au:w-5 au:peer-checked:after:translate-x-4.5': size === 'sm',
        'au:w-7 au:peer-checked:after:translate-x-6.5': size === 'md',
        'au:w-9 au:peer-checked:after:translate-x-8.5': size === 'lg',
      }
    ),
    classes?.slider
  );
  const labelClasses = twMerge(
    classNames('au:text-primary au:text-xs au:sm:text-sm au:lg:text-base'),
    classes?.label
  );
  const descriptionClasses = twMerge(
    classNames('au:text-subtle au:text-xs au:sm:text-sm au:lg:text-base'),
    classes?.description
  );
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(event, event.currentTarget.checked);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const currentChecked = event.currentTarget.checked;
      event.currentTarget.checked = !currentChecked;
    }

    if (event.key === 'Escape') {
      event.currentTarget.checked = false;
    }

    if (onKeyDown) {
      onKeyDown(event, event.currentTarget.checked);
    }
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
        onKeyDown={handleKeyDown}
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
