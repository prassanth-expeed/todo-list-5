<script setup>
import { inject, ref } from 'vue';

const store = inject('store');
if (!store) {
  throw new Error('Store not provided');
}

const text = ref('');

function onSubmit() {
  store.addTodo(text.value);
  text.value = '';
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <h1 style="margin: 0">Todos</h1>
        <a href="#/about">About</a>
      </header>

      <form @submit.prevent="onSubmit" style="margin-top: 16px; display: flex; gap: 8px">
        <label for="new-todo" class="sr-only">New todo</label>
        <input
          id="new-todo"
          v-model="text"
          type="text"
          autocomplete="off"
          placeholder="Add a todo"
          style="flex: 1; padding: 10px 12px"
        />
        <button type="submit" style="padding: 10px 12px">Add</button>
      </form>

      <section aria-label="Filters" style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
        <button type="button" @click="store.setFilterStatus('all')" :aria-pressed="store.state.filters.status === 'all'">
          All
        </button>
        <button
          type="button"
          @click="store.setFilterStatus('active')"
          :aria-pressed="store.state.filters.status === 'active'"
        >
          Active
        </button>
        <button
          type="button"
          @click="store.setFilterStatus('completed')"
          :aria-pressed="store.state.filters.status === 'completed'"
        >
          Completed
        </button>
      </section>

      <ul style="margin-top: 16px; padding-left: 18px">
        <li v-for="todo in store.filteredTodos.value" :key="todo.id">
          {{ todo.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
