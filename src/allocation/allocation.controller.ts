import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Run the allocation engine' })
  run(@Body() request: AllocateRequestDto): AllocateResponseDto {
    return this.allocationService.run(request);
  }

  @Get()
  @ApiOperation({ summary: 'Get allocation results' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['allocated', 'partial', 'unallocated'],
  })
  @ApiQuery({ name: 'channel', required: false })
  findAll(
    @Query('status') status?: string,
    @Query('channel') channel?: string,
  ): AllocationResultDto[] {
    return this.allocationService.queryResults(status, channel);
  }
}
