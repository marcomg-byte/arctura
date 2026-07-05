const playgroundTypes = `
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    section: {
      children?: unknown;
      className?: string;
    };
  }
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      section: {
        children?: unknown;
        className?: string;
      };
    }
  }
}

declare module '@arctura/atomics' {
  type AtomicsNode = JSX.Element | string | number | boolean | null | undefined;

  interface CommonProps {
    children?: AtomicsNode | AtomicsNode[];
    className?: string;
  }

  interface BadgeProps extends CommonProps {
    color?: 'primary' | 'secondary' | 'accent' | 'inverse' | 'subtle' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'filled' | 'outline' | 'soft';
  }

  interface ButtonProps extends CommonProps {
    href?: string;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    target?: string;
    variant?: 'primary' | 'secondary' | 'text' | 'outline';
  }

  interface TypographyProps extends CommonProps {
    align?: 'left' | 'center' | 'right' | 'justify';
    bold?: boolean;
    clamp?: number;
    color?: 'primary' | 'secondary' | 'accent' | 'inverse' | 'subtle' | 'white';
    removePadding?: boolean;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'base' | 'small';
  }

  export function Badge(props: BadgeProps): JSX.Element;
  export function Button(props: ButtonProps): JSX.Element;
  export function Typography(props: TypographyProps): JSX.Element;
}
`;

const basicTemplate = `import { Badge, Button, Typography } from '@arctura/atomics';

export function GettingStartedCard() {
  return (
    <section className="au:flex au:max-w-md au:flex-col au:gap-3 au:rounded-lg au:bg-primary au:p-4">
      <Badge color="success" size="sm" variant="outline">
        Ready to build
      </Badge>
      <Typography removePadding variant="h3">
        Compose interfaces with Arctura
      </Typography>
      <Typography removePadding>
        Use atomics as reusable building blocks for React, TypeScript and Tailwind CSS apps.
      </Typography>
      <Button href="/docs">Open documentation</Button>
    </section>
  );
}`;

export { basicTemplate, playgroundTypes };
