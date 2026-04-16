import { ApiProperty } from '@nestjs/swagger';

export enum AllocationStatus {
  ALLOCATED = 'ALLOCATED',
  PARTIAL = 'PARTIAL',
  UNALLOCATED = 'UNALLOCATED',
}

export class AllocationResultDto {
  @ApiProperty({
    description: 'Order identifier',
    example: 'ORD-2024-001',
  })
  orderId!: string;

  @ApiProperty({
    description: 'Stock keeping unit identifier',
    example: 'SKU-12345',
  })
  skuId!: string;

  @ApiProperty({
    description: 'Warehouse identifier',
    example: 'WH-EAST-01',
  })
  warehouseId!: string;

  @ApiProperty({
    description: 'Quantity requested',
    example: 5,
  })
  quantityRequested!: number;

  @ApiProperty({
    description: 'Quantity allocated',
    example: 5,
  })
  allocatedQty!: number;

  @ApiProperty({
    description: 'Allocation status',
    enum: AllocationStatus,
    example: AllocationStatus.ALLOCATED,
  })
  status!: AllocationStatus;

  @ApiProperty({
    description: 'Priority rank in allocation queue',
    example: 1,
  })
  priorityRank!: number;

  @ApiProperty({
    description: 'Reason code for allocation decision',
    example: 'SUFFICIENT_INVENTORY',
  })
  reasonCode!: string;

  @ApiProperty({
    description: 'Demand type',
    example: 'RETAIL',
  })
  demandType!: string;
}
