import { ApiProperty } from '@nestjs/swagger';
import { AllocationResultDto } from './allocation-result.model.js';

export class AllocationSummaryDto {
  @ApiProperty({ example: 20, description: 'Total number of orders processed in this run' })
  totalOrders!: number;

  @ApiProperty({ example: 200, description: 'Sum of all requested quantities across orders' })
  totalRequested!: number;

  @ApiProperty({ example: 150, description: 'Sum of all quantities actually allocated' })
  totalAllocated!: number;

  @ApiProperty({ example: 0.75, description: 'Fill rate as a decimal (totalAllocated / totalRequested). Range 0–1.' })
  fillRate!: number;

  @ApiProperty({ example: 12, description: 'Number of orders fully allocated' })
  allocated!: number;

  @ApiProperty({ example: 5, description: 'Number of orders partially allocated' })
  partial!: number;

  @ApiProperty({ example: 3, description: 'Number of orders with zero allocation' })
  unallocated!: number;
}

export class AllocateResponseDto {
  @ApiProperty({ example: 'run-20240115-001', description: 'Unique identifier for this allocation run' })
  runId!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Timestamp when the run was executed (ISO 8601)' })
  timestamp!: string;

  @ApiProperty({ example: false, description: 'Whether this was a dry-run (true = no results persisted)' })
  dryRun!: boolean;

  @ApiProperty({ type: AllocationSummaryDto, description: 'Aggregate statistics for the run' })
  summary!: AllocationSummaryDto;

  @ApiProperty({ type: [AllocationResultDto], description: 'Per-order allocation results sorted by priority' })
  results!: AllocationResultDto[];
}
