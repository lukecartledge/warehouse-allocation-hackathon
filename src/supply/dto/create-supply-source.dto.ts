import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateSupplySourceDto {
  @ApiProperty({ example: 'On-hand Inventory' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Physical stock available in warehouse' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 1, description: 'Priority order (1 = highest)' })
  @IsInt()
  @Min(1)
  priority!: number;
}
