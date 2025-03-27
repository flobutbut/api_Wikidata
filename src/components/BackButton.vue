<template>
  <button 
    class="back-button"
    @click="$emit('click')"
  >
    Retour
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
.back-button {
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
}

.back-button:hover {
  background-color: #d32f2f;
}
</style> 