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
      'Executes the warehouse allocation algorithm against current orders and inventory. ' +
      'Optionally filter by SKU or channel, override supply quantities, or run in dry-run mode.',
  })
  @ApiBody({ type: AllocateRequestDto, description: 'Allocation run parameters' })
  @ApiCreatedResponse({
    type: AllocateResponseDto,
    description: 'Allocation run completed — returns run ID, summary stats, and per-order results.',
  })
  async run(@Body() request: AllocateRequestDto): Promise<AllocateResponseDto> {
    return this.allocationService.run(request);
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
