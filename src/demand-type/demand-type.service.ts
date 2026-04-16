import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandTypeEntity } from './demand-type.entity.js';
import { DemandType } from './types.js';
import { CreateDemandTypeDto } from './dto/create-demand-type.dto.js';

@Injectable()
export class DemandTypeService {
  constructor(
    @InjectRepository(DemandTypeEntity)
    private readonly repo: Repository<DemandTypeEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  private async seed(): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) {
      return;
    }

    const defaults: DemandType[] = [
      {
        id: 'dt-1-retail',
        displayName: 'Retail',
        channel: 'Retail',
        orderType: 'Standard Ship',
        allocationTemplate: 'tpl-retail',
      },
      {
        id: 'dt-2-wholesale',
        displayName: 'Wholesale',
        channel: 'Wholesale',
        orderType: 'Standard Ship',
        allocationTemplate: 'tpl-wholesale',
      },
      {
        id: 'dt-3-d2c',
        displayName: 'D2C',
        channel: 'D2C',
        orderType: 'Express',
        allocationTemplate: 'tpl-d2c',
      },
      {
        id: 'dt-4-marketplace',
        displayName: 'Marketplace',
        channel: 'Marketplace',
        orderType: 'Standard Ship',
        allocationTemplate: 'tpl-retail',
      },
    ];

    for (const demandType of defaults) {
      await this.repo.save(demandType);
    }
  }

  async findAll(): Promise<DemandType[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findById(id: string): Promise<DemandType | undefined> {
    const demandType = await this.repo.findOneBy({ id });
    return demandType ?? undefined;
  }

  async create(dto: CreateDemandTypeDto): Promise<DemandType> {
    const id = randomUUID();
    return this.repo.save({
      id,
      ...dto,
    });
  }

  async update(
    id: string,
    dto: Partial<CreateDemandTypeDto>,
  ): Promise<DemandType | undefined> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      return undefined;
    }

    const updated: DemandTypeEntity = {
      ...existing,
      ...dto,
    };

    return this.repo.save(updated);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
