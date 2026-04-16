import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type AllocationStatus = 'allocated' | 'partial' | 'unallocated';

export class AllocationResultDto {
  @ApiProperty({ example: 'res-001' })
  id!: string;

  @ApiProperty({ example: 'ORD-2024-001' })
  orderId!: string;

  @ApiProperty({ example: 'SKU-RUNNER-001' })
  sku!: string;

  @ApiProperty({ example: 'Cloud Runner 2' })
  productName!: string;

  @ApiProperty({ example: 'Wholesale' })
  channel!: string;

  @ApiProperty({ example: 10 })
  requestedQty!: number;

  @ApiProperty({ example: 10 })
  allocatedQty!: number;

  @ApiProperty({ enum: ['allocated', 'partial', 'unallocated'], example: 'allocated' })
  status!: AllocationStatus;

  @ApiPropertyOptional({ example: 'On-hand', nullable: true })
  source!: string | null;

  @ApiPropertyOptional({ example: 'Allocated via Wholesale template: tier=VIP, rank=1', nullable: true })
  reason!: string | null;

  @ApiProperty({ example: 'SportCo International' })
  customer!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  orderDate!: string;

  @ApiProperty({ example: 1 })
  priority!: number;
}
