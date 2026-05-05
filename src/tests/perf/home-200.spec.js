import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HomeView from '../../views/HomeView.vue';
import { STORE_KEY } from '../../store';
import items from '../fixtures/200-pending.json';

function createTestStore({ pending = [] } = {}) {
  return {
    state: { notice: null },
    pendingCount: { value: pending.length },
    sortedPendingTodos: { value: pending },
    ensureActiveFilter() {}
  };
}

describe('perf smoke: HomeView 200 pending', () => {
  it('mounts quickly with 200 items (smoke)', () => {
    const store = createTestStore({ pending: items });

    const t0 = performance.now();
    const wrapper = mount(HomeView, {
      global: {
        provide: {
          [STORE_KEY]: store
        }
      }
    });
    const t1 = performance.now();

    const elapsed = t1 - t0;

    // Generous budget for CI/JSDOM; intent is to catch accidental O(N^2) dom work.
    expect(elapsed).toBeLessThan(1000);
    expect(wrapper.findAll('li').length).toBe(200);

    // Helpful log for trend visibility in CI output.
    // eslint-disable-next-line no-console
    console.log(`HomeView mount elapsed(ms): ${elapsed.toFixed(1)}`);
  });
});
