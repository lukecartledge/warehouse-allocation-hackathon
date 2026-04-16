import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllocationTemplateModule } from './allocation-template/allocation-template.module.js';
import { AllocationModule } from './allocation/allocation.module.js';
import { DemandTypeModule } from './demand-type/demand-type.module.js';
import { SupplyModule } from './supply/supply.module.js';

@Module({
  imports: [
    AllocationTemplateModule,
    DemandTypeModule,
    SupplyModule,
    AllocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
