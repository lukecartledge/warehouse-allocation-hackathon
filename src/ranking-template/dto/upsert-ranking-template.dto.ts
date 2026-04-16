import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RankingLevelDto {
  @ApiProperty({ example: 'customerTier' })
  @IsString()
  field!: string;

  @ApiProperty({ enum: ['ASC', 'DESC'], example: 'ASC' })
  @IsIn(['ASC', 'DESC'])
  direction!: 'ASC' | 'DESC';

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order!: number;
}

export class UpsertRankingTemplateDto {
  @ApiProperty({ example: 'tpl-retail' })
  @IsString()
  id!: string;

  @ApiProperty({ example: 'Retail Default' })
  @IsString()
  name!: string;

  @ApiProperty({ type: () => RankingLevelDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RankingLevelDto)
  levels!: RankingLevelDto[];
}
