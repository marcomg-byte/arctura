'use client';
import type {
  ComponentProps,
  ChangeEvent,
  FC,
  FormHTMLAttributes,
  JSX,
  ReactElement,
  ReactNode,
  Ref,
  SubmitEvent,
} from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from 'react';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextArea } from './TextArea';
import { TextInput } from './TextInput';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import { Button } from '../buttons';
import { Typography } from '../typography';
import { useBreakpoints, useControlled } from '@/lib';

/**
 * React element shape used when recursively traversing nested children.
 */
type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

/**
 * A form adornment can be either a FontAwesome `IconDefinition` or an image descriptor.
 * - When an `IconDefinition` is passed, the component renders a FontAwesome icon.
 * - When an object is passed it should provide a `src` (image `src`) and optional `alt` text.
 */
type FormAdornment = IconDefinition | { src: string; alt?: string };

/**
 * Theme color options accepted by the form for adornments and text.
 *
 * - 'accent' | 'primary' | 'secondary' | 'subtle' map to theme token names.
 * - 'black' | 'white' | 'inverse' are additional semantic colors used by the UI.
 */
type FormColor =
  | 'accent'
  | 'black'
  | 'inverse'
  | 'primary'
  | 'secondary'
  | 'subtle'
  | 'white';

/**
 * Class names for the disclaimer sub-elements.
 */
interface DisclaimerClasses {
  /** Classes applied to the disclaimer adornment (icon or image). */
  adornment?: string;
  /** Classes applied to the disclaimer container wrapper. */
  container?: string;
  /** Classes applied to the disclaimer text element. */
  text?: string;
}

/**
 * Top-level class overrides for the `Form` component parts.
 *
 * Each property is optional and, when provided, will be merged with the
 * component's internal class names.
 */
interface FormClasses {
  /** Classes applied to the header/start adornment. */
  adornment?: string;
  /** Classes applied to the main body wrapper containing form children. */
  body?: string;
  /** Classes for the disclaimer sub-elements. */
  disclaimer?: DisclaimerClasses;
  /** Classes applied to the form header. */
  header?: string;
  /** Classes applied to the form footer. */
  footer?: string;
  /** Classes applied to the wrapper that contains the footer action buttons. */
  footerButtonsContainer?: string;
  /** Classes applied to the root `<form>` element. */
  form?: string;
  /** Classes applied to the submit button container. */
  submitButton?: string;
}

/**
 * Descriptor for the optional disclaimer shown in the form footer.
 *
 * - `adornment`: optional `FormAdornment` to display beside the text.
 * - `text`: the disclaimer string to render.
 */
type FormDisclaimer = { adornment?: FormAdornment; text?: string };

/**
 * Props accepted by the `Form` component.
 *
 * Extends native `FormHTMLAttributes<HTMLFormElement>` (excluding
 * `className`) and exposes additional configuration used by the component
 * such as adornments, color tokens, class overrides, and an optional
 * disclaimer rendered in the footer.
 */
interface FormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'className' | 'onChange' | 'onSubmit'
> {
  /** Accessible label for the form (maps to `aria-label`). */
  'aria-label'?: string;
  /** ID of an element that labels the form (maps to `aria-labelledby`). */
  'aria-labelledby'?: string;
  /** Native HTML `action` attribute (submission URL). */
  action?: JSX.IntrinsicElements['form']['action'];
  /** Color used for adornments and accents inside the form (maps to theme tokens). */
  adornmentColor?: FormColor;
  /** Child nodes to render inside the form (inputs, buttons, etc.). */
  children?: ReactNode;
  /** Additional CSS classes to apply to the form container. */
  classes?: FormClasses;
  /** Color used for text elements in the form and disclaimer (maps to theme tokens). */
  color?: FormColor;
  /** Optional disclaimer shown in the form footer; includes an optional adornment and text. */
  disclaimer?: FormDisclaimer;
  /** Encoding type for the form, e.g. `multipart/form-data` for file uploads. */
  encType?: JSX.IntrinsicElements['form']['encType'];
  /** Optional adornment to render at the end of the form header (icon or image). */
  endAdornment?: FormAdornment;
  /** Controlled error state for the form, derived from child field validation. */
  error?: boolean;
  /** `id` attribute for the form element. */
  id?: string;
  /** HTTP method used when submitting the form (`get` | `post`). */
  method?: JSX.IntrinsicElements['form']['method'];
  /** `name` attribute for the form. */
  name?: string;
  /** When true, disables the browser's native validation (`noValidate`). */
  noValidate?: boolean;
  /** Change event handler for the form element. */
  onChange?: (values: FormValue[], error: boolean) => void;
  /** Reset event handler for the form element. */
  onReset?: (event: SubmitEvent<HTMLFormElement>) => void;
  /** Submit event handler for the form element. */
  onSubmit?: (
    event: SubmitEvent<HTMLFormElement>,
    values?: FormValue[],
    error?: boolean,
  ) => void;
  /** Ref to access the underlying HTML form element. */
  ref?: Ref<HTMLFormElement>;
  /** Optional adornment to render at the start of the form header (icon or image). */
  startAdornment?: FormAdornment;
  /** Optional title displayed next to adornments in the form header. */
  title?: string;
  /** Initial values for form fields, used to populate internal state. */
  value?: FormValue[];
}

/**
 * Internal representation of a form field's value used for mapping children
 * into a predictable, typed state structure.
 *
 * - `key`: unique identifier generated for the field when mapping children.
 * - `type`: discriminant for the field component type (`TextInput` or `TextArea`).
 * - `value`: current string value for the field.
 * - `error`: optional boolean flag indicating the field has a validation error.
 */
interface FormValue {
  /** Whether the field currently has a validation error. */
  error?: boolean;
  /** Unique key generated when mapping children into form state. */
  key?: string;
  /** Component type of the field (`TextInput` or `TextArea`). */
  type?: 'TextInput' | 'TextArea';
  /** Current string value for the field. */
  value?: string;
}

/**
 * React element type corresponding to the `TextArea` child component.
 * Used when inferring props from children elements.
 */
type TextAreaComponent = ReactElement<ComponentProps<typeof TextArea>>;

/**
 * Props inferred from the `TextArea` component.
 */
type TextAreaProps = ComponentProps<typeof TextArea>;

/**
 * React element type corresponding to the `TextInput` child component.
 * Used when inferring props from children elements.
 */
type TextInputComponent = ReactElement<ComponentProps<typeof TextInput>>;

/**
 * Props inferred from the `TextInput` component.
 */
type TextInputProps = ComponentProps<typeof TextInput>;

/**
 * Map React children to an array of `FormValue` entries.
 *
 * This helper inspects the provided `children` and converts any
 * `TextInput` or `TextArea` elements into a normalized `FormValue`
 * structure that can be used to initialize or synchronize component
 * state. It supports a single child or an array of children.
 *
 * @param children - Optional React children to scan for form fields.
 * @returns An array of `FormValue` objects representing discovered fields.
 */
const mapState = (children?: ReactNode): FormValue[] => {
  const results: FormValue[] = [];
  let counter = 0;

  const walk = (node?: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;

      if (isValidElement(child) && child.type === TextInput) {
        counter++;
        const props = child.props as TextInputComponent['props'];
        results.push({
          key: `form-text-input-${counter}`,
          type: 'TextInput',
          error: props.error,
          value: props.value || props.defaultValue || '',
        });
      } else if (isValidElement(child) && child.type === TextArea) {
        counter++;
        const props = child.props as TextAreaComponent['props'];
        results.push({
          key: `form-text-area-${counter}`,
          type: 'TextArea',
          value: props.value || props.defaultValue || '',
        });
      }

      if (
        isValidElement(child) &&
        (child as ElementWithChildren).props?.children
      ) {
        walk((child as ElementWithChildren).props.children);
      }
    });
  };

  walk(children);
  return results;
};

/**
 * Render a form adornment.
 *
 * If a FontAwesome `IconDefinition` is provided, this returns a
 * `FontAwesomeIcon`. Otherwise it renders a Next.js `Image` using the
 * adornment object's `string` as the `src` and optional `alt` text.
 *
 * @param {FormAdornment} adornment - IconDefinition or image descriptor.
 * @returns {JSX.Element} A `FontAwesomeIcon` or `Image` element.
 */
const renderAdornment = (
  adornment: FormAdornment,
  className?: string,
): JSX.Element => {
  const iconClasses = classNames(
    'mg:animate-fade-in mg:transition-transform mg:duration-500 mg:hover:scale-110',
    className,
  );
  const imageClasses = twMerge(
    'mg:object-contain mg:animate-fade-in mg:transition-transform mg:duration-500 mg:hover:scale-110',
    className,
  );

  if ('iconName' in adornment) {
    return <FontAwesomeIcon className={iconClasses} icon={adornment} />;
  }

  return (
    <img
      alt={adornment.alt || ''}
      src={adornment.src || ''}
      width={32}
      height={32}
      className={imageClasses}
    />
  );
};

/**
 * Form component - a wrapper around the native HTML `<form>` element.
 *
 * Renders optional `startAdornment` and `endAdornment` (icons or images) with
 * an optional `title`, then renders `children` which should contain form
 * controls. All standard HTML form attributes are forwarded via `...rest`.
 *
 * @param {FormProps} props - Configuration props for the form component.
 * @returns {JSX.Element} The rendered form element.
 * @example
 * ```tsx
 * import { Form, Button } from '@/components/ui/atomics';
 * import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
 *
 * const MyForm = () => (
 *  <Form
 *    action="/submit"
 *    method="post"
 *    title="Contact Us"
 *    startAdornment={faPaperPlane}
 *  >
 *    <input type="text" name="name" placeholder="Your Name" required />
 *    <input type="email" name="email" placeholder="Your Email" required />
 *    <Button type="submit">Send</Button>
 *  </Form>
 * );
 * ```
 */
const Form: FC<FormProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  action,
  adornmentColor = 'primary',
  children,
  classes = {},
  color = 'primary',
  disclaimer,
  encType,
  endAdornment,
  error: errorProp,
  id,
  method,
  name,
  noValidate,
  onChange,
  onReset,
  onSubmit,
  ref,
  startAdornment,
  title,
  value: valueProp,
  ...rest
}) => {
  const initialState: FormValue[] = mapState(children);
  const [values, setValues] = useState<FormValue[]>(initialState);
  const [, setError] = useControlled<boolean>({
    defaultValue: initialState.some((value) => value?.error),
    value: errorProp,
  });
  const [, setValue] = useControlled<FormValue[]>({
    defaultValue: initialState,
    value: valueProp,
  });

  const { isBelow } = useBreakpoints();
  const isBelowSm = isBelow('sm');

  const adornmentClasses = classNames(
    'mg:text-2xl',
    {
      'mg:text-accent': adornmentColor === 'accent',
      'mg:text-black': adornmentColor === 'black',
      'mg:text-inverse': adornmentColor === 'inverse',
      'mg:text-primary': adornmentColor === 'primary',
      'mg:text-secondary': adornmentColor === 'secondary',
      'mg:text-subtle': adornmentColor === 'subtle',
      'mg:text-white': adornmentColor === 'white',
    },
    classes?.adornment,
  );

  const bodyClasses = twMerge(
    'mg:flex mg:flex-col mg:items-start mg:gap-3 mg:bg-inherit mg:w-full',
    classes?.body,
  );

  const disclaimerAdornmentClasses = classNames(
    'mg:p-1 mg:text-2xl',
    {
      'mg:text-accent': adornmentColor === 'accent',
      'mg:text-black': adornmentColor === 'black',
      'mg:text-inverse': adornmentColor === 'inverse',
      'mg:text-primary': adornmentColor === 'primary',
      'mg:text-secondary': adornmentColor === 'secondary',
      'mg:text-subtle': adornmentColor === 'subtle',
      'mg:text-white': adornmentColor === 'white',
    },
    classes?.disclaimer?.adornment,
  );

  const disclaimerContainerClasses = twMerge(
    'mg:flex mg:grow mg:gap-2',
    classes?.disclaimer?.container,
  );

  const headerClasses = twMerge(
    'mg:flex mg:items-center mg:justify-between mg:w-full',
    classes?.header,
  );

  const footerClasses = twMerge(
    'mg:flex mg:flex-col mg:items-start mg:gap-3 mg:sm:flex-row mg:sm:items-center mg:justify-between mg:w-full',
    classes?.footer,
  );

  const footerButtonsContainerClasses = twMerge(
    classNames('mg:flex mg:items-center mg:justify-between mg:w-full'),
    classes?.footerButtonsContainer,
  );

  const formClasses = twMerge(
    'mg:flex mg:flex-col mg:p-6 mg:gap-4 mg:rounded-lg mg:bg-inherit',
    classes?.form,
  );

  const submitButtonClasses = classNames(
    {
      'mg:text-accent': adornmentColor === 'accent',
      'mg:text-black': adornmentColor === 'black',
      'mg:text-inverse': adornmentColor === 'inverse',
      'mg:text-primary': adornmentColor === 'primary',
      'mg:text-secondary': adornmentColor === 'secondary',
      'mg:text-subtle': adornmentColor === 'subtle',
      'mg:text-white': adornmentColor === 'white',
    },
    classes?.submitButton,
  );

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    key?: string,
  ) => {
    setValues((prev) => {
      let changed = false;
      const next = prev.map((value) => {
        if (value?.key === key) {
          if (value.value === event.target.value) return value;
          changed = true;
          return { ...value, value: event.target.value };
        }
        return value;
      });
      return changed ? next : prev;
    });
  };

  const handleInputClear = (key?: string) => {
    setValues((prev) => {
      const next = prev.map((value) => {
        if (value?.key === key) {
          return { ...value, value: '' };
        }
        return value;
      });
      return next;
    });
  };

  const handleInputError = (error: boolean, key?: string) => {
    setValues((prev) => {
      let changed = false;
      const next = prev.map((value) => {
        if (value?.key === key) {
          if (value.error === error) return value;
          changed = true;
          return { ...value, error };
        }
        return value;
      });
      return changed ? next : prev;
    });
  };

  const handleReset = (event: SubmitEvent<HTMLFormElement>) => {
    setValues(initialState);
    if (onReset) {
      onReset(event);
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    if (onSubmit) {
      const error = values.some((value) => value?.error);
      onSubmit(event, values, error);
    }
  };

  const renderChildren = (children?: ReactNode): ReactNode => {
    let counter = 0;

    const walk = (node?: ReactNode): ReactNode => {
      return Children.map(node, (child) => {
        if (!isValidElement(child)) return child;

        if (child.type === TextArea) {
          counter++;
          const key = `form-text-area-${counter}`;
          const currentValue = values.find((value) => value?.key === key);
          const props = child.props as TextAreaComponent['props'];
          return cloneElement<TextAreaProps>(child as TextAreaComponent, {
            key,
            onChange: (event) => handleInputChange(event, key),
            onClear: props?.clearable ? () => handleInputClear(key) : undefined,
            value: currentValue?.value,
          });
        }

        if (child.type === TextInput) {
          counter++;
          const key = `form-text-input-${counter}`;
          const currentValue = values.find((value) => value?.key === key);
          const props = child.props as TextInputComponent['props'];
          return cloneElement<TextInputProps>(child as TextInputComponent, {
            key,
            error: currentValue?.error,
            onClear: props?.clearable ? () => handleInputClear(key) : undefined,
            onChange: (event) => handleInputChange(event, key),
            onError: (error) => handleInputError(error, key),
            value: currentValue?.value,
          });
        }

        if ((child as ElementWithChildren).props?.children) {
          const nested = walk((child as ElementWithChildren).props.children);
          return cloneElement(child as ElementWithChildren, {
            children: nested,
          });
        }

        return child;
      });
    };

    return walk(children);
  };

  useEffect(() => {
    const error = values.some((value) => value?.error);
    if (onChange) {
      onChange(values, error);
    } else {
      setValue(values);
      setError(error);
    }
  }, [onChange, setValue, values, setError]);

  return (
    <form
      action={action}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={formClasses}
      encType={encType}
      id={id}
      method={method}
      name={name}
      noValidate={noValidate}
      onReset={handleReset}
      onSubmit={handleSubmit}
      ref={ref}
      {...rest}
    >
      <div className={headerClasses}>
        <div className="mg:flex mg:items-center mg:gap-2">
          {startAdornment && renderAdornment(startAdornment, adornmentClasses)}
          {title && (
            <Typography color="white" variant="h2">
              {title}
            </Typography>
          )}
        </div>
        {endAdornment && renderAdornment(endAdornment, adornmentClasses)}
      </div>
      <div className={bodyClasses}>{children && renderChildren(children)}</div>
      <div className={footerClasses}>
        {isBelowSm ? (
          <div className={footerButtonsContainerClasses}>
            <Button
              classes={{ button: submitButtonClasses }}
              type="submit"
              variant="outline"
            >
              SUBMIT
            </Button>
            <Button
              classes={{ button: submitButtonClasses }}
              type="reset"
              variant="outline"
            >
              RESET
            </Button>
          </div>
        ) : (
          <>
            <Button
              classes={{ button: submitButtonClasses }}
              type="submit"
              variant="outline"
            >
              SUBMIT
            </Button>
            <Button
              classes={{ button: submitButtonClasses }}
              type="reset"
              variant="outline"
            >
              RESET
            </Button>
          </>
        )}
        {disclaimer && (
          <div className={disclaimerContainerClasses}>
            {disclaimer?.adornment &&
              renderAdornment(
                disclaimer?.adornment,
                disclaimerAdornmentClasses,
              )}
            <Typography
              clamp={10}
              className={classes?.disclaimer?.text}
              color={color}
              removePadding
              variant="base"
            >
              {disclaimer?.text}
            </Typography>
          </div>
        )}
      </div>
    </form>
  );
};

Form.displayName = 'Form';

export { Form };
export type { FormValue };
