import type { ComponentProps, FC, JSX } from 'react';
import { IconButton } from '../buttons';
import type { IconButtonClasses } from '../buttons';
import { useTheme } from '../../lib';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

/** Props inherited from the shared `IconButton` component. */
type IconButtonProps = ComponentProps<typeof IconButton>;

/** Props supported by the theme toggle button. */
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
 * import { Button } from '@/components/theme/Button';
 *
 * function App() {
 *   return (
 *     <div>
 *       <Button />
 *     </div>
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
