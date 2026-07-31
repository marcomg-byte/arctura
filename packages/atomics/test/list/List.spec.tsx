import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { List } from '../../src/list/List';
import { ListItem } from '../../src/list/ListItem';

afterEach(cleanup);

describe('List', () => {
  it('renders as ul, ol, or div with size/background classes', () => {
    const { rerender } = render(
      <List background="secondary" size="lg" data-testid="list">
        <ListItem label="One" />
      </List>
    );

    expect(screen.getByTestId('list').tagName).toBe('UL');
    expect(screen.getByTestId('list').className).toContain('au:bg-secondary');
    expect(screen.getByTestId('list').className).toContain('au:w-40');

    rerender(
      <List as="ol" data-testid="list">
        <ListItem label="One" />
      </List>
    );
    expect(screen.getByTestId('list').tagName).toBe('OL');

    rerender(
      <List as="div" fullWidth data-testid="list">
        <ListItem label="One" />
      </List>
    );
    expect(screen.getByTestId('list').tagName).toBe('DIV');
    expect(screen.getByTestId('list').className).toContain('au:w-full');
  });

  it('propagates selection props and reports selected items', () => {
    const handleChange = vi.fn();
    render(
      <List onChange={handleChange} divider status="info">
        <ListItem title="First" label="Alpha" value="alpha" defaultSelected />
        <ListItem title="Second" label="Beta" value="beta" />
      </List>
    );

    expect(handleChange).toHaveBeenCalledWith([
      { key: 'list-item-1', label: 'Alpha', value: 'alpha' },
    ]);

    handleChange.mockClear();
    fireEvent.click(screen.getByText('Beta').closest('li') as HTMLElement);

    expect(handleChange).toHaveBeenCalledWith([
      { key: 'list-item-1', label: 'Alpha', value: 'alpha' },
      { key: 'list-item-2', label: 'Beta', value: 'beta' },
    ]);
    expect(document.querySelector('.au\\:border-b-primary')).toBeDefined();
  });

  it('respects non-selectable and disabled states', () => {
    const handleChange = vi.fn();

    render(
      <List selectable={false} disabled onChange={handleChange}>
        <ListItem label="Alpha" value="alpha" defaultSelected />
      </List>
    );

    const item = screen.getByText('Alpha').closest('li') as HTMLElement;

    fireEvent.click(item);

    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.className).toContain('au:opacity-80');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders nested ListItem children and item target variants', () => {
    render(
      <List itemsAs="a">
        <div>
          <ListItem label="Nested" href="/nested" />
        </div>
      </List>
    );

    const item = screen.getByText('Nested').closest('a') as HTMLElement;

    expect(item.tagName).toBe('A');
    expect(item.getAttribute('href')).toBe('/nested');
  });
});
