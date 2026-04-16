import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrategyPreset, SupplyConfig, SupplySource } from './types.js';
import { CreateSupplySourceDto } from './dto/create-supply-source.dto.js';
import { SupplyConfigEntity } from './supply-config.entity.js';
import { SupplySourceEntity } from './supply-source.entity.js';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(SupplySourceEntity)
    private readonly sourceRepo: Repository<SupplySourceEntity>,
    @InjectRepository(SupplyConfigEntity)
    private readonly configRepo: Repository<SupplyConfigEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  private async seed(): Promise<void> {
    const sourceCount = await this.sourceRepo.count();
    const config = await this.configRepo.findOneBy({ id: 1 });

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

    if (sourceCount === 0) {
      await this.sourceRepo.save(defaultSources);
    }

    if (!config) {
      await this.configRepo.save({ id: 1, activePreset: 'balanced' });
    }
  }

  private getSequenceForPreset(
    preset: StrategyPreset,
    allSources: SupplySource[],
  ): SupplySource[] {
    const sortedSources = [...allSources].sort(
      (a, b) => a.priority - b.priority,
    );

    switch (preset) {
      case 'conservative':
        return sortedSources.filter(s => s.priority === 1);
      case 'fast':
        return sortedSources;
      case 'balanced':
        return sortedSources.filter(s => s.priority <= 2);
      default:
        return sortedSources;
    }
  }

  async getConfig(): Promise<SupplyConfig> {
    const sources = await this.sourceRepo.find({ order: { priority: 'ASC' } });
    const config =
      (await this.configRepo.findOneBy({ id: 1 })) ??
      (await this.configRepo.save({ id: 1, activePreset: 'balanced' }));
    const activePreset = config.activePreset as StrategyPreset;

    return {
      activePreset,
      sequence: this.getSequenceForPreset(activePreset, sources),
    };
  }

  async setPreset(preset: StrategyPreset): Promise<SupplyConfig> {
    await this.configRepo.save({ id: 1, activePreset: preset });
    return this.getConfig();
  }

  async setSequence(sequence: SupplySource[]): Promise<SupplyConfig> {
    const inferredPreset: StrategyPreset =
      sequence.length <= 1
        ? 'conservative'
        : sequence.length <= 2
          ? 'balanced'
          : 'fast';

    await this.configRepo.save({ id: 1, activePreset: inferredPreset });
    return this.getConfig();
  }

  async findAllSources(): Promise<SupplySource[]> {
    return this.sourceRepo.find({ order: { priority: 'ASC' } });
  }

  async createSource(dto: CreateSupplySourceDto): Promise<SupplySource> {
    const source: SupplySourceEntity = {
      id: randomUUID(),
      ...dto,
    };

    return this.sourceRepo.save(source);
  }

  async updateSource(
    id: string,
    dto: Partial<CreateSupplySourceDto>,
  ): Promise<SupplySource | undefined> {
    const source = await this.sourceRepo.findOneBy({ id });
    if (!source) {
      return undefined;
    }

    const updated: SupplySource = {
      ...source,
      ...dto,
    };

    return this.sourceRepo.save(updated);
  }

  async removeSource(id: string): Promise<boolean> {
    const result = await this.sourceRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
