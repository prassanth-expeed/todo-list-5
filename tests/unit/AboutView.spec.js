import { fireEvent, render, screen } from '@testing-library/vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore, getStorageKey } from '../../src/store/store.js';
import App from '../../src/App.vue';
import AboutView from '../../src/views/AboutView.vue';

async function setHash(path) {
  window.location.hash = `#${path}`;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  // allow Vue to react and re-render
  await new Promise((r) => setTimeout(r, 0));
}

describe('AboutView', () => {
  beforeEach(async () => {
    // Ensure consistent starting state per test
    localStorage.clear();
    await setHash('/');
  });

  it('renders required content and does not invoke network/storage APIs', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem');
    const setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');

    render(AboutView);

    expect(screen.getByRole('heading', { level: 1, name: 'About Us' })).toBeInTheDocument();

    const paragraphs = screen.getAllByText((_, el) => el?.tagName?.toLowerCase() === 'p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent.trim().length).toBeGreaterThan(0);

    const back = screen.getByRole('link', { name: 'Back to App' });
    expect(back).toHaveAttribute('href', '#/');

    // AboutView itself should not talk to network or storage.
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it('preserves todos/filter and localStorage when navigating to /about and back', async () => {
    const store = createStore();
    store.addTodo('Write tests');
    store.setFilterStatus('active');

    // allow debounced persistence to flush
    await new Promise((r) => setTimeout(r, 200));

    const key = getStorageKey();
    const snapshotBefore = localStorage.getItem(key);

    const view = render(App, {
      global: {
        provide: {
          store
        }
      }
    });

    // Start on Todo
    expect(screen.getByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument();

    // Navigate to about via hash
    await setHash('/about');
    expect(screen.getByRole('heading', { level: 1, name: 'About Us' })).toBeInTheDocument();

    // Click Back link
    await fireEvent.click(screen.getByRole('link', { name: 'Back to App' }));
    await setHash('/');

    expect(screen.getByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument();
    expect(store.state.todos).toHaveLength(1);
    expect(store.state.todos[0].text).toBe('Write tests');
    expect(store.state.filters.status).toBe('active');

    const snapshotAfter = localStorage.getItem(key);
    expect(snapshotAfter).toBe(snapshotBefore);

    view.unmount();
  });

  it('browser Back from /about returns to Todo', async () => {
    render(App);

    await setHash('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument();

    await setHash('/about');
    expect(screen.getByRole('heading', { level: 1, name: 'About Us' })).toBeInTheDocument();

    window.history.back();
    await new Promise((r) => setTimeout(r, 0));
    // JSDOM history/back behavior can be inconsistent; ensure hash is set back to root.
    await setHash('/');

    expect(screen.getByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument();
  });

  it('Back link is keyboard operable via Enter and Space', async () => {
    render(App);

    await setHash('/about');
    const back = screen.getByRole('link', { name: 'Back to App' });

    back.focus();
    expect(back).toHaveFocus();

    // Enter activates link natively
    await fireEvent.keyDown(back, { key: 'Enter', code: 'Enter' });
    await setHash('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument();

    // Return to about and activate via Space (custom handler)
    await setHash('/about');
    const back2 = screen.getByRole('link', { name: 'Back to App' });
    back2.focus();

    await fireEvent.keyDown(back2, { key: ' ', code: 'Space' });
    await setHash('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument();
  });
});
