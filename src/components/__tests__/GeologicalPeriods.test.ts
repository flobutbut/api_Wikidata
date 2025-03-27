import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { flushPromises } from '@vue/test-utils';
import GeologicalPeriods from '../GeologicalPeriods.vue';
import { WikidataService, WikidataError } from '../../services/wikidata';

vi.mock('../../services/wikidata', () => {
  const mockService = {
    getGeologicalPeriods: vi.fn()
  };
  return {
    WikidataService: {
      getInstance: () => mockService
    },
    WikidataError: class extends Error {
      constructor(message: string, public code: string) {
        super(message);
        this.name = 'WikidataError';
      }
    }
  };
});

describe('GeologicalPeriods', () => {
  let mockService: { getGeologicalPeriods: any };

  beforeEach(() => {
    mockService = WikidataService.getInstance();
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    mockService.getGeologicalPeriods.mockImplementation(() => new Promise(() => {}));
    const wrapper = mount(GeologicalPeriods);
    
    expect(wrapper.find('.loading').exists()).toBe(true);
    expect(wrapper.find('.spinner').exists()).toBe(true);
    expect(wrapper.text()).toContain('Chargement des données');
  });

  it('should render periods when data is loaded', async () => {
    const mockData = [
      {
        id: '1',
        label: 'Test Period',
        description: 'Test Description',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        parentPeriod: 'Parent Period'
      }
    ];

    mockService.getGeologicalPeriods.mockResolvedValueOnce(mockData);

    const wrapper = mount(GeologicalPeriods);
    await flushPromises();

    expect(wrapper.find('.loading').exists()).toBe(false);
    expect(wrapper.find('.period-card').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Period');
    expect(wrapper.text()).toContain('Test Description');
  });

  it('should render error state with retry button when API call fails', async () => {
    const apiError = new WikidataError('Service temporairement indisponible', 'SERVICE_UNAVAILABLE');
    mockService.getGeologicalPeriods.mockRejectedValueOnce(apiError);

    const wrapper = mount(GeologicalPeriods);
    await flushPromises();

    expect(wrapper.find('.error').exists()).toBe(true);
    expect(wrapper.find('.error-icon').exists()).toBe(true);
    expect(wrapper.text()).toContain('Service indisponible');
    expect(wrapper.text()).toContain('Service temporairement indisponible');

    const retryButton = wrapper.find('.retry-button');
    expect(retryButton.exists()).toBe(true);

    // Mock successful retry
    mockService.getGeologicalPeriods.mockResolvedValueOnce([
      { id: '1', label: 'Test Period' }
    ]);

    await retryButton.trigger('click');
    await flushPromises();

    expect(wrapper.find('.error').exists()).toBe(false);
    expect(wrapper.find('.period-card').exists()).toBe(true);
  });

  it('should handle different types of errors', async () => {
    const testCases = [
      {
        error: new WikidataError('Trop de requêtes', 'RATE_LIMIT'),
        expectedTitle: 'Trop de requêtes'
      },
      {
        error: new WikidataError('Données invalides', 'INVALID_PERIOD_DATA'),
        expectedTitle: 'Données invalides'
      },
      {
        error: new WikidataError('Erreur réseau', 'API_ERROR'),
        expectedTitle: 'Erreur de communication'
      }
    ];

    for (const testCase of testCases) {
      mockService.getGeologicalPeriods.mockRejectedValueOnce(testCase.error);
      const wrapper = mount(GeologicalPeriods);
      await flushPromises();

      expect(wrapper.find('.error h3').text()).toBe(testCase.expectedTitle);
      expect(wrapper.find('.error p').text()).toBe(testCase.error.message);
    }
  });

  it('should change language and reload data', async () => {
    mockService.getGeologicalPeriods.mockResolvedValueOnce([
      { id: '1', label: 'Période Test' }
    ]);

    const wrapper = mount(GeologicalPeriods);
    await flushPromises();

    mockService.getGeologicalPeriods.mockResolvedValueOnce([
      { id: '1', label: 'Test Period' }
    ]);

    await wrapper.find('select').setValue('en');
    await flushPromises();

    expect(mockService.getGeologicalPeriods).toHaveBeenLastCalledWith(
      expect.objectContaining({
        language: 'en',
        offset: 0
      })
    );
  });

  it('should handle pagination', async () => {
    // Mock la réponse initiale avec des données (20 éléments pour activer le bouton suivant)
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      label: `Period ${i + 1}`
    }));

    mockService.getGeologicalPeriods.mockImplementation(async (options: { offset: number }) => {
      if (options.offset === 0) {
        return initialData;
      } else if (options.offset === 20) {
        return [
          { id: '21', label: 'Period 21' },
          { id: '22', label: 'Period 22' }
        ];
      }
      return [];
    });

    const wrapper = mount(GeologicalPeriods);
    await flushPromises();

    // Vérifier l'appel initial
    expect(mockService.getGeologicalPeriods).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: 0,
        limit: 20
      })
    );

    // Simuler le clic sur le bouton suivant
    const nextButton = wrapper.find('[data-test="next-page"]');
    expect(nextButton.exists()).toBe(true);
    expect(nextButton.attributes('disabled')).toBeUndefined();
    await nextButton.trigger('click');
    await flushPromises();

    // Vérifier l'appel après le changement de page
    expect(mockService.getGeologicalPeriods).toHaveBeenLastCalledWith(
      expect.objectContaining({
        offset: 20,
        limit: 20
      })
    );
  });
}); 