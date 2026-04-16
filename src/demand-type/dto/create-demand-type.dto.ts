import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

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

  @ApiProperty({
    example: 1,
    description:
      'Allocation priority (lower = higher priority). ' +
      'D2C orders at priority 1 are allocated before Wholesale at priority 3. ' +
      'Used by the engine to rank orders across demand types.',
  })
  @IsInt()
  @Min(0)
  priority!: number;
}
