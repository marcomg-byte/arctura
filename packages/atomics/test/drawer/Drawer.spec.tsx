import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Drawer } from '../../src/drawer/Drawer';

afterEach(cleanup);

describe('Drawer', () => {
  it('renders open drawer content, backdrop, and header slots', () => {
    const handleClose = vi.fn();

    const { container } = render(
      <Drawer
        open
        onClose={handleClose}
        header={{
          title: 'Menu',
          leftSlot: <span>Left</span>,
          rightSlot: <span>Right</span>,
        }}
      >
        Drawer content
      </Drawer>
    );

    const root = screen.getByText('Drawer content').closest('.au\\:relative');
    const overlay = container.querySelector('[aria-hidden="true"]');

    expect(screen.getByText('Menu')).toBeDefined();
    expect(screen.getByText('Left')).toBeDefined();
    expect(screen.getByText('Right')).toBeDefined();
    expect(root?.className).toContain('au:translate-x-0');
    expect(overlay?.className).toContain('au:opacity-100');
  });

  it('applies closed transform classes by anchor', () => {
    render(
      <Drawer open={false} onClose={vi.fn()} anchor="right">
        Content
      </Drawer>
    );

    const root = screen.getByText('Content').closest('.au\\:relative');

    expect(root?.className).toContain('au:translate-x-full');
  });

  it('calls onClose from close button and Escape key', () => {
    const handleClose = vi.fn();

    render(
      <Drawer open onClose={handleClose}>
        Content
      </Drawer>
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('does not close on Escape when closeOnEscape is false', () => {
    const handleClose = vi.fn();

    render(
      <Drawer open closeOnEscape={false} onClose={handleClose}>
        Content
      </Drawer>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('uses custom backdrop click handler or internal close state', () => {
    const handleBackdropClick = vi.fn();
    const { rerender } = render(
      <Drawer open onClose={vi.fn()} onBackdropClick={handleBackdropClick}>
        Content
      </Drawer>
    );

    fireEvent.click(document.querySelector('[aria-hidden="true"]') as Element);
    expect(handleBackdropClick).toHaveBeenCalledTimes(1);

    rerender(
      <Drawer open onClose={vi.fn()} showBackdrop={false}>
        Content
      </Drawer>
    );

    expect(document.querySelector('[aria-hidden="true"]')?.className).toContain('au:opacity-0');
  });
});
