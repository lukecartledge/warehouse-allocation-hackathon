export type StrategyPreset = 'conservative' | 'fast' | 'balanced';

export interface SupplySource {
  id: string;
  name: string;
  description: string;
  priority: number;
}

export interface SupplyConfig {
  activePreset: StrategyPreset;
  sequence: SupplySource[];
}
