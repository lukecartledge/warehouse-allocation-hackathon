import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type AllocationStatus = 'allocated' | 'partial' | 'unallocated';

export class AllocationResultDto {
  @ApiProperty({ example: 'res-001', description: 'Unique result identifier' })
  id!: string;

  @ApiProperty({ example: 'ORD-2024-001', description: 'Order that was allocated (or attempted)' })
  orderId!: string;

  @ApiProperty({ example: 'SKU-RUNNER-001', description: 'SKU that was allocated' })
  sku!: string;

  @ApiProperty({ example: 'Cloud Runner 2', description: 'Product display name' })
  productName!: string;

  @ApiProperty({ example: 'Wholesale', description: 'Sales channel of the originating order' })
  channel!: string;

  @ApiProperty({ example: 10, description: 'Quantity originally requested by the order' })
  requestedQty!: number;

  @ApiProperty({ example: 10, description: 'Quantity actually allocated from available inventory' })
  allocatedQty!: number;

  @ApiProperty({
    enum: ['allocated', 'partial', 'unallocated'],
    example: 'allocated',
    description: 'Outcome — "allocated" (fully filled), "partial" (some units), or "unallocated" (zero units)',
  })
  status!: AllocationStatus;

  @ApiPropertyOptional({
    example: 'On-hand',
    nullable: true,
    description: 'Supply source used for fulfilment, or null if unallocated',
  })
  source!: string | null;

  @ApiPropertyOptional({
    example: 'Allocated via Wholesale template: tier=VIP, rank=1',
    nullable: true,
    description: 'Human-readable explanation of how/why this result was determined',
  })
  reason!: string | null;

  @ApiProperty({ example: 'SportCo International', description: 'Customer name from the order' })
  customer!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Order creation timestamp (ISO 8601)' })
  orderDate!: string;

  @ApiProperty({ example: 1, description: 'Final priority rank assigned by the allocation engine (1 = highest)' })
  priority!: number;
}
