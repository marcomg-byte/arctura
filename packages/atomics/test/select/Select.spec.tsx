import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Select } from '../../src/select/Select';

afterEach(cleanup);

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta', icon: faCheck },
];

describe('Select', () => {
  it('renders label, placeholder, and hidden input', () => {
    const { container } = render(<Select label="Choice" name="choice" placeholder="Pick one" />);

    expect(screen.getByText('Choice')).toBeDefined();
    expect(screen.getByText('Pick one')).toBeDefined();
    expect(container.querySelector('input')?.getAttribute('name')).toBe('choice');
  });

  it('opens options and updates uncontrolled selection', () => {
    render(<Select options={options} placeholder="Pick one" />);

    fireEvent.click(screen.getByText('Pick one'));
    expect(screen.getByText('Alpha')).toBeDefined();
    expect(screen.getByText('Beta')).toBeDefined();

    fireEvent.click(screen.getByText('Beta'));

    expect(screen.getByText('beta')).toBeDefined();
    expect(screen.queryByText('Alpha')).toBeNull();
  });

  it('calls onChange without mutating controlled display', () => {
    const handleChange = vi.fn();
    render(<Select value="alpha" options={options} onChange={handleChange} />);

    fireEvent.click(screen.getByText('alpha'));
    fireEvent.click(screen.getByText('Beta'));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('alpha')).toBeDefined();
  });

  it('capitalizes selected values when requested', () => {
    render(<Select capitalize options={options} placeholder="Pick one" />);

    fireEvent.click(screen.getByText('Pick one'));
    fireEvent.click(screen.getByText('Beta'));

    expect(screen.getByText('Beta')).toBeDefined();
  });

  it('does not open when disabled', () => {
    render(<Select disabled options={options} placeholder="Pick one" />);

    const trigger = screen.getByText('Pick one').parentElement as HTMLElement;
    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(trigger.getAttribute('tabindex')).toBe('-1');
    expect(screen.queryByText('Alpha')).toBeNull();
  });

  it('matches TextInput width placement for size and fullWidth props', () => {
    const { rerender } = render(<Select placeholder="Pick one" size="lg" />);

    const placeholder = screen.getByText('Pick one');
    const trigger = placeholder.parentElement as HTMLElement;
    const root = trigger.parentElement as HTMLElement;

    expect(placeholder.className).toContain('au:w-52');
    expect(root.className).not.toContain('au:w-52');
    expect(trigger.className).not.toContain('au:w-full');

    rerender(<Select fullWidth placeholder="Pick one" size="lg" />);

    expect(screen.getByText('Pick one').className).toContain('au:grow');
    expect(screen.getByText('Pick one').parentElement?.className).toContain('au:w-full');
  });

  it('closes when clicking away and renders option icons', () => {
    const { container } = render(<Select options={options} placeholder="Pick one" />);

    fireEvent.click(screen.getByText('Pick one'));

    expect(container.querySelector('li svg')?.getAttribute('data-icon')).toBe('check');

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Alpha')).toBeNull();
  });
});
