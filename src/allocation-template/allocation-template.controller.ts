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
  ApiResponse,
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
  @ApiOperation({
    summary: 'List all allocation templates',
    description:
      'Returns every allocation template. Each template defines the ranking dimensions ' +
      'and clearance strategy the engine uses when processing orders for a given demand type.',
  })
  @ApiOkResponse({ type: [Object], description: 'All allocation templates' })
  async findAll(): Promise<AllocationTemplate[]> {
    return this.allocationTemplateService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create an allocation template',
    description:
      'Creates a new template with ranking dimensions and clearance settings. ' +
      'Link it to a demand type via the demand-types API to put it into use.',
  })
  @ApiBody({
    type: CreateAllocationTemplateDto,
    description: 'Template definition including dimensions and clearance settings',
  })
  @ApiCreatedResponse({
    type: Object,
    description: 'Created allocation template with generated ID',
  })
  @ApiResponse({ status: 400, description: 'Validation failed — check required fields and dimension format' })
  async create(
    @Body() body: CreateAllocationTemplateDto,
  ): Promise<AllocationTemplate> {
    return this.allocationTemplateService.create(body);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an allocation template',
    description:
      'Partially updates an existing template. Changes take effect on the next allocation run ' +
      'for any demand type referencing this template.',
  })
  @ApiParam({ name: 'id', description: 'Allocation template ID', example: 'tpl-retail' })
  @ApiBody({
    type: UpdateAllocationTemplateDto,
    description: 'Fields to update — only provided fields are changed',
  })
  @ApiOkResponse({ type: Object, description: 'Updated allocation template' })
  @ApiResponse({ status: 400, description: 'Validation failed — check field formats' })
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
  @ApiOperation({
    summary: 'Delete an allocation template',
    description:
      'Permanently removes an allocation template. Any demand type still referencing this ' +
      'template will fail to resolve during allocation runs.',
  })
  @ApiParam({ name: 'id', description: 'Allocation template ID', example: 'tpl-retail' })
  @ApiNoContentResponse({ description: 'Allocation template deleted' })
  @ApiNotFoundResponse({ description: 'Allocation template not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const removed = await this.allocationTemplateService.remove(id);

    if (!removed) {
      throw new NotFoundException(`Allocation template not found: ${id}`);
    }
  }
}
