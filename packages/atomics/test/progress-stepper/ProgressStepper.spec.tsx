import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ProgressStepper } from '@/components/ui/atomics/progress-stepper/ProgressStepper';
import { Step } from '@/components/ui/atomics/progress-stepper/Step';

const breakpointState = vi.hoisted(() => ({ belowSm: false }));

vi.mock('@/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib')>();
  return {
    ...actual,
    useBreakpoints: () => ({
      isBelow: (breakpoint: string) =>
        breakpoint === 'sm' ? breakpointState.belowSm : false,
      current: breakpointState.belowSm ? 'xs' : 'lg',
    }),
  };
});

beforeEach(() => {
  breakpointState.belowSm = false;
});

afterEach(cleanup);

describe('ProgressStepper', () => {
  it('initializes with the default step and renders linear controls', () => {
    const handleInit = vi.fn();
    render(
      <ProgressStepper onInit={handleInit} defaultStep={1}>
        <Step label="First" title="First" />
        <Step label="Second" title="Second" />
      </ProgressStepper>,
    );

    expect(handleInit).toHaveBeenCalled();
    expect(screen.getByText('Second')).toBeDefined();
    expect(screen.getByRole('button', { name: 'NEXT' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'COMPLETE' })).toBeDefined();
  });

  it('moves through linear next, complete, undo, and finish controls', () => {
    const handleComplete = vi.fn();
    render(
      <ProgressStepper onComplete={handleComplete}>
        <Step label="First" title="First" />
        <Step label="Second" title="Second" />
      </ProgressStepper>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'NEXT' }));
    expect(screen.getAllByText('Second').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'COMPLETE' }));
    expect(screen.getByRole('button', { name: 'UNDO' })).toBeDefined();
  });

  it('calls onStepClick for non-linear step clicks and reset when completed', () => {
    const handleStepClick = vi.fn();
    const handleComplete = vi.fn();

    render(
      <ProgressStepper
        linear={false}
        completed
        onStepClick={handleStepClick}
        onComplete={handleComplete}
      >
        <Step label="First" title="First" />
        <Step label="Second" title="Second" />
      </ProgressStepper>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    expect(handleStepClick).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'RESET' }));
    expect(handleComplete).toHaveBeenCalledWith(false);
  });

  it('uses vertical layout on small breakpoints unless forced horizontal', () => {
    breakpointState.belowSm = true;

    const { rerender } = render(
      <ProgressStepper data-testid="stepper">
        <Step label="First" />
        <Step label="Second" />
      </ProgressStepper>,
    );

    expect(screen.getByRole('list').className).toContain('mg:flex-col');

    rerender(
      <ProgressStepper data-testid="stepper" forceHorizontal>
        <Step label="First" />
        <Step label="Second" />
      </ProgressStepper>,
    );

    expect(screen.getByRole('list').className).not.toContain('mg:flex-col');
  });
});
