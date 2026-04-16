import { Module } from '@nestjs/common';
import { DemandTypeService } from './demand-type.service.js';
import { DemandTypeController } from './demand-type.controller.js';

@Module({
  controllers: [DemandTypeController],
  providers: [DemandTypeService],
  exports: [DemandTypeService],
})
export class DemandTypeModule {}
