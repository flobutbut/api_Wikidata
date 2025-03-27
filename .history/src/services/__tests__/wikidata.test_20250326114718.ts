import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';
import { WikidataService, WikidataError } from '../wikidata';
import type { WikidataResponse } from '../../types/geological';

vi.mock('axios');

describe('WikidataService', () => {
  let service: WikidataService;
  const mockResponse = {
    results: {
      bindings: [
        {
          item: { value: 'Q1' },
          itemLabel: { value: 'Test Period' },
          description: { value: 'Test Description' },
          startDate: { value: '2023-01-01' },
          endDate: { value: '2023-12-31' },
          parentPeriodLabel: { value: 'Parent Period' }
        }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = WikidataService.getInstance();
  });

  it('should be a singleton', () => {
    const instance1 = WikidataService.getInstance();
    const instance2 = WikidataService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should fetch geological periods with default options', async () => {
    (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getGeologicalPeriods();

    expect(axios.get).toHaveBeenCalledWith(
      'https://query.wikidata.org/sparql',
      expect.objectContaining({
        params: expect.objectContaining({
          format: 'json',
          query: expect.stringContaining('LIMIT 20')
        }),
        timeout: 10000
      })
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'Q1',
      label: 'Test Period',
      description: 'Test Description',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      parentPeriod: 'Parent Period'
    });
  });

  it('should fetch geological periods with custom options', async () => {
    (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

    await service.getGeologicalPeriods({
      limit: 10,
      offset: 20,
      language: 'en'
    });

    expect(axios.get).toHaveBeenCalledWith(
      'https://query.wikidata.org/sparql',
      expect.objectContaining({
        params: expect.objectContaining({
          query: expect.stringMatching(/LIMIT 10.*OFFSET 20/s)
        })
      })
    );
  });

  it('should handle API errors with retry', async () => {
    const error503 = new Error('Service Unavailable');
    (error503 as any).response = { status: 503 };
    (axios.get as any)
      .mockRejectedValueOnce(error503)
      .mockRejectedValueOnce(error503)
      .mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getGeologicalPeriods();

    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(result).toHaveLength(1);
  });

  it('should handle rate limit errors', async () => {
    const error429 = new Error('Too Many Requests');
    (error429 as any).response = { status: 429 };
    (axios.get as any).mockRejectedValue(error429);

    await expect(service.getGeologicalPeriods()).rejects.toThrow(
      new WikidataError('Trop de requêtes', 'RATE_LIMIT')
    );
  });

  it('should handle invalid response data', async () => {
    (axios.get as any).mockResolvedValueOnce({ data: {} });

    await expect(service.getGeologicalPeriods()).rejects.toThrow(
      new WikidataError('Réponse invalide de l\'API Wikidata', 'INVALID_RESPONSE')
    );
  });

  it('should handle invalid period data', async () => {
    const invalidResponse = {
      results: {
        bindings: [
          {
            item: { value: 'Q1' }
            // Missing itemLabel
          }
        ]
      }
    };
    (axios.get as any).mockResolvedValueOnce({ data: invalidResponse });

    await expect(service.getGeologicalPeriods()).rejects.toThrow(
      new WikidataError('Données de période géologique invalides', 'INVALID_PERIOD_DATA')
    );
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network Error');
    (networkError as any).response = undefined;
    (axios.get as any)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError);

    await expect(service.getGeologicalPeriods()).rejects.toThrow(
      new WikidataError('Erreur lors de la communication avec Wikidata', 'API_ERROR')
    );
    expect(axios.get).toHaveBeenCalledTimes(3);
  });
}); 