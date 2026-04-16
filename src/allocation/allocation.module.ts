import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllocationTemplateModule } from '../allocation-template/allocation-template.module.js';
import { DemandTypeModule } from '../demand-type/demand-type.module.js';
import { SupplyModule } from '../supply/supply.module.js';
import { AllocationController } from './allocation.controller.js';
import { AllocationEngineService } from './allocation-engine.service.js';
import { AllocationResultEntity } from './entities/allocation-result.entity.js';
import { InventoryPoolEntity } from './entities/inventory-pool.entity.js';
import { OrderEntity } from './entities/order.entity.js';
import { AllocationService } from './allocation.service.js';
import { DemoController } from './demo.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      InventoryPoolEntity,
      AllocationResultEntity,
    ]),
    AllocationTemplateModule,
    DemandTypeModule,
    SupplyModule,
  ],
  controllers: [AllocationController, DemoController],
  providers: [AllocationEngineService, AllocationService],
  exports: [AllocationService],
})
export class AllocationModule {}
