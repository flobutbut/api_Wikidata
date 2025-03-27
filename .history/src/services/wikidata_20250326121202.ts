import axios, { AxiosError } from 'axios';
import type { GeologicalPeriod, WikidataResponse } from '../types/geological';

const WIKIDATA_API_URL = '/api/wikidata/w/api.php';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde
const REQUEST_TIMEOUT = 10000; // 10 secondes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: GeologicalPeriod[];
  timestamp: number;
}

interface CacheKey {
  limit: number;
  offset: number;
  language: string;
}

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
  private cache: Map<string, CacheEntry> = new Map();

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

  private getCacheKey(options: Required<QueryOptions>): string {
    return `${options.limit}-${options.offset}-${options.language}`;
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }

  private getFromCache(key: string): GeologicalPeriod[] | null {
    const entry = this.cache.get(key);
    if (entry && this.isCacheValid(entry)) {
      return entry.data;
    }
    return null;
  }

  private setCache(key: string, data: GeologicalPeriod[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  async getGeologicalPeriods(options: QueryOptions = {}): Promise<GeologicalPeriod[]> {
    const { limit = this.defaultLimit, offset = 0, language = this.defaultLanguage } = options;
    const cacheKey = this.getCacheKey({ limit, offset, language });
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    return this.retryOperation(async () => {
      const response = await axios.get(WIKIDATA_API_URL, {
        params: {
          action: 'wbsearchentities',
          search: 'période géologique',
          language: language,
          format: 'json',
          uselang: language,
          type: 'item',
          limit: limit,
          continue: offset,
        },
        timeout: REQUEST_TIMEOUT
      });

      if (!response.data?.search) {
        throw new WikidataError(
          'Réponse invalide de l\'API Wikidata',
          'INVALID_RESPONSE'
        );
      }

      const data = this.transformResponse(response.data);
      this.setCache(cacheKey, data);
      return data;
    });
  }

  private transformResponse(response: any): GeologicalPeriod[] {
    try {
      return response.search.map((item: any) => ({
        id: item.id,
        label: item.label,
        description: item.description,
      }));
    } catch (error) {
      throw new WikidataError(
        'Erreur lors de la transformation des données',
        'TRANSFORM_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }
} 