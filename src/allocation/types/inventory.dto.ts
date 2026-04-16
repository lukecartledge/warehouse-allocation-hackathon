import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class InventoryPoolDto {
  @ApiProperty({
    description: 'Stock keeping unit identifier',
    example: 'SKU-12345',
  })
  @IsString()
  @IsNotEmpty()
  skuId!: string;

  @ApiProperty({
    description: 'Warehouse identifier',
    example: 'WH-EAST-01',
  })
  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @ApiProperty({
    description: 'Available to sell quantity',
    example: 100,
  })
  @IsInt()
  @Min(0)
  availableToSell!: number;
}
