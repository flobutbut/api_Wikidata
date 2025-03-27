<!-- PropertyExplorer.vue -->
<template>
  <div class="property-explorer">
    <div class="search-bar">
      <input 
        v-model="entityId"
        placeholder="Entrez l'ID Wikidata (ex: Q323 pour Big Bang)"
        @keyup.enter="exploreEntity"
      />
      <button @click="exploreEntity" :disabled="loading">
        {{ loading ? 'Chargement...' : 'Explorer' }}
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="properties.length > 0" class="results">
      <h3>Propriétés trouvées</h3>
      
      <div class="property-group" v-for="group in propertyGroups" :key="group.name">
        <h4>{{ group.name }} ({{ group.properties.length }})</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Valeur</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in group.properties" :key="prop.property">
              <td>{{ prop.property }}</td>
              <td>{{ prop.propertyLabel }}</td>
              <td>{{ prop.valueLabel }}</td>
              <td>{{ prop.type }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { PropertyDiscoveryService } from '@/services/propertyDiscovery';

interface PropertyGroup {
  name: string;
  properties: any[];
}

export default defineComponent({
  name: 'PropertyExplorer',
  
  setup() {
    const entityId = ref('');
    const properties = ref<any[]>([]);
    const loading = ref(false);
    const error = ref('');

    const discoveryService = PropertyDiscoveryService.getInstance();

    const propertyGroups = computed((): PropertyGroup[] => {
      const groups: PropertyGroup[] = [
        { name: 'Propriétés temporelles', properties: [] },
        { name: 'Propriétés de localisation', properties: [] },
        { name: 'Propriétés de type', properties: [] },
        { name: 'Propriétés de relation', properties: [] },
        { name: 'Autres propriétés', properties: [] }
      ];

      properties.value.forEach(prop => {
        if (['P580', 'P582', 'P569', 'P570'].includes(prop.property)) {
          groups[0].properties.push(prop);
        } else if (['P17', 'P131', 'P276', 'P706'].includes(prop.property)) {
          groups[1].properties.push(prop);
        } else if (['P31', 'P279'].includes(prop.property)) {
          groups[2].properties.push(prop);
        } else if (['P361', 'P527', 'P156'].includes(prop.property)) {
          groups[3].properties.push(prop);
        } else {
          groups[4].properties.push(prop);
        }
      });

      return groups.filter(group => group.properties.length > 0);
    });

    const exploreEntity = async () => {
      if (!entityId.value) {
        error.value = 'Veuillez entrer un ID Wikidata';
        return;
      }

      loading.value = true;
      error.value = '';

      try {
        const id = entityId.value.toUpperCase().replace('WD:', '').replace('Q', 'Q');
        properties.value = await discoveryService.discoverProperties(id);
      } catch (e) {
        error.value = 'Erreur lors de la récupération des propriétés : ' + (e as Error).message;
      } finally {
        loading.value = false;
      }
    };

    return {
      entityId,
      properties,
      loading,
      error,
      propertyGroups,
      exploreEntity
    };
  }
});
</script>

<style scoped>
.property-explorer {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.search-bar button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.search-bar button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff0000;
  margin-bottom: 20px;
}

.property-group {
  margin-bottom: 30px;
}

.property-group h4 {
  margin-bottom: 10px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}
</style> 