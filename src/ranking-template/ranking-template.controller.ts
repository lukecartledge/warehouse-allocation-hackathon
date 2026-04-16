import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { RankingTemplate } from '../allocation/types/index.js';
import { RankingTemplateService } from './ranking-template.service.js';
import { UpsertRankingTemplateDto } from './dto/upsert-ranking-template.dto.js';

@ApiTags('Ranking Templates')
@Controller('templates')
export class RankingTemplateController {
  constructor(private readonly rankingTemplateService: RankingTemplateService) {}

  @Get()
  @ApiOperation({ summary: 'List all ranking templates' })
  @ApiOkResponse({
    description: 'All ranking templates',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'tpl-retail' },
          demandType: { type: 'string', example: 'RETAIL' },
          name: { type: 'string', example: 'Retail Default' },
          levels: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'customerTier' },
                direction: { type: 'string', enum: ['ASC', 'DESC'] },
                order: { type: 'number', example: 1 },
              },
            },
          },
        },
      },
    },
  })
  findAll(): RankingTemplate[] {
    return this.rankingTemplateService.findAll();
  }

  @Get(':demandType')
  @ApiOperation({ summary: 'Get ranking template by demand type' })
  @ApiParam({ name: 'demandType', example: 'RETAIL' })
  @ApiOkResponse({
    description: 'Ranking template for the provided demand type',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'tpl-retail' },
        demandType: { type: 'string', example: 'RETAIL' },
        name: { type: 'string', example: 'Retail Default' },
        levels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'customerTier' },
              direction: { type: 'string', enum: ['ASC', 'DESC'] },
              order: { type: 'number', example: 1 },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Ranking template not found' })
  findByDemandType(@Param('demandType') demandType: string): RankingTemplate {
    const template = this.rankingTemplateService.findByDemandType(demandType);

    if (!template) {
      throw new NotFoundException(
        `Ranking template not found for demandType: ${demandType}`,
      );
    }

    return template;
  }

  @Put(':demandType')
  @ApiOperation({ summary: 'Create or update a ranking template' })
  @ApiParam({ name: 'demandType', example: 'RETAIL' })
  @ApiOkResponse({
    description: 'Created or updated ranking template',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'tpl-retail' },
        demandType: { type: 'string', example: 'RETAIL' },
        name: { type: 'string', example: 'Retail Default' },
        levels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'customerTier' },
              direction: { type: 'string', enum: ['ASC', 'DESC'] },
              order: { type: 'number', example: 1 },
            },
          },
        },
      },
    },
  })
  upsert(
    @Param('demandType') demandType: string,
    @Body() body: UpsertRankingTemplateDto,
  ): RankingTemplate {
    return this.rankingTemplateService.upsert({
      id: body.id,
      demandType,
      name: body.name,
      levels: body.levels.map((level) => ({
        field: level.field,
        direction: level.direction,
        order: level.order,
      })),
    });
  }
}
