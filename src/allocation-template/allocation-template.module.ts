import { Module } from '@nestjs/common';
import { AllocationTemplateController } from './allocation-template.controller.js';
import { AllocationTemplateService } from './allocation-template.service.js';

@Module({
  controllers: [AllocationTemplateController],
  providers: [AllocationTemplateService],
  exports: [AllocationTemplateService],
})
export class AllocationTemplateModule {}
