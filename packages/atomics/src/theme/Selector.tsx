import type { ComponentProps, FC, JSX, MouseEvent } from 'react';
import { Select } from '../select';
import type { SelectClasses } from '../select';
import { useTheme, THEME_MODES, THEME_OPTIONS } from '../../lib';
import type { ThemeMode } from '../../lib';

/** Props inherited from the shared `Select` component. */
type SelectProps = ComponentProps<typeof Select>;

/**
 * Props supported by the theme selector wrapper.
 *
 * Use these props to customize the theme selector while preserving the shared
 * `Select` behavior, option rendering, sizing, and class override surface.
 *
 * @property [classes] - Class name hooks for the underlying select internals.
 */
interface SelectorProps extends SelectProps {
  /** Optional class name overrides for the underlying select internals. */
  classes?: SelectClasses;
}

/**
 * Renders the theme mode selector that stays synchronized with the current
 * application theme and updates it when the user chooses a new option.
 *
 * The component wraps the shared `Select` control with the theme-specific
 * label, option list, and change handler needed to switch between the
 * supported theme modes.
 *
 * @param {SelectorProps} props - Props forwarded to the theme selector, plus optional class overrides.
 * @returns {JSX.Element} The themed select dropdown.
 * @example
 * ```tsx
 * import { Selector as ThemeSelector } from '@arctura/atomics/theme';
 *
 * export function ThemeToolbarSelect() {
 *   return <ThemeSelector label="Theme mode" fullWidth />;
 * }
 * ```
 */
const Selector: FC<SelectorProps> = ({ classes = {}, ...rest }): JSX.Element => {
  const { mode, setMode } = useTheme();

  const handleChange = (event: MouseEvent<HTMLLIElement>) => {
    const newValue = event.currentTarget.getAttribute('data-value');
    if (newValue && THEME_MODES.includes(newValue as ThemeMode)) {
      setMode(newValue as ThemeMode);
    }
  };

  return (
    <Select
      classes={classes}
      label="Theme"
      options={THEME_OPTIONS}
      value={mode}
      onChange={handleChange}
      {...rest}
    />
  );
};

export { Selector };
export type { SelectorProps };
