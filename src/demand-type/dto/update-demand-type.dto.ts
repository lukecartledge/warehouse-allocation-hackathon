import { PartialType } from '@nestjs/swagger';
import { CreateDemandTypeDto } from './create-demand-type.dto.js';

export class UpdateDemandTypeDto extends PartialType(CreateDemandTypeDto) {}
