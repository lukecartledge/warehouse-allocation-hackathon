import { PartialType } from '@nestjs/swagger';
import { CreateSupplySourceDto } from './create-supply-source.dto.js';

export class UpdateSupplySourceDto extends PartialType(CreateSupplySourceDto) {}
