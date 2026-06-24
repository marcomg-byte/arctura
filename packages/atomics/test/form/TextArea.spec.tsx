import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { TextArea } from '../../src/form/TextArea';

afterEach(cleanup);

describe('TextArea', () => {
  it('renders label, required marker, and native textarea attributes', () => {
    render(
      <TextArea
        aria-label="Message"
        id="message"
        name="message"
        label="Message"
        placeholder="Write here"
        rows={4}
        cols={20}
        required
        fullWidth
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(screen.getByText('Message')).toBeDefined();
    expect(screen.getByText('*')).toBeDefined();
    expect(textarea.getAttribute('id')).toBe('message');
    expect(textarea.getAttribute('name')).toBe('message');
    expect(textarea.getAttribute('rows')).toBe('4');
    expect(textarea.className).toContain('au:w-full');
  });

  it('updates uncontrolled values and clears with Escape', () => {
    render(<TextArea aria-label="Message" defaultValue="Hello" />);

    const textarea = screen.getByRole('textbox', { name: 'Message' });

    fireEvent.change(textarea, { target: { value: 'Updated' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('Updated');

    fireEvent.keyDown(textarea, { key: 'Escape', code: 'Escape' });
    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  it('renders clear button and adornments', () => {
    const handleClear = vi.fn();
    const handleAction = vi.fn();

    render(
      <TextArea
        aria-label="Message"
        clearable
        defaultValue="Hello"
        onClear={handleClear}
        startAdornments={[{ icon: faComment }, { children: 'Insert', onClick: handleAction }]}
        endAdornments={[{ src: '/images/icon.png', alt: 'End icon' }]}
        classes={{ adornment: 'custom-adornment' }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));
    fireEvent.click(screen.getByRole('button', { name: 'Insert' }));

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(screen.getByAltText('End icon').getAttribute('src')).toContain('icon.png');
    expect(
      document.querySelector('svg[data-icon="comment"]')?.closest('button')?.getAttribute('class')
    ).toContain('custom-adornment');
  });

  it('applies status, color, and custom classes', () => {
    const { container } = render(
      <TextArea
        aria-label="Message"
        status="warning"
        color="white"
        classes={{ container: 'custom-container', textarea: 'custom-area' }}
      />
    );

    const wrapper = container.firstElementChild as HTMLElement;
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(wrapper.className).toContain('au:border-warning');
    expect(wrapper.className).toContain('custom-container');
    expect(textarea.className).toContain('au:text-white');
    expect(textarea.className).toContain('custom-area');
  });
});
