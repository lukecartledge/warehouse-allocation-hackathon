import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateSupplySourceDto {
  @ApiProperty({
    example: 'On-hand Inventory',
    description: 'Short name of the supply source (e.g. "On-hand Inventory", "In-Transit", "3PL")',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Physical stock available in warehouse',
    description: 'Longer explanation of what this source represents and when it is available',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 1,
    description: 'Priority order — the engine tries sources from lowest number first (1 = highest priority)',
  })
  @IsInt()
  @Min(1)
  priority!: number;
}
