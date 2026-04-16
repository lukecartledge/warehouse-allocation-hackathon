import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllocationTemplateController } from './allocation-template.controller.js';
import { AllocationTemplateService } from './allocation-template.service.js';
import { AllocationTemplateEntity } from './allocation-template.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([AllocationTemplateEntity])],
  controllers: [AllocationTemplateController],
  providers: [AllocationTemplateService],
  exports: [AllocationTemplateService],
})
export class AllocationTemplateModule {}
