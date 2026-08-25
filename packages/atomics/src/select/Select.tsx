'use client';
import type { FC, HTMLAttributes, MouseEvent, Ref } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useControlled } from '../../lib/hooks';
import { capitalize } from '../utils';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/**
 * Option data consumed by the Select component.
 *
 * @property value - Value used for selection state and form submission.
 * @property label - Visible label shown in the dropdown.
 * @property [icon] - Optional icon rendered alongside the label.
 */
interface Option {
  /**
   * Value used for selection state and form submission.
   * @defaultValue undefined
   */
  value: string;
  /**
   * Visible label shown in the dropdown.
   * @defaultValue undefined
   */
  label: string;
  /**
   * Optional icon rendered alongside the label.
   * @defaultValue undefined
   */
  icon?: IconDefinition;
}

/**
 * Optional class name hooks for the Select component internals.
 *
 * @property [container] - Class names applied to the outer container.
 * @property [icon] - Class names applied to the chevron icon.
 * @property [iconContainer] - Class names applied to the icon wrapper.
 * @property [label] - Class names applied to the label above the control.
 * @property [placeholder] - Class names applied to the placeholder value.
 * @property [option] - Class names applied to the option row and option icon.
 * @property [optionsContainer] - Class names applied to the dropdown list container.
 * @property [root] - Class names applied to the root wrapper.
 */
interface SelectClasses {
  /**
   * Class names applied to the outer container.
   * @defaultValue undefined
   */
  container?: string;
  /**
   * Class names applied to the chevron icon.
   * @defaultValue undefined
   */
  icon?: string;
  /**
   * Class names applied to the icon wrapper.
   * @defaultValue undefined
   */
  iconContainer?: string;
  /**
   * Class names applied to the label above the control.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Class names applied to the placeholder value.
   * @defaultValue undefined
   */
  placeholder?: string;
  /**
   * Class names applied to the option row and option icon.
   * @defaultValue undefined
   */
  option?: { root?: string; icon?: string };
  /**
   * Class names applied to the dropdown list container.
   * @defaultValue undefined
   */
  optionsContainer?: string;
  /**
   * Class names applied to the root wrapper.
   * @defaultValue undefined
   */
  root?: string;
}

/**
 * Props for the Select component.
 *
 * Use this interface to configure an accessible themed dropdown with
 * controlled or uncontrolled selection, optional icons in options, hidden
 * input integration, sizing, and class name hooks.
 *
 * @property [classes] - Class name hooks for internal elements.
 * @property [defaultValue] - Initial selected value for uncontrolled usage.
 * @property [disabled] - Disables the select.
 * @property [fullWidth] - Expands the select to fill its parent.
 * @property [label] - Label rendered above the select trigger.
 * @property [name] - Name applied to the hidden input for forms.
 * @property [onChange] - Callback fired when an option is selected.
 * @property [options] - Options displayed in the dropdown.
 * @property [placeholder] - Text shown when no selection is active.
 * @property [ref] - Ref forwarded to the root wrapper.
 * @property [size] - Size token controlling trigger dimensions.
 * @property [tabIndex] - Keyboard tab index for trigger and options.
 * @property [variant] - Visual treatment for the dropdown.
 * @property [value] - Controlled selected value.
 */
interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'className'> {
  /**
   * Class name hooks for the internal elements.
   * @defaultValue {}
   */
  classes?: SelectClasses;
  /**
   * Initial value used when the component is uncontrolled.
   * @defaultValue undefined
   */
  defaultValue?: string;
  /**
   * Whether the select is disabled.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Expands the select control to fill the width of its parent container.
   * @defaultValue false
   */
  fullWidth?: boolean;
  /**
   * Label rendered above the select trigger.
   * @defaultValue undefined
   */
  label?: string;
  /**
   * Name applied to the hidden input for form integration.
   * @defaultValue undefined
   */
  name?: string;
  /**
   * Callback fired when an option is selected.
   * @defaultValue undefined
   */
  onChange?: (event: MouseEvent<HTMLLIElement>) => void;
  /**
   * Available options to display in the dropdown.
   * @defaultValue []
   */
  options?: Option[];
  /**
   * Placeholder shown when no selection is active.
   * @defaultValue undefined
   */
  placeholder?: string;
  /**
   * Ref forwarded to the root wrapper.
   * @defaultValue undefined
   */
  ref?: Ref<HTMLDivElement>;
  /**
   * Size token controlling the select trigger width and height.
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Keyboard tab index for the select trigger and options.
   * @defaultValue 0
   */
  tabIndex?: number;
  /**
   * Visual treatment for the dropdown.
   * @defaultValue 'outline'
   */
  variant?: 'outline' | 'filled';
  /**
   * Controlled selected value.
   * @defaultValue undefined
   */
  value?: string;
}

/**
 * Select dropdown component.
 *
 * Renders a styled dropdown menu for selecting an option from a list.
 * Supports both controlled and uncontrolled usage, keyboard navigation, and optional icons for options.
 *
 * - Controlled: Provide `value` and `onChange` props to manage selection state externally.
 * - Uncontrolled: Provide `defaultValue` for initial selection and let the component manage state internally.
 *
 * @param {SelectProps} props - The props for the Select component.
 * @returns {JSX.Element} The rendered select dropdown.
 *
 * @example
 * ```tsx
 * import { Select } from '@arctura/atomics';
 * import { faLayerGroup, faTableCells } from '@fortawesome/free-solid-svg-icons';
 *
 * export function ViewModeSelect() {
 *   return (
 *     <Select
 *       label="View"
 *       name="view"
 *       options={[
 *         { value: 'cards', label: 'Cards', icon: faLayerGroup },
 *         { value: 'table', label: 'Table', icon: faTableCells },
 *       ]}
 *       placeholder="Choose a layout"
 *     />
 *   );
 * }
 * ```
 *
 * @see Option
 * @see SelectProps
 */
const Select: FC<SelectProps> = ({
  classes = {},
  defaultValue,
  disabled = false,
  fullWidth = false,
  label,
  name,
  onChange,
  options = [],
  placeholder,
  ref,
  size = 'md',
  tabIndex = 0,
  value,
  variant = 'outline',
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useControlled<Option>({
    defaultValue: defaultValue
      ? { value: defaultValue, label: capitalize(defaultValue) }
      : undefined,
    value: value ? { value: value, label: capitalize(value) } : undefined,
  });

  const containerClasses = twMerge(
    classNames(
      'au:relative au:flex au:justify-start au:items-center au:gap-1 au:rounded-sm au:w-full',
      {
        'au:border-1 au:border-solid au:border-primary au:hover:border-hover':
          variant === 'outline',
        'au:bg-primary': variant === 'filled',
        'au:cursor-not-allowed au:opacity-50': disabled,
        'au:hover:cursor-pointer': !disabled,
        'au:min-h-[32px]': size === 'sm',
        'au:min-h-[40px]': size === 'md',
        'au:min-h-[48px]': size === 'lg',
      }
    ),
    classes?.container
  );

  const labelClasses = twMerge('au:text-xs au:sm:text-sm au:lg:text-lg', classes?.label);

  const placeholderClasses = twMerge(
    'au:relative au:flex au:justify-start au:items-center au:gap-1 au:p-1 au:text-xs au:w-full',
    classes?.placeholder
  );

  const optionsContainerClasses = twMerge(
    classNames(
      'au:absolute au:top-full au:left-0 au:mt-1 au:flex au:flex-col au:justify-start au:items-center au:w-full',
      {
        'au:border-solid au:border-1 au:border-primary au:rounded-sm au:bg-secondary':
          variant === 'outline',
        'au:w-12': size === 'sm' && !fullWidth,
        'au:w-32': size === 'md' && !fullWidth,
        'au:w-52': size === 'lg' && !fullWidth,
        'au:grow': fullWidth,
      }
    ),
    classes?.optionsContainer
  );

  const optionClasses = twMerge(
    classNames(
      'au:flex au:justify-between au:items-center au:px-1.5 au:py-1 au:w-full au:text-xs',
      {
        'au:hover:text-accent': variant === 'outline',
      }
    ),
    classes?.option?.root
  );

  const optionIconClasses = twMerge(
    'au:text-sm au:sm:text-sm au:lg:text-lg',
    classes?.option?.icon
  );

  const rootClasses = twMerge(
    classNames(
      'au:inline-flex au:flex-col au:items-start au:justify-center au:gap-0.5 au:min-w-12 au:font-body au:text-inverse',
      {
        'au:w-full': fullWidth,
        'au:w-24': size === 'sm' && !fullWidth,
        'au:w-32': size === 'md' && !fullWidth,
        'au:w-52': size === 'lg' && !fullWidth,
      }
    ),
    classes?.root
  );

  const iconClasses = twMerge(
    classNames('au:text-sm au:transition-transform au:duration-200', {
      'au:rotate-180': isOpen,
    }),
    classes?.icon
  );

  const iconContainerClasses = twMerge(
    'au:relative au:flex au:justify-center au:items-center au:p-0.5',
    classes?.iconContainer
  );

  const handleClickAway = useCallback((event: globalThis.MouseEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleOnChange = (event: MouseEvent<HTMLLIElement>) => {
    setIsOpen(false);
    if (onChange) {
      onChange(event);
    } else {
      const newValue = event.currentTarget.getAttribute('data-value');
      setCurrentValue({
        value: newValue ?? '',
        label: capitalize(newValue ?? ''),
      });
    }
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('mousedown', handleClickAway);
    return () => document.removeEventListener('mousedown', handleClickAway);
  }, [isOpen, handleClickAway]);

  return (
    <div className={rootClasses} ref={ref} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {label && <label className={labelClasses}>{label}</label>}
      <div
        aria-disabled={disabled}
        className={containerClasses}
        onClick={toggleOpen}
        ref={containerRef}
        tabIndex={disabled ? -1 : tabIndex}
      >
        <div className={placeholderClasses}>
          {currentValue?.label || placeholder || 'Select an option'}
        </div>
        <div className={iconContainerClasses}>
          <FontAwesomeIcon className={iconClasses} icon={faChevronDown} />
        </div>
        {isOpen && options.length > 0 && (
          <ul className={optionsContainerClasses}>
            {options.map((option, index) => (
              <li
                className={optionClasses}
                data-value={option.value}
                key={`select-option-${index}`}
                onClick={handleOnChange}
                tabIndex={disabled ? -1 : tabIndex + (index + 1)}
              >
                {option.icon && (
                  <FontAwesomeIcon className={optionIconClasses} icon={option.icon} />
                )}
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {name && <input type="hidden" name={name} value={value ?? defaultValue ?? ''} />}
    </div>
  );
};

Select.displayName = 'Select';

export { Select };
export type { Option, SelectClasses, SelectProps };
