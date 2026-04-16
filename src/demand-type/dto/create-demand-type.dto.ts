import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDemandTypeDto {
  @ApiProperty({ example: 'Retail' })
  @IsString()
  displayName!: string;

  @ApiProperty({ example: 'Retail', description: 'Channel: D2C, Wholesale, Retail, or Marketplace' })
  @IsString()
  channel!: string;

  @ApiProperty({ example: 'Standard Ship', description: 'Order type: Standard Ship, Express, Click & Collect, or Pre-order' })
  @IsString()
  orderType!: string;

  @ApiProperty({ example: 'tpl-retail', description: 'ID of the allocation template to use' })
  @IsString()
  allocationTemplate!: string;
}
