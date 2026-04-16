import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAllocationTemplateDto } from './dto/create-allocation-template.dto.js';
import { UpdateAllocationTemplateDto } from './dto/update-allocation-template.dto.js';
import type { AllocationTemplate } from './types.js';
import { AllocationTemplateService } from './allocation-template.service.js';

@ApiTags('Allocation Templates')
@Controller('allocation-templates')
export class AllocationTemplateController {
  constructor(
    private readonly allocationTemplateService: AllocationTemplateService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all allocation templates' })
  @ApiOkResponse({ type: [Object], description: 'All allocation templates' })
  async findAll(): Promise<AllocationTemplate[]> {
    return this.allocationTemplateService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create an allocation template' })
  @ApiBody({
    type: CreateAllocationTemplateDto,
    description: 'Allocation template payload',
  })
  @ApiCreatedResponse({
    type: Object,
    description: 'Created allocation template',
  })
  async create(
    @Body() body: CreateAllocationTemplateDto,
  ): Promise<AllocationTemplate> {
    return this.allocationTemplateService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an allocation template' })
  @ApiParam({ name: 'id', example: 'tpl-retail' })
  @ApiBody({
    type: UpdateAllocationTemplateDto,
    description: 'Allocation template patch payload',
  })
  @ApiOkResponse({ type: Object, description: 'Updated allocation template' })
  @ApiNotFoundResponse({ description: 'Allocation template not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAllocationTemplateDto,
  ): Promise<AllocationTemplate> {
    const updatedTemplate = await this.allocationTemplateService.update(id, body);

    if (!updatedTemplate) {
      throw new NotFoundException(`Allocation template not found: ${id}`);
    }

    return updatedTemplate;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an allocation template' })
  @ApiParam({ name: 'id', example: 'tpl-retail' })
  @ApiNoContentResponse({ description: 'Allocation template deleted' })
  @ApiNotFoundResponse({ description: 'Allocation template not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const removed = await this.allocationTemplateService.remove(id);

    if (!removed) {
      throw new NotFoundException(`Allocation template not found: ${id}`);
    }
  }
}
