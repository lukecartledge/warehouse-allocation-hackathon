import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { SupplyConfig, SupplySource, StrategyPreset } from './types.js';
import { SupplyService } from './supply.service.js';
import { CreateSupplySourceDto } from './dto/create-supply-source.dto.js';
import { UpdateSupplySourceDto } from './dto/update-supply-source.dto.js';

class SetPresetDto {
  @IsIn(['conservative', 'fast', 'balanced'])
  preset!: StrategyPreset;
}

class SetSequenceDto {
  @ValidateNested({ each: true })
  @Type(() => Object)
  sequence!: SupplySource[];
}

@Controller('supply')
@ApiTags('Supply Configuration')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get('config')
  @ApiOperation({
    summary: 'Get current supply configuration',
    description: 'Returns the active strategy preset and the ordered list of supply sources.',
  })
  @ApiOkResponse({ description: 'Current supply configuration including preset and source sequence.' })
  getConfig(): SupplyConfig {
    return this.supplyService.getConfig();
  }

  @Put('config/preset')
  @ApiOperation({
    summary: 'Set supply strategy preset',
    description:
      'Switches the active allocation strategy. ' +
      '"conservative" maximises fill rate, "fast" prioritises speed, "balanced" is the default.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        preset: { type: 'string', enum: ['conservative', 'fast', 'balanced'], example: 'balanced' },
      },
      required: ['preset'],
    },
    description: 'Strategy preset to activate',
  })
  @ApiOkResponse({ description: 'Updated supply configuration.' })
  setPreset(@Body() dto: SetPresetDto): SupplyConfig {
    return this.supplyService.setPreset(dto.preset);
  }

  @Put('config/sequence')
  @ApiOperation({
    summary: 'Set custom supply source sequence',
    description:
      'Overrides the supply source priority order. ' +
      'The engine will attempt to fulfil orders from sources in the given sequence.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sequence: {
          type: 'array',
          items: { type: 'object' },
          description: 'Ordered array of SupplySource objects',
        },
      },
      required: ['sequence'],
    },
    description: 'New supply source sequence',
  })
  @ApiOkResponse({ description: 'Updated supply configuration with new sequence.' })
  setSequence(@Body() dto: SetSequenceDto): SupplyConfig {
    return this.supplyService.setSequence(dto.sequence);
  }

  @Post('sources')
  @ApiOperation({
    summary: 'Create a new supply source',
    description: 'Adds a new inventory source (e.g. warehouse, 3PL, in-transit stock) to the engine.',
  })
  @ApiBody({ type: CreateSupplySourceDto, description: 'Supply source details' })
  @ApiCreatedResponse({ description: 'Supply source created successfully.' })
  createSource(@Body() dto: CreateSupplySourceDto): SupplySource {
    return this.supplyService.createSource(dto);
  }

  @Put('sources/:id')
  @ApiOperation({
    summary: 'Update a supply source',
    description: 'Updates the name, description, or priority of an existing supply source.',
  })
  @ApiParam({ name: 'id', description: 'Supply source ID', example: 'src-warehouse-east' })
  @ApiBody({ type: UpdateSupplySourceDto, description: 'Fields to update' })
  @ApiOkResponse({ description: 'Updated supply source.' })
  @ApiNotFoundResponse({ description: 'Supply source not found.' })
  updateSource(
    @Param('id') id: string,
    @Body() dto: UpdateSupplySourceDto,
  ): SupplySource {
    const updated = this.supplyService.updateSource(id, dto);
    if (!updated) {
      throw new NotFoundException(`Supply source with id ${id} not found`);
    }
    return updated;
  }

  @Delete('sources/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a supply source',
    description: 'Permanently removes a supply source from the engine.',
  })
  @ApiParam({ name: 'id', description: 'Supply source ID', example: 'src-warehouse-east' })
  @ApiNoContentResponse({ description: 'Supply source deleted.' })
  @ApiNotFoundResponse({ description: 'Supply source not found.' })
  removeSource(@Param('id') id: string): void {
    const deleted = this.supplyService.removeSource(id);
    if (!deleted) {
      throw new NotFoundException(`Supply source with id ${id} not found`);
    }
  }
}
