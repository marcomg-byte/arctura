import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faInfoCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Form } from '@/src/form/Form';
import { TextInput } from '@/src/form/TextInput';
import { TextArea } from '@/src/form/TextArea';

vi.mock('@/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib')>();
  return {
    ...actual,
    useBreakpoints: () => ({
      isBelow: (breakpoint: string) => breakpoint === 'sm',
      current: 'xs',
    }),
  };
});

afterEach(cleanup);

describe('Form', () => {
  it('renders form attributes, header adornments, footer actions, and disclaimer', () => {
    const { container } = render(
      <Form
        aria-label="Contact form"
        action="/send"
        method="post"
        name="contact"
        noValidate
        title="Contact"
        startAdornment={faPaperPlane}
        endAdornment={{ src: '/images/logo.png', alt: 'Logo' }}
        disclaimer={{ adornment: faInfoCircle, text: 'We reply soon.' }}
      >
        <TextInput aria-label="Name" defaultValue="Marco" />
      </Form>
    );

    const form = screen.getByRole('form', { name: 'Contact form' });

    expect(form.getAttribute('action')).toContain('/send');
    expect(form.getAttribute('method')).toBe('post');
    expect(form.getAttribute('name')).toBe('contact');
    expect(form.hasAttribute('novalidate')).toBe(true);
    expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeDefined();
    expect(screen.getByAltText('Logo').getAttribute('src')).toContain('logo.png');
    expect(screen.getByText('We reply soon.')).toBeDefined();
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'SUBMIT' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'RESET' })).toBeDefined();
  });

  it('clones text fields, reports changes, and submits current values', () => {
    const handleChange = vi.fn();
    const handleSubmit = vi.fn(
      (event: { preventDefault: () => void }, _values?: unknown, _error?: boolean) =>
        event.preventDefault()
    );

    render(
      <Form aria-label="Contact form" onChange={handleChange} onSubmit={handleSubmit}>
        <TextInput aria-label="Name" defaultValue="Marco" />
        <div>
          <TextArea aria-label="Message" defaultValue="Hello" />
        </div>
      </Form>
    );

    handleChange.mockClear();

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Mario' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'Updated' },
    });

    expect(handleChange).toHaveBeenCalled();

    fireEvent.submit(screen.getByRole('form', { name: 'Contact form' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.calls[0][1]).toEqual([
      {
        key: 'form-text-input-1',
        type: 'TextInput',
        error: undefined,
        value: 'Mario',
      },
      {
        key: 'form-text-area-2',
        type: 'TextArea',
        value: 'Updated',
      },
    ]);
    expect(handleSubmit.mock.calls[0][2]).toBe(false);
  });

  it('resets cloned field values to initial state', () => {
    const handleReset = vi.fn();

    render(
      <Form aria-label="Contact form" onReset={handleReset}>
        <TextInput aria-label="Name" defaultValue="Marco" />
      </Form>
    );

    const input = screen.getByRole('textbox', { name: 'Name' });

    fireEvent.change(input, { target: { value: 'Mario' } });
    expect((input as HTMLInputElement).value).toBe('Mario');

    fireEvent.click(screen.getByRole('button', { name: 'RESET' }));

    expect(handleReset).toHaveBeenCalledTimes(1);
    expect((input as HTMLInputElement).value).toBe('Marco');
  });
});
