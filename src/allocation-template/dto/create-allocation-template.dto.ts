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
  @ApiProperty({ example: 'Customer Tier' })
  @IsString()
  label!: string;

  @ApiProperty({ example: 'customerTier' })
  @IsString()
  level!: string;
}

export class CreateAllocationTemplateDto {
  @ApiProperty({ example: 'Wholesale Default' })
  @IsString()
  name!: string;

  @ApiProperty({ type: [RankingDimensionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RankingDimensionDto)
  dimensions!: RankingDimensionDto[];

  @ApiProperty({ example: false })
  @IsBoolean()
  clearanceLogic!: boolean;

  @ApiProperty({ enum: ['in-season', 'drop-out'], example: 'in-season' })
  @IsIn(['in-season', 'drop-out'])
  clearanceMode!: 'in-season' | 'drop-out';
}
