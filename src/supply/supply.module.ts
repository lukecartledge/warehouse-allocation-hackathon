import { Module } from '@nestjs/common';
import { SupplyService } from './supply.service.js';
import { SupplyController } from './supply.controller.js';

@Module({
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [SupplyService],
})
export class SupplyModule {}
