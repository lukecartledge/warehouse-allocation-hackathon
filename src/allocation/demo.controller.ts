import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllocationService } from './allocation.service.js';
import { AllocateResponseDto } from './types/index.js';

@Controller('demo')
@ApiTags('Demo')
export class DemoController {
  constructor(private readonly allocationService: AllocationService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed demo data and run allocation' })
  seed(): AllocateResponseDto {
    return this.allocationService.seedDemo();
  }
}
