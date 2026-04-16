import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllocationService } from './allocation.service.js';
import { AllocateResponseDto } from './types/index.js';

@Controller('demo')
@ApiTags('Demo')
export class DemoController {
  constructor(private readonly allocationService: AllocationService) {}

  @Post('seed')
  @ApiOperation({
    summary: 'Seed demo data and run allocation',
    description:
      'Populates the engine with a realistic set of orders, inventory pools, demand types, ' +
      'allocation templates, and supply sources, then immediately runs the allocation algorithm. ' +
      'Use this as the first step in a live demo.',
  })
  @ApiCreatedResponse({
    type: AllocateResponseDto,
    description: 'Demo data seeded and allocation run completed.',
  })
  async seed(): Promise<AllocateResponseDto> {
    return this.allocationService.seedDemo();
  }
}
