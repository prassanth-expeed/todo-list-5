import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
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

describe('keyboard navigation smoke', () => {
  it('tab order reaches dismiss button when notice is present', async () => {
    const store = createTestStore({
      pending: [],
      notice: { kind: 'storage-reset', message: 'reset happened' }
    });

    const wrapper = mount(HomeView, {
      attachTo: document.body,
      global: {
        provide: {
          [STORE_KEY]: store
        }
      }
    });

    const button = wrapper.get('button');
    button.element.focus();

    expect(document.activeElement).toBe(button.element);

    wrapper.unmount();
  });
});
