import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RankingDimensionDto {
  @ApiProperty({
    example: 'Customer Tier',
    description: 'Human-readable label shown in the UI for this ranking dimension',
  })
  @IsString()
  label!: string;

  @ApiProperty({
    example: 'customerTier',
    description: 'Field key on the order used to rank — must match an OrderDto property (e.g. "customerTier", "shippingMethod")',
  })
  @IsString()
  level!: string;
}

export class CreateAllocationTemplateDto {
  @ApiProperty({
    example: 'Wholesale Default',
    description: 'Descriptive name for this template (e.g. "Retail Priority", "Wholesale Default")',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    type: [RankingDimensionDto],
    description: 'Ordered list of ranking dimensions — earlier dimensions have higher priority in the allocation sort',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RankingDimensionDto)
  dimensions!: RankingDimensionDto[];

  @ApiProperty({
    example: false,
    description: 'When true, the engine applies clearance/markdown logic during allocation for this template',
  })
  @IsBoolean()
  clearanceLogic!: boolean;

  @ApiProperty({
    enum: ['in-season', 'drop-out'],
    example: 'in-season',
    description: 'Clearance strategy: "in-season" keeps stock flowing normally, "drop-out" aggressively clears end-of-life SKUs',
  })
  @IsIn(['in-season', 'drop-out'])
  clearanceMode!: 'in-season' | 'drop-out';
}
