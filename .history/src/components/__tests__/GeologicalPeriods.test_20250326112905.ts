import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import GeologicalPeriods from '../GeologicalPeriods.vue';
import { WikidataService } from '../../services/wikidata';

vi.mock('../../services/wikidata');

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
    const wrapper = mount(GeologicalPeriods);
    expect(wrapper.find('.loading').exists()).toBe(true);
  });

  it('should render periods when data is loaded', async () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockResolvedValue(mockPeriods),
    };
    (WikidataService as any).getInstance = vi.fn().mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.loading').exists()).toBe(false);
    expect(wrapper.find('.periods-list').exists()).toBe(true);
    expect(wrapper.findAll('.period-card')).toHaveLength(1);
  });

  it('should render error state when API call fails', async () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    (WikidataService as any).getInstance = vi.fn().mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.loading').exists()).toBe(false);
    expect(wrapper.find('.error').exists()).toBe(true);
  });

  it('should change language and reload data', async () => {
    const mockService = {
      getGeologicalPeriods: vi.fn().mockResolvedValue(mockPeriods),
    };
    (WikidataService as any).getInstance = vi.fn().mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    await wrapper.vm.$nextTick();

    const languageSelect = wrapper.find('select');
    await languageSelect.setValue('en');
    await wrapper.vm.$nextTick();

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
    (WikidataService as any).getInstance = vi.fn().mockReturnValue(mockService);

    const wrapper = mount(GeologicalPeriods);
    await wrapper.vm.$nextTick();

    const nextButton = wrapper.find('.pagination button:last-child');
    await nextButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(mockService.getGeologicalPeriods).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: 20,
      })
    );
  });
}); 