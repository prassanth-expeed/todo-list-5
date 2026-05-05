import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import HomeView from '../../views/HomeView.vue';
import { STORE_KEY } from '../../store';

function createTestStore({ pending = [], notice = null } = {}) {
  return {
    state: { notice },
    pendingCount: { value: pending.length },
    sortedPendingTodos: { value: pending },
    ensureActiveFilter: vi.fn()
  };
}

describe('HomeView', () => {
  it('renders header and pending count and calls ensureActiveFilter on mount', async () => {
    const store = createTestStore({
      pending: [
        {
          id: '1',
          text: 'A',
          completed: false,
          createdAt: '2026-05-05T08:00:00.000Z',
          order: 1
        }
      ]
    });

    const wrapper = mount(HomeView, {
      global: {
        provide: {
          [STORE_KEY]: store
        }
      }
    });

    expect(wrapper.get('h1').text()).toBe('Pending Tasks');
    expect(wrapper.text()).toContain('1 pending');
    expect(store.ensureActiveFilter).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no pending items', () => {
    const store = createTestStore({ pending: [] });

    const wrapper = mount(HomeView, {
      global: {
        provide: {
          [STORE_KEY]: store
        }
      }
    });

    expect(wrapper.text()).toContain('0 pending');
    expect(wrapper.text()).toContain('No pending tasks');
    expect(wrapper.find('ul').exists()).toBe(false);
  });

  it('shows reset notice when notice.kind=storage-reset and allows dismiss', async () => {
    const store = createTestStore({
      pending: [],
      notice: { kind: 'storage-reset', message: 'reset happened' }
    });

    const wrapper = mount(HomeView, {
      global: {
        provide: {
          [STORE_KEY]: store
        }
      }
    });

    const notice = wrapper.get('.notice');
    expect(notice.text()).toContain('reset happened');

    await wrapper.get('button').trigger('click');

    expect(wrapper.find('.notice').exists()).toBe(false);
  });
});
