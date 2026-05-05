import { describe, expect, it } from 'vitest';
import { createRouter, normalizePath } from '../../src/router/router.js';

describe('router', () => {
  it('normalizePath returns / for unknown paths', () => {
    expect(normalizePath('/nope')).toBe('/');
    expect(normalizePath('nope')).toBe('/');
  });

  it('navigate updates location.hash and currentRoute', () => {
    const listeners = new Map();
    const win = {
      location: { hash: '' },
      addEventListener: (event, cb) => listeners.set(event, cb)
    };

    const router = createRouter(win);
    expect(router.currentRoute.value).toBe('/');

    router.navigate('/about');
    expect(win.location.hash).toBe('#/about');

    // simulate hashchange
    listeners.get('hashchange')?.();
    expect(router.currentRoute.value).toBe('/about');
  });

  it('unknown hash normalizes to /', () => {
    const listeners = new Map();
    const win = {
      location: { hash: '#/unknown' },
      addEventListener: (event, cb) => listeners.set(event, cb)
    };

    const router = createRouter(win);
    expect(router.currentRoute.value).toBe('/');

    win.location.hash = '#/about';
    listeners.get('hashchange')?.();
    expect(router.currentRoute.value).toBe('/about');
  });
});
