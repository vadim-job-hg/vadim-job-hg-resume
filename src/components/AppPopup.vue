<template>
  <div v-if="visible" class="popup-overlay" @click.self="close">
    <div class="popup-content">
      <slot />
      <button class="close-btn" @click="close">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
const visible = ref(false);
function open() { visible.value = true; }
function close() { visible.value = false; }
defineExpose({ open, close, visible });
</script>

<style>
.popup-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.popup-content {
  background: #fff; padding: 24px; border-radius: 8px; position: relative;
}
.close-btn {
  position: absolute; top: 8px; right: 8px;
}
</style>
