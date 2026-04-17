import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AllocationService } from './allocation.service.js';
import {
  AllocateRequestDto,
  AllocateResponseDto,
  AllocationResultDto,
} from './types/index.js';

@Controller('allocations')
@ApiTags('Allocations')
export class AllocationController {
  constructor(private readonly allocationService: AllocationService) {}

  @Post('run')
  @ApiOperation({
    summary: 'Run the allocation engine',
    description:
      'Executes the warehouse allocation algorithm against current orders and inventory.\n\n' +
      '**Strategy presets** modify engine behaviour:\n' +
      '- `conservative` — reduces effective ATS by 20% (safety stock hold-back)\n' +
      '- `fast` — no safety stock; prefers orders with earliest requestedDeliveryDate\n' +
      '- `balanced` — default behaviour, no modification\n\n' +
      '**Multi-source fallthrough**: inventory is walked in supply source priority order. ' +
      'If source #1 is insufficient, source #2 is tried, etc.\n\n' +
      '**Clearance drop-out**: templates with `clearanceLogic=true` and `clearanceMode="drop-out"` ' +
      'reject orders that cannot be fully filled (allocatedQty=0).\n\n' +
      '**Supply overrides**: keyed by SKU ID (e.g. `{"SKU-RUNNER-001": 100}`), ' +
      'sets the available-to-sell for matching inventory pools before allocation.',
  })
  @ApiBody({ type: AllocateRequestDto, description: 'Allocation run parameters' })
  @ApiCreatedResponse({
    type: AllocateResponseDto,
    description: 'Allocation run completed — returns run ID, summary stats, and per-order results.',
  })
  async run(@Body() request: AllocateRequestDto): Promise<AllocateResponseDto> {
    return this.allocationService.run(request);
  }

  @Get('inventory')
  @ApiOperation({
    summary: 'Get current inventory pools',
    description: 'Returns all inventory pools with their available-to-sell quantities, grouped by SKU and source.',
  })
  @ApiOkResponse({ description: 'List of inventory pools.' })
  getInventory() {
    return this.allocationService.getInventory();
  }

  @Get()
  @ApiOperation({
    summary: 'Get allocation results',
    description:
      'Returns the results from the most recent allocation run. ' +
      'Filter by status (allocated / partial / unallocated) and/or sales channel.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['allocated', 'partial', 'unallocated'],
    description: 'Filter results by allocation status',
  })
  @ApiQuery({ name: 'channel', required: false, description: 'Filter results by sales channel' })
  @ApiOkResponse({
    type: [AllocationResultDto],
    description: 'List of allocation results matching the given filters.',
  })
  findAll(
    @Query('status') status?: string,
    @Query('channel') channel?: string,
  ): Promise<AllocationResultDto[]> {
    return this.allocationService.queryResults(status, channel);
  }
}
