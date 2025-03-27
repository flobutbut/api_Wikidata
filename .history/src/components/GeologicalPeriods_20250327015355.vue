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
      <div 
        v-for="period in periods" 
        :key="period.id" 
        class="period-item"
        @click="enterPeriod(period)"
      >
        <div class="period-info">
          <h3>{{ period.label }}</h3>
          <p v-if="period.startDate || period.endDate" class="period-dates">
            {{ period.startDate ? `Début: ${period.startDate}` : '' }}
            {{ period.endDate ? ` - Fin: ${period.endDate}` : '' }}
          </p>
        </div>
        <div class="period-arrow">→</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WikidataService } from '../services/wikidata';
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

.period-item {
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

.period-item:hover {
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-color: #4CAF50;
}

.period-info {
  flex: 1;
  text-align: left;
}

.period-info h3 {
  margin: 0 0 10px 0;
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