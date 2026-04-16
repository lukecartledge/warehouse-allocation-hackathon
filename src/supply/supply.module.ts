import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplyService } from './supply.service.js';
import { SupplyController } from './supply.controller.js';
import { SupplyConfigEntity } from './supply-config.entity.js';
import { SupplySourceEntity } from './supply-source.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([SupplySourceEntity, SupplyConfigEntity])],
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [SupplyService],
})
export class SupplyModule {}
