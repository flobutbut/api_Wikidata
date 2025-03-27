<template>
  <div class="geological-periods">
    <h2>Périodes Géologiques</h2>
    
    <div class="controls">
      <select v-model="selectedLanguage" @change="fetchPeriods">
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
      <button 
        v-if="currentParent" 
        @click="goBack" 
        class="back-button"
      >
        Retour
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      Chargement...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="periods-list">
      <GeologicalPeriodCard
        v-for="period in periods"
        :key="period.id"
        :period="period"
        @click="enterPeriod(period)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WikidataService } from '../services/wikidata';
import GeologicalPeriodCard from './GeologicalPeriodCard.vue';
import type { GeologicalPeriod } from '../types/geological';

const wikidataService = WikidataService.getInstance();
const periods = ref<GeologicalPeriod[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedLanguage = ref('fr');
const currentParent = ref<string | null>(null);

const fetchPeriods = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const options = {
      language: selectedLanguage.value,
      parentId: currentParent.value || undefined
    };
    
    periods.value = await wikidataService.getGeologicalPeriods(options);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};

const enterPeriod = (period: GeologicalPeriod) => {
  currentParent.value = period.id;
  fetchPeriods();
};

const goBack = () => {
  currentParent.value = null;
  fetchPeriods();
};

onMounted(fetchPeriods);
</script>

<style scoped>
.geological-periods {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

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

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #f44336;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 0.9em;
}
</style> 