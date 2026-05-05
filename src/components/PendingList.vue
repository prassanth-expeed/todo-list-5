<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <ul aria-label="Pending tasks">
    <li v-for="todo in items" :key="todo.id" class="pending-item">
      <!-- Mustache binding escapes HTML by default; do NOT use v-html. -->
      <span class="pending-item__text">{{ todo.text }}</span>
    </li>
  </ul>
</template>

<style scoped>
.pending-item__text {
  overflow-wrap: anywhere;
  word-break: break-word;
}
</style>
