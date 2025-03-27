export interface GeologicalPeriod {
  id: string;
  label: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  parentPeriod?: string;
  childPeriods?: string[];
}

export interface WikidataResponse {
  results: {
    bindings: Array<{
      [key: string]: {
        value: string;
        type: string;
      };
    }>;
  };
} 