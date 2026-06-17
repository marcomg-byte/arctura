'use client';
import type {
  ComponentProps,
  FC,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import { Step } from './Step';
import type { StepClasses } from './Step';
import { Connector } from './Connector';
import type { ConnectorClasses } from './Connector';
import { Button } from '../buttons';
import type { ButtonClasses } from '../buttons';
import { Typography } from '../typography';
import { useControlled, useBreakpoints } from '@/lib';
import { capitalize } from '../utils';
import { twMerge } from 'tailwind-merge';

/**
 * @interface StepType
 * @description Represents the minimal shape of a step managed by the stepper.
 */
interface StepType {
  /** Unique key identifying the step. */
  key?: string;
  /** Whether the step is currently active (shows expanded content). */
  active?: boolean;
  /** Whether the step is marked as completed. */
  completed?: boolean;
  /** Optional label for the step, used for accessibility and display purposes. */
  label?: string;
}

/**
 * @type StepComponent
 * @description
 * A React element representing a single Step component with its props.
 */
type StepComponent = ReactElement<ComponentProps<typeof Step>>;

/**
 * @type ConnectorComponent
 * @description
 * A React element representing a Connector component with its props.
 */
type ConnectorComponent = ReactElement<ComponentProps<typeof Connector>>;

/**
 * @interface Slots
 * @description
 * Structure for stepper slots, containing a step node and an optional connector.
 * @property {StepComponent} node - The step node element.
 * @property {ConnectorComponent} [connector] - The connector element, if present.
 */
interface Slots {
  /** The step node element. */
  node: StepComponent;
  /** The connector element, if present. */
  connector?: ConnectorComponent;
}

/**
 * Class name overrides for the `ProgressStepper` component parts.
 */
interface ProgressStepperClasses {
  /** Classes applied to the action buttons. */
  button?: ButtonClasses;
  /** Classes applied to the button wrapper inside the controls footer. */
  buttonsContainer?: string;
  /** Classes applied to the step connectors. */
  connector?: ConnectorClasses;
  /** Classes applied to the footer controls container. */
  controls?: string;
  /** Classes applied to the active step label. */
  label?: string;
  /** Classes applied to the outer wrapper around the stepper and controls. */
  outer?: string;
  /** Classes applied to the root step list container. */
  root?: string;
  /** Classes applied to each rendered step. */
  step?: StepClasses;
}

/**
 * @interface ProgressStepperProps
 * @extends HTMLAttributes<HTMLDivElement>
 * @description
 * Props for the ProgressStepper component, extending standard HTML div attributes.
 * Includes properties for active step index, custom connectors, click handling, layout orientation, and linear mode.
 */
interface ProgressStepperProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'className'
> {
  /** Controlled value representing the currently active step object. */
  activeStep?: StepType;
  /** One or more `<Step />` nodes to render inside the stepper. */
  children?: ReactNode;
  /** Optional class overrides for the stepper layout, controls, and steps. */
  classes?: ProgressStepperClasses;
  /** Whether all steps have been completed. */
  completed?: boolean;
  /** Index of the initially active step when uncontrolled (default: `0`). */
  defaultStep?: number;
  /** Forces horizontal layout even on small screens. */
  forceHorizontal?: boolean;
  /** When `true`, hides the default step controls in non linear Progress Steppers. */
  hideControls?: boolean;
  /** When `true`, step activation follows linear behaviour; when `false`, steps are clickable. */
  linear?: boolean;
  /** Callback invoked when the completion state changes; receives the new completed value. */
  onComplete?: (completed: boolean) => void;
  /** Callback invoked once on mount with the initial active `StepType`. */
  onInit?: (step: StepType) => void;
  /** Fired when a step is clicked; receives the click event and the resulting `StepType`. */
  onStepClick?: (event: MouseEvent<HTMLButtonElement>, step: StepType) => void;
  /** Layout orientation for the stepper (default: `'horizontal'`). */
  orientation?: 'horizontal' | 'vertical';
  /** Ref forwarded to the root container element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Map the provided `children` to an internal array of `StepType` objects.
 * Only direct `<Step />` elements are converted; other children are ignored.
 *
 * @param {ReactNode} children - The stepper children (one or more `<Step />` nodes).
 * @param {number} defaultStepProp - Index to mark as active by default when no child sets `active`.
 * @returns {StepType[]} An array of step objects with `key`, `active`, and `completed` fields.
 */
function mapChildrenToSteps(
  children: ReactNode,
  defaultStepProp: number,
): StepType[] {
  if (Array.isArray(children)) {
    const mappedSteps: StepType[] = Children.toArray(children)
      .map((child, index) => {
        if (isValidElement(child) && child.type === Step) {
          const stepProps = child.props as StepComponent['props'];
          return {
            key: `step-${index}`,
            active:
              index === defaultStepProp ? true : stepProps?.active || false,
            completed: stepProps?.completed || false,
            label: stepProps?.label,
          };
        }
        return null;
      })
      .filter((step) => step !== null);
    return mappedSteps;
  } else if (isValidElement(children) && children.type === Step) {
    const stepProps = children.props as StepComponent['props'];
    return [
      {
        key: 'step-0',
        active: stepProps.active || false,
        completed: stepProps.completed || false,
        label: stepProps?.label,
      },
    ];
  }
  return [];
}

/**
 * @component ProgressStepper
 * @description
 * ProgressStepper component renders a sequence of steps with optional connectors.
 * It manages active step state and allows for custom connectors and click handling on steps. The layout can be oriented horizontally or vertically.
 *
 * @param {ProgressStepperProps} props - The properties for the ProgressStepper component.
 * @returns {JSX.Element} The rendered stepper component.
 * @example
 * ```tsx
 * import { useState } from 'react';
 * import { ProgressStepper, Step } from '@/components/ui/atomics';
 * import type { StepType } from '@/components/ui/atomics';
 *
 * const MyStepper = () => {
 *   const [activeStep, setActiveStep] = useState<StepType>({});
 *   return (
 *     <ProgressStepper
 *       activeStep={activeStep}
 *       onStepClick={(event, step) => {
 *         console.log('Step clicked:', step);
 *         setActiveStep(step);
 *     }}>
 *       <Step label="Step 1" />
 *       <Step label="Step 2" />
 *       <Step label="Step 3" />
 *     </ProgressStepper>
 *   );
 * };
 */
const ProgressStepper: FC<ProgressStepperProps> = ({
  activeStep: activeStepProp,
  children: childrenProp,
  classes = {},
  completed: completedProp,
  defaultStep: defaultStepProp = 0,
  forceHorizontal = false,
  hideControls = false,
  linear = true,
  onComplete,
  onInit,
  onStepClick,
  orientation = 'horizontal',
  ref,
  ...rest
}) => {
  const currentStepCount = Children.toArray(childrenProp).filter(
    (child) => isValidElement(child) && child.type === Step,
  ).length;

  const [steps, setSteps] = useState<StepType[]>(() =>
    mapChildrenToSteps(childrenProp, defaultStepProp),
  );

  const [trackedStepCount, setTrackedStepCount] = useState(currentStepCount);

  useEffect(() => {
    if (onInit) {
      const initialStep =
        steps.find((step) => step.active) ?? steps[defaultStepProp];

      if (initialStep) {
        onInit(initialStep);
      }
    }
  });

  if (trackedStepCount !== currentStepCount) {
    setTrackedStepCount(currentStepCount);
    setSteps(mapChildrenToSteps(childrenProp, defaultStepProp));
  }

  const [activeStep, setActiveStep] = useControlled<StepType>({
    defaultValue: {
      key: `step-${defaultStepProp}`,
      active: true,
      completed: false,
      label: '',
    },
    value: activeStepProp,
  });

  const [completed, setCompleted] = useControlled<boolean>({
    defaultValue: false,
    value: completedProp,
  });

  const { isBelow } = useBreakpoints();
  const isBelowSm = isBelow('sm');

  const buttonsContainerClasses = twMerge(
    'mg:flex mg:gap-1 mg:items-center',
    classes?.buttonsContainer,
  );

  const controlsClasses = twMerge(
    'mg:w-full mg:flex mg:items-center mg:justify-between mg:pb-5 mg:sm:pb-6 mg:px-6',
    classes?.controls,
  );

  const outerClasses = twMerge('mg:flex mg:flex-col mg:w-full', classes?.outer);

  const rootClasses = twMerge(
    classNames(
      'mg:w-full mg:h-full mg:flex mg:px-6 mg:pb-2 mg:pt-0 mg:sm:pt-6 mg:overflow-x-scroll mg:scrollbar-subtle',
      {
        'mg:flex-col':
          orientation === 'vertical' || (isBelowSm && !forceHorizontal),
        'mg:justify-between': orientation === 'horizontal' && !isBelowSm,
      },
    ),
    classes?.root,
  );

  const handleStepClick = (
    event: MouseEvent<HTMLButtonElement>,
    stepIndex: number,
  ) => {
    const newValue = steps.map((step) => {
      if (step.key === `step-${stepIndex}`) {
        if (step.completed) {
          return { ...step, active: true, completed: false };
        }

        if (step.active) {
          return { ...step, active: false, completed: true };
        }

        return { ...step, active: true, completed: false };
      }

      return { ...step, active: false };
    });

    const allCompleted = newValue.every((step) => step?.completed);

    if (allCompleted) {
      if (onComplete) {
        onComplete(true);
      } else {
        setCompleted(true);
      }
    }

    setSteps(newValue);
    if (onStepClick) {
      onStepClick(event, newValue[stepIndex]);
    } else {
      setActiveStep(newValue[stepIndex]);
    }
  };

  const handleComplete = (event: MouseEvent<HTMLButtonElement>) => {
    const activeIndex = steps.findIndex((step) => step?.active);
    const isStepCompleted = steps[activeIndex]?.completed;
    const newValue = steps.map((steps, index) => {
      if (index === activeIndex && !isStepCompleted) {
        return {
          ...steps,
          completed: true,
        };
      }

      if (index === activeIndex && isStepCompleted) {
        return {
          ...steps,
          completed: false,
        };
      }

      return steps;
    });

    setSteps(newValue);
    if (onStepClick) {
      onStepClick(event, newValue[activeIndex]);
    } else {
      setActiveStep(newValue[activeIndex]);
    }
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    const activeIndex = steps.findIndex((step) => step?.active);
    const newValue = steps.map((step, index) => {
      if (activeIndex + 1 < steps.length && index === activeIndex + 1) {
        return {
          ...step,
          active: true,
        };
      }

      if (activeIndex + 1 > steps.length - 1 && index === 0) {
        return {
          ...step,
          active: true,
        };
      }

      return { ...step, active: false };
    });
    setSteps(newValue);
    if (onStepClick) {
      onStepClick(event, newValue[activeIndex + 1] || newValue[0]);
    } else {
      setActiveStep(newValue[activeIndex + 1] || newValue[0]);
    }
  };

  const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
    if (onComplete) {
      onComplete(false);
    } else {
      setCompleted(false);
    }

    setSteps(
      steps.map((step, index) => {
        if (index === defaultStepProp) {
          return {
            ...step,
            active: true,
            completed: false,
          };
        }

        return {
          ...step,
          active: false,
          completed: false,
        };
      }),
    );

    if (!onInit && onStepClick) {
      onStepClick(event, {
        key: `step-${defaultStepProp}`,
        active: true,
        completed: false,
        label: '',
      });
    } else if (!onInit && !onStepClick) {
      setActiveStep({
        key: `step-${defaultStepProp}`,
        active: true,
        completed: false,
        label: '',
      });
    }
  };

  const renderChildren = (children: ReactNode): Slots[] => {
    if (Array.isArray(children)) {
      const childrenArray = Children.toArray(children);
      return childrenArray
        .map((child, index) => {
          if (isValidElement(child) && child.type === Step) {
            const isLast = index === Children.count(children) - 1;
            return {
              node: cloneElement(child as StepComponent, {
                index,
                classes: classes?.step,
                id: index === defaultStepProp ? `step-${index}` : undefined,
                active: steps[index]?.active,
                completed: steps[index]?.completed,
                linear,
                onClick: !linear
                  ? (event: MouseEvent<HTMLButtonElement>) =>
                      handleStepClick(event, index)
                  : undefined,
              }),
              connector: (
                <Connector classes={classes?.connector} lastIndex={isLast} />
              ),
            };
          }
          return null;
        })
        .filter((ele) => ele !== null) as Slots[];
    }

    return [];
  };

  const children = renderChildren(childrenProp);
  const activeStepLabel =
    activeStep?.label || capitalize(activeStep?.key || '');
  const activeStepCompleted = activeStep?.completed;

  useEffect(() => {
    if (linear) {
      const allCompleted = steps.every((step) => step?.completed);
      if (allCompleted) {
        setCompleted(true);
        if (onComplete) {
          onComplete(true);
        }
      } else {
        setCompleted(false);
        if (onComplete) {
          onComplete(false);
        }
      }
    }
  }, [steps, setCompleted, linear, onComplete]);

  return (
    <div className={outerClasses}>
      <div className={rootClasses} ref={ref} role="list" {...rest}>
        {children.map(({ node, connector }, index) => (
          <Fragment key={`progress-stepper-node-${index}`}>
            {node}
            {orientation === 'horizontal' && !isBelowSm && connector}
          </Fragment>
        ))}
      </div>
      {(!hideControls || linear || completed) && (
        <div className={controlsClasses}>
          <Typography className={classes?.label} color="primary" variant="base">
            {completed ? 'Completed' : activeStepLabel}
          </Typography>
          <div className={buttonsContainerClasses}>
            {completed && !linear && (
              <Button
                classes={classes?.button}
                onClick={handleReset}
                variant="outline"
              >
                RESET
              </Button>
            )}
            {!completed && linear && (
              <>
                <Button
                  classes={classes?.button}
                  onClick={handleNext}
                  variant="outline"
                >
                  NEXT
                </Button>
                <Button
                  classes={classes?.button}
                  onClick={handleComplete}
                  variant="outline"
                >
                  {activeStepCompleted ? 'UNDO' : 'COMPLETE'}
                </Button>
              </>
            )}
            {completed && linear && (
              <>
                <Button
                  classes={classes?.button}
                  onClick={handleComplete}
                  variant="outline"
                >
                  UNDO
                </Button>
                <Button
                  classes={classes?.button}
                  onClick={handleReset}
                  variant="outline"
                >
                  FINISH
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ProgressStepper.displayName = 'ProgressStepper';

export { ProgressStepper };
export type { ProgressStepperClasses, StepType };
