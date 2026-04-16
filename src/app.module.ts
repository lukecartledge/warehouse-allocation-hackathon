import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingTemplateModule } from './ranking-template/ranking-template.module.js';

@Module({
  imports: [RankingTemplateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
