import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StrategyPreset, SupplyConfig, SupplySource } from './types.js';
import { CreateSupplySourceDto } from './dto/create-supply-source.dto.js';

@Injectable()
export class SupplyService {
  private sources: Map<string, SupplySource> = new Map();
  private config: SupplyConfig;

  constructor() {
    this.config = {
      activePreset: 'balanced',
      sequence: [],
    };
    this.seed();
  }

  private seed(): void {
    const defaultSources: SupplySource[] = [
      {
        id: 'src-onhand',
        name: 'On-hand Inventory',
        description: 'Physical stock available in warehouse',
        priority: 1,
      },
      {
        id: 'src-transfer',
        name: 'Transfer Orders',
        description: 'Stock in transit between warehouses',
        priority: 2,
      },
      {
        id: 'src-inbound',
        name: 'Inbound Purchase Orders',
        description: 'Confirmed supplier shipments',
        priority: 3,
      },
    ];

    defaultSources.forEach(source => {
      this.sources.set(source.id, source);
    });

    this.config = {
      activePreset: 'balanced',
      sequence: this.getSequenceForPreset('balanced'),
    };
  }

  private getSequenceForPreset(preset: StrategyPreset): SupplySource[] {
    const allSources = Array.from(this.sources.values()).sort(
      (a, b) => a.priority - b.priority,
    );

    switch (preset) {
      case 'conservative':
        return allSources.filter(s => s.priority === 1);
      case 'fast':
        return allSources;
      case 'balanced':
        return allSources.filter(s => s.priority <= 2);
      default:
        return allSources;
    }
  }

  getConfig(): SupplyConfig {
    return this.config;
  }

  setPreset(preset: StrategyPreset): SupplyConfig {
    this.config.activePreset = preset;
    this.config.sequence = this.getSequenceForPreset(preset);
    return this.config;
  }

  setSequence(sequence: SupplySource[]): SupplyConfig {
    this.config.sequence = sequence;
    return this.config;
  }

  findAllSources(): SupplySource[] {
    return Array.from(this.sources.values());
  }

  createSource(dto: CreateSupplySourceDto): SupplySource {
    const source: SupplySource = {
      id: randomUUID(),
      ...dto,
    };
    this.sources.set(source.id, source);
    return source;
  }

  updateSource(
    id: string,
    dto: Partial<CreateSupplySourceDto>,
  ): SupplySource | undefined {
    const source = this.sources.get(id);
    if (!source) {
      return undefined;
    }

    const updated: SupplySource = {
      ...source,
      ...dto,
    };
    this.sources.set(id, updated);
    return updated;
  }

  removeSource(id: string): boolean {
    return this.sources.delete(id);
  }
}
