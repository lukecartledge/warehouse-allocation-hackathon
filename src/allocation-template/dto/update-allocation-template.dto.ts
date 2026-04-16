import { PartialType } from '@nestjs/swagger';
import { CreateAllocationTemplateDto } from './create-allocation-template.dto.js';

export class UpdateAllocationTemplateDto extends PartialType(
  CreateAllocationTemplateDto,
) {}
