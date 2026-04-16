import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateAllocationTemplateDto } from './dto/create-allocation-template.dto.js';
import type { UpdateAllocationTemplateDto } from './dto/update-allocation-template.dto.js';
import { AllocationTemplateEntity } from './allocation-template.entity.js';
import type { AllocationTemplate, RankingDimension } from './types.js';

@Injectable()
export class AllocationTemplateService {
  constructor(
    @InjectRepository(AllocationTemplateEntity)
    private readonly repo: Repository<AllocationTemplateEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  async findAll(): Promise<AllocationTemplate[]> {
    const entities = await this.repo.find();
    return entities.map((entity) => this.toModel(entity));
  }

  async findById(id: string): Promise<AllocationTemplate | undefined> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this.toModel(entity) : undefined;
  }

  async create(dto: CreateAllocationTemplateDto): Promise<AllocationTemplate> {
    const createdTemplate: AllocationTemplateEntity = {
      id: randomUUID(),
      name: dto.name,
      dimensions: JSON.stringify(
        dto.dimensions.map((dimension) => ({
          id: randomUUID(),
          label: dimension.label,
          level: dimension.level,
        })),
      ),
      clearanceLogic: dto.clearanceLogic,
      clearanceMode: dto.clearanceMode,
    };

    const saved = await this.repo.save(createdTemplate);
    return this.toModel(saved);
  }

  async update(
    id: string,
    dto: UpdateAllocationTemplateDto,
  ): Promise<AllocationTemplate | undefined> {
    const existingTemplate = await this.repo.findOneBy({ id });

    if (!existingTemplate) {
      return undefined;
    }

    const currentDimensions = this.parseDimensions(existingTemplate.dimensions);
    const updatedDimensions: RankingDimension[] =
      dto.dimensions !== undefined
        ? dto.dimensions.map((dimension) => ({
            id: randomUUID(),
            label: dimension.label,
            level: dimension.level,
          }))
        : currentDimensions;

    const updatedTemplate: AllocationTemplateEntity = {
      ...existingTemplate,
      ...dto,
      dimensions: JSON.stringify(updatedDimensions),
    };

    const saved = await this.repo.save(updatedTemplate);
    return this.toModel(saved);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private async seed(): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) {
      return;
    }

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

    await this.repo.save(
      defaults.map((template) => ({
        ...template,
        dimensions: JSON.stringify(template.dimensions),
      })),
    );
  }

  private toModel(entity: AllocationTemplateEntity): AllocationTemplate {
    return {
      id: entity.id,
      name: entity.name,
      dimensions: this.parseDimensions(entity.dimensions),
      clearanceLogic: entity.clearanceLogic,
      clearanceMode: entity.clearanceMode as 'in-season' | 'drop-out',
    };
  }

  private parseDimensions(dimensions: string): RankingDimension[] {
    return JSON.parse(dimensions) as RankingDimension[];
  }
}
