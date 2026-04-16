import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateAllocationTemplateDto } from './dto/create-allocation-template.dto.js';
import type { UpdateAllocationTemplateDto } from './dto/update-allocation-template.dto.js';
import type { AllocationTemplate, RankingDimension } from './types.js';

@Injectable()
export class AllocationTemplateService {
  private readonly templates = new Map<string, AllocationTemplate>();

  constructor() {
    this.seed();
  }

  findAll(): AllocationTemplate[] {
    return Array.from(this.templates.values());
  }

  findById(id: string): AllocationTemplate | undefined {
    return this.templates.get(id);
  }

  create(dto: CreateAllocationTemplateDto): AllocationTemplate {
    const createdTemplate: AllocationTemplate = {
      id: randomUUID(),
      name: dto.name,
      dimensions: dto.dimensions.map((dimension) => ({
        id: randomUUID(),
        label: dimension.label,
        level: dimension.level,
      })),
      clearanceLogic: dto.clearanceLogic,
      clearanceMode: dto.clearanceMode,
    };

    this.templates.set(createdTemplate.id, createdTemplate);
    return createdTemplate;
  }

  update(
    id: string,
    dto: UpdateAllocationTemplateDto,
  ): AllocationTemplate | undefined {
    const existingTemplate = this.templates.get(id);

    if (!existingTemplate) {
      return undefined;
    }

    const updatedDimensions: RankingDimension[] =
      dto.dimensions !== undefined
        ? dto.dimensions.map((dimension) => ({
            id: randomUUID(),
            label: dimension.label,
            level: dimension.level,
          }))
        : existingTemplate.dimensions;

    const updatedTemplate: AllocationTemplate = {
      ...existingTemplate,
      ...dto,
      dimensions: updatedDimensions,
    };

    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  remove(id: string): boolean {
    return this.templates.delete(id);
  }

  seed(): void {
    this.templates.clear();

    const defaults: AllocationTemplate[] = [
      {
        id: 'tpl-retail',
        name: 'Retail Default',
        clearanceLogic: false,
        clearanceMode: 'in-season',
        dimensions: [
          { id: 'dim-r1', label: 'Customer Tier', level: 'customerTier' },
          { id: 'dim-r2', label: 'Order Seniority', level: 'createdAt' },
          {
            id: 'dim-r3',
            label: 'Delivery Urgency',
            level: 'requestedDeliveryDate',
          },
        ],
      },
      {
        id: 'tpl-wholesale',
        name: 'Wholesale Default',
        clearanceLogic: false,
        clearanceMode: 'in-season',
        dimensions: [
          { id: 'dim-w1', label: 'Customer Tier', level: 'customerTier' },
          { id: 'dim-w2', label: 'Order Seniority', level: 'createdAt' },
          {
            id: 'dim-w3',
            label: 'Delivery Urgency',
            level: 'requestedDeliveryDate',
          },
        ],
      },
      {
        id: 'tpl-d2c',
        name: 'D2C Default',
        clearanceLogic: false,
        clearanceMode: 'in-season',
        dimensions: [
          { id: 'dim-d1', label: 'Shipping Speed', level: 'shippingMethod' },
          { id: 'dim-d2', label: 'Order Seniority', level: 'createdAt' },
          { id: 'dim-d3', label: 'Order Value', level: 'totalOrderValue' },
        ],
      },
    ];

    for (const template of defaults) {
      this.templates.set(template.id, template);
    }
  }
}
