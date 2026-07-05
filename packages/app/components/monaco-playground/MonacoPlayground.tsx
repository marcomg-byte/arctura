'use client';
import type { FC, HTMLAttributes, Ref, TouchEvent as ReactTouchEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { BeforeMount, OnMount } from '@monaco-editor/react';
import { Button } from '@arctura/atomics';
import { useBreakpoints } from '@arctura/atomics/hooks';
import { useTheme } from '@arctura/theme';
import { faCheck, faCopy, faMoon, faRotateLeft, faSun } from '@fortawesome/free-solid-svg-icons';
import { basicTemplate, playgroundTypes } from './templates';
import { twMerge } from 'tailwind-merge';

interface MonacoPlaygroundClasses {
  root?: string;
  container?: string;
  controlsContainer?: string;
}

interface MonacoPlaygroundProps extends HTMLAttributes<HTMLDivElement> {
  classes?: MonacoPlaygroundClasses;
  initialCode?: string;
  ref?: Ref<HTMLDivElement>;
}

type EditorTheme = 'arctura-dark' | 'arctura-light';
type ResolvedTheme = 'dark' | 'light';
type EditorInstance = Parameters<OnMount>[0];

interface SwipePoint {
  scrollLeft: number;
  scrollTop: number;
  x: number;
  y: number;
}

const resolveTheme = (mode: string): ResolvedTheme => {
  if (mode.toLowerCase() === 'dark') return 'dark';
  if (mode.toLowerCase() === 'light') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const isMonacoCanceledError = (value: unknown) => {
  if (!(value instanceof Error)) return false;

  const stack = value.stack ?? '';
  const isCanceledError = value.name === 'Canceled' && value.message === 'Canceled';
  const isMonacoStack = stack.includes('monaco-editor') || stack.includes('editor.api');

  return isCanceledError && isMonacoStack;
};

const MonacoPlayground: FC<MonacoPlaygroundProps> = ({
  classes = {},
  initialCode = basicTemplate,
  ref,
  ...rest
}) => {
  const { mode } = useTheme();
  const { isBelow } = useBreakpoints();
  const isBelowSm = isBelow('sm');
  const isBelowMd = isBelow('md');
  const editorRef = useRef<EditorInstance | null>(null);
  const swipePointRef = useRef<SwipePoint | null>(null);
  const [code, setCode] = useState(initialCode);
  const [copyLabel, setCopyLabel] = useState('Copy code');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const editorTheme: EditorTheme = `arctura-${resolvedTheme}`;
  const editorHeight = isBelowSm ? '320px' : isBelowMd ? '360px' : '420px';
  const isDarkTheme = resolvedTheme === 'dark';

  useEffect(() => {
    const syncResolvedTheme = () => setResolvedTheme(resolveTheme(mode));

    syncResolvedTheme();

    if (mode.toLowerCase() !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', syncResolvedTheme);
    return () => mediaQuery.removeEventListener('change', syncResolvedTheme);
  }, [mode]);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isMonacoCanceledError(event.reason)) {
        event.preventDefault();
      }
    };

    const handleWindowError = (event: ErrorEvent) => {
      if (isMonacoCanceledError(event.error)) {
        event.preventDefault();
      }
    };

    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      if (args.some(isMonacoCanceledError)) return;

      originalConsoleError(...args);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleEditorBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('arctura-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '63e6be' },
        { token: 'string', foreground: '8cc8ff' },
        { token: 'type.identifier', foreground: 'f8d66d' },
      ],
      colors: {
        'editor.background': '#151f2c',
        'editor.foreground': '#e7eef8',
        'editor.lineHighlightBackground': '#223247',
        'editor.selectionBackground': '#2e5d7a',
        'editorCursor.foreground': '#63e6be',
        'editorLineNumber.foreground': '#7f91a8',
      },
    });

    monaco.editor.defineTheme('arctura-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '008a72' },
        { token: 'string', foreground: '1f6fb2' },
        { token: 'type.identifier', foreground: '946300' },
      ],
      colors: {
        'editor.background': '#f7fbff',
        'editor.foreground': '#162232',
        'editor.lineHighlightBackground': '#e8f1fb',
        'editor.selectionBackground': '#b9dff2',
        'editorCursor.foreground': '#008a72',
        'editorLineNumber.foreground': '#7b8da3',
      },
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      strict: true,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      playgroundTypes,
      'file:///node_modules/@arctura/atomics/index.d.ts'
    );
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!isBelowMd) return;

    event.stopPropagation();

    if (event.touches.length !== 1 || !editorRef.current) return;

    const touch = event.touches[0];
    swipePointRef.current = {
      scrollLeft: editorRef.current.getScrollLeft(),
      scrollTop: editorRef.current.getScrollTop(),
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleEditorTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!isBelowMd) return;

    event.stopPropagation();

    if (event.touches.length !== 1 || !editorRef.current || !swipePointRef.current) return;

    const touch = event.touches[0];
    const deltaX = swipePointRef.current.x - touch.clientX;
    const deltaY = swipePointRef.current.y - touch.clientY;

    editorRef.current.setScrollLeft(swipePointRef.current.scrollLeft + deltaX);
    editorRef.current.setScrollTop(swipePointRef.current.scrollTop + deltaY);
  };

  const handleEditorTouchEnd = (event?: ReactTouchEvent<HTMLDivElement>) => {
    if (isBelowMd) {
      event?.stopPropagation();
    }

    swipePointRef.current = null;
  };

  const handleControlsTouchEvent = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy code'), 1600);
    } catch {
      setCopyLabel('Copy failed');
      window.setTimeout(() => setCopyLabel('Copy code'), 1600);
    }
  };

  const containerClasses = twMerge(
    'au:relative au:overflow-hidden au:rounded-lg au:border au:border-subtle',
    classes?.container
  );

  const controlsContainerClasses = twMerge(
    'au:flex au:flex-col au:items-start au:gap-2 au:sm:flex-row au:sm:items-center au:sm:justify-end',
    classes?.controlsContainer
  );

  const rootClasses = twMerge(
    'au:flex au:w-full au:min-w-0 au:flex-col au:gap-3 au:rounded-lg au:bg-primary au:py-3 au:sm:gap-4 au:sm:p-0 au:lg:flex-1',
    classes?.root
  );

  return (
    <div id="playground" className={rootClasses} ref={ref} {...rest}>
      <div className={containerClasses}>
        <Editor
          height={editorHeight}
          className="au:pointer-events-none au:md:pointer-events-auto"
          defaultLanguage="typescript"
          beforeMount={handleEditorBeforeMount}
          onMount={handleEditorMount}
          path="file:///arctura-playground.tsx"
          theme={editorTheme}
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={{
            automaticLayout: true,
            fontSize: isBelowSm ? 12 : 14,
            lineNumbersMinChars: isBelowSm ? 3 : 5,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: isBelowMd ? 'on' : 'off',
          }}
        />
        <div
          aria-hidden
          className="au:absolute au:inset-0 au:touch-none au:md:hidden"
          onTouchCancel={handleEditorTouchEnd}
          onTouchEnd={handleEditorTouchEnd}
          onTouchMove={handleEditorTouchMove}
          onTouchStart={handleEditorTouchStart}
        />
      </div>
      <div
        className={controlsContainerClasses}
        onTouchCancelCapture={handleControlsTouchEvent}
        onTouchEndCapture={handleControlsTouchEvent}
        onTouchMoveCapture={handleControlsTouchEvent}
        onTouchStartCapture={handleControlsTouchEvent}
      >
        <Button
          startAdornment={isDarkTheme ? faSun : faMoon}
          onClick={() => setResolvedTheme(isDarkTheme ? 'light' : 'dark')}
        >
          {isDarkTheme ? 'Light theme' : 'Dark theme'}
        </Button>
        <Button startAdornment={faRotateLeft} onClick={() => setCode(initialCode)}>
          Reset code
        </Button>
        <Button
          startAdornment={copyLabel === 'Copied' ? faCheck : faCopy}
          onClick={handleCopyCode}
          variant="secondary"
        >
          {copyLabel}
        </Button>
      </div>
    </div>
  );
};

export { MonacoPlayground };
