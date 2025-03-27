export interface GeologicalPeriod {
  id: string;
  label: string;
  description?: string;
}

export interface WikidataResponse {
  search: GeologicalPeriod[];
} 