import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Step } from '@/components/ui/atomics/progress-stepper/Step';
import { Typography } from '@/components/ui/atomics/typography/Typography';

afterEach(cleanup);

describe('Step', () => {
  it('renders a linear node with index when inactive', () => {
    render(<Step index={0} label="First step" title="First" />);

    expect(screen.getByText('1')).toBeDefined();
    expect(screen.queryByText('First')).toBeNull();
  });

  it('renders active title and description', () => {
    render(
      <Step
        active
        index={1}
        title="Details"
        description={<Typography>Step description</Typography>}
      />,
    );

    const title = screen.getByRole('heading', { level: 3, name: 'Details' });
    const description = screen.getByText('Step description');

    expect(title.className).toContain('mg:text-base');
    expect(description.className).toContain('mg:text-xs');
  });

  it('renders completed non-linear steps as clickable fabs', () => {
    const handleClick = vi.fn();
    render(
      <Step
        active
        completed
        linear={false}
        label="Clickable step"
        icon={faCheck}
        onClick={handleClick}
        title="Done"
      />,
    );

    const button = screen.getByRole('button', { name: 'Clickable step' });

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(button.className).toContain('mg:border-success');
    expect(button.querySelector('svg')?.getAttribute('data-icon')).toBe(
      'check',
    );
  });
});
