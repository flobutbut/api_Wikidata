<template>
  <div class="geological-periods">
    <h2>Périodes Géologiques</h2>
    
    <div class="controls">
      <div class="language-selector">
        <label for="language">Langue :</label>
        <select id="language" v-model="selectedLanguage">
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      Chargement des données...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="periods-list">
        <div v-for="period in periods" :key="period.id" class="period-card">
          <h3>{{ period.label }}</h3>
          <p v-if="period.description" class="description">{{ period.description }}</p>
          <div class="dates">
            <p v-if="period.startDate">
              <strong>Début :</strong> {{ formatDate(period.startDate) }}
            </p>
            <p v-if="period.endDate">
              <strong>Fin :</strong> {{ formatDate(period.endDate) }}
            </p>
          </div>
          <p v-if="period.parentPeriod" class="parent-period">
            <strong>Période parente :</strong> {{ period.parentPeriod }}
          </p>
        </div>
      </div>
      
      <div class="pagination">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          Précédent
        </button>
        <span>Page {{ currentPage }}</span>
        <button 
          :disabled="!hasMore" 
          @click="changePage(currentPage + 1)"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { WikidataService } from '../services/wikidata';
import type { GeologicalPeriod } from '../types/geological';

const periods = ref<GeologicalPeriod[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const hasMore = ref(true);
const selectedLanguage = ref('fr');

const ITEMS_PER_PAGE = 20;
const wikidataService = WikidataService.getInstance();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchPeriods = async () => {
  try {
    loading.value = true;
    error.value = null;
    const offset = (currentPage.value - 1) * ITEMS_PER_PAGE;
    const result = await wikidataService.getGeologicalPeriods({
      limit: ITEMS_PER_PAGE,
      offset,
      language: selectedLanguage.value
    });
    
    periods.value = result;
    hasMore.value = result.length === ITEMS_PER_PAGE;
  } catch (err) {
    error.value = 'Erreur lors du chargement des périodes géologiques';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  fetchPeriods();
};

watch(selectedLanguage, () => {
  currentPage.value = 1;
  fetchPeriods();
});

onMounted(() => {
  fetchPeriods();
});
</script>

<style scoped>
.geological-periods {
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-selector select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: #dc3545;
}

.periods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.period-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  color: #2c3e50;
}

.period-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.period-card h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.description {
  color: #4a5568;
  margin-bottom: 15px;
}

.dates {
  margin: 15px 0;
}

.dates p {
  margin: 5px 0;
  color: #4a5568;
}

.parent-period {
  color: #4a5568;
  font-style: italic;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:hover:not(:disabled) {
  background-color: #34495e;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1.1em;
  color: #4a5568;
}
</style> 