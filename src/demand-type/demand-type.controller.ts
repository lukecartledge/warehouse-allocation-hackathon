import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { DemandTypeService } from './demand-type.service.js';
import type { DemandType } from './types.js';
import { CreateDemandTypeDto } from './dto/create-demand-type.dto.js';
import { UpdateDemandTypeDto } from './dto/update-demand-type.dto.js';

@ApiTags('Demand Types')
@Controller('demand-types')
export class DemandTypeController {
  constructor(private readonly demandTypeService: DemandTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all demand types' })
  @ApiResponse({
    status: 200,
    description: 'List of all demand types',
    type: [Object],
  })
  async findAll(): Promise<DemandType[]> {
    return this.demandTypeService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new demand type' })
  @ApiResponse({
    status: 201,
    description: 'Demand type created successfully',
    type: Object,
  })
  async create(
    @Body() createDemandTypeDto: CreateDemandTypeDto,
  ): Promise<DemandType> {
    return this.demandTypeService.create(createDemandTypeDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a demand type' })
  @ApiParam({ name: 'id', description: 'Demand type ID' })
  @ApiResponse({
    status: 200,
    description: 'Demand type updated successfully',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Demand type not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDemandTypeDto: UpdateDemandTypeDto,
  ): Promise<DemandType> {
    const updated = await this.demandTypeService.update(id, updateDemandTypeDto);
    if (!updated) {
      throw new NotFoundException(`Demand type with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a demand type' })
  @ApiParam({ name: 'id', description: 'Demand type ID' })
  @ApiResponse({ status: 204, description: 'Demand type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Demand type not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.demandTypeService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Demand type with ID ${id} not found`);
    }
  }
}
