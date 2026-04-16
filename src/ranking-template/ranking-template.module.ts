import { Module } from '@nestjs/common';
import { RankingTemplateController } from './ranking-template.controller.js';
import { RankingTemplateService } from './ranking-template.service.js';

@Module({
  controllers: [RankingTemplateController],
  providers: [RankingTemplateService],
  exports: [RankingTemplateService],
})
export class RankingTemplateModule {}
