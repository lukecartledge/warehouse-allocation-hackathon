import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns a simple greeting to confirm the API is running.',
  })
  @ApiOkResponse({ description: 'API is healthy', type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
