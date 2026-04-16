import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDemandTypeDto {
  @ApiProperty({
    example: 'Retail',
    description: 'Human-readable name shown in the UI (e.g. "Retail", "Wholesale Express")',
  })
  @IsString()
  displayName!: string;

  @ApiProperty({
    example: 'Retail',
    description: 'Sales channel this demand type applies to: D2C, Wholesale, Retail, or Marketplace',
  })
  @IsString()
  channel!: string;

  @ApiProperty({
    example: 'Standard Ship',
    description: 'Fulfilment method: Standard Ship, Express, Click & Collect, or Pre-order',
  })
  @IsString()
  orderType!: string;

  @ApiProperty({
    example: 'tpl-retail',
    description: 'ID of the allocation template that controls ranking dimensions for this demand type',
  })
  @IsString()
  allocationTemplate!: string;
}
