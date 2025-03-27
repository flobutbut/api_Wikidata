<script setup lang="ts">
import GeologicalPeriods from './components/GeologicalPeriods.vue'
import PropertyExplorer from './components/PropertyExplorer.vue'
import { ref } from 'vue'

const activeTab = ref('periods')
</script>

<template>
  <div class="app">
    <header>
      <h1>Périodes Géologiques - Wikidata</h1>
    </header>
    <nav class="tabs">
      <button 
        :class="{ active: activeTab === 'periods' }"
        @click="activeTab = 'periods'"
      >
        Périodes Géologiques
      </button>
      <button 
        :class="{ active: activeTab === 'explorer' }"
        @click="activeTab = 'explorer'"
      >
        Explorateur de Propriétés
      </button>
    </nav>
    <main>
      <GeologicalPeriods v-if="activeTab === 'periods'" />
      <PropertyExplorer v-if="activeTab === 'explorer'" />
    </main>
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

header h1 {
  color: #2c3e50;
  font-size: 2.5em;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #e9ecef;
  color: #495057;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabs button:hover {
  background: #dee2e6;
}

.tabs button.active {
  background: #4CAF50;
  color: white;
}

main {
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f0f2f5;
}
</style>
