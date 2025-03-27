<template>
  <select 
    class="language-selector"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option value="fr">Français</option>
    <option value="en">English</option>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
.language-selector {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 0.9em;
  cursor: pointer;
  transition: border-color 0.2s ease;
  color: #333;
}

.language-selector option {
  color: #333;
  background-color: white;
}

.language-selector:hover {
  border-color: #4CAF50;
}

.language-selector:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}
</style> 