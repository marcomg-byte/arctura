import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ListItem } from '../../src/list/ListItem';

afterEach(cleanup);

describe('ListItem', () => {
  it('renders as an li by default with title and label', () => {
    render(<ListItem title="Projects" label="Recent work" selected />);

    const item = screen.getByText('Projects').closest('li') as HTMLElement;

    expect(item.tagName).toBe('LI');
    expect(item.className).toContain('au:bg-black/50');
    expect(screen.getByText('Recent work')).toBeDefined();
  });

  it('renders anchor and div variants', () => {
    const { rerender } = render(
      <ListItem as="a" href="/projects" target="_blank" label="Projects" />
    );

    const anchor = screen.getByText('Projects').closest('a') as HTMLElement;
    expect(anchor.getAttribute('href')).toBe('/projects');
    expect(anchor.getAttribute('target')).toBe('_blank');

    rerender(<ListItem as="div" label="Panel" />);

    expect(screen.getByText('Panel').closest('div')?.tagName).toBe('DIV');
  });

  it('calls click handlers or selects itself when uncontrolled', () => {
    const handleClick = vi.fn();
    const { rerender } = render(<ListItem label="Handled" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Handled').closest('li') as HTMLElement);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<ListItem label="Selectable" />);
    const item = screen.getByText('Selectable').closest('li') as HTMLElement;

    fireEvent.click(item);

    expect(item.className).toContain('au:bg-black/50');
  });

  it('renders icon and image adornments with status classes', () => {
    const { rerender, container } = render(
      <ListItem label="Done" adornment={faCheck} status="success" />
    );

    expect(container.querySelector('svg')?.getAttribute('data-icon')).toBe('check');
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('au:text-success');

    rerender(<ListItem label="Avatar" adornment={{ src: '/images/avatar.png', alt: 'Avatar' }} />);

    expect(screen.getByAltText('Avatar').getAttribute('src')).toContain('avatar.png');
  });
});
