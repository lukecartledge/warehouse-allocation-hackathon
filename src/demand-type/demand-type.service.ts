import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DemandType } from './types.js';
import { CreateDemandTypeDto } from './dto/create-demand-type.dto.js';

@Injectable()
export class DemandTypeService {
  private demandTypes = new Map<string, DemandType>();

  constructor() {
    this.seed();
  }

  private seed(): void {
    const defaults: DemandType[] = [
      {
        id: 'dt-retail',
        displayName: 'Retail',
        channel: 'Retail',
        orderType: 'Standard Ship',
        allocationTemplate: 'tpl-retail',
      },
      {
        id: 'dt-wholesale',
        displayName: 'Wholesale',
        channel: 'Wholesale',
        orderType: 'Standard Ship',
        allocationTemplate: 'tpl-wholesale',
      },
      {
        id: 'dt-d2c',
        displayName: 'D2C',
        channel: 'D2C',
        orderType: 'Express',
        allocationTemplate: 'tpl-d2c',
      },
      {
        id: 'dt-marketplace',
        displayName: 'Marketplace',
        channel: 'Marketplace',
        orderType: 'Standard Ship',
        allocationTemplate: 'tpl-retail',
      },
    ];

    defaults.forEach(dt => {
      this.demandTypes.set(dt.id, dt);
    });
  }

  findAll(): DemandType[] {
    return Array.from(this.demandTypes.values());
  }

  findById(id: string): DemandType | undefined {
    return this.demandTypes.get(id);
  }

  create(dto: CreateDemandTypeDto): DemandType {
    const id = randomUUID();
    const demandType: DemandType = {
      id,
      ...dto,
    };
    this.demandTypes.set(id, demandType);
    return demandType;
  }

  update(id: string, dto: Partial<CreateDemandTypeDto>): DemandType | undefined {
    const existing = this.demandTypes.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: DemandType = {
      ...existing,
      ...dto,
    };
    this.demandTypes.set(id, updated);
    return updated;
  }

  remove(id: string): boolean {
    return this.demandTypes.delete(id);
  }
}
