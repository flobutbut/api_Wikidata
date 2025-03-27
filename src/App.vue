<script setup lang="ts">
import GeologicalPeriods from './components/GeologicalPeriods.vue'
</script>

<template>
  <div class="app">
    <header>
      <h1>Périodes Géologiques - Wikidata</h1>
    </header>
    <main>
      <GeologicalPeriods />
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
  margin-bottom: 40px;
}

header h1 {
  color: #2c3e50;
  font-size: 2.5em;
  margin: 0;
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
