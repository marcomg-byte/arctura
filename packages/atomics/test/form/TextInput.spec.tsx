import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { TextInput } from '@/components/ui/atomics/form/TextInput';

afterEach(cleanup);

describe('TextInput', () => {
  it('renders label, helper text, required marker, and native attributes', () => {
    render(
      <TextInput
        aria-label="Email"
        id="email"
        name="email"
        label="Email"
        helperText="Use a valid address"
        placeholder="hello@example.com"
        required
        fullWidth
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getAllByText('*')).toHaveLength(2);
    expect(screen.getByText('Use a valid address')).toBeDefined();
    expect(input.getAttribute('id')).toBe('email');
    expect(input.getAttribute('name')).toBe('email');
    expect(input.getAttribute('placeholder')).toBe('hello@example.com');
    expect(input.className).toContain('mg:grow');
  });

  it('updates uncontrolled values and clears with Escape', () => {
    render(<TextInput aria-label="Name" defaultValue="Marco" />);

    const input = screen.getByRole('textbox', { name: 'Name' });

    fireEvent.change(input, { target: { value: 'Mario' } });
    expect((input as HTMLInputElement).value).toBe('Mario');

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('runs validation callbacks for pattern errors', () => {
    const handleError = vi.fn();

    render(
      <TextInput aria-label="Code" pattern={/^\d+$/} onError={handleError} />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Code' }), {
      target: { value: 'abc' },
    });

    expect(handleError).toHaveBeenCalledWith(true);
  });

  it('renders clear button and start/end adornments', () => {
    const handleClear = vi.fn();

    const { container } = render(
      <TextInput
        aria-label="Search"
        clearable
        defaultValue="query"
        onClear={handleClear}
        startAdornment={faEnvelope}
        endAdornment={{ src: '/images/icon.png', alt: 'End icon' }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(
      container
        .querySelector('svg[data-icon="envelope"]')
        ?.getAttribute('data-icon'),
    ).toBe('envelope');
    expect(screen.getByAltText('End icon').getAttribute('src')).toContain(
      'icon.png',
    );
  });

  it('toggles password visibility', () => {
    render(
      <TextInput aria-label="Password" type="password" defaultValue="secret" />,
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;

    expect(input.getAttribute('type')).toBe('password');

    fireEvent.click(
      screen.getByRole('button', { name: 'Toggle password visibility' }),
    );

    expect(input.getAttribute('type')).toBe('text');
  });
});
