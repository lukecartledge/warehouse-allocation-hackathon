export interface RankingDimension {
  id: string;
  label: string;
  level: string;
}

export interface AllocationTemplate {
  id: string;
  name: string;
  dimensions: RankingDimension[];
  clearanceLogic: boolean;
  clearanceMode: 'in-season' | 'drop-out';
}
