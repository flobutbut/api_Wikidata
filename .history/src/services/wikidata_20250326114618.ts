import axios, { AxiosError } from 'axios';
import type { GeologicalPeriod, WikidataResponse } from '../types/geological';

const WIKIDATA_API_URL = 'https://query.wikidata.org/sparql';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde
const REQUEST_TIMEOUT = 10000; // 10 secondes

export interface QueryOptions {
  limit?: number;
  offset?: number;
  language?: string;
}

export class WikidataError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'WikidataError';
  }
}

export class WikidataService {
  private static instance: WikidataService;
  private readonly defaultLimit = 20;
  private readonly defaultLanguage = 'fr';

  private constructor() {}

  public static getInstance(): WikidataService {
    if (!WikidataService.instance) {
      WikidataService.instance = new WikidataService();
    }
    return WikidataService.instance;
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.retryOperation(operation, retries - 1);
      }
      throw this.handleError(error);
    }
  }

  private isRetryableError(error: any): boolean {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return status === 429 || status === 503 || status === 504 || !status;
    }
    return false;
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      switch (status) {
        case 400:
          throw new WikidataError('Requête invalide', 'INVALID_REQUEST', error);
        case 429:
          throw new WikidataError('Trop de requêtes', 'RATE_LIMIT', error);
        case 503:
        case 504:
          throw new WikidataError('Service temporairement indisponible', 'SERVICE_UNAVAILABLE', error);
        default:
          throw new WikidataError(
            'Erreur lors de la communication avec Wikidata',
            'API_ERROR',
            error
          );
      }
    }
    throw new WikidataError('Erreur inattendue', 'UNKNOWN_ERROR', error instanceof Error ? error : undefined);
  }

  async getGeologicalPeriods(options: QueryOptions = {}): Promise<GeologicalPeriod[]> {
    const { limit = this.defaultLimit, offset = 0, language = this.defaultLanguage } = options;

    const query = `
      SELECT DISTINCT ?item ?itemLabel ?description ?startDate ?endDate ?parentPeriod ?parentPeriodLabel
      WHERE {
        ?item wdt:P31 wd:Q12308941.  # instance of geological period
        ?item wdt:P279* wd:Q12308941.  # subclass of geological period
        SERVICE wikibase:label { bd:serviceParam wikibase:language "${language},en". }
        ?item rdfs:label ?itemLabel.
        OPTIONAL { ?item schema:description ?description. }
        OPTIONAL { ?item wdt:P580 ?startDate. }
        OPTIONAL { ?item wdt:P582 ?endDate. }
        OPTIONAL { ?item wdt:P361 ?parentPeriod. }
        OPTIONAL { ?parentPeriod rdfs:label ?parentPeriodLabel. }
        FILTER(LANG(?itemLabel) = "${language}" || LANG(?itemLabel) = "en")
      }
      ORDER BY ?startDate
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return this.retryOperation(async () => {
      const response = await axios.get<WikidataResponse>(WIKIDATA_API_URL, {
        params: {
          query,
          format: 'json',
        },
        timeout: REQUEST_TIMEOUT,
      });

      if (!response.data?.results?.bindings) {
        throw new WikidataError(
          'Réponse invalide de l\'API Wikidata',
          'INVALID_RESPONSE'
        );
      }

      return this.transformResponse(response.data);
    });
  }

  private transformResponse(response: WikidataResponse): GeologicalPeriod[] {
    try {
      return response.results.bindings.map((binding) => {
        if (!binding.item?.value || !binding.itemLabel?.value) {
          throw new WikidataError(
            'Données de période géologique invalides',
            'INVALID_PERIOD_DATA'
          );
        }

        return {
          id: binding.item.value,
          label: binding.itemLabel.value,
          description: binding.description?.value,
          startDate: binding.startDate?.value,
          endDate: binding.endDate?.value,
          parentPeriod: binding.parentPeriodLabel?.value,
        };
      });
    } catch (error) {
      throw new WikidataError(
        'Erreur lors de la transformation des données',
        'TRANSFORM_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }
} 