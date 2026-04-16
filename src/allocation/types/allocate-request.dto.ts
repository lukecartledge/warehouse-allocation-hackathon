import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export type StrategyPreset = 'conservative' | 'fast' | 'balanced';

export class AllocateRequestDto {
  @ApiPropertyOptional({ description: 'Only allocate for these SKUs', type: [String], example: ['SKU-RUNNER-001'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skus?: string[];

  @ApiPropertyOptional({ description: 'Only allocate for these channels', type: [String], example: ['D2C', 'Wholesale'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channels?: string[];

  @ApiPropertyOptional({ description: 'Override available supply per SKU', example: { 'SKU-RUNNER-001': 100 } })
  @IsOptional()
  @IsObject()
  supplyOverrides?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Strategy preset to use', enum: ['conservative', 'fast', 'balanced'] })
  @IsOptional()
  @IsIn(['conservative', 'fast', 'balanced'])
  strategyPreset?: StrategyPreset;

  @ApiPropertyOptional({ description: 'If true, simulate only — don\'t persist results', default: false })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
