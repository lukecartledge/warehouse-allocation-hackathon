import { Injectable } from '@nestjs/common';
import type { RankingTemplate } from '../allocation/types/index.js';

@Injectable()
export class RankingTemplateService {
  private readonly templates = new Map<string, RankingTemplate>();

  constructor() {
    this.seed();
  }

  findAll(): RankingTemplate[] {
    return Array.from(this.templates.values());
  }

  findByDemandType(demandType: string): RankingTemplate | undefined {
    return this.templates.get(this.normalizeDemandType(demandType));
  }

  upsert(template: RankingTemplate): RankingTemplate {
    const normalizedDemandType = this.normalizeDemandType(template.demandType);
    const normalizedTemplate: RankingTemplate = {
      ...template,
      demandType: normalizedDemandType,
    };

    this.templates.set(normalizedDemandType, normalizedTemplate);
    return normalizedTemplate;
  }

  seed(): void {
    this.templates.clear();

    const defaults: RankingTemplate[] = [
      {
        id: 'tpl-retail',
        demandType: 'RETAIL',
        name: 'Retail Default',
        levels: [
          { field: 'customerTier', direction: 'ASC', order: 1 },
          { field: 'createdAt', direction: 'ASC', order: 2 },
          { field: 'requestedDeliveryDate', direction: 'ASC', order: 3 },
        ],
      },
      {
        id: 'tpl-wholesale',
        demandType: 'WHOLESALE',
        name: 'Wholesale Default',
        levels: [
          { field: 'customerTier', direction: 'ASC', order: 1 },
          { field: 'createdAt', direction: 'ASC', order: 2 },
          { field: 'requestedDeliveryDate', direction: 'ASC', order: 3 },
        ],
      },
      {
        id: 'tpl-d2c',
        demandType: 'D2C',
        name: 'D2C Default',
        levels: [
          { field: 'shippingMethod', direction: 'ASC', order: 1 },
          { field: 'createdAt', direction: 'ASC', order: 2 },
          { field: 'totalOrderValue', direction: 'DESC', order: 3 },
        ],
      },
    ];

    for (const template of defaults) {
      this.upsert(template);
    }
  }

  private normalizeDemandType(demandType: string): string {
    return demandType.trim().toUpperCase();
  }
}
