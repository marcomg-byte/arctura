'use client';
import type {
  ChangeEvent,
  FC,
  FocusEvent,
  InputEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import { useState } from 'react';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { Button, IconButton } from '../buttons';
import { useControlled } from '../../lib/hooks';
import { twMerge } from 'tailwind-merge';

/**
 * An adornment that can be rendered inside the `TextArea`.
 * It can be:
 * - custom React `children` (e.g. text or elements),
 * - an image specified by `src`/`alt`,
 * - or an icon (FontAwesome `IconDefinition`).
 * Each variant may include an optional `onClick` handler.
 */
type TextAreaAdornment =
  | { children: ReactNode; onClick?: (event: MouseEvent) => void }
  | { alt?: string; src: string; onClick?: (event: MouseEvent) => void }
  | { icon: IconDefinition; onClick?: (event: MouseEvent) => void };

/**
 * Colors available for adornments and label text.
 *
 * Allowed values:
 * - 'accent': Accent color from the theme.
 * - 'black': Standard black color.
 * - 'inverse': Inverted color for dark backgrounds.
 * - 'primary': Primary theme color.
 * - 'secondary': Secondary theme color.
 * - 'subtle': Subtle color for less emphasis.
 * - 'white': White color for dark backgrounds.
 * Note: 'inverse' and 'white' are intended for use on dark backgrounds, while 'accent', 'black', 'primary', 'secondary', and 'subtle' are for light backgrounds.
 */
type TextAreaAdornmentColor =
  | 'accent'
  | 'black'
  | 'inverse'
  | 'primary'
  | 'secondary'
  | 'subtle'
  | 'white';

/**
 * Text color variants for the textarea content.
 *
 * Allowed values:
 * - 'black': Standard black text.
 * - 'inverse': Inverted color for dark backgrounds.
 * - 'primary': Primary theme color.
 * - 'white': White text for dark backgrounds.
 * Note: 'inverse' and 'white' are intended for use on dark backgrounds, while 'black' and 'primary' are for light backgrounds.
 */
type TextAreaColor = 'black' | 'inverse' | 'primary' | 'white';

/**
 * Size presets for the textarea: 'sm', 'md', or 'lg'.
 * These control the width and height of the textarea, unless `fullWidth` is true.
 * - sm: Small size.
 * - md: Medium size.
 * - lg: Large size.
 */
type TextAreaSize = 'sm' | 'md' | 'lg';

/**
 * Visual status states that affect border and label coloring.
 * - 'error': Indicates an error state, typically with red styling.
 * - 'success': Indicates a successful state, typically with green styling.
 * - 'warning': Indicates a warning state, typically with yellow/orange styling.
 */
type TextAreaStatus = 'error' | 'success' | 'warning';

/**
 * Optional CSS class overrides for `TextArea` sub-elements.
 * Provide any of these to customize styling or to merge with the default classes.
 * - `adornment`: class applied to each adornment element (icons/buttons).
 * - `adornmentContainer`: class applied to the wrapper that contains adornments.
 * - `container`: class applied to the root container of the component.
 * - `label`: class applied to the label element.
 * - `textarea`: class applied to the underlying `<textarea>` element.
 *
 * @property [adornment] - Class applied to each adornment element.
 * @property [adornmentContainer] - Class applied to the wrapper that contains adornments.
 * @property [container] - Class applied to the root container of the component.
 * @property [label] - Class applied to the label element.
 * @property [textarea] - Class applied to the underlying textarea element.
 */
interface TextAreaClasses {
  adornment?: string;
  adornmentContainer?: string;
  container?: string;
  label?: string;
  textarea?: string;
}

/**
 * Props for the `TextArea` component.
 *
 * Use this interface for multiline text entry with controlled or uncontrolled
 * value handling, optional adornments, clear interactions, validation states,
 * and native textarea attributes.
 *
 * @property ['aria-describedby'] - ID of the element that describes this textarea.
 * @property ['aria-label'] - Accessible label for the textarea.
 * @property ['aria-invalid'] - Whether the textarea is in an invalid state.
 * @property [adornmentColor] - Color used for adornments and label text.
 * @property [autoFocus] - Whether the textarea receives focus on mount.
 * @property [classes] - Class name hooks for textarea sub-elements.
 * @property [clearable] - Shows a clear button to reset the value.
 * @property [color] - Text color variant for the textarea content.
 * @property [cols] - Number of visible columns for the textarea.
 * @property [defaultValue] - Initial uncontrolled value.
 * @property [disabled] - Disables the textarea.
 * @property [endAdornments] - Adornments rendered at the end of the textarea.
 * @property [error] - Marks the textarea as showing an error state.
 * @property [fullWidth] - Expands the textarea to fill its parent.
 * @property [id] - ID attribute for the textarea.
 * @property [label] - Optional label displayed above the textarea.
 * @property [maxLength] - Maximum allowed value length.
 * @property [minLength] - Minimum required value length.
 * @property [name] - Name attribute for form submission.
 * @property [onChange] - Change handler for controlled usage.
 * @property [onClear] - Handler invoked when the clear button is clicked.
 * @property [onInput] - Input event handler.
 * @property [onBlur] - Blur event handler.
 * @property [onFocus] - Focus event handler.
 * @property [onKeyDown] - Key down event handler.
 * @property [onKeyUp] - Key up event handler.
 * @property [onMouseDown] - Mouse down handler on the textarea.
 * @property [placeholder] - Placeholder text shown when empty.
 * @property [readonly] - Renders the textarea as read-only.
 * @property [required] - Whether the field is required.
 * @property [rows] - Number of visible rows for the textarea.
 * @property [size] - Size preset controlling width and height.
 * @property [spellCheck] - Whether spell checking is enabled.
 * @property [startAdornments] - Adornments rendered at the start of the textarea.
 * @property [status] - Visual status used to style the control.
 * @property [value] - Controlled value for the textarea.
 *
 * @extends {Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'cols' | 'onError' | 'rows'>}
 */
interface TextAreaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'cols' | 'onError' | 'rows'
> {
  /**
   * ID of the element that describes this textarea (for `aria-describedby`).
   * @defaultValue undefined
   */
  'aria-describedby'?: string;
  /**
   * Accessible label for the textarea (for `aria-label`).
   * @defaultValue undefined
   */
  'aria-label'?: string;
  /**
   * Whether the textarea is in an invalid state (for `aria-invalid`).
   * @defaultValue undefined
   */
  'aria-invalid'?: boolean;
  /**
   * Color used for adornments and label text.
   * @defaultValue 'primary'
   */
  adornmentColor?: TextAreaAdornmentColor;
  /**
   * Whether the textarea should receive focus automatically on mount.
   * @defaultValue false
   */
  autoFocus?: boolean;
  /**
   * Override or extend CSS classes for internal sub-elements.
   * @defaultValue {}
   */
  classes?: TextAreaClasses;
  /**
   * Show a clear button to reset the textarea value.
   * @defaultValue false
   */
  clearable?: boolean;
  /**
   * Text color variant for the textarea content.
   * @defaultValue 'primary'
   */
  color?: TextAreaColor;
  /**
   * Number of columns (width) for the textarea.
   * @defaultValue undefined
   */
  cols?: number;
  /**
   * Initial uncontrolled value for the textarea.
   * @defaultValue undefined
   */
  defaultValue?: string;
  /**
   * Disable the textarea.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Adornments rendered at the end of the textarea (icons, images, or nodes).
   * @defaultValue []
   */
  endAdornments?: TextAreaAdornment[];
  /**
   * Mark the textarea as showing an error state.
   * @defaultValue false
   */
  error?: boolean;
  /**
   * Make the textarea take full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean;
  /**
   * The `id` attribute for the textarea.
   * @defaultValue undefined
   */
  id?: string;
  /**
   * Optional label text displayed above the textarea.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Maximum allowed length of the value.
   * @defaultValue undefined
   */
  maxLength?: number;
  /**
   * Minimum required length of the value.
   * @defaultValue undefined
   */
  minLength?: number;
  /**
   * The `name` attribute for form submission.
   * @defaultValue undefined
   */
  name?: string;
  /**
   * Change event handler for controlled usage.
   * @defaultValue undefined
   */
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * Handler invoked when the clear button is clicked.
   * @defaultValue undefined
   */
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Input event handler.
   * @defaultValue undefined
   */
  onInput?: (event: InputEvent<HTMLTextAreaElement>) => void;
  /**
   * Blur event handler.
   * @defaultValue undefined
   */
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * Focus event handler.
   * @defaultValue undefined
   */
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * Key down event handler.
   * @defaultValue undefined
   */
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  /**
   * Key up event handler.
   * @defaultValue undefined
   */
  onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  /**
   * Mouse down handler on the textarea element.
   * @defaultValue undefined
   */
  onMouseDown?: (event: MouseEvent<HTMLTextAreaElement>) => void;
  /**
   * Placeholder text shown when the textarea is empty.
   * @defaultValue undefined
   */
  placeholder?: string;
  /**
   * Render the textarea as read-only.
   * @defaultValue false
   */
  readonly?: boolean;
  /**
   * Whether the field is required.
   * @defaultValue false
   */
  required?: boolean;
  /**
   * Number of visible rows for the textarea.
   * @defaultValue undefined
   */
  rows?: number;
  /**
   * Size preset controlling width/height when not fullWidth.
   * @defaultValue 'md'
   */
  size?: TextAreaSize;
  /**
   * Whether spell checking is enabled.
   * @defaultValue true
   */
  spellCheck?: boolean;
  /**
   * Adornments rendered at the start of the textarea.
   * @defaultValue []
   */
  startAdornments?: TextAreaAdornment[];
  /**
   * Visual status (error, success, warning) to style the control.
   * @defaultValue undefined
   */
  status?: TextAreaStatus;
  /**
   * Controlled value for the textarea.
   * @defaultValue undefined
   */
  value?: string;
}

/**
 * Render a single adornment for the `TextArea`.
 *
 * Chooses the proper control based on the adornment shape:
 * - icon variant -> `IconButton` with the icon as child
 * - image variant -> `IconButton` with an `Image` child
 * - children variant -> `Button` with the provided `children`
 *
 * @param adornment - The adornment to render (icon, image, or children).
 * @param index - Index of the adornment used to build a stable `key`.
 * @param className - Optional className to apply to the rendered control.
 * @returns A React element suitable for rendering inside the adornment container.
 */
const renderAdornment = (adornment: TextAreaAdornment, index: number, className?: string) => {
  if (typeof adornment === 'object' && 'icon' in adornment) {
    return (
      <IconButton
        key={`adornment-${index + 1}`}
        classes={{ iconButton: className }}
        onClick={adornment?.onClick}
      >
        {adornment?.icon}
      </IconButton>
    );
  } else if (typeof adornment === 'object' && 'src' in adornment) {
    return (
      <IconButton
        key={`adornment-${index + 1}`}
        classes={{ iconButton: className }}
        onClick={adornment?.onClick}
      >
        <img src={adornment?.src || ''} alt={adornment?.alt || ''} />
      </IconButton>
    );
  } else {
    return (
      <Button
        key={`adornment-${index + 1}`}
        classes={{ button: 'au:py-1 au:px-1.5' }}
        variant="outline"
        onClick={adornment?.onClick}
      >
        {adornment?.children}
      </Button>
    );
  }
};

/**
 * `TextArea` - a controlled/uncontrolled textarea with optional adornments.
 *
 * Features:
 * - Supports `value` (controlled) or `defaultValue` (uncontrolled) handled via `useControlled`.
 * - `startAdornments` and `endAdornments` accept icons, images, or custom children.
 * - `clearable` renders a clear button that resets the value or calls `onClear`.
 * - Accepts `classes` to override internal element classNames and `adornmentColor`, `color`, `size`, `status` to adjust styling.
 * - Preserves native textarea attributes (placeholder, rows, spellCheck, keyboard handlers, etc.).
 *
 * Accessibility:
 * - Supports `aria-label`, `aria-describedby`, and `aria-invalid` props.
 *
 * @param props - `TextAreaProps` describing appearance, behavior, and event handlers.
 * @returns A JSX element rendering the styled textarea with optional adornments.
 * @example
 * ```tsx
 * import { TextArea } from '@arctura/atomics';
 * import { faComment } from '@fortawesome/free-solid-svg-icons';
 *
 * export function FeedbackField() {
 *   return (
 *     <TextArea
 *       label="Feedback"
 *       placeholder="Tell us what worked well"
 *       clearable
 *       fullWidth
 *       rows={5}
 *       startAdornments={[{ icon: faComment }]}
 *       onChange={(event) => console.log(event.target.value)}
 *     />
 *   );
 * }
 * ```
 */
const TextArea: FC<TextAreaProps> = ({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  adornmentColor = 'primary',
  autoFocus = false,
  classes = {},
  clearable = false,
  color = 'primary',
  cols,
  defaultValue,
  disabled = false,
  endAdornments = [],
  error = false,
  fullWidth = false,
  id,
  label,
  maxLength,
  minLength,
  name,
  onChange,
  onClear,
  onInput,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onMouseDown,
  placeholder,
  readonly = false,
  required = false,
  rows,
  size = 'md',
  spellCheck = true,
  startAdornments = [],
  status,
  value: valueProp,
}) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [value, setValue] = useControlled<string>({
    defaultValue,
    value: valueProp,
  });

  const containerClasses = twMerge(
    classNames(
      'au:relative au:bg-inherit au:flex au:flex-col au:p-2 au:border-solid au:border-1 au:rounded-lg',
      {
        'au:border-danger': status === 'error' || error,
        'au:border-success': status === 'success',
        'au:border-warning': status === 'warning',
        'au:border-primary': !status && !error,
        'au:w-full': fullWidth,
        'au:has-[textarea:focus-visible]:outline-1 au:has-[textarea:focus-visible]:outline-primary au:has-[textarea:focus-visible]:outline-offset-4':
          !clicked && value === '',
      }
    ),
    classes?.container
  );
  const adornmentClasses = classNames(
    'au:shrink-0',
    {
      'au:text-accent': adornmentColor === 'accent',
      'au:text-black': adornmentColor === 'black',
      'au:text-inverse': adornmentColor === 'inverse',
      'au:text-primary': adornmentColor === 'primary',
      'au:text-secondary': adornmentColor === 'secondary',
      'au:text-subtle': adornmentColor === 'subtle',
      'au:text-white': adornmentColor === 'white',
    },
    classes?.adornment
  );
  const adornmentContainerClasses = twMerge(
    'au:flex au:w-full au:gap-2 au:overflow-x-auto au:scrollbar-subtle au:p-1',
    classes?.adornmentContainer
  );
  const rightAdormentContainerClasses = classNames(
    adornmentContainerClasses,
    'au:flex-row-reverse'
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
  const textareaClasses = twMerge(
    classNames('au:focus-visible:outline-0 au:caret-accent', {
      'au:text-black': color === 'black',
      'au:text-inverse': color === 'inverse',
      'au:text-primary': color === 'primary',
      'au:text-white': color === 'white',
      'au:w-12': size === 'sm' && !fullWidth,
      'au:w-32': size === 'md' && !fullWidth,
      'au:w-52': size === 'lg' && !fullWidth,
      'au:w-full au:h-24': fullWidth,
    }),
    classes?.textarea
  );

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setClicked(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    } else {
      setValue(event.target.value);
    }
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClear) {
      onClear(event);
    } else {
      setValue('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleMouseDown = (event: MouseEvent<HTMLTextAreaElement>) => {
    setClicked(true);
    if (onMouseDown) {
      onMouseDown(event);
    }
  };

  return (
    <div className={containerClasses}>
      {label && (
        <div className="au:absolute au:bg-inherit au:-top-1.5 au:left-3.5 au:animate-slide-in-top">
          <p className={labelClasses}>
            {label}
            {required && <span className="au:text-danger"> *</span>}
          </p>
        </div>
      )}
      <div className="au:flex au:justify-between au:gap-2 au:pb-1">
        <div className={adornmentContainerClasses}>
          {clearable && (
            <IconButton
              aria-label="Clear input"
              classes={{ iconButton: adornmentClasses }}
              onClick={handleClear}
              type="button"
            >
              {faXmark}
            </IconButton>
          )}
          {startAdornments.map((adornment, index) =>
            renderAdornment(adornment, index, adornmentClasses)
          )}
        </div>
        <div className={rightAdormentContainerClasses}>
          {endAdornments.map((adornment, index) =>
            renderAdornment(adornment, index, adornmentClasses)
          )}
        </div>
      </div>
      <textarea
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        autoFocus={autoFocus}
        className={textareaClasses}
        cols={cols}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        minLength={minLength}
        name={name}
        onChange={handleChange}
        onInput={onInput}
        onBlur={handleBlur}
        onFocus={onFocus}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        readOnly={readonly}
        required={required}
        rows={rows}
        spellCheck={spellCheck}
        value={value}
      />
    </div>
  );
};

TextArea.displayName = 'TextArea';

export { TextArea };
export type {
  TextAreaAdornment,
  TextAreaAdornmentColor,
  TextAreaClasses,
  TextAreaColor,
  TextAreaProps,
  TextAreaSize,
  TextAreaStatus,
};
