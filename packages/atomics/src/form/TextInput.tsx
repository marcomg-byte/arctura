'use client';
import type {
  ChangeEvent,
  FC,
  FocusEvent,
  InputEvent,
  InputHTMLAttributes,
  JSX,
  KeyboardEvent,
  MouseEvent,
  Ref,
} from 'react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '../buttons';
import { useControlled } from '../../lib/hooks';

/**
 * Adornment for `TextInput` - either a FontAwesome `IconDefinition`
 * or an image object `{ src, alt? }`.
 */
type TextInputAdornment = IconDefinition | { src: string; alt?: string };

/**
 * Colors available for adornments and small text styles.
 * Allowed values:
 * - 'primary'
 * - 'secondary'
 * - 'accent'
 * - 'subtle'
 * - 'inverse'
 * - 'black'
 * - 'white'
 */
type TextInputAdornmentColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'subtle'
  | 'inverse'
  | 'black'
  | 'white';

/**
 * Optional class overrides for `TextInput` sub-elements.
 * Use these to merge or replace default styles on internal parts.
 *
 * @property [container] - Class applied to the root container for the component.
 * @property [clearButton] - Class applied to the clear button or icon.
 * @property [endAdornment] - Class applied to the end adornment element.
 * @property [helper] - Class applied to the helper text element.
 * @property [input] - Class applied to the native input element.
 * @property [inputContainer] - Class applied to the input border and wrapper.
 * @property [label] - Class applied to the label element.
 * @property [startAdornment] - Class applied to the start adornment element.
 * @property [toggleButton] - Class applied to the password visibility toggle button.
 */
interface TextInputClasses {
  /**
   * Root container for the component.
   * @defaultValue undefined
   */
  container?: string;
  /**
   * Class applied to the clear button/icon.
   * @defaultValue undefined
   */
  clearButton?: string;
  /**
   * Class applied to the end adornment element.
   * @defaultValue undefined
   */
  endAdornment?: string;
  /**
   * Class applied to the helper text element.
   * @defaultValue undefined
   */
  helper?: string;
  /**
   * Class applied to the native input element.
   * @defaultValue undefined
   */
  input?: string;
  /**
   * Class applied to the input container (border/wrapper).
   * @defaultValue undefined
   */
  inputContainer?: string;
  /**
   * Class applied to the label element.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Class applied to the start adornment element.
   * @defaultValue undefined
   */
  startAdornment?: string;
  /**
   * Class applied to the toggle button (e.g., show password).
   * @defaultValue undefined
   */
  toggleButton?: string;
}

/**
 * Text color variants for the input element.
 * Allowed values:
 * - 'black': Standard black text
 * - 'inverse': Inverted color for dark backgrounds
 * - 'primary': Primary theme color
 * - 'white': White text for dark backgrounds
 */
type TextInputColor = 'black' | 'inverse' | 'primary' | 'white';

/**
 * Size presets for the input.
 * Allowed values:
 * - 'sm': Small size with reduced padding and font size
 * - 'md': Medium size (default) with balanced padding and font size
 * - 'lg': Large size with increased padding and font size for better readability
 */
type TextInputSize = 'sm' | 'md' | 'lg';

/**
 * Visual status variants used for border/helper coloring.
 * Allowed values: 'success', 'warning', 'error'
 */
type TextInputStatus = 'success' | 'warning' | 'error';

/**
 * Supported input `type` values for this component.
 * This excludes non-textual types; the component supports common textual
 * types such as 'text', 'email', 'tel', 'url', 'number', 'password', 'search', etc.
 */
type TextInputType = Exclude<
  JSX.IntrinsicElements['input']['type'],
  'button' | 'checkbox' | 'date' | 'datetime-local' | 'month' | 'radio' | 'range' | 'time' | 'week'
>;

/**
 * Props for `TextInput`.
 *
 * Use this interface for single-line text entry with controlled or uncontrolled
 * value handling, custom validation patterns, helper text, adornments, clear
 * actions, and text-oriented native input attributes.
 *
 * @property ['aria-describedby'] - ID of the element that describes this input.
 * @property ['aria-label'] - Accessible label for the input.
 * @property ['aria-invalid'] - Whether the input is in an invalid state.
 * @property [adornmentColor] - Color theme used for adornments and small text.
 * @property [autoComplete] - Native autocomplete behavior.
 * @property [autoFocus] - Whether the input receives focus on mount.
 * @property [classes] - Class name hooks for input sub-elements.
 * @property [clearable] - Shows a clear button inside the input.
 * @property [color] - Text color variant for the input.
 * @property [defaultValue] - Initial uncontrolled value.
 * @property [disabled] - Disables the input.
 * @property [endAdornment] - Adornment rendered at the end of the input.
 * @property [error] - Controlled external error state.
 * @property [fullWidth] - Expands the input to fill its parent.
 * @property [helperText] - Helper or error text displayed below the input.
 * @property [id] - ID attribute for the input element.
 * @property [inputMode] - Native input mode hint for virtual keyboards.
 * @property [label] - Visible label text for the input.
 * @property [maxLength] - Maximum allowed value length.
 * @property [minLength] - Minimum required value length.
 * @property [name] - Name attribute for form submission.
 * @property [pattern] - RegExp validation pattern applied client-side.
 * @property [placeholder] - Placeholder text shown when empty.
 * @property [readOnly] - Renders the input as read-only.
 * @property [ref] - Ref forwarded to the native input element.
 * @property [required] - Whether the field is required.
 * @property [showPasswordToggle] - Shows a password visibility toggle for password inputs.
 * @property [size] - Size token controlling the input dimensions.
 * @property [status] - Visual status used to style border and helper text.
 * @property [spellCheck] - Whether spell checking is enabled.
 * @property [startAdornment] - Adornment rendered at the start of the input.
 * @property [type] - Text-oriented native input type.
 * @property [onChange] - Change event handler.
 * @property [onClear] - Clear button click handler.
 * @property [onError] - Callback invoked when the error state changes.
 * @property [onInput] - Low-level input event handler.
 * @property [onBlur] - Blur event handler.
 * @property [onFocus] - Focus event handler.
 * @property [onKeyDown] - Key down event handler.
 * @property [onKeyUp] - Key up event handler.
 * @property [onMouseDown] - Mouse down handler for the input element.
 * @property [value] - Controlled value for the input.
 */
interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'pattern' | 'onError'
> {
  /**
   * ID of the element that describes this input (helper or error message).
   * @defaultValue undefined
   */
  'aria-describedby'?: string;
  /**
   * Accessible label for the input when a visible label is not present.
   * @defaultValue undefined
   */
  'aria-label'?: string;
  /**
   * Indicates the input has a validation error (true/false).
   * @defaultValue undefined
   */
  'aria-invalid'?: boolean;
  /**
   * Color theme to use for adornments and small text.
   * @defaultValue undefined
   */
  adornmentColor?: TextInputAdornmentColor;
  /**
   * Native `autocomplete` value (e.g., 'on', 'off', 'email').
   * @defaultValue false
   */
  autoComplete?: string;
  /**
   * Autofocus the input on mount.
   * @defaultValue false
   */
  autoFocus?: boolean;
  /**
   * Class overrides for component sub-elements.
   * @defaultValue {}
   */
  classes?: TextInputClasses;
  /**
   * Show a clear button inside the input.
   * @defaultValue false
   */
  clearable?: boolean;
  /**
   * Text color variant for the input.
   * @defaultValue 'black'
   */
  color?: TextInputColor;
  /**
   * Default (uncontrolled) value for the input.
   * @defaultValue undefined
   */
  defaultValue?: string;
  /**
   * Disable the input.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Adornment to render at the end of the input.
   * @defaultValue undefined
   */
  endAdornment?: TextInputAdornment;
  /**
   * External error state (controlled).
   * @defaultValue undefined
   */
  error?: boolean;
  /**
   * When true, input expands to fill available width.
   * @defaultValue false
   */
  fullWidth?: boolean;
  /**
   * Helper or error text displayed below the input.
   * @defaultValue undefined
   */
  helperText?: string;
  /**
   * Element id attribute.
   * @defaultValue undefined
   */
  id?: string;
  /**
   * Native `inputmode` value hinting the type of virtual keyboard.
   * @defaultValue undefined
   */
  inputMode?: JSX.IntrinsicElements['input']['inputMode'];
  /**
   * Visible label text for the input.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Maximum allowed length of the input value.
   * @defaultValue undefined
   */
  maxLength?: number;
  /**
   * Minimum allowed length of the input value.
   * @defaultValue undefined
   */
  minLength?: number;
  /**
   * Name attribute for form submission.
   * @defaultValue undefined
   */
  name?: string;
  /**
   * Validation pattern (RegExp) applied client-side.
   * @defaultValue undefined
   */
  pattern?: RegExp;
  /**
   * Placeholder text shown when the input is empty.
   * @defaultValue undefined
   */
  placeholder?: string;
  /**
   * Make the input read-only.
   * @defaultValue false
   */
  readOnly?: boolean;
  /**
   * Forwarded ref to the native input element.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLInputElement>;
  /**
   * Whether the input is required.
   * @defaultValue false
   */
  required?: boolean;
  /**
   * Show a toggle for password visibility when `type='password'`.
   * @defaultValue true
   */
  showPasswordToggle?: boolean;
  /**
   * Size variant of the input.
   * @defaultValue 'md'
   */
  size?: TextInputSize;
  /**
   * Visual status for styling (affects border/helper color).
   * @defaultValue undefined
   */
  status?: TextInputStatus;
  /**
   * Enable browser spell checking.
   * @defaultValue false
   */
  spellCheck?: boolean;
  /**
   * Adornment to render at the start of the input.
   * @defaultValue undefined
   */
  startAdornment?: TextInputAdornment;
  /**
   * Input `type` (textual types only).
   * @defaultValue 'text'
   */
  type?: TextInputType;
  /**
   * Change event handler.
   * @defaultValue undefined
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Clear button click handler. Receives the event and current error state.
   * @defaultValue undefined
   */
  onClear?: (event: MouseEvent<HTMLButtonElement>, error: boolean) => void;
  /**
   * Callback invoked when the error state changes.
   * @defaultValue undefined
   */
  onError?: (error: boolean) => void;
  /**
   * Low-level input event handler.
   * @defaultValue undefined
   */
  onInput?: (event: InputEvent<HTMLInputElement>) => void;
  /**
   * Blur event handler.
   * @defaultValue undefined
   */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Focus event handler.
   * @defaultValue undefined
   */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * Key down handler.
   * @defaultValue undefined
   */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Key up handler.
   * @defaultValue undefined
   */
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Key down handler for the input element.
   * @defaultValue undefined
   */
  onMouseDown?: (event: MouseEvent<HTMLInputElement>) => void;
  /**
   * Controlled value for the input.
   * @defaultValue undefined
   */
  value?: string;
}

/**
 * Render a start/end adornment for the input.
 *
 * Accepts either a FontAwesome `IconDefinition` or an image object
 * (`{ src, alt? }`). Chooses `FontAwesomeIcon` when the adornment
 * contains icon data, otherwise renders a `next/image` element.
 *
 * @param adornment - The adornment to render (icon or image).
 * @param color - Color theme for the adornment. Defaults to `'white'`.
 * @param className - Optional className to merge with internal classes.
 * @returns JSX element for the provided adornment.
 */
const renderAdornment = (
  adornment: TextInputAdornment,
  color: TextInputAdornmentColor = 'white',
  className?: string
) => {
  const iconClasses = classNames(
    'au:text-base',
    {
      'au:text-white': color === 'white',
      'au:text-black': color === 'black',
      'au:text-primary': color === 'primary',
      'au:text-secondary': color === 'secondary',
      'au:text-accent': color === 'accent',
      'au:text-subtle': color === 'subtle',
    },
    className
  );

  const imageClasses = classNames(
    'au:object-contain au:animate-fade-in au:duration-500',
    className
  );

  if ('iconName' in adornment) {
    return <FontAwesomeIcon icon={adornment} className={iconClasses} />;
  } else {
    return (
      <img
        src={adornment.src || ''}
        alt={adornment.alt || ''}
        width={16}
        height={16}
        className={imageClasses}
      />
    );
  }
};

/**
 * `TextInput` - a fully featured, accessible text input component.
 *
 * Features:
 * - Optional `label`, `helperText`, and required marker
 * - Start / end adornments (icons or images)
 * - Optional clear button (`clearable`) and password visibility toggle
 * - Controlled or uncontrolled usage via `value` / `defaultValue` and `useControlled`
 * - Visual `status` variants (`success` | `warning` | `error`) and per-prop `adornmentColor`
 *
 * Accessibility:
 * - Supports `aria-describedby`, `aria-label`, and `aria-invalid` props
 * - Uses `type='password'` toggle with accessible labels on toggle button
 * - Leaves focus styling to `:focus-visible` (keyboard focus) and exposes classes via `classes` prop
 *
 * @param props - Props for the `TextInput` component, extending native input attributes with additional features.
 * @returns JSX element representing the `TextInput` component.
 * @example
 * ```tsx
 * import { TextInput } from '@arctura/atomics';
 *
 * export function UsernameField() {
 *   return (
 *     <TextInput
 *       label="Username"
 *       placeholder="Enter your username"
 *       helperText="Use 4 to 16 letters or numbers"
 *       required
 *       pattern={/^[a-zA-Z0-9]{4,16}$/}
 *       onError={(error) => console.log('Validation error:', error)}
 *     />
 *   );
 * }
 * ```
 */
const TextInput: FC<TextInputProps> = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  autoComplete = false,
  adornmentColor,
  autoFocus = false,
  classes = {},
  clearable = false,
  color = 'black',
  defaultValue,
  disabled = false,
  endAdornment,
  error: errorProp,
  fullWidth = false,
  helperText,
  id,
  inputMode,
  label,
  maxLength,
  minLength,
  name,
  pattern,
  placeholder,
  readOnly = false,
  ref,
  required = false,
  showPasswordToggle = true,
  status,
  size = 'md',
  spellCheck = false,
  startAdornment,
  type: typeProp = 'text',
  onChange,
  onClear,
  onError,
  onInput,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onMouseDown,
  value: valueProp,
  ...rest
}) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useControlled<boolean>({
    defaultValue: false,
    value: errorProp,
  });
  const [value, setValue] = useControlled<string>({
    defaultValue,
    value: valueProp,
  });

  const containerClasses = twMerge(
    classNames(
      'au:flex au:flex-col au:gap-2 au:relative au:bg-inherit au:pt-0.5 au:pb-3 au:h-full',
      {
        'au:w-full': fullWidth,
      }
    ),
    classes?.container
  );

  const clearButtonClasses = classNames(
    {
      'au:text-accent': adornmentColor === 'accent',
      'au:text-black': adornmentColor === 'black',
      'au:text-inverse': adornmentColor === 'inverse',
      'au:text-primary': adornmentColor === 'primary',
      'au:text-secondary': adornmentColor === 'secondary',
      'au:text-subtle': adornmentColor === 'subtle',
      'au:text-white': adornmentColor === 'white',
      'au:shrink-0': fullWidth,
    },
    classes?.clearButton
  );

  const helperClasses = twMerge(
    classNames('au:font-body au:text-sm', {
      'au:text-accent': adornmentColor === 'accent' && !status && !error,
      'au:text-black': adornmentColor === 'black' && !status && !error,
      'au:text-inverse': adornmentColor === 'inverse' && !status && !error,
      'au:text-primary': adornmentColor === 'primary' && !status && !error,
      'au:text-secondary': adornmentColor === 'secondary' && !status && !error,
      'au:text-subtle': adornmentColor === 'subtle' && !status && !error,
      'au:text-white': adornmentColor === 'white' && !status && !error,
      'au:text-success': status === 'success' && !error,
      'au:text-warning': status === 'warning' && !error,
      'au:text-danger': status === 'error' || error,
    }),
    classes?.helper
  );

  const inputClasses = twMerge(
    classNames('au:focus-visible:outline-0 au:caret-accent', {
      'au:text-black': color === 'black',
      'au:text-inverse': color === 'inverse',
      'au:text-primary': color === 'primary',
      'au:text-white': color === 'white',
      'au:w-12': size === 'sm' && !fullWidth,
      'au:w-32': size === 'md' && !fullWidth,
      'au:w-52': size === 'lg' && !fullWidth,
      'au:grow': fullWidth,
    }),
    classes?.input
  );

  const inputContainerClasses = twMerge(
    classNames(
      'au:flex au:h-full au:items-center au:border-solid au:gap-2 au:border-1 au:rounded-md au:px-3 au:py-2 au:hover:border-accent',
      {
        'au:border-danger': error || status === 'error',
        'au:border-warning': status === 'warning',
        'au:border-success': status === 'success',
        'au:border-primary': !error && !status,
        'au:w-full': fullWidth,
        'au:has-[input:focus]:outline-1 au:has-[input:focus]:outline-primary au:has-[input:focus]:outline-offset-4':
          !clicked && value === '',
      }
    ),
    classes?.inputContainer
  );

  const labelClasses = twMerge(
    classNames('au:font-body au:text-sm', {
      'au:text-accent': adornmentColor === 'accent' && !status && !error,
      'au:text-black': adornmentColor === 'black' && !status && !error,
      'au:text-inverse': adornmentColor === 'inverse' && !status && !error,
      'au:text-primary': adornmentColor === 'primary' && !status && !error,
      'au:text-secondary': adornmentColor === 'secondary' && !status && !error,
      'au:text-subtle': adornmentColor === 'subtle' && !status && !error,
      'au:text-white': adornmentColor === 'white' && !status && !error,
      'au:text-success': status === 'success' && !error,
      'au:text-warning': status === 'warning' && !error,
      'au:text-danger': status === 'error' || error,
    }),
    classes?.label
  );

  const toggleButtonClasses = classNames(
    {
      'au:text-accent': adornmentColor === 'accent',
      'au:text-black': adornmentColor === 'black',
      'au:text-inverse': adornmentColor === 'inverse',
      'au:text-primary': adornmentColor === 'primary',
      'au:text-secondary': adornmentColor === 'secondary',
      'au:text-subtle': adornmentColor === 'subtle',
      'au:text-white': adornmentColor === 'white',
      'au:shrink-0': fullWidth,
    },
    classes?.toggleButton
  );

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setClicked(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (pattern) {
      const isValid = pattern.test(event.target.value);
      if (onError) {
        onError(!isValid);
      } else {
        setError(!isValid);
      }
    }

    if (onChange) {
      onChange(event);
    } else {
      setValue(event.target.value);
    }
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    setValue('');
    if (onClear) {
      onClear(event, false);
    } else {
      setError(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const isEscape = event.key === 'Escape' || event.key === 'Esc' || event.code === 'Escape';

    if (isEscape) {
      setClicked(false);
      if (onKeyDown) {
        onKeyDown(event);
      } else {
        setValue('');
      }
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLInputElement>) => {
    setClicked(true);
    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const isErrorWithoutPattern = status === 'error' && !pattern;

    if (status !== 'error' && pattern) return;

    if (onError) {
      if (isErrorWithoutPattern) onError(error !== isErrorWithoutPattern);
    } else {
      if (isErrorWithoutPattern) setError(error !== isErrorWithoutPattern);
    }
  }, [pattern, status, onError, setError, error]);

  const type = typeProp === 'password' && showPassword ? 'text' : typeProp;

  return (
    <div className={containerClasses}>
      <div className="au:absolute au:-top-0.75 au:bg-inherit au:left-3.5 au:animate-slide-in-top">
        {label && (
          <p className={labelClasses}>
            {label}
            {required && <span className="au:text-danger"> *</span>}
          </p>
        )}
      </div>
      <div className={inputContainerClasses}>
        {clearable && (
          <IconButton
            aria-label="Clear input"
            classes={{ iconButton: clearButtonClasses }}
            onClick={handleClear}
            type="button"
          >
            {faXmark}
          </IconButton>
        )}
        {startAdornment && renderAdornment(startAdornment, adornmentColor, classes?.startAdornment)}
        <input
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid}
          autoComplete={autoComplete ? 'on' : 'off'}
          autoFocus={autoFocus}
          className={inputClasses}
          disabled={disabled}
          id={id}
          inputMode={inputMode}
          maxLength={maxLength}
          minLength={minLength}
          name={name}
          onChange={handleChange}
          onInput={onInput}
          onBlur={handleBlur}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          onKeyUp={onKeyUp}
          onMouseDown={handleMouseDown}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={ref}
          required={required}
          spellCheck={spellCheck}
          type={type}
          value={value ?? ''}
          {...rest}
        />
        {typeProp !== 'password' &&
          endAdornment &&
          renderAdornment(endAdornment, adornmentColor, classes?.endAdornment)}
        {typeProp === 'password' && showPasswordToggle && (
          <IconButton
            aria-label="Toggle password visibility"
            classes={{ iconButton: toggleButtonClasses }}
            onClick={handlePasswordToggle}
            type="button"
          >
            {showPassword ? faEyeSlash : faEye}
          </IconButton>
        )}
      </div>
      <div className="au:absolute au:bottom-0 au:left-3.5 au:bg-inherit au:animate-slide-in-bottom">
        {helperText && (
          <p className={helperClasses}>
            {helperText}
            {required && <span className="au:text-danger"> *</span>}
          </p>
        )}
      </div>
    </div>
  );
};

TextInput.displayName = 'TextInput';

export { TextInput };
export type {
  TextInputAdornment,
  TextInputAdornmentColor,
  TextInputClasses,
  TextInputColor,
  TextInputProps,
  TextInputSize,
  TextInputStatus,
  TextInputType,
};
