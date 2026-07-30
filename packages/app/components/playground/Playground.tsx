import type { FC, HTMLAttributes } from 'react';
import { Controls, getControls } from './Controls';
import type { ComponentName } from './Component';
import { Component } from './Component';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

interface PlaygroundClasses {
  content?: string;
  editor?: string;
  overview?: string;
  playground?: string;
  root?: string;
}

interface PlaygroundProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  classes?: PlaygroundClasses;
  component: ComponentName;
  overview?: boolean;
  playground?: boolean;
  editor?: boolean;
}

const Playground: FC<PlaygroundProps> = ({
  classes = {},
  component,
  editor = true,
  overview = true,
  playground = true,
}) => {
  const rootClasses = twMerge(classNames('au:flex au:p-4'), classes?.root);
  const contentClasses = twMerge(classNames('au:flex au:flex-col'), classes?.content);
  const overviewClasses = twMerge(classNames('au:flex au:gap-2'), classes?.overview);
  const playgroundClasses = twMerge(classNames('au:flex au:flex-col'), classes?.playground);
  const editorClasses = twMerge(classNames('au:h-full au:grow'), classes?.editor);

  const controls = getControls(component);

  return (
    <div id="root" className={rootClasses}>
      <div id="content" className={contentClasses}>
        {overview && <div id="overview" className={overviewClasses}></div>}
        {playground && <div id="playground" className={playgroundClasses}>
          <Component component={component} />
          <Controls items={controls} />
        </div>}
      </div>
      {editor && <div id="editor" className={editorClasses}></div>}
    </div>
  );
};

Playground.displayName = 'Playground';

export { Playground };
