import axios from 'axios';

interface PropertyInfo {
  property: string;        // ID de la propriété (ex: P31)
  propertyLabel: string;   // Label de la propriété
  value: string;          // Valeur ou ID de l'objet lié
  valueLabel: string;     // Label de la valeur
  type: string;           // Type de valeur (date, item, string, etc.)
}

export class PropertyDiscoveryService {
  private static instance: PropertyDiscoveryService;
  private readonly WIKIDATA_API_URL = '/api/wikidata/sparql';

  private constructor() {}

  static getInstance(): PropertyDiscoveryService {
    if (!PropertyDiscoveryService.instance) {
      PropertyDiscoveryService.instance = new PropertyDiscoveryService();
    }
    return PropertyDiscoveryService.instance;
  }

  private buildDiscoveryQuery(id: string, language: string = 'fr'): string {
    return `
      SELECT DISTINCT ?property ?propertyLabel ?value ?valueLabel ?valueType
      WHERE {
        # Sélection de l'objet
        VALUES ?item { wd:${id} }
        
        # Récupération des propriétés directes
        ?item ?p ?value .
        
        # Filtrer les propriétés Wikidata uniquement
        FILTER(STRSTARTS(STR(?p), "http://www.wikidata.org/prop/"))
        
        # Convertir les URIs des propriétés en IDs
        BIND(IRI(REPLACE(STR(?p), "http://www.wikidata.org/prop/P", "http://www.wikidata.org/entity/P")) AS ?property)
        
        # Déterminer le type de valeur
        BIND(
          IF(ISIRI(?value),
            IF(STRSTARTS(STR(?value), "http://www.wikidata.org/entity/"),
              "item",
              "uri"
            ),
            IF(ISLITERAL(?value),
              DATATYPE(?value),
              "unknown"
            )
          ) AS ?valueType
        )
        
        # Service de labels
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "${language},en".
          ?property rdfs:label ?propertyLabel.
          ?value rdfs:label ?valueLabel.
        }
      }
      ORDER BY ?propertyLabel
    `;
  }

  async discoverProperties(id: string, language: string = 'fr'): Promise<PropertyInfo[]> {
    try {
      console.log('Découverte des propriétés pour:', id);
      const query = this.buildDiscoveryQuery(id, language);
      console.log('Requête de découverte:', query);

      const response = await axios.get(this.WIKIDATA_API_URL, {
        params: {
          query,
          format: 'json'
        }
      });

      if (!response.data?.results?.bindings) {
        throw new Error('Format de réponse invalide');
      }

      console.log('Réponse brute:', JSON.stringify(response.data.results.bindings, null, 2));

      const properties = response.data.results.bindings.map(binding => ({
        property: binding.property.value.split('/').pop() || '',
        propertyLabel: binding.propertyLabel?.value || '',
        value: binding.value.value,
        valueLabel: binding.valueLabel?.value || binding.value.value,
        type: binding.valueType.value
      }));

      // Analyse et catégorisation des propriétés
      this.analyzeProperties(properties);

      return properties;
    } catch (error) {
      console.error('Erreur lors de la découverte des propriétés:', error);
      throw error;
    }
  }

  private analyzeProperties(properties: PropertyInfo[]): void {
    console.log('\nAnalyse des propriétés trouvées:');
    
    // Propriétés temporelles
    const temporalProperties = properties.filter(p => 
      ['P580', 'P582', 'P569', 'P570'].includes(p.property)
    );
    console.log('Propriétés temporelles:', temporalProperties);

    // Propriétés de localisation
    const locationProperties = properties.filter(p => 
      ['P17', 'P131', 'P276', 'P706'].includes(p.property)
    );
    console.log('Propriétés de localisation:', locationProperties);

    // Propriétés de type/catégorie
    const typeProperties = properties.filter(p => 
      ['P31', 'P279'].includes(p.property)
    );
    console.log('Propriétés de type:', typeProperties);

    // Propriétés de relation
    const relationProperties = properties.filter(p => 
      ['P361', 'P527', 'P156'].includes(p.property)
    );
    console.log('Propriétés de relation:', relationProperties);
  }
} 