import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import GeologicalPeriods from '../GeologicalPeriods.vue';
import { WikidataService } from '../../services/wikidata';

vi.mock('../../services/wikidata', () => ({
  WikidataService: {
    getInstance: vi.fn(),
  },
}));

describe('GeologicalPeriods', () => {
  const mockPeriods = [
    {
      id: 'Q123',
      label: 'Période Test',
      description: 'Description test',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      parentPeriod: 'Période Parente',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockResolvedValue([]),
    };
    (WikidataService.getInstance as any).mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    expect(wrapper.find('.loading').exists()).toBe(true);
  });

  it('should render periods when data is loaded', async () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockResolvedValue(mockPeriods),
    };
    (WikidataService.getInstance as any).mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    await flushPromises();

    expect(wrapper.find('.loading').exists()).toBe(false);
    expect(wrapper.find('.periods-list').exists()).toBe(true);
    expect(wrapper.findAll('.period-card')).toHaveLength(1);
  });

  it('should render error state when API call fails', async () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    (WikidataService.getInstance as any).mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    await flushPromises();

    expect(wrapper.find('.loading').exists()).toBe(false);
    expect(wrapper.find('.error').exists()).toBe(true);
  });

  it('should change language and reload data', async () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockResolvedValue(mockPeriods),
    };
    (WikidataService.getInstance as any).mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    await flushPromises();

    const languageSelect = wrapper.find('select');
    await languageSelect.setValue('en');
    await flushPromises();

    expect(mockService.getGeologicalPeriods).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'en',
      })
    );
  });

  it('should handle pagination', async () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockResolvedValue(mockPeriods),
    };
    (WikidataService.getInstance as any).mockReturnValue(mockService);

    // Mock la réponse initiale avec des données
    mockService.getGeologicalPeriods.mockResolvedValueOnce([
      { id: '1', label: 'Period 1' },
      { id: '2', label: 'Period 2' }
    ]);

    const wrapper = mount(GeologicalPeriods);
    await flushPromises(); // Attendre le chargement initial

    // Mock la réponse pour la page suivante
    mockService.getGeologicalPeriods.mockResolvedValueOnce([
      { id: '3', label: 'Period 3' },
      { id: '4', label: 'Period 4' }
    ]);

    // Simuler le clic sur le bouton suivant
    const nextButton = wrapper.find('[data-test="next-page"]');
    expect(nextButton.exists()).toBe(true);
    await nextButton.trigger('click');
    await flushPromises();

    // Vérifier que le service a été appelé avec le bon offset
    expect(mockService.getGeologicalPeriods).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: 20,
        limit: 20
      })
    );
  });
}); 