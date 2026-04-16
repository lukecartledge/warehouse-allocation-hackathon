import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandTypeService } from './demand-type.service.js';
import { DemandTypeController } from './demand-type.controller.js';
import { DemandTypeEntity } from './demand-type.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([DemandTypeEntity])],
  controllers: [DemandTypeController],
  providers: [DemandTypeService],
  exports: [DemandTypeService],
})
export class DemandTypeModule {}
