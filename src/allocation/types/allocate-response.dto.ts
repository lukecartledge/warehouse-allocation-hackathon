import { ApiProperty } from '@nestjs/swagger';
import { AllocationResultDto } from './allocation-result.model.js';

export class AllocationSummaryDto {
  @ApiProperty({ example: 20 })
  totalOrders!: number;

  @ApiProperty({ example: 200 })
  totalRequested!: number;

  @ApiProperty({ example: 150 })
  totalAllocated!: number;

  @ApiProperty({ example: 0.75, description: 'Fill rate (0-1)' })
  fillRate!: number;

  @ApiProperty({ example: 12 })
  allocated!: number;

  @ApiProperty({ example: 5 })
  partial!: number;

  @ApiProperty({ example: 3 })
  unallocated!: number;
}

export class AllocateResponseDto {
  @ApiProperty({ example: 'run-20240115-001' })
  runId!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp!: string;

  @ApiProperty({ example: false })
  dryRun!: boolean;

  @ApiProperty({ type: AllocationSummaryDto })
  summary!: AllocationSummaryDto;

  @ApiProperty({ type: [AllocationResultDto] })
  results!: AllocationResultDto[];
}
