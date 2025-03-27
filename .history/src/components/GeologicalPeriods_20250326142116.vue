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
      <button v-if="currentPeriod" @click="goBack" class="back-button">
        ← Retour
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <div class="error-icon">⚠️</div>
      <h3>{{ getErrorTitle(error.code) }}</h3>
      <p>{{ error.message }}</p>
      <button @click="retryFetch" class="retry-button">
        Réessayer
      </button>
    </div>
    
    <div v-else>
      <div class="periods-list">
        <div v-for="period in periods" :key="period.id" class="period-card">
          <div class="period-header">
            <h3>{{ period.label }}</h3>
            <button 
              v-if="period.childPeriods.length > 0"
              @click="selectPeriod(period)"
              class="explore-button"
            >
              Explorer
            </button>
          </div>
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
      
      <div class="pagination" v-if="!currentPeriod">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
          data-test="prev-page"
        >
          Précédent
        </button>
        <span>Page {{ currentPage }}</span>
        <button 
          :disabled="periods.length < ITEMS_PER_PAGE" 
          @click="changePage(currentPage + 1)"
          data-test="next-page"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { WikidataService, WikidataError } from '../services/wikidata';
import type { GeologicalPeriod } from '../types/geological';

const periods = ref<GeologicalPeriod[]>([]);
const loading = ref(true);
const error = ref<WikidataError | null>(null);
const currentPage = ref(1);
const hasMore = ref(true);
const selectedLanguage = ref('fr');
const currentPeriod = ref<GeologicalPeriod | null>(null);

const ITEMS_PER_PAGE = 20;
const wikidataService = WikidataService.getInstance();

const getErrorTitle = (code: string) => {
  switch (code) {
    case 'RATE_LIMIT':
      return 'Trop de requêtes';
    case 'SERVICE_UNAVAILABLE':
      return 'Service indisponible';
    case 'INVALID_RESPONSE':
      return 'Réponse invalide';
    case 'INVALID_PERIOD_DATA':
      return 'Données invalides';
    case 'API_ERROR':
      return 'Erreur de communication';
    default:
      return 'Erreur inattendue';
  }
};

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
    if (err instanceof WikidataError) {
      error.value = err;
    } else {
      error.value = new WikidataError(
        'Une erreur inattendue est survenue',
        'UNKNOWN_ERROR',
        err instanceof Error ? err : undefined
      );
    }
    console.error('Erreur lors du chargement des périodes:', err);
  } finally {
    loading.value = false;
  }
};

const retryFetch = () => {
  fetchPeriods();
};

const changePage = (page: number) => {
  currentPage.value = page;
  fetchPeriods();
};

const selectPeriod = (period: GeologicalPeriod) => {
  currentPeriod.value = period;
  periods.value = period.childPeriods.map(child => ({
    id: '', // Ces données devraient venir de l'API
    label: child,
    childPeriods: [],
    description: undefined,
    startDate: undefined,
    endDate: undefined,
    parentPeriod: period.label
  }));
};

const goBack = () => {
  currentPeriod.value = null;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.periods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.period-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.period-card h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.description {
  color: #666;
  margin-bottom: 15px;
}

.dates {
  margin-bottom: 15px;
}

.dates p {
  margin: 5px 0;
}

.parent-period {
  margin-bottom: 15px;
  color: #2c3e50;
}

.child-periods {
  margin-top: 15px;
}

.child-periods ul {
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
}

.child-periods li {
  margin: 5px 0;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 40px;
  background-color: #fff3f3;
  border-radius: 8px;
  margin: 20px 0;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error h3 {
  color: #e74c3c;
  margin-bottom: 10px;
}

.retry-button {
  margin-top: 20px;
  background-color: #e74c3c;
}

.retry-button:hover {
  background-color: #c0392b;
}

.period-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.explore-button {
  background-color: #3498db;
  padding: 6px 12px;
  font-size: 0.9em;
}

.explore-button:hover {
  background-color: #2980b9;
}

.back-button {
  background-color: #95a5a6;
  margin-left: 20px;
}

.back-button:hover {
  background-color: #7f8c8d;
}
</style> 