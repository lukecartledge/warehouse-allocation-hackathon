import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllocationTemplateModule } from './allocation-template/allocation-template.module.js';
import { AllocationTemplateEntity } from './allocation-template/allocation-template.entity.js';
import { AllocationModule } from './allocation/allocation.module.js';
import { AllocationResultEntity } from './allocation/entities/allocation-result.entity.js';
import { InventoryPoolEntity } from './allocation/entities/inventory-pool.entity.js';
import { OrderEntity } from './allocation/entities/order.entity.js';
import { DemandTypeModule } from './demand-type/demand-type.module.js';
import { DemandTypeEntity } from './demand-type/demand-type.entity.js';
import { SupplyModule } from './supply/supply.module.js';
import { SupplyConfigEntity } from './supply/supply-config.entity.js';
import { SupplySourceEntity } from './supply/supply-source.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/allocation.db',
      entities: [
        DemandTypeEntity,
        SupplySourceEntity,
        SupplyConfigEntity,
        AllocationTemplateEntity,
        OrderEntity,
        InventoryPoolEntity,
        AllocationResultEntity,
      ],
      synchronize: true,
    }),
    AllocationTemplateModule,
    DemandTypeModule,
    SupplyModule,
    AllocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
