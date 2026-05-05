import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PendingList from '../../components/PendingList.vue';

describe('PendingList read-only', () => {
  it('renders no actionable controls per item', () => {
    const items = [
      {
        id: '1',
        text: 'Task',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 0
      }
    ];

    const wrapper = mount(PendingList, { props: { items } });

    expect(wrapper.find('li button').exists()).toBe(false);
    expect(wrapper.find('li input').exists()).toBe(false);
    expect(wrapper.find('li a').exists()).toBe(false);
  });
});
