import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { WikidataService } from '../wikidata';
import type { WikidataResponse } from '../../types/geological';

vi.mock('axios');

describe('WikidataService', () => {
  let service: WikidataService;
  const mockResponse: WikidataResponse = {
    results: {
      bindings: [
        {
          item: { value: 'Q123', type: 'uri' },
          itemLabel: { value: 'Période Test', type: 'literal' },
          description: { value: 'Description test', type: 'literal' },
          startDate: { value: '2020-01-01', type: 'literal' },
          endDate: { value: '2021-01-01', type: 'literal' },
          parentPeriodLabel: { value: 'Période Parente', type: 'literal' },
        },
      ],
    },
  };

  beforeEach(() => {
    service = WikidataService.getInstance();
    vi.clearAllMocks();
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
          query: expect.stringContaining('LIMIT 20'),
          format: 'json',
        }),
      })
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'Q123',
      label: 'Période Test',
      description: 'Description test',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      parentPeriod: 'Période Parente',
    });
  });

  it('should fetch geological periods with custom options', async () => {
    (axios.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getGeologicalPeriods({
      limit: 10,
      offset: 20,
      language: 'en',
    });

    expect(axios.get).toHaveBeenCalledWith(
      'https://query.wikidata.org/sparql',
      expect.objectContaining({
        params: expect.objectContaining({
          query: expect.stringContaining('LIMIT 10') && expect.stringContaining('OFFSET 20') && expect.stringContaining('language "en"'),
          format: 'json',
        }),
      })
    );

    expect(result).toHaveLength(1);
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    (axios.get as any).mockRejectedValueOnce(error);

    await expect(service.getGeologicalPeriods()).rejects.toThrow('API Error');
  });
}); 