'use client';
import { useEffect, useMemo, type FC, type HTMLAttributes } from 'react';
import { Controls, getControls } from './Controls';
import type { ComponentDocsProps } from './Controls';
import type { ComponentName } from './Component';
import { Component } from './Component';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import docs from '@arctura/docs/atomics-components.json';
import { getComponentDocs } from '@arctura/docs';

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
  const componentDocs = useMemo(() => getComponentDocs(docs, component), [component]);

  const componentProps = useMemo<ComponentDocsProps>(
    () =>
      componentDocs.props
        .filter((prop) => prop.name !== 'ref' && !prop.name.startsWith('on'))
        .map((prop) => ({
          ...prop,
          typeName: prop.typeName.replace(' | undefined', ''),
        })),
    [componentDocs.props]
  );
  const controls = useMemo(() => getControls(componentProps), [componentProps]);

  const rootClasses = twMerge(classNames('au:flex au:p-4 au:w-full'), classes?.root);
  const contentClasses = twMerge(classNames('au:flex au:flex-col'), classes?.content);
  const overviewClasses = twMerge(classNames('au:flex au:gap-2'), classes?.overview);
  const playgroundClasses = twMerge(classNames('au:flex au:flex-col'), classes?.playground);
  const editorClasses = twMerge(classNames('au:h-full au:grow'), classes?.editor);

  useEffect(() => console.log('Props: ', componentDocs), [componentDocs]);
  useEffect(() => console.log('Props: ', componentProps), [componentProps]);

  return (
    <div id="root" className={rootClasses}>
      <div id="content" className={contentClasses}>
        {overview && <div id="overview" className={overviewClasses}></div>}
        {playground && (
          <div id="playground" className={playgroundClasses}>
            <Component component={component} />
            <Controls items={controls} />
          </div>
        )}
      </div>
      {editor && <div id="editor" className={editorClasses}></div>}
    </div>
  );
};

Playground.displayName = 'Playground';

export { Playground };
