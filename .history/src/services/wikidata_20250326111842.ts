import axios from 'axios';
import type { GeologicalPeriod, WikidataResponse } from '../types/geological';

const WIKIDATA_API_URL = 'https://query.wikidata.org/sparql';

export class WikidataService {
  private static instance: WikidataService;

  private constructor() {}

  public static getInstance(): WikidataService {
    if (!WikidataService.instance) {
      WikidataService.instance = new WikidataService();
    }
    return WikidataService.instance;
  }

  async getGeologicalPeriods(): Promise<GeologicalPeriod[]> {
    const query = `
      SELECT DISTINCT ?item ?itemLabel ?description ?startDate ?endDate ?parentPeriod ?parentPeriodLabel
      WHERE {
        ?item wdt:P31 wd:Q12308941.  # instance of geological period
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        ?item rdfs:label ?itemLabel.
        OPTIONAL { ?item schema:description ?description. }
        OPTIONAL { ?item wdt:P580 ?startDate. }
        OPTIONAL { ?item wdt:P582 ?endDate. }
        OPTIONAL { ?item wdt:P361 ?parentPeriod. }
        OPTIONAL { ?parentPeriod rdfs:label ?parentPeriodLabel. }
      }
      ORDER BY ?startDate
    `;

    try {
      const response = await axios.get<WikidataResponse>(WIKIDATA_API_URL, {
        params: {
          query,
          format: 'json',
        },
      });

      return this.transformResponse(response.data);
    } catch (error) {
      console.error('Error fetching geological periods:', error);
      throw error;
    }
  }

  private transformResponse(response: WikidataResponse): GeologicalPeriod[] {
    return response.results.bindings.map((binding) => ({
      id: binding.item?.value || '',
      label: binding.itemLabel?.value || '',
      description: binding.description?.value,
      startDate: binding.startDate?.value,
      endDate: binding.endDate?.value,
      parentPeriod: binding.parentPeriodLabel?.value,
    }));
  }
} 