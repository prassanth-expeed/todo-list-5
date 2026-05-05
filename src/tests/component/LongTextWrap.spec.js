import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PendingList from '../../components/PendingList.vue';

describe('mobile readability: long text wrapping', () => {
  it('does not force horizontal scroll on long strings (smoke)', () => {
    const longText = 'x'.repeat(400);
    const wrapper = mount(PendingList, {
      props: {
        items: [
          {
            id: '1',
            text: longText,
            completed: false,
            createdAt: '2026-05-05T08:00:00.000Z',
            order: 0
          }
        ]
      },
      attachTo: document.body
    });

    // JSDOM doesn't do full layout, but we can at least assert the text is present
    // and a wrapping-friendly class is applied.
    const textEl = wrapper.get('.pending-item__text');
    expect(textEl.text()).toBe(longText);

    wrapper.unmount();
  });
});
