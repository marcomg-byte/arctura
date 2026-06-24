import type { ComponentProps, FC, JSX } from 'react';
import { IconButton } from '../buttons';
import type { IconButtonClasses } from '../buttons';
import { useTheme } from '../../lib';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

/** Props inherited from the shared `IconButton` component. */
type IconButtonProps = ComponentProps<typeof IconButton>;

/**
 * Props supported by the theme toggle button.
 *
 * Use these props to customize the theme toggle while preserving the shared
 * `IconButton` interaction and accessibility surface.
 *
 * @property [classes] - Class name hooks for the theme toggle internals.
 */
interface ButtonProps extends IconButtonProps {
  /** Optional class name overrides for the button internals. */
  classes?: IconButtonClasses;
}

/**
 * Theme toggle button component.
 *
 * Renders an IconButton that toggles between light and dark theme modes.
 * Displays a moon icon for light mode and a sun icon for dark mode.
 *
 * @returns {JSX.Element} The theme toggle button.
 * @example
 * ```tsx
 * import { Button as ThemeButton } from '@arctura/atomics/theme';
 *
 * export function ThemeToolbarAction() {
 *   return (
 *     <ThemeButton
 *       aria-label="Toggle color theme"
 *       classes={{ iconButton: 'au:text-primary' }}
 *     />
 *   );
 * }
 * ```
 */
const Button: FC<ButtonProps> = ({ classes, ...rest }): JSX.Element => {
  const { mode, setMode } = useTheme();

  const childrenClasses = classNames('au:animate-spin-in', classes?.children);

  const handleToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton
      classes={{ children: childrenClasses, iconButton: classes?.iconButton }}
      onClick={handleToggle}
      {...rest}
    >
      {mode === 'light' ? faMoon : faSun}
    </IconButton>
  );
};

export { Button };
export type { ButtonProps };
