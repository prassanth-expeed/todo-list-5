import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PendingList from '../../components/PendingList.vue';

describe('PendingList security', () => {
  it('renders script-like content as text (no HTML execution)', () => {
    const items = [
      {
        id: '1',
        text: '<script>window.__pwned=true</script>',
        completed: false,
        createdAt: '2026-05-05T08:00:00.000Z',
        order: 0
      }
    ];

    const wrapper = mount(PendingList, { props: { items } });

    expect(wrapper.text()).toContain('<script>window.__pwned=true</script>');
    expect(wrapper.find('script').exists()).toBe(false);
  });
});
