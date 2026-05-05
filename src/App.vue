<script setup>
import { computed, inject, provide } from 'vue';
import { createRouter } from './router/router.js';
import { createStore } from './store/store.js';
import TodoView from './views/TodoView.vue';
import AboutView from './views/AboutView.vue';

const providedStore = createStore();
provide('store', providedStore);

const router = createRouter(window);
provide('router', router);

// If tests (or an embedding parent) provide a store, reuse it so state is preserved.
const injectedStore = inject('store', null);
if (!injectedStore) {
  provide('store', providedStore);
}

const route = computed(() => router.currentRoute.value);
</script>

<template>
  <TodoView v-if="route === '/'" />
  <AboutView v-else-if="route === '/about'" />
  <TodoView v-else />
</template>
