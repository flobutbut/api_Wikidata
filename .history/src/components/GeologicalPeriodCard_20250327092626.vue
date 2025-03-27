<template>
  <div 
    class="period-card"
    @click="$emit('click')"
  >
    <div class="period-info">
      <h4>{{ period.label }}</h4>
      <p v-if="period.startDate || period.endDate" class="period-dates">
        {{ period.startDate ? `Début: ${period.startDate}` : '' }}
        {{ period.endDate ? ` - Fin: ${period.endDate}` : '' }}
      </p>
    </div>
    <div class="period-arrow">→</div>
  </div>
</template>

<script setup lang="ts">
import type { GeologicalPeriod } from '../types/geological';

defineProps<{
  period: GeologicalPeriod;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
.period-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
}

.period-card:hover {
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-color: #4CAF50;
}

.period-info {
  flex: 1;
  text-align: left;
}

.period-info h4 {
  margin: 0;
  color: #333;
  font-size: 1.2em;
}

.period-dates {
  margin: 5px 0;
  color: #666;
  font-size: 0.9em;
}

.period-arrow {
  color: #4CAF50;
  font-size: 1.2em;
  margin-left: 15px;
  padding: 0 5px;
}
</style> 