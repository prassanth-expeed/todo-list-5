<script setup>
import { computed, onMounted, ref } from 'vue';
import PendingList from '../components/PendingList.vue';
import { useStore } from '../store';

const store = useStore();

const dismissedStorageReset = ref(false);

onMounted(() => {
  store.ensureActiveFilter();
});

const pendingCount = computed(() => store.pendingCount.value);
const items = computed(() => store.sortedPendingTodos.value);

const showNotice = computed(
  () => store.state.notice?.kind === 'storage-reset' && dismissedStorageReset.value === false
);

function dismissNotice() {
  dismissedStorageReset.value = true;
}
</script>

<template>
  <main>
    <header>
      <h1 tabindex="-1">Pending Tasks</h1>
      <p aria-live="polite">{{ pendingCount }} pending</p>

      <section v-if="showNotice" class="notice" role="status" aria-label="Notice">
        <div class="notice__row">
          <p>{{ store.state.notice.message }}</p>
          <button type="button" @click="dismissNotice">Dismiss</button>
        </div>
      </section>
    </header>

    <section v-if="pendingCount === 0" aria-label="Empty state" style="margin-top: 16px">
      <p>No pending tasks</p>
    </section>

    <section v-else aria-label="Pending list" style="margin-top: 16px">
      <PendingList :items="items" />
    </section>
  </main>
</template>
