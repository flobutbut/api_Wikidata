<template>
  <div class="geological-periods">
    <h2 class="title">Périodes Géologiques</h2>
    
    <div class="controls">
      <div class="controls-left">
        <div class="back-button-container">
          <BackButton
            v-if="currentParent"
            @click="goBack"
          />
        </div>
      </div>
      <div class="controls-right">
        <LanguageSelector
          v-model="selectedLanguage"
          @update:modelValue="fetchPeriods"
        />
      </div>
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
import BackButton from './BackButton.vue';
import LanguageSelector from './LanguageSelector.vue';
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

.title {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}

.controls-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.back-button-container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.controls-right {
  margin-left: auto;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #f44336;
}
</style> 