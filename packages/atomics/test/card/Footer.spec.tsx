import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Footer } from '../../src/card/Footer';

afterEach(cleanup);

describe('Footer', () => {
  it('renders title, subtitle, and description', () => {
    render(
      <Footer title="Project" subtitle="Case study" description="A detailed project summary." />
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Project' })).toBeDefined();
    expect(screen.getByText('Case study')).toBeDefined();
    expect(screen.getByText('A detailed project summary.')).toBeDefined();
  });

  it('renders button and anchor actions', () => {
    const handleClick = vi.fn();
    render(
      <Footer
        actions={[
          { label: 'Save', onClick: handleClick, variant: 'outline' },
          {
            label: 'Open',
            href: '/projects',
            target: '_blank',
            endAdornment: faArrowRight,
          },
        ]}
      />
    );

    const save = screen.getByRole('button', { name: 'Save' });
    const open = screen.getByRole('link', { name: 'Open' });

    fireEvent.click(save);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(open.getAttribute('href')).toBe('/projects');
    expect(open.getAttribute('target')).toBe('_blank');
    expect(open.querySelector('svg')?.getAttribute('data-icon')).toBe('arrow-right');
  });
});
