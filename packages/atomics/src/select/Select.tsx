'use client';
import type { FC, HTMLAttributes, MouseEvent, Ref } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useControlled } from '@/lib';
import { capitalize } from '@/src/utils';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

/** Option data consumed by the Select component. */
interface Option {
  /** Value used for selection state and form submission. */
  value: string;
  /** Visible label shown in the dropdown. */
  label: string;
  /** Optional icon rendered alongside the label. */
  icon?: IconDefinition;
}

/** Optional class name hooks for the Select component internals. */
interface SelectClasses {
  /** Class names applied to the outer container. */
  container?: string;
  /** Class names applied to the chevron icon. */
  icon?: string;
  /** Class names applied to the icon wrapper. */
  iconContainer?: string;
  /** Class names applied to the label above the control. */
  label?: string;
  /** Class names applied to the placeholder value. */
  placeholder?: string;
  /** Class names applied to the option row and option icon. */
  option?: { root?: string; icon?: string };
  /** Class names applied to the dropdown list container. */
  optionsContainer?: string;
  /** Class names applied to the root wrapper. */
  root?: string;
}

/** Props for the Select component. */
interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'className'> {
  /** Class name hooks for the internal elements. */
  classes?: SelectClasses;
  /** Initial value used when the component is uncontrolled. */
  defaultValue?: string;
  /** Whether the select is disabled. */
  disabled?: boolean;
  /** Label rendered above the select trigger. */
  label?: string;
  /** Name applied to the hidden input for form integration. */
  name?: string;
  /** Callback fired when an option is selected. */
  onChange?: (event: MouseEvent<HTMLLIElement>) => void;
  /** Available options to display in the dropdown. */
  options?: Option[];
  /** Placeholder shown when no selection is active. */
  placeholder?: string;
  /** Ref forwarded to the root wrapper. */
  ref?: Ref<HTMLDivElement>;
  /** Keyboard tab index for the select trigger and options. */
  tabIndex?: number;
  /** Visual treatment for the dropdown. */
  variant?: 'outline' | 'filled';
  /** Controlled selected value. */
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
 * import { Select } from '@/src/select/Select';
 *
 * function App() {
 *  const options = [
 *   { value: 'option1', label: 'Option 1' },
 *   { value: 'option2', label: 'Option 2', icon: faStar },
 * ];
 *
 * return (
 *   <Select
 *    label="Choose an option"
 *    options={options}
 *    placeholder="Select an option"
 * />
 * );
 * ```
 *
 * @see Option
 * @see SelectProps
 */
const Select: FC<SelectProps> = ({
  classes = {},
  defaultValue,
  disabled = false,
  label,
  name,
  onChange,
  options = [],
  placeholder,
  ref,
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
      'au:relative au:flex au:justify-start au:items-center au:gap-1 au:rounded-sm au:w-full au:h-full',
      {
        'au:border-1 au:border-solid au:border-primary au:hover:border-hover':
          variant === 'outline',
        'au:bg-primary': variant === 'filled',
        'au:cursor-not-allowed au:opacity-50': disabled,
        'au:hover:cursor-pointer': !disabled,
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
    'au:inline-flex au:flex-col au:items-start au:justify-center au:gap-0.5 au:min-w-12 au:min-h-2 au:h-full au:font-body au:text-inverse',
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
export type { SelectClasses };
