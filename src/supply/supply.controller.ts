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
import { ApiTags, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: 200, description: 'Get current supply configuration' })
  getConfig(): SupplyConfig {
    return this.supplyService.getConfig();
  }

  @Put('config/preset')
  @ApiResponse({ status: 200, description: 'Set supply strategy preset' })
  setPreset(@Body() dto: SetPresetDto): SupplyConfig {
    return this.supplyService.setPreset(dto.preset);
  }

  @Put('config/sequence')
  @ApiResponse({ status: 200, description: 'Set custom supply sequence' })
  setSequence(@Body() dto: SetSequenceDto): SupplyConfig {
    return this.supplyService.setSequence(dto.sequence);
  }

  @Post('sources')
  @ApiResponse({ status: 201, description: 'Create new supply source' })
  createSource(@Body() dto: CreateSupplySourceDto): SupplySource {
    return this.supplyService.createSource(dto);
  }

  @Put('sources/:id')
  @ApiResponse({ status: 200, description: 'Update supply source' })
  @ApiResponse({ status: 404, description: 'Supply source not found' })
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
  @ApiResponse({ status: 204, description: 'Supply source deleted' })
  @ApiResponse({ status: 404, description: 'Supply source not found' })
  removeSource(@Param('id') id: string): void {
    const deleted = this.supplyService.removeSource(id);
    if (!deleted) {
      throw new NotFoundException(`Supply source with id ${id} not found`);
    }
  }
}
