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
import { IconButton } from '@/src/buttons';
import { useControlled } from '@/lib';

/**
 * Adornment for `TextInput` — either a FontAwesome `IconDefinition`
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
 */
interface TextInputClasses {
  /** Root container for the component. */
  container?: string;
  /** Class applied to the clear button/icon. */
  clearButton?: string;
  /** Class applied to the end adornment element. */
  endAdornment?: string;
  /** Class applied to the helper text element. */
  helper?: string;
  /** Class applied to the native input element. */
  input?: string;
  /** Class applied to the input container (border/wrapper). */
  inputContainer?: string;
  /** Class applied to the label element. */
  label?: string;
  /** Class applied to the start adornment element. */
  startAdornment?: string;
  /** Class applied to the toggle button (e.g., show password). */
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
 * Extends native input attributes (omitting component-controlled `size`, `pattern`, `onError`).
 */
interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'pattern' | 'onError'
> {
  /** ID of the element that describes this input (helper or error message). */
  'aria-describedby'?: string;
  /** Accessible label for the input when a visible label is not present. */
  'aria-label'?: string;
  /** Indicates the input has a validation error (true/false). */
  'aria-invalid'?: boolean;
  /** Color theme to use for adornments and small text. */
  adornmentColor?: TextInputAdornmentColor;
  /** Native `autocomplete` value (e.g., 'on', 'off', 'email'). */
  autoComplete?: string;
  /** Autofocus the input on mount. */
  autoFocus?: boolean;
  /** Class overrides for component sub-elements. */
  classes?: TextInputClasses;
  /** Show a clear button inside the input. */
  clearable?: boolean;
  /** Text color variant for the input. */
  color?: TextInputColor;
  /** Default (uncontrolled) value for the input. */
  defaultValue?: string;
  /** Disable the input. */
  disabled?: boolean;
  /** Adornment to render at the end of the input. */
  endAdornment?: TextInputAdornment;
  /** External error state (controlled). */
  error?: boolean;
  /** When true, input expands to fill available width. */
  fullWidth?: boolean;
  /** Helper or error text displayed below the input. */
  helperText?: string;
  /** Element id attribute. */
  id?: string;
  /** Native `inputmode` value hinting the type of virtual keyboard. */
  inputMode?: JSX.IntrinsicElements['input']['inputMode'];
  /** Visible label text for the input. */
  label?: string;
  /** Maximum allowed length of the input value. */
  maxLength?: number;
  /** Minimum allowed length of the input value. */
  minLength?: number;
  /** Name attribute for form submission. */
  name?: string;
  /** Validation pattern (RegExp) applied client-side. */
  pattern?: RegExp;
  /** Placeholder text shown when the input is empty. */
  placeholder?: string;
  /** Make the input read-only. */
  readOnly?: boolean;
  /** Forwarded ref to the native input element. */
  ref?: Ref<HTMLInputElement>;
  /** Whether the input is required. */
  required?: boolean;
  /** Show a toggle for password visibility when `type='password'`. */
  showPasswordToggle?: boolean;
  /** Size variant of the input. */
  size?: TextInputSize;
  /** Visual status for styling (affects border/helper color). */
  status?: TextInputStatus;
  /** Enable browser spell checking. */
  spellCheck?: boolean;
  /** Adornment to render at the start of the input. */
  startAdornment?: TextInputAdornment;
  /** Input `type` (textual types only). */
  type?: TextInputType;
  /** Change event handler. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Clear button click handler. Receives the event and current error state. */
  onClear?: (event: MouseEvent<HTMLButtonElement>, error: boolean) => void;
  /** Callback invoked when the error state changes. */
  onError?: (error: boolean) => void;
  /** Low-level input event handler. */
  onInput?: (event: InputEvent<HTMLInputElement>) => void;
  /** Blur event handler. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Focus event handler. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Key down handler. */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /** Key up handler. */
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /** Key down handler for the input element. */
  onMouseDown?: (event: MouseEvent<HTMLInputElement>) => void;
  /** Controlled value for the input. */
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
    'mg:text-base',
    {
      'mg:text-white': color === 'white',
      'mg:text-black': color === 'black',
      'mg:text-primary': color === 'primary',
      'mg:text-secondary': color === 'secondary',
      'mg:text-accent': color === 'accent',
      'mg:text-subtle': color === 'subtle',
    },
    className
  );

  const imageClasses = classNames(
    'mg:object-contain mg:animate-fade-in mg:duration-500',
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
 * `TextInput` — a fully featured, accessible text input component.
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
 * import { TextInput } from '@/src';
 *
 * const MyTextInput = () => (
 *  <TextInput
 *    label="Username"
 *    placeholder="Enter your username"
 *    helperText="Must be 4-16 characters"
 *    required
 *    pattern={/^[a-zA-Z0-9]{4,16}$/}
 *    onError={(error) => console.log('Validation error:', error)}
 *  />
 * );
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
      'mg:flex mg:flex-col mg:gap-2 mg:relative mg:bg-inherit mg:pt-0.5 mg:pb-3 mg:h-full',
      {
        'mg:w-full': fullWidth,
      }
    ),
    classes?.container
  );

  const clearButtonClasses = classNames(
    {
      'mg:text-accent': adornmentColor === 'accent',
      'mg:text-black': adornmentColor === 'black',
      'mg:text-inverse': adornmentColor === 'inverse',
      'mg:text-primary': adornmentColor === 'primary',
      'mg:text-secondary': adornmentColor === 'secondary',
      'mg:text-subtle': adornmentColor === 'subtle',
      'mg:text-white': adornmentColor === 'white',
      'mg:shrink-0': fullWidth,
    },
    classes?.clearButton
  );

  const helperClasses = twMerge(
    classNames('mg:font-body mg:text-sm', {
      'mg:text-accent': adornmentColor === 'accent' && !status && !error,
      'mg:text-black': adornmentColor === 'black' && !status && !error,
      'mg:text-inverse': adornmentColor === 'inverse' && !status && !error,
      'mg:text-primary': adornmentColor === 'primary' && !status && !error,
      'mg:text-secondary': adornmentColor === 'secondary' && !status && !error,
      'mg:text-subtle': adornmentColor === 'subtle' && !status && !error,
      'mg:text-white': adornmentColor === 'white' && !status && !error,
      'mg:text-success': status === 'success' && !error,
      'mg:text-warning': status === 'warning' && !error,
      'mg:text-danger': status === 'error' || error,
    }),
    classes?.helper
  );

  const inputClasses = twMerge(
    classNames('mg:focus-visible:outline-0 mg:caret-white', {
      'mg:text-black': color === 'black',
      'mg:text-inverse': color === 'inverse',
      'mg:text-primary': color === 'primary',
      'mg:text-white': color === 'white',
      'mg:w-12': size === 'sm' && !fullWidth,
      'mg:w-32': size === 'md' && !fullWidth,
      'mg:w-52': size === 'lg' && !fullWidth,
      'mg:grow': fullWidth,
    }),
    classes?.input
  );

  const inputContainerClasses = twMerge(
    classNames(
      'mg:flex mg:h-full mg:items-center mg:border-solid mg:gap-2 mg:border-1 mg:rounded-md mg:px-3 mg:py-2 mg:hover:border-accent',
      {
        'mg:border-danger': error || status === 'error',
        'mg:border-warning': status === 'warning',
        'mg:border-success': status === 'success',
        'mg:border-primary': !error && !status,
        'mg:w-full': fullWidth,
        'mg:has-[input:focus]:outline-1 mg:has-[input:focus]:outline-primary mg:has-[input:focus]:outline-offset-4':
          !clicked && value === '',
      }
    ),
    classes?.inputContainer
  );

  const labelClasses = twMerge(
    classNames('mg:font-body mg:text-sm', {
      'mg:text-accent': adornmentColor === 'accent' && !status && !error,
      'mg:text-black': adornmentColor === 'black' && !status && !error,
      'mg:text-inverse': adornmentColor === 'inverse' && !status && !error,
      'mg:text-primary': adornmentColor === 'primary' && !status && !error,
      'mg:text-secondary': adornmentColor === 'secondary' && !status && !error,
      'mg:text-subtle': adornmentColor === 'subtle' && !status && !error,
      'mg:text-white': adornmentColor === 'white' && !status && !error,
      'mg:text-success': status === 'success' && !error,
      'mg:text-warning': status === 'warning' && !error,
      'mg:text-danger': status === 'error' || error,
    }),
    classes?.label
  );

  const toggleButtonClasses = classNames(
    {
      'mg:text-accent': adornmentColor === 'accent',
      'mg:text-black': adornmentColor === 'black',
      'mg:text-inverse': adornmentColor === 'inverse',
      'mg:text-primary': adornmentColor === 'primary',
      'mg:text-secondary': adornmentColor === 'secondary',
      'mg:text-subtle': adornmentColor === 'subtle',
      'mg:text-white': adornmentColor === 'white',
      'mg:shrink-0': fullWidth,
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
      <div className="mg:absolute mg:-top-0.75 mg:bg-inherit mg:left-3.5 mg:animate-slide-in-top">
        {label && (
          <p className={labelClasses}>
            {label}
            {required && <span className="mg:text-danger"> *</span>}
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
      <div className="mg:absolute mg:bottom-0 mg:left-3.5 mg:bg-inherit mg:animate-slide-in-bottom">
        {helperText && (
          <p className={helperClasses}>
            {helperText}
            {required && <span className="mg:text-danger"> *</span>}
          </p>
        )}
      </div>
    </div>
  );
};

TextInput.displayName = 'TextInput';

export { TextInput };
