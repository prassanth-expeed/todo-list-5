import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PendingList from '../../components/PendingList.vue';

describe('PendingList', () => {
  it('renders semantic ul/li and shows only todo.text', () => {
    const items = [
      {
        id: '1',
        text: 'Hello',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 0
      }
    ];

    const wrapper = mount(PendingList, { props: { items } });

    expect(wrapper.find('ul').exists()).toBe(true);
    const lis = wrapper.findAll('li');
    expect(lis).toHaveLength(1);
    expect(lis[0].text()).toBe('Hello');

    // no per-item actions
    expect(wrapper.find('button').exists()).toBe(false);
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
  });
});
