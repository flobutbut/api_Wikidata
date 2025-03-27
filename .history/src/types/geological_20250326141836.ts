export interface GeologicalPeriod {
  id: string;
  label: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  parentPeriod?: string;
  childPeriods: string[];
}

export interface WikidataBinding {
  value: string;
  type: string;
  'xml:lang'?: string;
}

export interface WikidataResult {
  bindings: {
    item: WikidataBinding;
    itemLabel: WikidataBinding;
    description?: WikidataBinding;
    startDate?: WikidataBinding;
    endDate?: WikidataBinding;
    parentPeriod?: WikidataBinding;
    parentLabel?: WikidataBinding;
    childPeriod?: WikidataBinding;
    childLabel?: WikidataBinding;
  }[];
}

export interface WikidataResponse {
  head: {
    vars: string[];
  };
  results: WikidataResult;
} 