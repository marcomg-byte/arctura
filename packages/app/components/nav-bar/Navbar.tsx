import type { FC, HTMLAttributes, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

type NavbarOrientation = 'horizontal' | 'vertical';

interface NavbarClasses {
  root?: string;
}

interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  classes?: NavbarClasses;
  orientation?: NavbarOrientation;
  ref?: Ref<HTMLDivElement>;
}

const Navbar: FC<NavbarProps> = ({
  children,
  classes = {},
  orientation = 'vertical',
  ref,
  ...rest
}) => {
  const rootClasses = twMerge(
    classNames('au:flex au:w-1/3', {
      'au:flex-col': orientation === 'vertical',
    }),
    classes?.root
  );

  return (
    <div className={rootClasses} id="navbar" role="navigation" ref={ref} {...rest}>
      {children}
    </div>
  );
};

Navbar.displayName = 'Navbar';

export { Navbar };
