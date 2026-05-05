import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import HomeView from '../../views/HomeView.vue';
import { STORE_KEY } from '../../store';

function createTestStore({ pending = [], notice = null } = {}) {
  return {
    state: { notice },
    pendingCount: { value: pending.length },
    sortedPendingTodos: { value: pending },
    ensureActiveFilter() {}
  };
}

describe('a11y: HomeView', () => {
  it('has no critical axe issues', async () => {
    const store = createTestStore({
      pending: [
        {
          id: '1',
          text: 'Hello',
          completed: false,
          createdAt: '2026-05-05T08:00:00.000Z',
          order: 0
        }
      ]
    });

    const wrapper = mount(HomeView, {
      attachTo: document.body,
      global: {
        provide: {
          [STORE_KEY]: store
        }
      }
    });

    const results = await axe(wrapper.element, {
      rules: {
        // avoid false positives in JSDOM
        region: { enabled: false }
      }
    });

    // In this codebase we treat any violations as failures.
    expect(results.violations).toEqual([]);

    wrapper.unmount();
  });
});
