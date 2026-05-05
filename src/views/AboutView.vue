<script setup>
function onBackKeydown(e) {
  // Anchors activate on Enter by default, but not on Space. Add Space parity.
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault();
    e.currentTarget?.click?.();
  }
}
</script>

<template>
  <div class="page">
    <div class="container">
      <h1>About Us</h1>
      <p>
        A simple, offline-ready Todo app that keeps your data in your browser so you can stay focused on your tasks.
      </p>
      <a href="#/" @keydown="onBackKeydown">Back to App</a>
    </div>
  </div>
</template>
