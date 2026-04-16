import { Module } from '@nestjs/common';
import { AllocationTemplateModule } from '../allocation-template/allocation-template.module.js';
import { DemandTypeModule } from '../demand-type/demand-type.module.js';
import { SupplyModule } from '../supply/supply.module.js';
import { AllocationController } from './allocation.controller.js';
import { AllocationEngineService } from './allocation-engine.service.js';
import { AllocationService } from './allocation.service.js';
import { DemoController } from './demo.controller.js';

@Module({
  imports: [AllocationTemplateModule, DemandTypeModule, SupplyModule],
  controllers: [AllocationController, DemoController],
  providers: [AllocationEngineService, AllocationService],
  exports: [AllocationService],
})
export class AllocationModule {}
